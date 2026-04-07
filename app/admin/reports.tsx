import { ScrollView, Text, View, Pressable } from "react-native";
import { ScreenContainer } from "@/components/screen-container";
import { useDigitalStore } from "@/lib/digital-products-context";
import { useColors } from "@/hooks/use-colors";
import { useRouter } from "expo-router";

/**
 * شاشة التقارير والإحصائيات
 */
export default function AdminReportsScreen() {
  const colors = useColors();
  const router = useRouter();
  const { products, orders } = useDigitalStore();

  const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);
  const completedOrders = orders.filter(o => o.status === 'completed').length;
  const pendingOrders = orders.filter(o => o.status === 'pending').length;
  const averageOrderValue = orders.length > 0 ? totalRevenue / orders.length : 0;

  // حساب أفضل المنتجات
  const topProducts = [...products]
    .sort((a, b) => b.rating - a.rating)
    .slice(0, 5);

  // حساب الفئات
  const categoriesStats = products.reduce((acc: any, product) => {
    const existing = acc.find((c: any) => c.name === product.category);
    if (existing) {
      existing.count++;
    } else {
      acc.push({ name: product.category, count: 1 });
    }
    return acc;
  }, []);

  return (
    <ScreenContainer className="bg-background">
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* رأس الصفحة */}
        <View className="px-4 py-4 flex-row items-center gap-3">
          <Pressable onPress={() => router.back()}>
            <Text className="text-2xl">←</Text>
          </Pressable>
          <Text className="text-2xl font-bold text-foreground">التقارير</Text>
        </View>

        {/* الإحصائيات الرئيسية */}
        <View className="px-4 py-4">
          <Text className="text-lg font-semibold text-foreground mb-3">
            الإحصائيات الرئيسية
          </Text>

          <View className="gap-3">
            <View
              className="p-4 rounded-lg flex-row justify-between items-center"
              style={{ backgroundColor: colors.surface }}
            >
              <View>
                <Text className="text-sm text-muted">إجمالي الإيرادات</Text>
                <Text className="text-2xl font-bold text-primary">
                  {totalRevenue.toFixed(2)} ر.س
                </Text>
              </View>
              <Text className="text-3xl">💰</Text>
            </View>

            <View
              className="p-4 rounded-lg flex-row justify-between items-center"
              style={{ backgroundColor: colors.surface }}
            >
              <View>
                <Text className="text-sm text-muted">إجمالي الطلبات</Text>
                <Text className="text-2xl font-bold text-foreground">
                  {orders.length}
                </Text>
              </View>
              <Text className="text-3xl">📦</Text>
            </View>

            <View
              className="p-4 rounded-lg flex-row justify-between items-center"
              style={{ backgroundColor: colors.surface }}
            >
              <View>
                <Text className="text-sm text-muted">متوسط قيمة الطلب</Text>
                <Text className="text-2xl font-bold text-foreground">
                  {averageOrderValue.toFixed(2)} ر.س
                </Text>
              </View>
              <Text className="text-3xl">📊</Text>
            </View>
          </View>
        </View>

        {/* حالة الطلبات */}
        <View className="px-4 py-4">
          <Text className="text-lg font-semibold text-foreground mb-3">
            حالة الطلبات
          </Text>

          <View className="flex-row gap-3">
            <View
              className="flex-1 p-4 rounded-lg"
              style={{ backgroundColor: colors.surface }}
            >
              <Text className="text-sm text-muted mb-1">مكتملة</Text>
              <Text className="text-2xl font-bold text-success">
                {completedOrders}
              </Text>
            </View>

            <View
              className="flex-1 p-4 rounded-lg"
              style={{ backgroundColor: colors.surface }}
            >
              <Text className="text-sm text-muted mb-1">قيد الانتظار</Text>
              <Text className="text-2xl font-bold text-warning">
                {pendingOrders}
              </Text>
            </View>

            <View
              className="flex-1 p-4 rounded-lg"
              style={{ backgroundColor: colors.surface }}
            >
              <Text className="text-sm text-muted mb-1">المنتجات</Text>
              <Text className="text-2xl font-bold text-foreground">
                {products.length}
              </Text>
            </View>
          </View>
        </View>

        {/* أفضل المنتجات */}
        {topProducts.length > 0 && (
          <View className="px-4 py-4">
            <Text className="text-lg font-semibold text-foreground mb-3">
              أفضل المنتجات
            </Text>

            {topProducts.map((product) => (
              <View
                key={product.id}
                className="p-3 rounded-lg mb-2 flex-row justify-between items-center"
                style={{ backgroundColor: colors.surface }}
              >
                <View className="flex-1">
                  <Text className="font-semibold text-foreground" numberOfLines={1}>
                    {product.name}
                  </Text>
                  <Text className="text-xs text-muted">
                    ⭐ {product.rating} ({product.reviews} تقييم)
                  </Text>
                </View>
                <Text className="text-primary font-bold">
                  {product.price.toFixed(2)} ر.س
                </Text>
              </View>
            ))}
          </View>
        )}

        {/* توزيع الفئات */}
        {categoriesStats.length > 0 && (
          <View className="px-4 py-4">
            <Text className="text-lg font-semibold text-foreground mb-3">
              توزيع الفئات
            </Text>

            {categoriesStats.map((category: any, index: number) => (
              <View
                key={index}
                className="p-3 rounded-lg mb-2 flex-row justify-between items-center"
                style={{ backgroundColor: colors.surface }}
              >
                <Text className="font-semibold text-foreground">
                  {category.name}
                </Text>
                <View
                  className="px-3 py-1 rounded"
                  style={{ backgroundColor: colors.primary + "20" }}
                >
                  <Text className="text-primary font-bold text-sm">
                    {category.count}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        )}
      </ScrollView>
    </ScreenContainer>
  );
}
