import { ScrollView, Text, View, Pressable, Alert, TextInput } from "react-native";
import { ScreenContainer } from "@/components/screen-container";
import { useDigitalStore } from "@/lib/digital-products-context";
import { useColors } from "@/hooks/use-colors";
import { useRouter } from "expo-router";
import { useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

/**
 * شاشة لوحة التحكم
 */
export default function AdminPanelScreen() {
  const colors = useColors();
  const router = useRouter();
  const { products, orders, cartTotal } = useDigitalStore();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [adminPassword, setAdminPassword] = useState("admin123");

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const savedAuth = await AsyncStorage.getItem("adminAuth");
      if (savedAuth === "true") {
        setIsAuthenticated(true);
      }
    } catch (error) {
      console.error("Error checking auth:", error);
    }
  };

  const handleLogin = async () => {
    if (password === adminPassword) {
      await AsyncStorage.setItem("adminAuth", "true");
      setIsAuthenticated(true);
      setPassword("");
    } else {
      Alert.alert("خطأ", "كلمة المرور غير صحيحة");
    }
  };

  const handleLogout = async () => {
    await AsyncStorage.removeItem("adminAuth");
    setIsAuthenticated(false);
    setPassword("");
  };

  if (!isAuthenticated) {
    return (
      <ScreenContainer className="bg-background items-center justify-center px-4">
        <View className="w-full max-w-sm">
          <Text className="text-3xl font-bold text-foreground mb-2 text-center">
            لوحة التحكم
          </Text>
          <Text className="text-muted text-center mb-6">
            أدخل كلمة المرور للوصول إلى لوحة التحكم
          </Text>

          <View className="mb-4">
            <Text className="text-sm text-muted mb-2">كلمة المرور</Text>
            <TextInput
              placeholder="أدخل كلمة المرور"
              placeholderTextColor={colors.muted}
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              className="px-4 py-3 rounded-lg border"
              style={{
                borderColor: colors.border,
                backgroundColor: colors.surface,
                color: colors.foreground,
              }}
            />
          </View>

          <Pressable
            onPress={handleLogin}
            className="py-3 rounded-lg mb-3"
            style={{ backgroundColor: colors.primary }}
          >
            <Text className="text-white text-center font-bold">دخول</Text>
          </Pressable>

          <Pressable
            onPress={() => router.back()}
            className="py-3 rounded-lg"
            style={{ backgroundColor: colors.surface }}
          >
            <Text className="text-foreground text-center font-bold">العودة</Text>
          </Pressable>
        </View>
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer className="bg-background">
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* رأس الصفحة */}
        <View className="px-4 py-4 flex-row items-center justify-between">
          <Pressable onPress={() => router.back()}>
            <Text className="text-2xl">←</Text>
          </Pressable>
          <Text className="text-2xl font-bold text-foreground">لوحة التحكم</Text>
          <Pressable onPress={handleLogout}>
            <Text className="text-lg">🚪</Text>
          </Pressable>
        </View>

        {/* الإحصائيات */}
        <View className="px-4 py-4">
          <View className="flex-row gap-3">
            {/* المنتجات */}
            <View
              className="flex-1 p-4 rounded-lg"
              style={{ backgroundColor: colors.surface }}
            >
              <Text className="text-2xl mb-1">📦</Text>
              <Text className="text-2xl font-bold text-foreground">
                {products.length}
              </Text>
              <Text className="text-xs text-muted">المنتجات</Text>
            </View>

            {/* الطلبات */}
            <View
              className="flex-1 p-4 rounded-lg"
              style={{ backgroundColor: colors.surface }}
            >
              <Text className="text-2xl mb-1">📋</Text>
              <Text className="text-2xl font-bold text-foreground">
                {orders.length}
              </Text>
              <Text className="text-xs text-muted">الطلبات</Text>
            </View>

            {/* الإيرادات */}
            <View
              className="flex-1 p-4 rounded-lg"
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

        {/* الخيارات */}
        <View className="px-4 py-4">
          <Text className="text-lg font-semibold text-foreground mb-3">
            الإدارة
          </Text>

          {/* إدارة المنتجات */}
          <Pressable
            onPress={() => router.push("./products")}
            className="p-4 rounded-lg mb-3 flex-row items-center"
            style={{ backgroundColor: colors.surface }}
          >
            <Text className="text-2xl mr-3">📝</Text>
            <View className="flex-1">
              <Text className="font-semibold text-foreground">
                إدارة المنتجات
              </Text>
              <Text className="text-xs text-muted">
                إضافة وتعديل وحذف المنتجات
              </Text>
            </View>
            <Text className="text-lg">→</Text>
          </Pressable>

          {/* إدارة الطلبات */}
          <Pressable
            onPress={() => router.push("./orders")}
            className="p-4 rounded-lg mb-3 flex-row items-center"
            style={{ backgroundColor: colors.surface }}
          >
            <Text className="text-2xl mr-3">📊</Text>
            <View className="flex-1">
              <Text className="font-semibold text-foreground">
                إدارة الطلبات
              </Text>
              <Text className="text-xs text-muted">
                عرض وإدارة جميع الطلبات
              </Text>
            </View>
            <Text className="text-lg">→</Text>
          </Pressable>

          {/* التقارير */}
          <Pressable
            onPress={() => router.push("./reports")}
            className="p-4 rounded-lg mb-3 flex-row items-center"
            style={{ backgroundColor: colors.surface }}
          >
            <Text className="text-2xl mr-3">📈</Text>
            <View className="flex-1">
              <Text className="font-semibold text-foreground">
                التقارير والإحصائيات
              </Text>
              <Text className="text-xs text-muted">
                عرض تقارير المبيعات والإحصائيات
              </Text>
            </View>
            <Text className="text-lg">→</Text>
          </Pressable>

          {/* الإعدادات */}
          <Pressable
            onPress={() => router.push("./settings")}
            className="p-4 rounded-lg flex-row items-center"
            style={{ backgroundColor: colors.surface }}
          >
            <Text className="text-2xl mr-3">⚙️</Text>
            <View className="flex-1">
              <Text className="font-semibold text-foreground">
                الإعدادات
              </Text>
              <Text className="text-xs text-muted">
                إعدادات المتجر والأمان
              </Text>
            </View>
            <Text className="text-lg">→</Text>
          </Pressable>
        </View>

        {/* معلومات النظام */}
        <View className="px-4 py-6 border-t" style={{ borderColor: colors.border }}>
          <Text className="text-xs text-muted text-center mb-2">
            TAREK STOR LDY Admin Panel v1.0.0
          </Text>
          <Text className="text-xs text-muted text-center">
            © 2024 جميع الحقوق محفوظة
          </Text>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
