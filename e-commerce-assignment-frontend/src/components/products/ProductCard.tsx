import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ShoppingCart } from 'lucide-react';
import { Product } from '@/lib/api';
import { useCartStore } from '@/store/cartStore';
import { useAuthStore } from '@/store/authStore';
import styles from './ProductCard.module.css';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const addItem = useCartStore((state) => state.addItem);
  const token = useAuthStore((state) => state.token);
  const router = useRouter();

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault(); // prevent navigation
    if (!token) {
      router.push('/login');
      return;
    }
    try {
      await addItem(token, product.id, 1);
    } catch (error) {
      console.error('Failed to add to cart:', error);
    }
  };

  return (
    <Link href={`/products/${product.id}`} className={styles.card}>
      <div className={styles.imageContainer}>
        <img 
          src={product.thumbnail} 
          alt={product.title}
          className={styles.image}
          loading="lazy"
        />
        {product.discountPercentage > 0 && (
          <div className={styles.discountBadge}>
            -{Math.round(product.discountPercentage)}%
          </div>
        )}
      </div>
      
      <div className={styles.content}>
        <p className={styles.category}>{product.category?.name || 'Uncategorized'}</p>
        <h3 className={styles.title}>{product.title}</h3>
        
        <div className={styles.footer}>
          <div className={styles.priceContainer}>
            <span className={styles.price}>${product.price.toFixed(2)}</span>
          </div>
          
          <button 
            className={styles.addBtn}
            onClick={handleAddToCart}
            aria-label="Add to cart"
          >
            <ShoppingCart size={18} />
          </button>
        </div>
      </div>
    </Link>
  );
}
