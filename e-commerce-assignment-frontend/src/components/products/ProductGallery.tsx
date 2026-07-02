"use client";

import { useState } from 'react';
import styles from '@/app/products/[id]/page.module.css';

interface ProductGalleryProps {
  title: string;
  thumbnail: string;
  images: string[];
  discountPercentage: number;
}

export default function ProductGallery({ title, thumbnail, images, discountPercentage }: ProductGalleryProps) {
  // Use the first high-res image from the array if available, otherwise fallback to thumbnail
  const [mainImage, setMainImage] = useState((images && images.length > 0) ? images[0] : thumbnail);

  return (
    <div className={styles.imageSection}>
      <div className={styles.mainImageContainer}>
        <img 
          src={mainImage} 
          alt={title} 
          className={styles.mainImage} 
        />
        {discountPercentage > 0 && (
          <div className={styles.discountBadge}>
            -{Math.round(discountPercentage)}% OFF
          </div>
        )}
      </div>
      
      {images && images.length > 1 && (
        <div className={styles.gallery}>
          {images.map((img, idx) => (
            <button 
              key={idx} 
              className={`${styles.galleryImageContainer} ${mainImage === img ? styles.galleryImageSelected : ''}`}
              onClick={() => setMainImage(img)}
              aria-label={`View gallery image ${idx + 1}`}
            >
              <img src={img} alt={`Gallery image ${idx + 1}`} className={styles.galleryImage} />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
