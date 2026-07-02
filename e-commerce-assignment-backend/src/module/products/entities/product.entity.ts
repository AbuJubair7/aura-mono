import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Category } from '../../categories/entities/category.entity';

@Entity('products')
export class Product {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'varchar', length: 255 })
  title!: string;

  @Column({ type: 'text' })
  description!: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  price!: number;

  @Column({ type: 'varchar', length: 500 })
  thumbnail!: string;

  @Column({ type: 'text', array: true, nullable: true })
  images!: string[];

  @Column({ type: 'int', default: 0 })
  stock!: number;

  @Column({ type: 'decimal', precision: 3, scale: 2, nullable: true })
  rating!: number;

  @ManyToOne(() => Category, (category) => category.id, { eager: true })
  @JoinColumn({ name: 'categoryId' })
  category!: Category;

  @Column()
  categoryId!: string;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
