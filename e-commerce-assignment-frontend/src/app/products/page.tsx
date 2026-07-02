import { fetchProducts, fetchCategories } from '@/lib/api';
import Sidebar from '@/components/products/Sidebar';
import ProductGrid from '@/components/products/ProductGrid';
import styles from './page.module.css';

export const metadata = {
  title: 'Products | Premium E-Commerce',
  description: 'Browse our entire catalog of premium products.',
};

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ search?: string; category?: string }>;
}) {
  const resolvedParams = await searchParams;
  const search = resolvedParams?.search || '';
  const categorySlug = resolvedParams?.category || '';

  // Fetch initial data concurrently on the server
  const [initialProductsData, categories] = await Promise.all([
    fetchProducts(1, 10, search, categorySlug),
    fetchCategories(),
  ]);

  return (
    <div className={`container ${styles.pageLayout}`}>
      <aside className={styles.sidebarSection}>
        <Sidebar categories={categories} currentCategory={categorySlug} currentSearch={search} />
      </aside>
      
      <section className={styles.mainSection}>
        <div className={styles.header}>
          <h1 className={styles.title}>
            {categorySlug 
              ? categories.find(c => c.slug === categorySlug)?.name || 'Products'
              : search
                ? `Search Results for "${search}"`
                : 'All Products'}
          </h1>
          <p className={styles.subtitle}>Showing {initialProductsData.total} results</p>
        </div>

        <ProductGrid 
          initialData={initialProductsData} 
          currentSearch={search} 
          currentCategory={categorySlug} 
        />
      </section>
    </div>
  );
}
