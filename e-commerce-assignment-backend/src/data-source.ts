import 'reflect-metadata';
import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';
import { Product } from './module/products/entities/product.entity';
import { Category } from './module/categories/entities/category.entity';
import { User } from './module/users/entities/user.entity';
import { Cart } from './module/cart/entities/cart.entity';
import { CartItem } from './module/cart/entities/cart-item.entity';

dotenv.config();

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5433', 10),
  username: process.env.DB_USERNAME || 'postgres',
  password: process.env.DB_PASSWORD || '114957',
  database: process.env.DB_NAME || 'e-commerce',
  synchronize: process.env.DB_SYNCHRONIZE === 'true',
  logging: false,
  entities: [Product, Category, User, Cart, CartItem],
  migrations: [__dirname + '/migrations/*{.ts,.js}'],
  subscribers: [],
});
