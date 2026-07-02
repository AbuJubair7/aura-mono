import 'dotenv/config'; // Loads variables from .env into process.env
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CategoriesModule } from './module/categories/categories.module';
import { ProductsModule } from './module/products/products.module';
import { UsersModule } from './module/users/users.module';
import { CartModule } from './module/cart/cart.module';
import { AuthModule } from './module/auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT || '5432', 10),
      username: process.env.DB_USERNAME || 'postgres',
      password: process.env.DB_PASSWORD || 'postgres',
      database: process.env.DB_DATABASE || 'e-commerce',
      autoLoadEntities: true, // Automatically loads entities registered in features
      synchronize: true, // Warning: Don't use true in production, use migrations instead
    }),
    CategoriesModule,
    ProductsModule,
    UsersModule,
    CartModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
