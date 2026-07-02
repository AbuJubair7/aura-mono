"use client";

import { useState, useEffect, useRef, useCallback } from 'react';
import { PaginatedProducts, Product, fetchProducts } from '@/lib/api';
import ProductCard from './ProductCard';
import styles from './ProductGrid.module.css';

interface ProductGridProps {
  initialData: PaginatedProducts;
  currentSearch: string;
  currentCategory: string;
}

export default function ProductGrid({
  initialData,
  currentSearch,
  currentCategory,
}: ProductGridProps) {
  const [products, setProducts] = useState<Product[]>(initialData.items);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(initialData.hasMore);
  const [loading, setLoading] = useState(false);
  const observerTarget = useRef<HTMLDivElement>(null);

  // Reset state when filters change (initialData changes from server)
  useEffect(() => {
    setProducts(initialData.items);
    setPage(1);
    setHasMore(initialData.hasMore);
  }, [initialData]);

  const loadMore = useCallback(async () => {
    if (loading || !hasMore) return;
    
    setLoading(true);
    try {
      const nextPage = page + 1;
      const data = await fetchProducts(nextPage, 10, currentSearch, currentCategory);
      setProducts((prev) => [...prev, ...data.items]);
      setPage(nextPage);
      setHasMore(data.hasMore);
    } catch (error) {
      console.error('Error fetching more products:', error);
    } finally {
      setLoading(false);
    }
  }, [page, hasMore, loading, currentSearch, currentCategory]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          loadMore();
        }
      },
      { threshold: 0.1 }
    );

    if (observerTarget.current) {
      observer.observe(observerTarget.current);
    }

    return () => observer.disconnect();
  }, [loadMore]);

  if (products.length === 0) {
    return (
      <div className={styles.emptyState}>
        <h2>No products found</h2>
        <p>Try adjusting your search or filters to find what you&apos;re looking for.</p>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.grid}>
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
      
      {hasMore && (
        <div ref={observerTarget} className={styles.loader}>
          <div className={styles.spinner}></div>
          <p>Loading more products...</p>
        </div>
      )}
    </div>
  );
}
