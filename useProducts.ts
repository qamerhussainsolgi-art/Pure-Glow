import { useState, useEffect, useMemo } from 'react';
import { Product, LUXURY_PRODUCTS, INITIAL_REVIEWS, Review } from '@/lib/constants';

export function useProducts() {
  const [products, setProducts] = useState<Product[]>(LUXURY_PRODUCTS);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  
  // Wishlist state
  const [wishlist, setWishlist] = useState<Product[]>([]);
  
  // Product Comparison state (holds max 2 products)
  const [comparedProducts, setComparedProducts] = useState<Product[]>([]);
  
  // Reviews state (persisted per product)
  const [allReviews, setAllReviews] = useState<{ [productId: string]: Review[] }>(INITIAL_REVIEWS);

  // Load wishlist & reviews from LocalStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedWish = localStorage.getItem('pureglow_wishlist');
      if (savedWish) {
        try {
          const parsedWish = JSON.parse(savedWish);
          setTimeout(() => setWishlist(parsedWish), 0);
        } catch (e) {
          console.error("Failed loading saved wishlist", e);
        }
      }

      const savedReviews = localStorage.getItem('pureglow_reviews');
      if (savedReviews) {
        try {
          const parsedReviews = JSON.parse(savedReviews);
          setTimeout(() => setAllReviews(parsedReviews), 0);
        } catch (e) {
          console.error("Failed loading custom reviews", e);
        }
      }
    }
  }, []);

  // Sync wishlist to storage
  const toggleWishlist = (product: Product) => {
    setWishlist((prev) => {
      const exists = prev.some((p) => p.id === product.id);
      let updated;
      if (exists) {
        updated = prev.filter((p) => p.id !== product.id);
      } else {
        updated = [...prev, product];
      }
      localStorage.setItem('pureglow_wishlist', JSON.stringify(updated));
      return updated;
    });
  };

  // Compare toggler (maximum 2 products)
  const toggleCompare = (product: Product) => {
    setComparedProducts((prev) => {
      const exists = prev.some((p) => p.id === product.id);
      if (exists) {
        return prev.filter((p) => p.id !== product.id);
      }
      if (prev.length >= 2) {
        // Swap out first
        return [prev[1], product];
      }
      return [...prev, product];
    });
  };

  const clearCompare = () => {
    setComparedProducts([]);
  };

  // Reviews writer
  const addProductReview = (productId: string, alias: string, rating: number, comment: string) => {
    const newRev: Review = {
      id: `rev-${Date.now()}`,
      alias: alias.trim() || "Anonymous Buyer",
      rating,
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      comment: comment.trim()
    };

    setAllReviews((prev) => {
      const updated = {
        ...prev,
        [productId]: [newRev, ...(prev[productId] || [])]
      };
      localStorage.setItem('pureglow_reviews', JSON.stringify(updated));
      return updated;
    });

    // Dynamically recalculate average rating & reviewsCount for display locally
    setProducts((prevProd) => {
      return prevProd.map((prod) => {
        if (prod.id === productId) {
          const productReviews = allReviews[productId] || [];
          const combinedReviews = [newRev, ...productReviews];
          const average = parseFloat((combinedReviews.reduce((sum, r) => sum + r.rating, 0) / combinedReviews.length).toFixed(1));
          return {
            ...prod,
            rating: average,
            reviewsCount: combinedReviews.length
          };
        }
        return prod;
      });
    });
  };

  // Filtered & searched products
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchCategory = selectedCategory === 'All' || p.category.toLowerCase() === selectedCategory.toLowerCase();
      const matchSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          p.tagline.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          p.ingredients.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCategory && matchSearch;
    });
  }, [products, selectedCategory, searchQuery]);

  return {
    products,
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
    wishlist,
    toggleWishlist,
    comparedProducts,
    toggleCompare,
    clearCompare,
    allReviews,
    addProductReview,
    filteredProducts
  };
}
