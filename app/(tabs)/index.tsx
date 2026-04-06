import { ScrollView, Text, View, FlatList, Pressable, TextInput } from "react-native";
import { ScreenContainer } from "@/components/screen-container";
import { useStore } from "@/lib/store-context";
import { useEffect } from "react";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { useColors } from "@/hooks/use-colors";

/**
 * بطاقة المنتج
 */
function ProductCard({ product, onPress }: { product: any; onPress: () => void }) {
  const colors = useColors();
  const { isFavorite, addToFavorites, removeFromFavorites } = useStore();
  const favorite = isFavorite(product.id);

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        {
          flex: 1,
          margin: 8,
          backgroundColor: colors.surface,
          borderRadius: 12,
          overflow: "hidden",
          opacity: pressed ? 0.7 : 1,
        },
      ]}
    >
      <View className="flex-1">
        {/* صورة المنتج */}
        <View className="bg-gray-200 h-40 relative">
          <Image
            source={product.image}
            style={{ width: "100%", height: "100%" }}
            contentFit="cover"
          />
          {/* زر المفضلة */}
          <Pressable
            onPress={() => {
              if (favorite) {
                removeFromFavorites(product.id);
              } else {
                addToFavorites(product.id);
              }
            }}
            style={{ position: "absolute", top: 8, right: 8, padding: 8 }}
          >
            <Text style={{ fontSize: 20 }}>{favorite ? "❤️" : "🤍"}</Text>
          </Pressable>
        </View>

        {/* معلومات المنتج */}
        <View className="p-3 flex-1 justify-between">
          <View>
            <Text
              className="font-semibold text-foreground"
              style={{ fontSize: 14 }}
              numberOfLines={2}
            >
              {product.name}
            </Text>
            <View className="flex-row items-center gap-1 mt-1">
              <Text className="text-yellow-500">⭐</Text>
              <Text className="text-xs text-muted">
                {product.rating} ({product.reviews})
              </Text>
            </View>
          </View>

          {/* السعر */}
          <View className="mt-2">
            <View className="flex-row items-baseline gap-2">
              <Text className="font-bold text-primary" style={{ fontSize: 16 }}>
                {product.price.toFixed(2)} ر.س
              </Text>
              {product.originalPrice && (
                <Text
                  className="text-xs text-muted line-through"
                  style={{ fontSize: 12 }}
                >
                  {product.originalPrice.toFixed(2)} ر.س
                </Text>
              )}
            </View>
          </View>
        </View>
      </View>
    </Pressable>
  );
}

/**
 * الصفحة الرئيسية
 */
export default function HomeScreen() {
  const colors = useColors();
  const router = useRouter();
  const {
    products,
    filteredProducts,
    categories,
    selectedCategory,
    searchQuery,
    setSearchQuery,
    setSelectedCategory,
    loadData,
  } = useStore();

  useEffect(() => {
    loadData();
  }, []);

  return (
    <ScreenContainer className="bg-background">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} showsVerticalScrollIndicator={false}>
        {/* رأس الصفحة */}
        <View className="px-4 pt-4 pb-2">
          <Text className="text-3xl font-bold text-foreground mb-4">TAREK STOR LDY</Text>

          {/* شريط البحث */}
          <View
            className="flex-row items-center px-3 py-2 rounded-lg border"
            style={{ borderColor: colors.border, backgroundColor: colors.surface }}
          >
            <Text className="text-lg mr-2">🔍</Text>
            <TextInput
              placeholder="ابحث عن منتج..."
              placeholderTextColor={colors.muted}
              value={searchQuery}
              onChangeText={setSearchQuery}
              className="flex-1 text-foreground"
              style={{ color: colors.foreground }}
            />
          </View>
        </View>

        {/* البنر الإعلاني */}
        <View className="px-4 py-4">
          <View
            className="rounded-lg p-4 items-center justify-center"
            style={{ backgroundColor: colors.primary, height: 150 }}
          >
            <Text className="text-white text-2xl font-bold mb-2">عروض خاصة</Text>
            <Text className="text-white text-center">احصل على خصم يصل إلى 50% على المنتجات المختارة</Text>
          </View>
        </View>

        {/* الفئات */}
        <View className="px-4 py-2">
          <Text className="text-lg font-semibold text-foreground mb-3">الفئات</Text>
          <FlatList
            horizontal
            data={categories}
            keyExtractor={(item) => item}
            scrollEnabled={false}
            showsHorizontalScrollIndicator={false}
            renderItem={({ item }) => (
              <Pressable
                onPress={() => setSelectedCategory(item)}
                style={({ pressed }) => [
                  {
                    paddingHorizontal: 12,
                    paddingVertical: 8,
                    marginRight: 8,
                    borderRadius: 20,
                    backgroundColor:
                      selectedCategory === item ? colors.primary : colors.surface,
                    opacity: pressed ? 0.7 : 1,
                  },
                ]}
              >
                <Text
                  className="font-medium"
                  style={{
                    color: selectedCategory === item ? "white" : colors.foreground,
                  }}
                >
                  {item}
                </Text>
              </Pressable>
            )}
          />
        </View>

        {/* المنتجات */}
        <View className="px-2 py-4 flex-1">
          <Text className="text-lg font-semibold text-foreground px-2 mb-3">المنتجات</Text>
          {filteredProducts.length > 0 ? (
            <FlatList
              data={filteredProducts}
              keyExtractor={(item) => item.id}
              numColumns={2}
              scrollEnabled={false}
              renderItem={({ item }) => (
                <ProductCard
                  product={item}
                  onPress={() => router.push(`/product/${item.id}`)}
                />
              )}
            />
          ) : (
            <View className="flex-1 items-center justify-center py-8">
              <Text className="text-muted text-center">لا توجد منتجات</Text>
            </View>
          )}
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
