export interface Product {
  id: string;
  name: string;
  tagline: string;
  category: string;
  price: number; // base price for first variant size
  description: string;
  image: string;
  images: string[]; // for gallery
  sizes: { name: string; priceAdjustment: number; stock: number }[];
  ingredients: string;
  benefits: string[];
  careInstructions: string;
  rating: number;
  reviewsCount: number;
}

export interface Review {
  id: string;
  alias: string;
  rating: number;
  date: string;
  comment: string;
}

export interface OrderItem {
  id: string;
  name: string;
  selectedSize: string;
  price: number;
  quantity: number;
}

export interface Order {
  id: string;
  customerName: string;
  address: string;
  whatsapp: string;
  items: OrderItem[];
  paymentMethod: 'COD' | 'CARD';
  total: number;
  date: string;
  status: 'PENDING' | 'CONFIRMED' | 'PACKING' | 'SHIPPED';
}

export const LUXURY_PRODUCTS: Product[] = [
  {
    id: "1",
    name: "Royal Saffron Elixir",
    tagline: "24k Gold & Saffron Serum",
    category: "Serums",
    price: 4500,
    description: "Premium facial brightening oil designed for supreme cellular repair and a majestic, long-lasting royal radiance. Powered by pristine organic handpicked saffron and real suspended gold flakes.",
    image: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=500",
    images: [
      "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=500",
      "https://images.unsplash.com/photo-1608248597481-496100c8c836?w=500",
      "https://images.unsplash.com/photo-1526947425960-945c6e72858f?w=500"
    ],
    sizes: [
      { name: "30ml", priceAdjustment: 0, stock: 12 },
      { name: "50ml", priceAdjustment: 2000, stock: 7 }
    ],
    ingredients: "Pristine Kashmiri Saffron Extract, Pure 24k Suspended Gold leaf flakes, Organic Jojoba Oil, Cold-pressed Sweet Almond Extract, Squalane, Vitamin E.",
    benefits: [
      "Visibly brightens and evens skin tone",
      "Stimulates deep cellular collagen synthesis",
      "Heals hyperpigmentation and fine-lines",
      "Imbues a velvety, high-fashion dewy glass finish"
    ],
    careInstructions: "Slightly massage 3 to 4 drops onto cleansed damp skin. Use every night before slumber for ultimate cellular renewal.",
    rating: 4.9,
    reviewsCount: 148
  },
  {
    id: "2",
    name: "Midnight Obsidian Cream",
    tagline: "Deep Velvet Hydration Complex",
    category: "Creams",
    price: 5200,
    description: "Rare organic volcanic mineral blend for intense overnight texture softening, absolute moisture containment, and supreme barrier fortification.",
    image: "https://images.unsplash.com/photo-1608248597481-496100c8c836?w=500",
    images: [
      "https://images.unsplash.com/photo-1608248597481-496100c8c836?w=500",
      "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=500",
      "https://images.unsplash.com/photo-1611080626919-7cf5a9dbab5b?w=500"
    ],
    sizes: [
      { name: "50ml", priceAdjustment: 0, stock: 15 },
      { name: "100ml", priceAdjustment: 2500, stock: 4 }
    ],
    ingredients: "Obsidian Micro-crystals, Organic Volcanic Minerals, Hyaluronic Acid, Nilotica Shea Butter, Sea Buckthorn Pulp extract, Niacinamide (5%).",
    benefits: [
      "Locks moisture up to 72 hours continuously",
      "Refines uneven texture and skin roughness",
      "Builds a robust, impenetrable skin barrier",
      "Minimizes structural pore visibility"
    ],
    careInstructions: "Warm a pea-sized amount between clean fingertips and press gently into cheekbones, jawline and forehead.",
    rating: 4.8,
    reviewsCount: 96
  },
  {
    id: "3",
    name: "Rose Dew Cellular Mist",
    tagline: "Rose Otto & Hyaluronic Acid Cleansing Mist",
    category: "Mists",
    price: 3800,
    description: "Instantly calm inflamed tissue and boost moisture retention with actual steam-distilled organic rose otto water.",
    image: "https://images.unsplash.com/photo-1526947425960-945c6e72858f?w=500",
    images: [
      "https://images.unsplash.com/photo-1526947425960-945c6e72858f?w=500",
      "https://images.unsplash.com/photo-1611080626919-7cf5a9dbab5b?w=500"
    ],
    sizes: [
      { name: "100ml", priceAdjustment: 0, stock: 24 }
    ],
    ingredients: "Organic Steam-distilled Rosa Damascena Hydrosol, Multiphasic Hyaluronic Acid, Calendula Leaf Extract, Aloe Vera Leaf Juice, Glycerin.",
    benefits: [
      "Instant cooling and redness relief",
      "Plumps skin cells with moisture on demand",
      "Balances natural skin pH levels perfectly",
      "Refreshes makeup throughout the day beautifully"
    ],
    careInstructions: "Hold bottle 10 inches from face and mist with closed eyes. Ideal as a luxurious post-cleansing botanical toner.",
    rating: 4.7,
    reviewsCount: 112
  },
  {
    id: "4",
    name: "Jasmine Youth Concentrate",
    tagline: "Retinol & Jasmine Infusion Oil",
    category: "Oils",
    price: 4900,
    description: "An incredibly fast-absorbing night repair elixir fusing vegan gentle retinol with pure jasmine absolute to correct fine lines and restore supreme elasticity.",
    image: "https://images.unsplash.com/photo-1611080626919-7cf5a9dbab5b?w=500",
    images: [
      "https://images.unsplash.com/photo-1611080626919-7cf5a9dbab5b?w=500",
      "https://images.unsplash.com/photo-1526947425960-945c6e72858f?w=500"
    ],
    sizes: [
      { name: "30ml", priceAdjustment: 0, stock: 9 },
      { name: "45ml", priceAdjustment: 1800, stock: 3 }
    ],
    ingredients: "Pure Jasmine Sambac Oil, Granactive Retinoid (1%), Evening Primrose Extract, Black Cumin Seed Oil, Rosehip Fruit Seed Oil.",
    benefits: [
      "Accelerates natural cellular turnover speed",
      "Improves elasticity and smooths wrinkles",
      "Soothes sensory stress through Jasmine aromatherapy",
      "Clears blemishes and morning puffiness"
    ],
    careInstructions: "Press 2-3 drops onto clean face and neck in the PM. We highly recommend applying broad-spectrum sunscreen the following morning.",
    rating: 4.9,
    reviewsCount: 82
  },
  {
    id: "5",
    name: "Gold Leaf Honey Cleanser",
    tagline: "24k Gold Foil Honey Cleanser",
    category: "Cleansers",
    price: 3500,
    description: "A decadent, non-foaming hydrating cleanser infused with Sidr honey extract and 24k gold leaf to melt away makeup, residue, and environmental toxins without drying.",
    image: "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=500",
    images: [
      "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=500",
      "https://images.unsplash.com/photo-1526947425960-945c6e72858f?w=500"
    ],
    sizes: [
      { name: "150ml", priceAdjustment: 0, stock: 18 }
    ],
    ingredients: "Raw Organic Sidr Honey, Suspended 24k Gold foils, Saponified Olive Oil, Organic Shea Butter extract, Chamomile Flower distillate, Provitamin B5.",
    benefits: [
      "Thoroughly cleanses without stripping skin oils",
      "Intensely hydrates and softens facial texture",
      "Delivers anti-inflammatory and antibacterial healing",
      "Instantly revives dull complexions with gold luminescence"
    ],
    careInstructions: "Massage onto dry face to dissolve makeup and impurities. Moisten fingers to emulsify into a silky milk, then rinse with warm water.",
    rating: 4.6,
    reviewsCount: 65
  }
];

