import { ScrollView, Text, View, Pressable, FlatList, Alert } from "react-native";
import { ScreenContainer } from "@/components/screen-container";
import { useStore } from "@/lib/store-context";
import { Image } from "expo-image";
import { useColors } from "@/hooks/use-colors";
import { useRouter } from "expo-router";

/**
 * عنصر السلة
 */
function CartItemComponent({ item, onRemove, onQuantityChange }: any) {
  const colors = useColors();

  return (
    <View
      className="flex-row gap-3 p-4 rounded-lg mb-3"
      style={{ backgroundColor: colors.surface }}
    >
      {/* صورة المنتج */}
      <View className="w-20 h-20 rounded-lg overflow-hidden bg-gray-200">
        <Image
          source={item.product.image}
          style={{ width: "100%", height: "100%" }}
          contentFit="cover"
        />
      </View>

      {/* معلومات المنتج */}
      <View className="flex-1">
        <Text className="font-semibold text-foreground" numberOfLines={2}>
          {item.product.name}
        </Text>
        <Text className="text-primary font-bold mt-1">
          {item.product.price.toFixed(2)} ر.س
        </Text>

        {/* التحكم بالكمية */}
        <View className="flex-row items-center gap-2 mt-2">
          <Pressable
            onPress={() => onQuantityChange(item.product.id, item.quantity - 1)}
            className="w-6 h-6 items-center justify-center rounded"
            style={{ backgroundColor: colors.border }}
          >
            <Text className="text-xs font-bold">−</Text>
          </Pressable>
          <Text className="w-4 text-center text-sm font-semibold">
            {item.quantity}
          </Text>
          <Pressable
            onPress={() => onQuantityChange(item.product.id, item.quantity + 1)}
            className="w-6 h-6 items-center justify-center rounded"
            style={{ backgroundColor: colors.border }}
          >
            <Text className="text-xs font-bold">+</Text>
          </Pressable>
        </View>
      </View>

      {/* زر الحذف */}
      <Pressable
        onPress={() => onRemove(item.product.id)}
        className="items-center justify-center w-8"
      >
        <Text className="text-lg">🗑️</Text>
      </Pressable>
    </View>
  );
}

/**
 * شاشة سلة التسوق
 */
export default function CartScreen() {
  const colors = useColors();
  const router = useRouter();
  const { cart, cartTotal, removeFromCart, updateCartQuantity, clearCart } = useStore();

  const handleCheckout = () => {
    if (cart.length === 0) {
      Alert.alert("السلة فارغة", "يرجى إضافة منتجات قبل المتابعة");
      return;
    }
    router.push("/checkout");
  };

  const handleClearCart = () => {
    Alert.alert(
      "تأكيد",
      "هل تريد حقاً مسح جميع المنتجات من السلة؟",
      [
        { text: "إلغاء", onPress: () => {} },
        {
          text: "نعم، امسح",
          onPress: () => clearCart(),
          style: "destructive",
        },
      ]
    );
  };

  return (
    <ScreenContainer className="bg-background">
      {/* رأس الصفحة */}
      <View className="px-4 py-4">
        <Text className="text-2xl font-bold text-foreground">سلة التسوق</Text>
      </View>

      {cart.length === 0 ? (
        // السلة فارغة
        <View className="flex-1 items-center justify-center px-4">
          <Text className="text-4xl mb-4">🛒</Text>
          <Text className="text-xl font-semibold text-foreground mb-2">
            السلة فارغة
          </Text>
          <Text className="text-muted text-center mb-6">
            ابدأ بإضافة المنتجات المفضلة لديك
          </Text>
          <Pressable
            onPress={() => router.push("/(tabs)")}
            className="px-6 py-3 rounded-lg"
            style={{ backgroundColor: colors.primary }}
          >
            <Text className="text-white font-semibold">العودة للتسوق</Text>
          </Pressable>
        </View>
      ) : (
        // السلة بها منتجات
        <>
          <ScrollView className="flex-1 px-4" showsVerticalScrollIndicator={false}>
            <FlatList
              data={cart}
              keyExtractor={(item) => item.product.id}
              scrollEnabled={false}
              renderItem={({ item }) => (
                <CartItemComponent
                  item={item}
                  onRemove={removeFromCart}
                  onQuantityChange={updateCartQuantity}
                />
              )}
            />
          </ScrollView>

          {/* ملخص الطلب */}
          <View className="px-4 py-4 border-t" style={{ borderColor: colors.border }}>
            <View className="flex-row justify-between mb-2">
              <Text className="text-muted">المجموع الفرعي:</Text>
              <Text className="text-foreground font-semibold">
                {cartTotal.toFixed(2)} ر.س
              </Text>
            </View>
            <View className="flex-row justify-between mb-4">
              <Text className="text-muted">الشحن:</Text>
              <Text className="text-foreground font-semibold">مجاني</Text>
            </View>
            <View
              className="flex-row justify-between py-3 border-t"
              style={{ borderColor: colors.border }}
            >
              <Text className="text-lg font-bold text-foreground">الإجمالي:</Text>
              <Text className="text-lg font-bold text-primary">
                {cartTotal.toFixed(2)} ر.س
              </Text>
            </View>

            {/* الأزرار */}
            <View className="gap-3 mt-4">
              <Pressable
                onPress={handleCheckout}
                style={({ pressed }) => [
                  {
                    paddingVertical: 14,
                    borderRadius: 10,
                    backgroundColor: colors.primary,
                    opacity: pressed ? 0.8 : 1,
                  },
                ]}
              >
                <Text className="text-white text-center font-bold text-lg">
                  متابعة الشراء
                </Text>
              </Pressable>

              <Pressable
                onPress={() => router.push("/(tabs)")}
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

              <Pressable
                onPress={handleClearCart}
                style={({ pressed }) => [
                  {
                    paddingVertical: 12,
                    borderRadius: 10,
                    backgroundColor: colors.error + "20",
                    opacity: pressed ? 0.7 : 1,
                  },
                ]}
              >
                <Text className="text-error text-center font-semibold">
                  مسح السلة
                </Text>
              </Pressable>
            </View>
          </View>
        </>
      )}
    </ScreenContainer>
  );
}
