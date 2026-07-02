"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ShoppingCart, Check } from 'lucide-react';
import { Product } from '@/lib/api';
import { useCartStore } from '@/store/cartStore';
import { useAuthStore } from '@/store/authStore';
import styles from './AddToCartButton.module.css';

export default function AddToCartButton({ product }: { product: Product }) {
  const addItem = useCartStore((state) => state.addItem);
  const token = useAuthStore((state) => state.token);
  const router = useRouter();
  const [added, setAdded] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleAdd = async () => {
    if (!token) {
      router.push('/login');
      return;
    }

    setLoading(true);
    try {
      await addItem(token, product.id, 1);
      setAdded(true);
      setTimeout(() => setAdded(false), 2000);
    } catch (error) {
      console.error('Failed to add to cart:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button 
      className={`${styles.button} ${added ? styles.added : ''}`}
      onClick={handleAdd}
      disabled={product.stock === 0 || loading}
    >
      {loading ? (
        <span>Adding...</span>
      ) : added ? (
        <>
          <Check size={20} />
          <span>Added to Cart</span>
        </>
      ) : (
        <>
          <ShoppingCart size={20} />
          <span>{product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}</span>
        </>
      )}
    </button>
  );
}
