import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * نموذج المنتج الرقمي
 */
export interface DigitalProduct {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  category: string;
  description: string;
  fileUrl?: string; // رابط الملف الرقمي
  fileSize?: string; // حجم الملف
  downloadCount?: number; // عدد مرات التنزيل
  rating: number;
  reviews: number;
  inStock: boolean;
  tags?: string[];
}

/**
 * نموذج عنصر السلة الرقمية
 */
export interface DigitalCartItem {
  product: DigitalProduct;
  quantity: number;
}

/**
 * نموذج الطلب الرقمي
 */
export interface DigitalOrder {
  id: string;
  items: DigitalCartItem[];
  total: number;
  status: 'pending' | 'completed' | 'cancelled';
  createdAt: Date;
  paymentMethod: string;
  downloadLinks: Array<{
    productId: string;
    fileUrl: string;
    expiresAt: Date;
  }>;
}

/**
 * واجهة سياق المتجر الرقمي
 */
interface DigitalStoreContextType {
  // المنتجات
  products: DigitalProduct[];
  filteredProducts: DigitalProduct[];
  categories: string[];
  selectedCategory: string;
  searchQuery: string;
  sortBy: 'newest' | 'popular' | 'price-low' | 'price-high';

  // سلة التسوق
  cart: DigitalCartItem[];
  cartTotal: number;

  // المفضلة
  favorites: string[];

  // الطلبات
  orders: DigitalOrder[];

  // الدوال
  setSearchQuery: (query: string) => void;
  setSelectedCategory: (category: string) => void;
  setSortBy: (sort: 'newest' | 'popular' | 'price-low' | 'price-high') => void;
  addToCart: (product: DigitalProduct, quantity: number) => void;
  removeFromCart: (productId: string) => void;
  updateCartQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  addToFavorites: (productId: string) => void;
  removeFromFavorites: (productId: string) => void;
  isFavorite: (productId: string) => boolean;
  addOrder: (order: DigitalOrder) => void;
  getDownloadLinks: (orderId: string) => Array<{ productId: string; fileUrl: string }>;
  loadData: () => Promise<void>;

  // دوال الإدارة
  addProduct: (product: DigitalProduct) => void;
  updateProduct: (id: string, product: Partial<DigitalProduct>) => void;
  deleteProduct: (id: string) => void;
  addCategory: (category: string) => void;
}

/**
 * إنشاء السياق
 */
const DigitalStoreContext = createContext<DigitalStoreContextType | undefined>(undefined);

/**
 * بيانات المنتجات الرقمية الافتراضية
 */
