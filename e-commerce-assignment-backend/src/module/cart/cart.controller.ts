import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
} from '@nestjs/common';
import { CartService } from './cart.service';
import { CreateCartItemDto } from './dto/create-cart-item.dto';
import { UpdateCartItemDto } from './dto/update-cart-item.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

interface RequestWithUser {
  user: { userId: string; email: string };
}

@UseGuards(JwtAuthGuard)
@Controller('api/cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Get()
  getCart(@Request() req: RequestWithUser) {
    return this.cartService.getCart(req.user.userId);
  }

  @Post('items')
  addItem(
    @Request() req: RequestWithUser,
    @Body() createCartItemDto: CreateCartItemDto,
  ) {
    return this.cartService.addItem(req.user.userId, createCartItemDto);
  }

  @Patch('items/:id')
  updateItem(
    @Request() req: RequestWithUser,
    @Param('id') id: string,
    @Body() updateCartItemDto: UpdateCartItemDto,
  ) {
    return this.cartService.updateItem(req.user.userId, id, updateCartItemDto);
  }

  @Delete('items/:id')
  removeItem(@Request() req: RequestWithUser, @Param('id') id: string) {
    return this.cartService.removeItem(req.user.userId, id);
  }
}
