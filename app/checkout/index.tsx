import { ScrollView, Text, View, Pressable, TextInput, Alert } from "react-native";
import { ScreenContainer } from "@/components/screen-container";
import { useStore } from "@/lib/store-context";
import { useColors } from "@/hooks/use-colors";
import { useRouter } from "expo-router";
import { useState } from "react";

/**
 * شاشة الدفع والطلب
 */
export default function CheckoutScreen() {
  const colors = useColors();
  const router = useRouter();
  const { cart, cartTotal, clearCart, addOrder } = useStore();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("credit-card");
  const [isProcessing, setIsProcessing] = useState(false);

  if (cart.length === 0) {
    return (
      <ScreenContainer className="items-center justify-center">
        <Text className="text-foreground text-lg mb-4">السلة فارغة</Text>
        <Pressable
          onPress={() => router.back()}
          className="px-4 py-2 rounded-lg"
          style={{ backgroundColor: colors.primary }}
        >
          <Text className="text-white font-semibold">العودة</Text>
        </Pressable>
      </ScreenContainer>
    );
  }

  const handlePlaceOrder = async () => {
    // التحقق من البيانات
    if (!fullName.trim() || !email.trim() || !phone.trim() || !address.trim() || !city.trim()) {
      Alert.alert("خطأ", "يرجى ملء جميع الحقول المطلوبة");
      return;
    }

    setIsProcessing(true);

    try {
      // محاكاة معالجة الطلب
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // إنشاء الطلب
      const order = {
        id: Date.now().toString(),
        items: cart,
        total: cartTotal,
        status: "confirmed" as const,
        createdAt: new Date(),
        deliveryAddress: `${address}, ${city}`,
        paymentMethod,
      };

      addOrder(order);
      clearCart();

      Alert.alert(
        "تم بنجاح",
        `تم تأكيد طلبك برقم #${order.id}`,
        [
          {
            text: "العودة للرئيسية",
            onPress: () => router.push("/(tabs)"),
          },
        ]
      );
    } catch (error) {
      Alert.alert("خطأ", "حدث خطأ أثناء معالجة الطلب");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <ScreenContainer className="bg-background">
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* رأس الصفحة */}
        <View className="px-4 py-4 flex-row items-center gap-3">
          <Pressable onPress={() => router.back()}>
            <Text className="text-2xl">←</Text>
          </Pressable>
          <Text className="text-2xl font-bold text-foreground">إتمام الطلب</Text>
        </View>

        {/* ملخص الطلب */}
        <View className="px-4 py-3">
          <Text className="text-lg font-semibold text-foreground mb-3">ملخص الطلب</Text>
          <View
            className="p-3 rounded-lg mb-4"
            style={{ backgroundColor: colors.surface }}
          >
            <View className="flex-row justify-between mb-2">
              <Text className="text-muted">عدد المنتجات:</Text>
              <Text className="text-foreground font-semibold">{cart.length}</Text>
            </View>
            <View className="flex-row justify-between">
              <Text className="text-muted">الإجمالي:</Text>
              <Text className="text-primary font-bold text-lg">
                {cartTotal.toFixed(2)} ر.س
              </Text>
            </View>
          </View>
        </View>

        {/* بيانات التوصيل */}
        <View className="px-4 py-3">
          <Text className="text-lg font-semibold text-foreground mb-3">بيانات التوصيل</Text>

          {/* الاسم الكامل */}
          <View className="mb-3">
            <Text className="text-sm text-muted mb-1">الاسم الكامل *</Text>
            <TextInput
              placeholder="أدخل اسمك الكامل"
              placeholderTextColor={colors.muted}
              value={fullName}
              onChangeText={setFullName}
              className="px-3 py-2 rounded-lg border"
              style={{
                borderColor: colors.border,
                backgroundColor: colors.surface,
                color: colors.foreground,
              }}
            />
          </View>

          {/* البريد الإلكتروني */}
          <View className="mb-3">
            <Text className="text-sm text-muted mb-1">البريد الإلكتروني *</Text>
            <TextInput
              placeholder="your@email.com"
              placeholderTextColor={colors.muted}
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              className="px-3 py-2 rounded-lg border"
              style={{
                borderColor: colors.border,
                backgroundColor: colors.surface,
                color: colors.foreground,
              }}
            />
          </View>

          {/* رقم الهاتف */}
          <View className="mb-3">
            <Text className="text-sm text-muted mb-1">رقم الهاتف *</Text>
            <TextInput
              placeholder="0501234567"
              placeholderTextColor={colors.muted}
              value={phone}
              onChangeText={setPhone}
              keyboardType="phone-pad"
              className="px-3 py-2 rounded-lg border"
              style={{
                borderColor: colors.border,
                backgroundColor: colors.surface,
                color: colors.foreground,
              }}
            />
          </View>

          {/* العنوان */}
          <View className="mb-3">
            <Text className="text-sm text-muted mb-1">العنوان *</Text>
            <TextInput
              placeholder="أدخل عنوانك"
              placeholderTextColor={colors.muted}
              value={address}
              onChangeText={setAddress}
              className="px-3 py-2 rounded-lg border"
              style={{
                borderColor: colors.border,
                backgroundColor: colors.surface,
                color: colors.foreground,
              }}
            />
          </View>

          {/* المدينة */}
          <View className="mb-3">
            <Text className="text-sm text-muted mb-1">المدينة *</Text>
            <TextInput
              placeholder="أدخل المدينة"
              placeholderTextColor={colors.muted}
              value={city}
              onChangeText={setCity}
              className="px-3 py-2 rounded-lg border"
              style={{
                borderColor: colors.border,
                backgroundColor: colors.surface,
                color: colors.foreground,
              }}
            />
          </View>
        </View>

        {/* طريقة الدفع */}
        <View className="px-4 py-3">
          <Text className="text-lg font-semibold text-foreground mb-3">طريقة الدفع</Text>

          {/* بطاقة ائتمان */}
          <Pressable
            onPress={() => setPaymentMethod("credit-card")}
            className="flex-row items-center p-3 rounded-lg mb-2 border"
            style={{
              borderColor: paymentMethod === "credit-card" ? colors.primary : colors.border,
              backgroundColor: colors.surface,
            }}
          >
            <View
              className="w-5 h-5 rounded-full border-2 mr-3 items-center justify-center"
              style={{
                borderColor: paymentMethod === "credit-card" ? colors.primary : colors.border,
              }}
            >
              {paymentMethod === "credit-card" && (
                <View
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: colors.primary }}
                />
              )}
            </View>
            <Text className="text-foreground font-semibold">بطاقة ائتمان</Text>
          </Pressable>

          {/* التحويل البنكي */}
          <Pressable
            onPress={() => setPaymentMethod("bank-transfer")}
            className="flex-row items-center p-3 rounded-lg mb-2 border"
            style={{
              borderColor: paymentMethod === "bank-transfer" ? colors.primary : colors.border,
              backgroundColor: colors.surface,
            }}
          >
            <View
              className="w-5 h-5 rounded-full border-2 mr-3 items-center justify-center"
              style={{
                borderColor: paymentMethod === "bank-transfer" ? colors.primary : colors.border,
              }}
            >
              {paymentMethod === "bank-transfer" && (
                <View
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: colors.primary }}
                />
              )}
            </View>
            <Text className="text-foreground font-semibold">التحويل البنكي</Text>
          </Pressable>

          {/* الدفع عند الاستلام */}
          <Pressable
            onPress={() => setPaymentMethod("cash-on-delivery")}
            className="flex-row items-center p-3 rounded-lg border"
            style={{
              borderColor: paymentMethod === "cash-on-delivery" ? colors.primary : colors.border,
              backgroundColor: colors.surface,
            }}
          >
            <View
              className="w-5 h-5 rounded-full border-2 mr-3 items-center justify-center"
              style={{
                borderColor: paymentMethod === "cash-on-delivery" ? colors.primary : colors.border,
              }}
            >
              {paymentMethod === "cash-on-delivery" && (
                <View
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: colors.primary }}
                />
              )}
            </View>
            <Text className="text-foreground font-semibold">الدفع عند الاستلام</Text>
          </Pressable>
        </View>

        {/* زر تأكيد الطلب */}
        <View className="px-4 py-6 gap-3">
          <Pressable
            onPress={handlePlaceOrder}
            disabled={isProcessing}
            style={({ pressed }) => [
              {
                paddingVertical: 14,
                borderRadius: 10,
                backgroundColor: isProcessing ? colors.muted : colors.primary,
                opacity: pressed && !isProcessing ? 0.8 : 1,
              },
            ]}
          >
            <Text className="text-white text-center font-bold text-lg">
              {isProcessing ? "جاري المعالجة..." : "تأكيد الطلب"}
            </Text>
          </Pressable>

          <Pressable
            onPress={() => router.back()}
            disabled={isProcessing}
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
              العودة
            </Text>
          </Pressable>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