const MOCK_DIGITAL_PRODUCTS: DigitalProduct[] = [
  {
    id: '1',
    name: 'قالب ويب احترافي',
    price: 29.99,
    originalPrice: 49.99,
    image: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=300&h=300&fit=crop',
    category: 'قوالب',
    description: 'قالب ويب حديث وسريع مع تصميم استجابي',
    fileSize: '2.5 MB',
    rating: 4.8,
    reviews: 245,
    inStock: true,
    tags: ['HTML', 'CSS', 'JavaScript'],
  },
  {
    id: '2',
    name: 'كتاب البرمجة بـ Python',
    price: 19.99,
    originalPrice: 34.99,
    image: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=300&h=300&fit=crop',
    category: 'كتب',
    description: 'كتاب شامل لتعلم البرمجة بلغة Python من الصفر',
    fileSize: '15 MB',
    rating: 4.7,
    reviews: 512,
    inStock: true,
    tags: ['Python', 'البرمجة', 'التعليم'],
  },
  {
    id: '3',
    name: 'مكتبة أيقونات SVG',
    price: 14.99,
    originalPrice: 24.99,
    image: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=300&h=300&fit=crop',
    category: 'مكتبات',
    description: '5000 أيقونة SVG عالية الجودة جاهزة للاستخدام',
    fileSize: '8.3 MB',
    rating: 4.6,
    reviews: 189,
    inStock: true,
    tags: ['SVG', 'أيقونات', 'تصميم'],
  },
  {
    id: '4',
    name: 'دورة تصميم UI/UX',
    price: 39.99,
    originalPrice: 69.99,
    image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=300&h=300&fit=crop',
    category: 'دورات',
    description: 'دورة شاملة في تصميم الواجهات وتجربة المستخدم',
    fileSize: '1.2 GB',
    rating: 4.9,
    reviews: 678,
    inStock: true,
    tags: ['تصميم', 'UI/UX', 'التعليم'],
  },
  {
    id: '5',
    name: 'مجموعة صور عالية الجودة',
    price: 24.99,
    originalPrice: 44.99,
    image: 'https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=300&h=300&fit=crop',
    category: 'صور',
    description: '500 صورة احترافية للاستخدام التجاري',
    fileSize: '3.8 GB',
    rating: 4.5,
    reviews: 234,
    inStock: true,
    tags: ['صور', 'تصميم', 'احترافي'],
  },
  {
    id: '6',
    name: 'أداة تحرير فيديو متقدمة',
    price: 49.99,
    originalPrice: 89.99,
    image: 'https://images.unsplash.com/photo-1574375927938-d5a98e8ffe85?w=300&h=300&fit=crop',
    category: 'أدوات',
    description: 'برنامج تحرير فيديو احترافي مع مؤثرات متقدمة',
    fileSize: '500 MB',
    rating: 4.7,
    reviews: 456,
    inStock: true,
    tags: ['فيديو', 'تحرير', 'احترافي'],
  },
];

/**
 * مزود السياق
 */
