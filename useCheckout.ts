import { useState, useEffect } from 'react';
import { SHIPPING_RATES, Order, OrderItem } from '@/lib/constants';
import { 
  validateLegalName, 
  validatePakistaniPhone, 
  validateLuhn, 
  validateCardExpiry, 
  validateCVV, 
  standardizePakistaniPhone 
} from '@/lib/utils';
import { CartItem } from '@/hooks/useCart';

export function useCheckout(
  cart: CartItem[], 
  subtotalWithDiscount: number, 
  paymentMode: 'COD' | 'CARD',
  clearCart: () => void,
  addToast: (msg: string, type?: 'success' | 'error' | 'info') => void
) {
  // Input fields
  const [fullName, setFullName] = useState('');
  const [address, setAddress] = useState('');
  const [whatsappNumber, setWhatsappNumber] = useState('');
  const [selectedCity, setSelectedCity] = useState('');
  
  // Real-time Field Errors
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  
  // Simulated Card Values
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCVV, setCardCVV] = useState('');
  
  // Checkout submission loading cycle
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Created order feedback
  const [finalizedOrder, setFinalizedOrder] = useState<Order | null>(null);

  // Past Orders History (Persisted in LocalStorage)
  const [ordersHistory, setOrdersHistory] = useState<Order[]>([]);

  // Load Past Orders
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedOrders = localStorage.getItem('pureglow_order_history');
      if (savedOrders) {
        try {
          const parsedOrders = JSON.parse(savedOrders);
          setTimeout(() => setOrdersHistory(parsedOrders), 0);
        } catch (e) {
          console.error("Order history retrieval issue", e);
        }
      }
    }
  }, []);

  // Shipping rate calculation
  const shippingCost = selectedCity ? (SHIPPING_RATES[selectedCity] ?? 350) : 0;
  const grandTotal = subtotalWithDiscount + shippingCost;

  // Real-time single field validation helper
  const triggerFieldValidation = (field: string, value: string) => {
    const nextErrors = { ...errors };
    
    if (field === 'fullName') {
      if (!value.trim()) {
        nextErrors.fullName = 'Full Legal Name is required to sign off custom cargo manifests.';
      } else if (!validateLegalName(value)) {
        nextErrors.fullName = 'Name cannot contain numerical variables and must span 3+ characters.';
      } else {
        delete nextErrors.fullName;
      }
    }

    if (field === 'address') {
      if (!value.trim()) {
        nextErrors.address = 'A pristine physical destination address must be provided.';
      } else if (value.trim().length < 10) {
        nextErrors.address = 'Please furnish a sufficiently detailed address (10+ characters) to secure transport.';
      } else {
        delete nextErrors.address;
      }
    }

    if (field === 'whatsappNumber') {
      if (!value.trim()) {
        nextErrors.whatsappNumber = 'Active contact number is required for dispatch authentication.';
      } else if (!validatePakistaniPhone(value)) {
        nextErrors.whatsappNumber = 'Please input a valid Pakistani format: e.g. 03001234567 or +923217654321.';
      } else {
        delete nextErrors.whatsappNumber;
      }
    }

    if (field === 'selectedCity') {
      if (!value) {
        nextErrors.selectedCity = 'Please designate your shipping state to calculate freight paths.';
      } else {
        delete nextErrors.selectedCity;
      }
    }

    if (paymentMode === 'CARD') {
      if (field === 'cardNumber') {
        if (!value.trim()) {
          nextErrors.cardNumber = 'Credit Card Number is required.';
        } else if (!validateLuhn(value)) {
          nextErrors.cardNumber = 'Invalid credit card layout (Failed Luhn check validation).';
        } else {
          delete nextErrors.cardNumber;
        }
      }
      if (field === 'cardExpiry') {
        if (!value.trim()) {
          nextErrors.cardExpiry = 'Required (MM/YY).';
        } else if (!validateCardExpiry(value)) {
          nextErrors.cardExpiry = 'Invalid date or expired card.';
        } else {
          delete nextErrors.cardExpiry;
        }
      }
      if (field === 'cardCVV') {
        if (!value.trim()) {
          nextErrors.cardCVV = 'Required CVV.';
        } else if (!validateCVV(value)) {
          nextErrors.cardCVV = 'CVV must be 3 or 4 secure digits.';
        } else {
          delete nextErrors.cardCVV;
        }
      }
    }

    setErrors(nextErrors);
  };

  const handleDispatchOrder = async (e: React.FormEvent, paymentOverride: 'COD' | 'CARD') => {
    e.preventDefault();
    setErrors({});

    // Validate all standard elements
    const newErrors: { [key: string]: string } = {};
    if (!fullName.trim() || !validateLegalName(fullName)) {
      newErrors.fullName = 'Please enter a valid legal name.';
    }
    if (!address.trim() || address.trim().length < 10) {
      newErrors.address = 'Enter a detailed premium shipping location (10+ chars).';
    }
    if (!whatsappNumber.trim() || !validatePakistaniPhone(whatsappNumber)) {
      newErrors.whatsappNumber = 'Invalid phone number format specified.';
    }
    if (!selectedCity) {
      newErrors.selectedCity = 'Please declare your Pakistani municipality.';
    }

    if (paymentOverride === 'CARD') {
      if (!cardNumber.trim() || !validateLuhn(cardNumber)) {
        newErrors.cardNumber = 'Invalid Card parameters provided.';
      }
      if (!cardExpiry.trim() || !validateCardExpiry(cardExpiry)) {
        newErrors.cardExpiry = 'Visa/Mastercard parameters expired or misformatted.';
      }
      if (!cardCVV.trim() || !validateCVV(cardCVV)) {
        newErrors.cardCVV = 'Invalid CVV configuration.';
      }
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      addToast('Please verify all highlighted dispatch metrics.', 'error');
      return;
    }

    if (cart.length === 0) {
      addToast('Your bag has no selections. Order compile halted.', 'error');
      return;
    }

    setIsSubmitting(true);
    addToast('Contacting Pure Glow regional servers and organizing transit manifests...', 'info');

    // Simulate luxury API server latency delay (1.5 seconds)
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // Construct detailed Order Record
    const orderItems: OrderItem[] = cart.map((item) => ({
      id: item.product.id,
      name: item.product.name,
      selectedSize: item.selectedSize,
      price: item.price,
      quantity: item.quantity
    }));

    const newOrder: Order = {
      id: `PG-${Math.floor(100000 + Math.random() * 90000).toString()}`,
      customerName: fullName,
      address: `${address}, ${selectedCity}`,
      whatsapp: whatsappNumber,
      items: orderItems,
      paymentMethod: paymentOverride,
      total: grandTotal,
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
      status: 'CONFIRMED'
    };

    // Save order in history buffers
    const nextHistory = [newOrder, ...ordersHistory];
    setOrdersHistory(nextHistory);
    localStorage.setItem('pureglow_order_history', JSON.stringify(nextHistory));

    // WhatsApp generation script
    const businessWhatsApp = "923001234567";
    const paymentTypeText = paymentOverride === 'CARD' 
      ? `🔒 SECURE CREDIT CARD DEPOSITED` 
      : `Standard Cash on Delivery (COD) Mode Active for Verified Pakistani Hubs`;

    let itemLines = '';
    orderItems.forEach((item) => {
      itemLines += `• ${item.name} (${item.selectedSize}) (Qty: ${item.quantity}) - PKR ${item.price.toLocaleString()}\n`;
    });

    const receiptMessage = `✨ *NEW ORDER RECEIVED - PURE GLOW* ✨\n\n` +
      `📦 *Order Ref:* ${newOrder.id}\n` +
      `👤 *Customer Name:* ${newOrder.customerName}\n` +
      `📍 *Shipping Target:* ${newOrder.address}\n` +
      `📞 *Contact Number:* ${newOrder.whatsapp}\n\n` +
      `🛍 *Ordered Luxury Items:*\n${itemLines}` +
      `💳 *Payment Type:* ${paymentTypeText}\n` +
      `🚚 *Secure Freight Cost:* PKR ${shippingCost.toLocaleString()}\n` +
      `💰 *Grand Total Invoice:* *PKR ${grandTotal.toLocaleString()}*`;

    const encodedMessage = encodeURIComponent(receiptMessage);
    const whatsappUrl = `https://wa.me/${businessWhatsApp}?text=${encodedMessage}`;

    // Perform the safe launch of WhatsApp
    try {
      window.open(whatsappUrl, '_blank');
    } catch (err) {
      console.warn("Secure popup filter captured launch; manual override active.");
    }

    // Set final display view confirmation order, flush parameters
    setFinalizedOrder(newOrder);
    setIsSubmitting(false);
    clearCart();
    
    // Clear dynamic state variables
    setFullName('');
    setAddress('');
    setWhatsappNumber('');
    setSelectedCity('');
    setCardNumber('');
    setCardExpiry('');
    setCardCVV('');
    addToast(`Sovereign Order ${newOrder.id} successfully completed.`, 'success');
  };

  const discardFinalizedOrder = () => {
    setFinalizedOrder(null);
  };

  return {
    fullName,
    setFullName,
    address,
    setAddress,
    whatsappNumber,
    setWhatsappNumber,
    selectedCity,
    setSelectedCity,
    cardNumber,
    setCardNumber,
    cardExpiry,
    setCardExpiry,
    cardCVV,
    setCardCVV,
    errors,
    isSubmitting,
    finalizedOrder,
    ordersHistory,
    shippingCost,
    grandTotal,
    triggerFieldValidation,
    handleDispatchOrder,
    discardFinalizedOrder
  };
}
