import { ScrollView, Text, View, Pressable, Alert } from "react-native";
import { ScreenContainer } from "@/components/screen-container";
import { useStore } from "@/lib/store-context";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Image } from "expo-image";
import { useColors } from "@/hooks/use-colors";
import { useState } from "react";

/**
 * شاشة تفاصيل المنتج
 */
export default function ProductDetailScreen() {
  const colors = useColors();
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const { products, isFavorite, addToFavorites, removeFromFavorites, addToCart } = useStore();

  const [quantity, setQuantity] = useState(1);

  // البحث عن المنتج
  const product = products.find((p) => p.id === id);

  if (!product) {
    return (
      <ScreenContainer className="items-center justify-center">
        <Text className="text-foreground text-lg">المنتج غير موجود</Text>
        <Pressable
          onPress={() => router.back()}
          className="mt-4 px-4 py-2 rounded-lg"
          style={{ backgroundColor: colors.primary }}
        >
          <Text className="text-white font-semibold">العودة</Text>
        </Pressable>
      </ScreenContainer>
    );
  }

  const favorite = isFavorite(product.id);

  const handleAddToCart = () => {
    addToCart(product, quantity);
    Alert.alert("تم الإضافة", `تم إضافة ${quantity} من ${product.name} إلى السلة`);
    setQuantity(1);
  };

  return (
    <ScreenContainer className="bg-background">
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* رأس الصفحة مع زر الرجوع */}
        <View className="flex-row items-center justify-between px-4 py-4">
          <Pressable
            onPress={() => router.back()}
            style={({ pressed }) => [{ opacity: pressed ? 0.6 : 1 }]}
          >
            <Text className="text-2xl">←</Text>
          </Pressable>
          <Text className="text-xl font-bold text-foreground">تفاصيل المنتج</Text>
          <Pressable
            onPress={() => {
              if (favorite) {
                removeFromFavorites(product.id);
              } else {
                addToFavorites(product.id);
              }
            }}
            style={({ pressed }) => [{ opacity: pressed ? 0.6 : 1 }]}
          >
            <Text className="text-2xl">{favorite ? "❤️" : "🤍"}</Text>
          </Pressable>
        </View>

        {/* صورة المنتج */}
        <View className="px-4 py-2">
          <View
            className="rounded-lg overflow-hidden bg-gray-200"
            style={{ height: 300 }}
          >
            <Image
              source={product.image}
              style={{ width: "100%", height: "100%" }}
              contentFit="cover"
            />
          </View>
        </View>

        {/* معلومات المنتج الأساسية */}
        <View className="px-4 py-4">
          <Text className="text-2xl font-bold text-foreground mb-2">{product.name}</Text>

          {/* التقييم */}
          <View className="flex-row items-center gap-2 mb-4">
            <Text className="text-yellow-500 text-lg">⭐</Text>
            <Text className="text-foreground font-semibold">{product.rating}</Text>
            <Text className="text-muted">({product.reviews} تقييم)</Text>
          </View>

          {/* السعر */}
          <View className="flex-row items-baseline gap-2 mb-4">
            <Text className="text-3xl font-bold text-primary">
              {product.price.toFixed(2)} ر.س
            </Text>
            {product.originalPrice && (
              <Text className="text-lg text-muted line-through">
                {product.originalPrice.toFixed(2)} ر.س
              </Text>
            )}
          </View>

          {/* حالة المخزون */}
          <View className="mb-4">
            <Text
              className="font-semibold"
              style={{
                color: product.inStock ? colors.success : colors.error,
              }}
            >
              {product.inStock ? "✓ في المخزون" : "✗ غير متوفر"}
            </Text>
          </View>
        </View>

        {/* الوصف */}
        <View className="px-4 py-2 border-t" style={{ borderColor: colors.border }}>
          <Text className="text-lg font-semibold text-foreground mb-2">الوصف</Text>
          <Text className="text-foreground leading-relaxed">{product.description}</Text>
        </View>

        {/* اختيار الكمية */}
        <View className="px-4 py-4 border-t" style={{ borderColor: colors.border }}>
          <Text className="text-lg font-semibold text-foreground mb-3">الكمية</Text>
          <View className="flex-row items-center gap-4">
            <Pressable
              onPress={() => setQuantity(Math.max(1, quantity - 1))}
              className="w-10 h-10 items-center justify-center rounded-lg"
              style={{ backgroundColor: colors.surface }}
            >
              <Text className="text-xl font-bold text-foreground">−</Text>
            </Pressable>
            <Text className="text-xl font-bold text-foreground w-8 text-center">
              {quantity}
            </Text>
            <Pressable
              onPress={() => setQuantity(quantity + 1)}
              className="w-10 h-10 items-center justify-center rounded-lg"
              style={{ backgroundColor: colors.surface }}
            >
              <Text className="text-xl font-bold text-foreground">+</Text>
            </Pressable>
          </View>
        </View>

        {/* الأزرار */}
        <View className="px-4 py-6 gap-3 border-t" style={{ borderColor: colors.border }}>
          <Pressable
            onPress={handleAddToCart}
            disabled={!product.inStock}
            style={({ pressed }) => [
              {
                paddingVertical: 14,
                borderRadius: 10,
                backgroundColor: product.inStock ? colors.primary : colors.muted,
                opacity: pressed && product.inStock ? 0.8 : 1,
              },
            ]}
          >
            <Text className="text-white text-center font-bold text-lg">
              أضف إلى السلة
            </Text>
          </Pressable>

          <Pressable
            onPress={() => router.back()}
            style={({ pressed }) => [
              {
                paddingVertical: 14,
                borderRadius: 10,
                backgroundColor: colors.surface,
                opacity: pressed ? 0.7 : 1,
              },
            ]}
          >
            <Text className="text-foreground text-center font-bold text-lg">
              متابعة التسوق
            </Text>
          </Pressable>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