export function DigitalStoreProvider({ children }: { children: ReactNode }) {
  const [products, setProducts] = useState<DigitalProduct[]>(MOCK_DIGITAL_PRODUCTS);
  const [filteredProducts, setFilteredProducts] = useState<DigitalProduct[]>(MOCK_DIGITAL_PRODUCTS);
  const [cart, setCart] = useState<DigitalCartItem[]>([]);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [orders, setOrders] = useState<DigitalOrder[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('الكل');
  const [sortBy, setSortBy] = useState<'newest' | 'popular' | 'price-low' | 'price-high'>('newest');

  const categories = ['الكل', ...new Set(products.map(p => p.category))];

  /**
   * تحديث المنتجات المصفاة
   */
  useEffect(() => {
    let filtered = products;

    if (selectedCategory !== 'الكل') {
      filtered = filtered.filter(p => p.category === selectedCategory);
    }

    if (searchQuery.trim()) {
      filtered = filtered.filter(p =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    switch (sortBy) {
      case 'popular':
        filtered = [...filtered].sort((a, b) => b.rating - a.rating);
        break;
      case 'price-low':
        filtered = [...filtered].sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        filtered = [...filtered].sort((a, b) => b.price - a.price);
        break;
      case 'newest':
      default:
        break;
    }

    setFilteredProducts(filtered);
  }, [products, selectedCategory, searchQuery, sortBy]);

  /**
   * حساب إجمالي السلة
   */
  const cartTotal = cart.reduce((total, item) => total + item.product.price * item.quantity, 0);

  /**
   * إضافة منتج إلى السلة
   */
  const addToCart = (product: DigitalProduct, quantity: number) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.product.id === product.id);
      if (existingItem) {
        return prevCart.map(item =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prevCart, { product, quantity }];
    });
  };

  /**
   * إزالة منتج من السلة
   */
  const removeFromCart = (productId: string) => {
    setCart(prevCart => prevCart.filter(item => item.product.id !== productId));
  };

  /**
   * تحديث كمية المنتج في السلة
   */
  const updateCartQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
    } else {
      setCart(prevCart =>
        prevCart.map(item =>
          item.product.id === productId ? { ...item, quantity } : item
        )
      );
    }
  };

  /**
   * مسح السلة
   */
  const clearCart = () => {
    setCart([]);
  };

  /**
   * إضافة منتج إلى المفضلة
   */
  const addToFavorites = (productId: string) => {
    setFavorites(prev => [...new Set([...prev, productId])]);
  };

  /**
   * إزالة منتج من المفضلة
   */
  const removeFromFavorites = (productId: string) => {
    setFavorites(prev => prev.filter(id => id !== productId));
  };

  /**
   * التحقق من وجود منتج في المفضلة
   */
  const isFavorite = (productId: string) => favorites.includes(productId);

  /**
   * إضافة طلب جديد
   */
  const addOrder = (order: DigitalOrder) => {
    setOrders(prev => [...prev, order]);
  };

  /**
   * الحصول على روابط التنزيل
   */
  const getDownloadLinks = (orderId: string) => {
    const order = orders.find(o => o.id === orderId);
    return order?.downloadLinks.map(link => ({
      productId: link.productId,
      fileUrl: link.fileUrl,
    })) || [];
  };

  /**
   * إضافة منتج جديد (للإدارة)
   */
  const addProduct = (product: DigitalProduct) => {
    setProducts(prev => [...prev, product]);
  };

  /**
   * تحديث منتج (للإدارة)
   */
  const updateProduct = (id: string, updates: Partial<DigitalProduct>) => {
    setProducts(prev =>
      prev.map(p => (p.id === id ? { ...p, ...updates } : p))
    );
  };

  /**
   * حذف منتج (للإدارة)
   */
  const deleteProduct = (id: string) => {
    setProducts(prev => prev.filter(p => p.id !== id));
  };

  /**
   * إضافة فئة جديدة (للإدارة)
   */
  const addCategory = (category: string) => {
    if (!categories.includes(category)) {
      // سيتم تحديث الفئات تلقائياً عند إضافة منتج جديد بفئة جديدة
    }
  };

  /**
   * تحميل البيانات من التخزين المحلي
   */
  const loadData = async () => {
    try {
      const cartData = await AsyncStorage.getItem('digitalCart');
      const favoritesData = await AsyncStorage.getItem('digitalFavorites');
      const ordersData = await AsyncStorage.getItem('digitalOrders');

      if (cartData) setCart(JSON.parse(cartData));
      if (favoritesData) setFavorites(JSON.parse(favoritesData));
      if (ordersData) setOrders(JSON.parse(ordersData));
    } catch (error) {
      console.error('Error loading data from AsyncStorage:', error);
    }
  };

  /**
   * حفظ البيانات في التخزين المحلي
   */
  useEffect(() => {
    const saveData = async () => {
      try {
        await AsyncStorage.setItem('digitalCart', JSON.stringify(cart));
        await AsyncStorage.setItem('digitalFavorites', JSON.stringify(favorites));
        await AsyncStorage.setItem('digitalOrders', JSON.stringify(orders));
      } catch (error) {
        console.error('Error saving data to AsyncStorage:', error);
      }
    };

    saveData();
  }, [cart, favorites, orders]);

  const value: DigitalStoreContextType = {
    products,
    filteredProducts,
    categories,
    selectedCategory,
    searchQuery,
    sortBy,
    cart,
    cartTotal,
    favorites,
    orders,
    setSearchQuery,
    setSelectedCategory,
    setSortBy,
    addToCart,
    removeFromCart,
    updateCartQuantity,
    clearCart,
    addToFavorites,
    removeFromFavorites,
    isFavorite,
    addOrder,
    getDownloadLinks,
    loadData,
    addProduct,
    updateProduct,
    deleteProduct,
    addCategory,
  };

  return (
    <DigitalStoreContext.Provider value={value}>
      {children}
    </DigitalStoreContext.Provider>
  );
}

/**
 * Hook للوصول إلى سياق المتجر الرقمي
 */
export function useDigitalStore() {
  const context = useContext(DigitalStoreContext);
  if (context === undefined) {
    throw new Error('useDigitalStore must be used within a DigitalStoreProvider');
  }
  return context;
}
