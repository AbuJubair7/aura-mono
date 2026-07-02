"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Trash2, Plus, Minus, ArrowLeft } from 'lucide-react';
import { useCartStore } from '@/store/cartStore';
import { useAuthStore } from '@/store/authStore';
import styles from './page.module.css';

export default function CartPage() {
  const [mounted, setMounted] = useState(false);
  const cart = useCartStore();

  useEffect(() => {
    setMounted(true);
  }, []);

  // Redirect if unauthenticated
  useEffect(() => {
    if (mounted && !useAuthStore.getState().token) {
      window.location.href = '/login';
    }
  }, [mounted]);

  if (!mounted || !useAuthStore.getState().token) {
    return <div className="container" style={{ padding: '4rem' }}>Loading cart...</div>;
  }

  const token = useAuthStore.getState().token!;

  return (
    <div className={`container ${styles.pageLayout}`}>
      <div className={styles.header}>
        <h1 className={styles.title}>Your Cart</h1>
        <Link href="/products" className={styles.continueShopping}>
          <ArrowLeft size={16} /> Continue Shopping
        </Link>
      </div>

      {cart.loading ? (
        <div className={styles.emptyState}>
          <h2>Loading your cart...</h2>
        </div>
      ) : cart.items.length === 0 ? (
        <div className={styles.emptyState}>
          <h2>Your cart is currently empty</h2>
          <p>Explore our products and find something you love!</p>
          <Link href="/products" className={styles.primaryBtn}>
            Browse Products
          </Link>
        </div>
      ) : (
        <div className={styles.cartGrid}>
          <div className={styles.itemsSection}>
            {cart.items.map((item) => (
              <div key={item.id} className={styles.cartItem}>
                <div className={styles.itemImageContainer}>
                  <img src={item.product.thumbnail} alt={item.product.title} className={styles.itemImage} />
                </div>
                
                <div className={styles.itemDetails}>
                  <Link href={`/products/${item.product.id}`} className={styles.itemTitle}>
                    {item.product.title}
                  </Link>
                  <p className={styles.itemPrice}>${Number(item.product.price).toFixed(2)}</p>
                </div>

                <div className={styles.quantityControls}>
                  <button 
                    onClick={() => cart.updateQuantity(token, item.id, item.quantity - 1)}
                    disabled={item.quantity <= 1 || cart.loading}
                    className={styles.qtyBtn}
                  >
                    <Minus size={16} />
                  </button>
                  <span className={styles.quantity}>{item.quantity}</span>
                  <button 
                    onClick={() => cart.updateQuantity(token, item.id, item.quantity + 1)}
                    disabled={cart.loading}
                    className={styles.qtyBtn}
                  >
                    <Plus size={16} />
                  </button>
                </div>

                <div className={styles.itemTotal}>
                  ${(Number(item.product.price) * item.quantity).toFixed(2)}
                </div>

                <button 
                  onClick={() => cart.removeItem(token, item.id)}
                  disabled={cart.loading}
                  className={styles.removeBtn}
                  aria-label="Remove item"
                >
                  <Trash2 size={20} />
                </button>
              </div>
            ))}
          </div>

          <div className={styles.summarySection}>
            <div className={styles.summaryCard}>
              <h2 className={styles.summaryTitle}>Order Summary</h2>
              
              <div className={styles.summaryRow}>
                <span>Subtotal ({cart.getTotalItems()} items)</span>
                <span>${cart.getSubtotal().toFixed(2)}</span>
              </div>
              <div className={styles.summaryRow}>
                <span>Shipping</span>
                <span>Free</span>
              </div>
              <div className={styles.summaryRow}>
                <span>Tax</span>
                <span>Calculated at checkout</span>
              </div>
              
              <div className={styles.summaryDivider}></div>
              
              <div className={`${styles.summaryRow} ${styles.totalRow}`}>
                <span>Total</span>
                <span>${cart.getSubtotal().toFixed(2)}</span>
              </div>

              <button className={styles.checkoutBtn} onClick={() => alert("Checkout flow is currently unavailable.")}>
                Proceed to Checkout
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
