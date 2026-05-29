import { useState, useEffect } from 'react';
import { Product, COUPON_CODES } from '@/lib/constants';

export interface CartItem {
  product: Product;
  selectedSize: string;
  price: number; // variant price
  quantity: number;
}

export function useCart(addToast: (msg: string, type?: 'success' | 'error' | 'info') => void) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [couponCode, setCouponCode] = useState('');
  const [activeCoupon, setActiveCoupon] = useState<{ code: string; description: string; discountPercent?: number; flatDiscount?: number } | null>(null);
  const [couponError, setCouponError] = useState('');

  // Load from local storage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedCart = localStorage.getItem('pureglow_cart');
      if (savedCart) {
        try {
          const parsed = JSON.parse(savedCart);
          setTimeout(() => setCart(parsed), 0);
        } catch (e) {
          console.error("Cart retrieval failure", e);
        }
      }
      const savedCoupon = localStorage.getItem('pureglow_coupon');
      if (savedCoupon) {
        try {
          const parsedCoupon = JSON.parse(savedCoupon);
          setTimeout(() => setActiveCoupon(parsedCoupon), 0);
        } catch (e) {
          console.error("Coupon retrieval failure", e);
        }
      }
    }
  }, []);

  // Save to local storage
  const saveCartToStorage = (updatedCart: CartItem[]) => {
    localStorage.setItem('pureglow_cart', JSON.stringify(updatedCart));
  };

  const handleAddToBag = (product: Product, sizeName: string) => {
    // Determine designated size parameters
    const sizeConfig = product.sizes.find(s => s.name === sizeName) || product.sizes[0];
    const itemPrice = product.price + sizeConfig.priceAdjustment;
    const maxStock = sizeConfig.stock;

    setCart((prevCart) => {
      const existingIndex = prevCart.findIndex(
        (item) => item.product.id === product.id && item.selectedSize === sizeName
      );

      let updatedCart: CartItem[];

      if (existingIndex > -1) {
        const currentQty = prevCart[existingIndex].quantity;
        if (currentQty >= maxStock) {
          addToast(`Maximum boutique inventory limit of ${maxStock} units reached for ${product.name} (${sizeName}).`, 'error');
          return prevCart;
        }
        
        updatedCart = prevCart.map((item, idx) => 
          idx === existingIndex 
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
        addToast(`Enriched ${product.name} (${sizeName}) quantity inside your luxury bag.`, 'success');
      } else {
        updatedCart = [...prevCart, { product, selectedSize: sizeName, price: itemPrice, quantity: 1 }];
        addToast(`Added ${product.name} (${sizeName}) to your reserved selections.`, 'success');
      }

      saveCartToStorage(updatedCart);
      return updatedCart;
    });
  };

  const handleUpdateQuantity = (productId: string, sizeName: string, delta: number) => {
    setCart((prevCart) => {
      const existing = prevCart.find(
        (item) => item.product.id === productId && item.selectedSize === sizeName
      );

      if (!existing) return prevCart;

      const sizeConfig = existing.product.sizes.find(s => s.name === sizeName) || existing.product.sizes[0];
      const maxStock = sizeConfig.stock;
      const nextQuantity = existing.quantity + delta;

      if (nextQuantity > maxStock) {
        addToast(`Cannot select more than ${maxStock} available units of ${existing.product.name} (${sizeName}).`, 'error');
        return prevCart;
      }

      let updatedCart: CartItem[];

      if (nextQuantity <= 0) {
        updatedCart = prevCart.filter(
          (item) => !(item.product.id === productId && item.selectedSize === sizeName)
        );
        addToast(`Removed ${existing.product.name} (${sizeName}) from luxury bag.`, 'info');
      } else {
        updatedCart = prevCart.map((item) => 
          (item.product.id === productId && item.selectedSize === sizeName)
            ? { ...item, quantity: nextQuantity }
            : item
        );
      }

      saveCartToStorage(updatedCart);
      return updatedCart;
    });
  };

  const handleRemoveItem = (productId: string, sizeName: string) => {
    setCart((prevCart) => {
      const updatedCart = prevCart.filter(
        (item) => !(item.product.id === productId && item.selectedSize === sizeName)
      );
      addToast(`Removed selected skincare selection from your bag.`, 'info');
      saveCartToStorage(updatedCart);
      return updatedCart;
    });
  };

  const applyDiscountCoupon = (code: string) => {
    setCouponError('');
    const uppercaseCode = code.trim().toUpperCase();
    
    if (!uppercaseCode) {
      setCouponError('Please enter a coupon code.');
      return;
    }

    const coupon = COUPON_CODES[uppercaseCode];
    if (coupon) {
      const details = { code: uppercaseCode, ...coupon };
      setActiveCoupon(details);
      localStorage.setItem('pureglow_coupon', JSON.stringify(details));
      addToast(`Exquisite styling promo "${uppercaseCode}" has been successfully verified.`, 'success');
      setCouponCode('');
    } else {
      setCouponError('Voucher code unrecognized in our priority registries.');
      addToast('Unrecognized luxury promotion value.', 'error');
    }
  };

  const removeCoupon = () => {
    setActiveCoupon(null);
    localStorage.removeItem('pureglow_coupon');
    addToast('Coupon application discarded.', 'info');
  };

  const clearCart = () => {
    setCart([]);
    localStorage.removeItem('pureglow_cart');
  };

  // Aggregated figures
  const totalItemCount = cart.reduce((acc, item) => acc + item.quantity, 0);
  const subtotal = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);

  const discountAmount = (() => {
    if (!activeCoupon) return 0;
    if (activeCoupon.discountPercent) {
      return (subtotal * activeCoupon.discountPercent) / 100;
    }
    if (activeCoupon.flatDiscount) {
      return Math.min(activeCoupon.flatDiscount, subtotal);
    }
    return 0;
  })();

  const subtotalWithDiscount = Math.max(0, subtotal - discountAmount);

  return {
    cart,
    couponCode,
    setCouponCode,
    activeCoupon,
    couponError,
    applyDiscountCoupon,
    removeCoupon,
    handleAddToBag,
    handleUpdateQuantity,
    handleRemoveItem,
    clearCart,
    totalItemCount,
    subtotal,
    discountAmount,
    subtotalWithDiscount
  };
}
