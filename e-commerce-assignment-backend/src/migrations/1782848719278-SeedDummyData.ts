import { MigrationInterface, QueryRunner } from 'typeorm';

export class SeedDummyData1782848719278 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const response = await fetch('https://dummyjson.com/products?limit=50');
    const data = await response.json();
    const products = data.products;

    const uniqueCategories = [...new Set(products.map((p: any) => p.category))];

    for (const catName of uniqueCategories) {
      const nameStr = String(catName);
      const nameFormatted = nameStr.charAt(0).toUpperCase() + nameStr.slice(1).replace(/-/g, ' ');
      await queryRunner.query(
        `INSERT INTO categories (slug, name) VALUES ($1, $2) ON CONFLICT (slug) DO NOTHING`,
        [nameStr, nameFormatted],
      );
    }

    const categories = await queryRunner.query(`SELECT id, slug FROM categories`);
    const categoryMap = new Map();
    categories.forEach((c: any) => categoryMap.set(c.slug, c.id));

    for (const p of products) {
      const categoryId = categoryMap.get(p.category);
      if (!categoryId) continue;

      await queryRunner.query(
        `INSERT INTO products (title, description, price, thumbnail, images, stock, rating, "categoryId")
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
        [
          p.title,
          p.description,
          p.price,
          p.thumbnail,
          p.images,
          p.stock,
          p.rating,
          categoryId,
        ],
      );
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DELETE FROM products`);
    await queryRunner.query(`DELETE FROM categories`);
  }
}