export const CATEGORIES = ["All", "Serums", "Creams", "Oils", "Mists", "Cleansers"];

export const TESTIMONIALS = [
  {
    quote: "Pure Glow is the ultimate height of luxury skincare. The Royal Saffron Elixir completely eliminated my stubborn dark spots and left my skin with a gold velvet luminosity. Absolutely gorgeous brand.",
    author: "Nabila Malik, Lahore",
    role: "Aesthetician & Fashion Director"
  },
  {
    quote: "The Midnight Obsidian Cream has become a non-negotiable bedtime ritual. I wake up with wonderfully plumped, hydrated skin that even Clifton's humid breeze doesn't affect. Truly haute couture.",
    author: "Zainab Shah, Karachi",
    role: "Editorial Stylist"
  },
  {
    quote: "I am extremely selective with skincare. Pure Glow's cellular formulations show actual science combined with rich regional heritage. The Jasmine youth concentrate is a masterclass in anti-aging.",
    author: "Dr. Kamran Ahmed, Islamabad",
    role: "Surgical Dermatologist"
  }
];

export const FAQS = [
  {
    question: "What makes Pure Glow formulations unique?",
    answer: "Pure Glow fuses pristine organic organic elements sourced from the fertile Northern valleys of Pakistan with advanced laboratory cellular science. Our formulas utilize premium active concentrations like 24k gold leaf, steam-distilled rose damascena, and raw Sidr honey without synthetic silicones, parabens, or heavy chemical fillers."
  },
  {
    question: "Do you ship across Pakistan with secure packaging?",
    answer: "Yes, we ship premium tracked parcels to all states in Pakistan. Each order is dispatched inside a wax-sealed carbon black presentation box wrapped in thermal protector sheets to preserve pristine biochemical freshness."
  },
  {
    question: "Are your products safe for highly sensitive or acne-prone skin?",
    answer: "Absolutely. Our formulas are strictly non-comedogenic (won't clog pores), hypoallergenic, and dermatologically tested. By replacing toxic petroleum bases with skin-loving ingredients like squalane and jojoba, we minimize skin irritation risk."
  },
  {
    question: "Can I use the Saffron Elixir in the morning?",
    answer: "Yes! While saffron and gold repair wonderfully overnight, the Elixir operates as a spectacular, glow-inducing makeup primer. Just ensure you apply sunscreen over it if you are venturing into direct daylight."
  }
];

