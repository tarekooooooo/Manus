import { ScrollView, Text, View, Pressable, Alert, TextInput } from "react-native";
import { ScreenContainer } from "@/components/screen-container";
import { useColors } from "@/hooks/use-colors";
import { useRouter } from "expo-router";
import { useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

/**
 * شاشة الإعدادات
 */
export default function AdminSettingsScreen() {
  const colors = useColors();
  const router = useRouter();
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleChangePassword = async () => {
    if (!newPassword || !confirmPassword) {
      Alert.alert("خطأ", "يرجى ملء جميع الحقول");
      return;
    }

    if (newPassword !== confirmPassword) {
      Alert.alert("خطأ", "كلمات المرور غير متطابقة");
      return;
    }

    if (newPassword.length < 6) {
      Alert.alert("خطأ", "كلمة المرور يجب أن تكون 6 أحرف على الأقل");
      return;
    }

    await AsyncStorage.setItem("adminPassword", newPassword);
    Alert.alert("نجح", "تم تغيير كلمة المرور بنجاح");
    setNewPassword("");
    setConfirmPassword("");
  };

  const handleClearData = () => {
    Alert.alert(
      "تأكيد",
      "هل تريد حقاً حذف جميع البيانات؟ هذا الإجراء لا يمكن التراجع عنه",
      [
        { text: "إلغاء" },
        {
          text: "حذف",
          onPress: async () => {
            await AsyncStorage.removeItem("digitalCart");
            await AsyncStorage.removeItem("digitalFavorites");
            await AsyncStorage.removeItem("digitalOrders");
            Alert.alert("نجح", "تم حذف البيانات بنجاح");
          },
          style: "destructive",
        },
      ]
    );
  };

  return (
    <ScreenContainer className="bg-background">
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* رأس الصفحة */}
        <View className="px-4 py-4 flex-row items-center gap-3">
          <Pressable onPress={() => router.back()}>
            <Text className="text-2xl">←</Text>
          </Pressable>
          <Text className="text-2xl font-bold text-foreground">الإعدادات</Text>
        </View>

        {/* الأمان */}
        <View className="px-4 py-4">
          <Text className="text-lg font-semibold text-foreground mb-3">
            الأمان
          </Text>

          <View
            className="p-4 rounded-lg mb-4"
            style={{ backgroundColor: colors.surface }}
          >
            <Text className="font-semibold text-foreground mb-3">
              تغيير كلمة المرور
            </Text>

            <View className="mb-3">
              <Text className="text-sm text-muted mb-1">كلمة المرور الجديدة</Text>
              <TextInput
                placeholder="أدخل كلمة المرور الجديدة"
                placeholderTextColor={colors.muted}
                value={newPassword}
                onChangeText={setNewPassword}
                secureTextEntry
                className="px-3 py-2 rounded-lg border"
                style={{
                  borderColor: colors.border,
                  backgroundColor: colors.background,
                  color: colors.foreground,
                }}
              />
            </View>

            <View className="mb-3">
              <Text className="text-sm text-muted mb-1">تأكيد كلمة المرور</Text>
              <TextInput
                placeholder="أدخل كلمة المرور مرة أخرى"
                placeholderTextColor={colors.muted}
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry
                className="px-3 py-2 rounded-lg border"
                style={{
                  borderColor: colors.border,
                  backgroundColor: colors.background,
                  color: colors.foreground,
                }}
              />
            </View>

            <Pressable
              onPress={handleChangePassword}
              className="py-2 rounded-lg"
              style={{ backgroundColor: colors.primary }}
            >
              <Text className="text-white text-center font-bold">تحديث</Text>
            </Pressable>
          </View>
        </View>

        {/* البيانات */}
        <View className="px-4 py-4">
          <Text className="text-lg font-semibold text-foreground mb-3">
            البيانات
          </Text>

          <Pressable
            onPress={handleClearData}
            className="p-4 rounded-lg flex-row items-center justify-between"
            style={{ backgroundColor: colors.error + "10" }}
          >
            <View>
              <Text className="font-semibold text-error">حذف جميع البيانات</Text>
              <Text className="text-xs text-error mt-1">
                هذا الإجراء لا يمكن التراجع عنه
              </Text>
            </View>
            <Text className="text-lg">🗑️</Text>
          </Pressable>
        </View>

        {/* المعلومات */}
        <View className="px-4 py-4">
          <Text className="text-lg font-semibold text-foreground mb-3">
            المعلومات
          </Text>

          <View
            className="p-4 rounded-lg"
            style={{ backgroundColor: colors.surface }}
          >
            <View className="flex-row justify-between mb-2">
              <Text className="text-muted">إصدار التطبيق</Text>
              <Text className="font-semibold text-foreground">1.0.0</Text>
            </View>

            <View className="flex-row justify-between mb-2">
              <Text className="text-muted">النظام</Text>
              <Text className="font-semibold text-foreground">
                TAREK STOR LDY
              </Text>
            </View>

            <View className="flex-row justify-between">
              <Text className="text-muted">آخر تحديث</Text>
              <Text className="font-semibold text-foreground">
                {new Date().toLocaleDateString("ar-SA")}
              </Text>
            </View>
          </View>
        </View>

        {/* التعليمات */}
        <View className="px-4 py-6 border-t" style={{ borderColor: colors.border }}>
          <Text className="text-xs text-muted text-center mb-2">
            لوحة التحكم الإدارية
          </Text>
          <Text className="text-xs text-muted text-center">
            © 2024 TAREK STOR LDY - جميع الحقوق محفوظة
          </Text>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
