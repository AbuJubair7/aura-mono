import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cart } from './entities/cart.entity';
import { CartItem } from './entities/cart-item.entity';
import { CreateCartItemDto } from './dto/create-cart-item.dto';
import { UpdateCartItemDto } from './dto/update-cart-item.dto';
import { User } from '../users/entities/user.entity';
import { Product } from '../products/entities/product.entity';

@Injectable()
export class CartService {
  constructor(
    @InjectRepository(Cart)
    private readonly cartRepository: Repository<Cart>,
    @InjectRepository(CartItem)
    private readonly cartItemRepository: Repository<CartItem>,
  ) {}

  private async getOrCreateCart(userId: string): Promise<Cart> {
    let cart = await this.cartRepository.findOne({
      where: { user: { id: userId } },
      relations: {
        items: {
          product: true,
        },
      },
    });

    if (!cart) {
      cart = this.cartRepository.create({ user: { id: userId } as User });
      await this.cartRepository.save(cart);
      cart.items = [];
    }

    return cart;
  }

  async getCart(userId: string): Promise<Cart> {
    return this.getOrCreateCart(userId);
  }

  async addItem(
    userId: string,
    createCartItemDto: CreateCartItemDto,
  ): Promise<Cart> {
    const cart = await this.getOrCreateCart(userId);

    const existingItem = cart.items.find(
      (item) => item.product.id === createCartItemDto.productId!,
    );

    if (existingItem) {
      existingItem.quantity += createCartItemDto.quantity!;
      await this.cartItemRepository.save(existingItem);
    } else {
      const newItem = this.cartItemRepository.create({
        cart,
        product: { id: createCartItemDto.productId! } as Product,
        quantity: createCartItemDto.quantity!,
      });
      await this.cartItemRepository.save(newItem);
    }

    return this.getOrCreateCart(userId);
  }

  async updateItem(
    userId: string,
    itemId: string,
    updateCartItemDto: UpdateCartItemDto,
  ): Promise<Cart> {
    const item = await this.cartItemRepository.findOne({
      where: { id: itemId, cart: { user: { id: userId } } },
    });

    if (!item) {
      throw new NotFoundException('Cart item not found in your cart');
    }

    if (updateCartItemDto.quantity !== undefined) {
      item.quantity = updateCartItemDto.quantity;
      await this.cartItemRepository.save(item);
    }

    return this.getOrCreateCart(userId);
  }

  async removeItem(userId: string, itemId: string): Promise<Cart> {
    const item = await this.cartItemRepository.findOne({
      where: { id: itemId, cart: { user: { id: userId } } },
    });

    if (!item) {
      throw new NotFoundException('Cart item not found in your cart');
    }

    await this.cartItemRepository.remove(item);

    return this.getOrCreateCart(userId);
  }
}
