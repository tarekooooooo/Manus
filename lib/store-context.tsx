import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * نموذج بيانات المنتج
 */
export interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  category: string;
  rating: number;
  reviews: number;
  description: string;
  inStock: boolean;
}

/**
 * نموذج بيانات عنصر السلة
 */
export interface CartItem {
  product: Product;
  quantity: number;
}

/**
 * نموذج بيانات الطلب
 */
export interface Order {
  id: string;
  items: CartItem[];
  total: number;
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';
  createdAt: Date;
  deliveryAddress: string;
  paymentMethod: string;
}

/**
 * واجهة سياق المتجر
 */
interface StoreContextType {
  // المنتجات
  products: Product[];
  filteredProducts: Product[];
  categories: string[];
  selectedCategory: string;
  searchQuery: string;
  sortBy: 'newest' | 'popular' | 'price-low' | 'price-high';
  
  // سلة التسوق
  cart: CartItem[];
  cartTotal: number;
  
  // المفضلة
  favorites: string[];
  
  // الطلبات
  orders: Order[];
  
  // الدوال
  setSearchQuery: (query: string) => void;
  setSelectedCategory: (category: string) => void;
  setSortBy: (sort: 'newest' | 'popular' | 'price-low' | 'price-high') => void;
  addToCart: (product: Product, quantity: number) => void;
  removeFromCart: (productId: string) => void;
  updateCartQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  addToFavorites: (productId: string) => void;
  removeFromFavorites: (productId: string) => void;
  isFavorite: (productId: string) => boolean;
  addOrder: (order: Order) => void;
  loadData: () => Promise<void>;
}

/**
 * إنشاء السياق
 */
const StoreContext = createContext<StoreContextType | undefined>(undefined);

/**
 * بيانات المنتجات الافتراضية
 */
const MOCK_PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'تي شيرت كلاسيكي',
    price: 49.99,
    originalPrice: 79.99,
    image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=300&h=300&fit=crop',
    category: 'ملابس',
    rating: 4.5,
    reviews: 128,
    description: 'تي شيرت مريح وعملي مصنوع من القطن 100%',
    inStock: true,
  },
  {
    id: '2',
    name: 'جينز أزرق',
    price: 89.99,
    originalPrice: 129.99,
    image: 'https://images.unsplash.com/photo-1542272604-787c62d465d1?w=300&h=300&fit=crop',
    category: 'ملابس',
    rating: 4.7,
    reviews: 256,
    description: 'جينز عالي الجودة مع تصميم عصري',
    inStock: true,
  },
  {
    id: '3',
    name: 'حذاء رياضي',
    price: 119.99,
    originalPrice: 179.99,
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=300&h=300&fit=crop',
    category: 'أحذية',
    rating: 4.8,
    reviews: 512,
    description: 'حذاء رياضي مريح وخفيف الوزن',
    inStock: true,
  },
  {
    id: '4',
    name: 'ساعة ذكية',
    price: 199.99,
    originalPrice: 299.99,
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=300&h=300&fit=crop',
    category: 'إكسسوارات',
    rating: 4.6,
    reviews: 384,
    description: 'ساعة ذكية مع ميزات صحية متقدمة',
    inStock: true,
  },
  {
    id: '5',
    name: 'حقيبة يد جلدية',
    price: 149.99,
    originalPrice: 229.99,
    image: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=300&h=300&fit=crop',
    category: 'إكسسوارات',
    rating: 4.4,
    reviews: 156,
    description: 'حقيبة يد من الجلد الطبيعي',
    inStock: true,
  },
  {
    id: '6',
    name: 'قميص رسمي',
    price: 79.99,
    originalPrice: 119.99,
    image: 'https://images.unsplash.com/photo-1596399579883-e5fe39413900?w=300&h=300&fit=crop',
    category: 'ملابس',
    rating: 4.5,
    reviews: 89,
    description: 'قميص رسمي أنيق وعملي',
    inStock: true,
  },
];

/**
 * مزود السياق
 */
export function StoreProvider({ children }: { children: ReactNode }) {
  const [products] = useState<Product[]>(MOCK_PRODUCTS);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>(MOCK_PRODUCTS);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('الكل');
  const [sortBy, setSortBy] = useState<'newest' | 'popular' | 'price-low' | 'price-high'>('newest');

  const categories = ['الكل', ...new Set(products.map(p => p.category))];

  /**
   * تحديث المنتجات المصفاة
   */
  useEffect(() => {
    let filtered = products;

    // التصفية حسب الفئة
    if (selectedCategory !== 'الكل') {
      filtered = filtered.filter(p => p.category === selectedCategory);
    }

    // البحث
    if (searchQuery.trim()) {
      filtered = filtered.filter(p =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // الترتيب
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
        // الحفاظ على الترتيب الأصلي
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
  const addToCart = (product: Product, quantity: number) => {
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
  const addOrder = (order: Order) => {
    setOrders(prev => [...prev, order]);
  };

  /**
   * تحميل البيانات من التخزين المحلي
   */
  const loadData = async () => {
    try {
      const cartData = await AsyncStorage.getItem('cart');
      const favoritesData = await AsyncStorage.getItem('favorites');
      const ordersData = await AsyncStorage.getItem('orders');

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
        await AsyncStorage.setItem('cart', JSON.stringify(cart));
        await AsyncStorage.setItem('favorites', JSON.stringify(favorites));
        await AsyncStorage.setItem('orders', JSON.stringify(orders));
      } catch (error) {
        console.error('Error saving data to AsyncStorage:', error);
      }
    };

    saveData();
  }, [cart, favorites, orders]);

  const value: StoreContextType = {
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
    loadData,
  };

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

/**
 * Hook للوصول إلى سياق المتجر
 */
export function useStore() {
  const context = useContext(StoreContext);
  if (context === undefined) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
}