export const COUPON_CODES: { [key: string]: { description: string; discountPercent?: number; flatDiscount?: number } } = {
  "GOLDEN20": { description: "20% off all sovereign skincare", discountPercent: 20 },
  "PUREGLOW": { description: "PKR 500 flat dynamic discount", flatDiscount: 500 },
  "ELITE5": { description: "5% off for priority members", discountPercent: 5 }
};

export const SHIPPING_RATES: { [key: string]: number } = {
  "Lahore": 0,
  "Karachi": 0,
  "Islamabad": 0,
  "Rawalpindi": 0,
  "Faisalabad": 250,
  "Peshawar": 250,
  "Quetta": 250,
  "Multan": 250,
  "Sialkot": 250,
  "Gujranwala": 250,
  "Others (Pakistan)": 350
};

export const INITIAL_REVIEWS: { [productId: string]: Review[] } = {
  "1": [
    { id: "r1", alias: "Amina H.", rating: 5, date: "May 10, 2026", comment: "Breathtakingly light skin serum. Smells deeply of authentic Kashmiri saffron. My morning dullness has vanished completely." },
    { id: "r2", alias: "Sanam K.", rating: 5, date: "April 28, 2026", comment: "The gold flakes melt beautifully into the face. Worth every single rupee!" }
  ],
  "2": [
    { id: "r3", alias: "Mahnoor L.", rating: 5, date: "May 15, 2026", comment: "Superb hydration. My dry cheeks are finally supple even in winter. Highly recommended." },
    { id: "r4", alias: "Omar S.", rating: 4, date: "April 18, 2026", comment: "Wonderful texture recovery. Took about a week to show dramatic hydration changes but works wonders." }
  ]
};
