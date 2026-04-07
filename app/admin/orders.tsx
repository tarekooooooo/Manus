import { ScrollView, Text, View, Pressable, FlatList } from "react-native";
import { ScreenContainer } from "@/components/screen-container";
import { useDigitalStore } from "@/lib/digital-products-context";
import { useColors } from "@/hooks/use-colors";
import { useRouter } from "expo-router";

/**
 * شاشة إدارة الطلبات
 */
export default function AdminOrdersScreen() {
  const colors = useColors();
  const router = useRouter();
  const { orders } = useDigitalStore();

  const statusText: Record<string, string> = {
    pending: "قيد الانتظار",
    completed: "مكتمل",
    cancelled: "ملغى",
  };

  const statusColor: Record<string, string> = {
    pending: colors.warning,
    completed: colors.success,
    cancelled: colors.error,
  };

  return (
    <ScreenContainer className="bg-background">
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* رأس الصفحة */}
        <View className="px-4 py-4 flex-row items-center gap-3">
          <Pressable onPress={() => router.back()}>
            <Text className="text-2xl">←</Text>
          </Pressable>
          <Text className="text-2xl font-bold text-foreground">إدارة الطلبات</Text>
        </View>

        {/* الإحصائيات */}
        <View className="px-4 py-3">
          <View className="flex-row gap-3">
            <View
              className="flex-1 p-3 rounded-lg"
              style={{ backgroundColor: colors.surface }}
            >
              <Text className="text-lg font-bold text-foreground">{orders.length}</Text>
              <Text className="text-xs text-muted">إجمالي الطلبات</Text>
            </View>
            <View
              className="flex-1 p-3 rounded-lg"
              style={{ backgroundColor: colors.surface }}
            >
              <Text className="text-lg font-bold text-primary">
                {orders.reduce((sum, order) => sum + order.total, 0).toFixed(0)}
              </Text>
              <Text className="text-xs text-muted">الإيرادات</Text>
            </View>
          </View>
        </View>

        {/* قائمة الطلبات */}
        <View className="px-4 py-4">
          {orders.length > 0 ? (
            <FlatList
              data={orders}
              keyExtractor={(item) => item.id}
              scrollEnabled={false}
              renderItem={({ item }) => (
                <View
                  className="p-4 rounded-lg mb-3"
                  style={{ backgroundColor: colors.surface }}
                >
                  <View className="flex-row justify-between items-start mb-2">
                    <View>
                      <Text className="text-sm text-muted">رقم الطلب</Text>
                      <Text className="font-semibold text-foreground">#{item.id}</Text>
                    </View>
                    <View
                      className="px-2 py-1 rounded"
                      style={{
                        backgroundColor: (statusColor[item.status] || colors.muted) + "20",
                      }}
                    >
                      <Text
                        className="text-xs font-semibold"
                        style={{
                          color: statusColor[item.status] || colors.muted,
                        }}
                      >
                        {statusText[item.status] || "غير معروف"}
                      </Text>
                    </View>
                  </View>

                  <View className="flex-row justify-between mb-2">
                    <Text className="text-sm text-muted">
                      {item.items.length} منتج
                    </Text>
                    <Text className="font-bold text-primary">
                      {item.total.toFixed(2)} ر.س
                    </Text>
                  </View>

                  <Text className="text-xs text-muted">
                    {new Date(item.createdAt).toLocaleDateString("ar-SA")}
                  </Text>
                </View>
              )}
            />
          ) : (
            <View className="items-center py-8">
              <Text className="text-muted">لا توجد طلبات</Text>
            </View>
          )}
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
