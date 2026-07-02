"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { ShoppingCart, Search, Menu, LogOut, User } from 'lucide-react';
import { useCartStore } from '@/store/cartStore';
import { useAuthStore } from '@/store/authStore';
import styles from './Header.module.css';

export default function Header() {
  const [mounted, setMounted] = useState(false);
  const totalItems = useCartStore((state) => state.getTotalItems());
  const { user, token, logout } = useAuthStore();
  const fetchCart = useCartStore((state) => state.fetchCart);
  
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentSearch = searchParams.get('search') || '';

  const [searchTerm, setSearchTerm] = useState(currentSearch);

  useEffect(() => {
    setMounted(true);
    // On mount, if we have a token, fetch the latest cart from the server
    if (useAuthStore.getState().token) {
      fetchCart(useAuthStore.getState().token!);
    }
  }, [fetchCart]);

  useEffect(() => {
    setSearchTerm(currentSearch);
  }, [currentSearch]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams(searchParams.toString());
    if (searchTerm.trim()) {
      params.set('search', searchTerm.trim());
    } else {
      params.delete('search');
    }
    params.delete('page');
    router.push(`/products?${params.toString()}`);
  };

  const handleLogout = () => {
    logout();
    useCartStore.getState().clearCart();
    router.push('/login');
  };

  return (
    <header className={`${styles.header} glass-panel`}>
      <div className={`container ${styles.headerContainer}`}>
        {/* Mobile Menu */}
        <button className={styles.mobileMenu}>
          <Menu size={24} />
        </button>

        {/* Logo */}
        <Link href="/" className={styles.logo}>
          <span className={styles.logoText}>Aura</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className={styles.desktopNav}>
          <Link href="/products" className={styles.navLink}>All Products</Link>
        </nav>

        {/* Actions (Search, Auth & Cart) */}
        <div className={styles.actions}>
          <form className={styles.searchWrapper} onSubmit={handleSearchSubmit}>
            <input 
              type="text" 
              placeholder="Search products..." 
              className={styles.searchInput}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button type="submit" className={styles.searchIconBtn} aria-label="Submit search">
              <Search size={18} className={styles.searchIcon} />
            </button>
          </form>

          {mounted && user ? (
            <div className={styles.authActions}>
              <span className={styles.greeting}>Hi, {user.firstName}</span>
              <button onClick={handleLogout} className={styles.logoutBtn} aria-label="Logout">
                <LogOut size={20} />
              </button>
              <Link href="/cart" className={styles.cartBtn}>
                <ShoppingCart size={24} />
                {totalItems > 0 && (
                  <span className={styles.cartBadge}>{totalItems}</span>
                )}
              </Link>
            </div>
          ) : mounted ? (
            <div className={styles.authActions}>
              <Link href="/login" className={styles.loginBtn}>Login</Link>
            </div>
          ) : null}
        </div>
      </div>
    </header>
  );
}
