"use client";

import { useRouter, usePathname } from 'next/navigation';
import { Category } from '@/lib/api';
import styles from './Sidebar.module.css';

interface SidebarProps {
  categories: Category[];
  currentCategory: string;
  currentSearch: string;
}

export default function Sidebar({ categories, currentCategory, currentSearch }: SidebarProps) {
  const router = useRouter();
  const pathname = usePathname();

  const handleCategorySelect = (slug: string) => {
    const params = new URLSearchParams();
    if (currentSearch) params.set('search', currentSearch);
    if (slug !== currentCategory) params.set('category', slug); // toggle logic
    
    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <div className={styles.sidebar}>
      <div className={styles.stickyContainer}>
        <h3 className={styles.heading}>Categories</h3>
        <ul className={styles.categoryList}>
          {categories.map((category) => (
            <li key={category.id}>
              <button
                onClick={() => handleCategorySelect(category.slug)}
                className={`${styles.categoryBtn} ${
                  currentCategory === category.slug ? styles.active : ''
                }`}
              >
                {category.name}
              </button>
            </li>
          ))}
        </ul>

        {/* Placeholder for Price Range Filter if needed */}
        <div className={styles.divider}></div>
        <h3 className={styles.heading}>Filters</h3>
        <div className={styles.filterSection}>
          <p className={styles.filterNote}>Additional filters can be added here.</p>
        </div>
      </div>
    </div>
  );
}
