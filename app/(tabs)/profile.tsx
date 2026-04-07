import { ScrollView, Text, View, Pressable, Alert } from "react-native";
import { ScreenContainer } from "@/components/screen-container";
import { useStore } from "@/lib/store-context";
import { useColors } from "@/hooks/use-colors";
import { useRouter } from "expo-router";

/**
 * بطاقة الطلب
 */
function OrderCard({ order }: any) {
  const colors = useColors();

  const statusText: Record<string, string> = {
    pending: "قيد الانتظار",
    confirmed: "مؤكد",
    shipped: "مشحون",
    delivered: "تم التسليم",
    cancelled: "ملغى",
  };

  const statusColor: Record<string, string> = {
    pending: colors.warning,
    confirmed: colors.primary,
    shipped: colors.primary,
    delivered: colors.success,
    cancelled: colors.error,
  };

  return (
    <View
      className="p-4 rounded-lg mb-3"
      style={{ backgroundColor: colors.surface }}
    >
      <View className="flex-row justify-between items-start mb-2">
        <View>
          <Text className="text-sm text-muted">رقم الطلب</Text>
          <Text className="font-semibold text-foreground">#{order.id}</Text>
        </View>
        <View className="items-end">
          <Text
            className="text-xs font-semibold px-2 py-1 rounded"
            style={{ backgroundColor: (statusColor[order.status] || colors.muted) + "20", color: statusColor[order.status] || colors.muted }}
          >
            {statusText[order.status] || "غير معروف"}
          </Text>
        </View>
      </View>

      <View className="flex-row justify-between mb-2">
        <Text className="text-sm text-muted">عدد المنتجات: {order.items.length}</Text>
        <Text className="text-foreground font-bold">
          {order.total.toFixed(2)} ر.س
        </Text>
      </View>

      <Text className="text-xs text-muted">
        {new Date(order.createdAt).toLocaleDateString("ar-SA")}
      </Text>
    </View>
  );
}

/**
 * شاشة الملف الشخصي
 */
export default function ProfileScreen() {
  const colors = useColors();
  const router = useRouter();
  const { orders, favorites, products } = useStore();

  const favoriteProducts = products.filter((p) => favorites.includes(p.id));

  return (
    <ScreenContainer className="bg-background">
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* رأس الصفحة */}
        <View className="px-4 py-4">
          <Text className="text-2xl font-bold text-foreground mb-2">الملف الشخصي</Text>
        </View>

        {/* معلومات المستخدم */}
        <View className="px-4 py-3">
          <View
            className="p-4 rounded-lg flex-row items-center"
            style={{ backgroundColor: colors.surface }}
          >
            <View className="w-16 h-16 rounded-full bg-gray-300 items-center justify-center mr-4">
              <Text className="text-3xl">👤</Text>
            </View>
            <View className="flex-1">
              <Text className="text-lg font-bold text-foreground">مستخدم TAREK</Text>
              <Text className="text-sm text-muted">user@example.com</Text>
              <Text className="text-xs text-muted mt-1">عضو منذ اليوم</Text>
            </View>
          </View>
        </View>

        {/* الإحصائيات */}
        <View className="px-4 py-3">
          <View className="flex-row gap-3">
            {/* الطلبات */}
            <View
              className="flex-1 p-3 rounded-lg items-center"
              style={{ backgroundColor: colors.surface }}
            >
              <Text className="text-2xl mb-1">📦</Text>
              <Text className="text-2xl font-bold text-foreground">{orders.length}</Text>
              <Text className="text-xs text-muted">الطلبات</Text>
            </View>

            {/* المفضلة */}
            <View
              className="flex-1 p-3 rounded-lg items-center"
              style={{ backgroundColor: colors.surface }}
            >
              <Text className="text-2xl mb-1">❤️</Text>
              <Text className="text-2xl font-bold text-foreground">{favorites.length}</Text>
              <Text className="text-xs text-muted">المفضلة</Text>
            </View>

            {/* الإنفاق */}
            <View
              className="flex-1 p-3 rounded-lg items-center"
              style={{ backgroundColor: colors.surface }}
            >
              <Text className="text-2xl mb-1">💰</Text>
              <Text className="text-lg font-bold text-primary">
                {orders.reduce((sum, order) => sum + order.total, 0).toFixed(0)}
              </Text>
              <Text className="text-xs text-muted">ر.س</Text>
            </View>
          </View>
        </View>

        {/* الطلبات الأخيرة */}
        {orders.length > 0 && (
          <View className="px-4 py-3">
            <Text className="text-lg font-semibold text-foreground mb-3">الطلبات الأخيرة</Text>
            {orders.slice(-3).reverse().map((order) => (
              <OrderCard key={order.id} order={order} />
            ))}
          </View>
        )}

        {/* المفضلة */}
        {favoriteProducts.length > 0 && (
          <View className="px-4 py-3">
            <View className="flex-row justify-between items-center mb-3">
              <Text className="text-lg font-semibold text-foreground">المنتجات المفضلة</Text>
              <Text className="text-sm text-muted">{favoriteProducts.length}</Text>
            </View>
            <View className="gap-2">
              {favoriteProducts.slice(0, 3).map((product) => (
                <View
                  key={product.id}
                  className="p-3 rounded-lg flex-row items-center"
                  style={{ backgroundColor: colors.surface }}
                >
                  <Text className="text-2xl mr-3">❤️</Text>
                  <View className="flex-1">
                    <Text className="font-semibold text-foreground" numberOfLines={1}>
                      {product.name}
                    </Text>
                    <Text className="text-sm text-primary font-bold">
                      {product.price.toFixed(2)} ر.س
                    </Text>
                  </View>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* الخيارات */}
        <View className="px-4 py-4 gap-3">
          <Pressable
            onPress={() => router.push("./admin")}
            className="p-3 rounded-lg border"
            style={{ borderColor: colors.primary + "40", backgroundColor: colors.primary + "10" }}
          >
            <Text className="text-primary text-center font-semibold">🔐 لوحة التحكم</Text>
          </Pressable>

          <Pressable
            onPress={() => {
              Alert.alert("تسجيل الخروج", "هل تريد تسجيل الخروج؟", [
                { text: "إلغاء" },
                { text: "نعم", style: "destructive" },
              ]);
            }}
            className="p-3 rounded-lg border"
            style={{ borderColor: colors.error + "40", backgroundColor: colors.error + "10" }}
          >
            <Text className="text-error text-center font-semibold">تسجيل الخروج</Text>
          </Pressable>
        </View>

        {/* معلومات التطبيق */}
        <View className="px-4 py-4 border-t" style={{ borderColor: colors.border }}>
          <Text className="text-xs text-muted text-center mb-2">TAREK STOR LDY v1.0.0</Text>
          <Text className="text-xs text-muted text-center">© 2024 جميع الحقوق محفوظة</Text>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
