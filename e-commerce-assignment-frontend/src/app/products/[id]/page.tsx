import { Metadata } from 'next';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { fetchProductById } from '@/lib/api';
import AddToCartButton from '@/components/products/AddToCartButton';
import ProductGallery from '@/components/products/ProductGallery';
import styles from './page.module.css';

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  try {
    const resolvedParams = await params;
    const product = await fetchProductById(resolvedParams.id);
    return {
      title: `${product.title} | Premium E-Commerce`,
      description: product.description,
    };
  } catch (error) {
    return { title: 'Product Not Found' };
  }
}

export default async function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
  try {
    const resolvedParams = await params;
    const product = await fetchProductById(resolvedParams.id);

    return (
      <div className={`container ${styles.pageLayout}`}>
        <ProductGallery 
          title={product.title} 
          thumbnail={product.thumbnail} 
          images={product.images} 
          discountPercentage={product.discountPercentage} 
        />

        <div className={styles.detailsSection}>
          <div className={styles.breadcrumbs}>
            <span>Home</span> / <span>Products</span> / <span className={styles.current}>{product.category?.name || 'Category'}</span>
          </div>
          
          <h1 className={styles.title}>{product.title}</h1>
          <div className={styles.ratingInfo}>
            <span className={styles.brand}>{product.brand}</span>
            <span className={styles.rating}>⭐ {product.rating}</span>
          </div>

          <div className={styles.priceContainer}>
            <span className={styles.price}>${product.price.toFixed(2)}</span>
            {product.stock > 0 ? (
              <span className={styles.inStock}>In Stock ({product.stock})</span>
            ) : (
              <span className={styles.outOfStock}>Out of Stock</span>
            )}
          </div>

          <p className={styles.description}>{product.description}</p>

          <div className={styles.actionSection}>
            <AddToCartButton product={product} />
          </div>
        </div>
      </div>
    );
  } catch (error) {
    notFound();
  }
}
