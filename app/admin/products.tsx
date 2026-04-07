import { ScrollView, Text, View, Pressable, Alert, TextInput, FlatList } from "react-native";
import { ScreenContainer } from "@/components/screen-container";
import { useDigitalStore } from "@/lib/digital-products-context";
import { useColors } from "@/hooks/use-colors";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Image } from "expo-image";

/**
 * بطاقة المنتج في الإدارة
 */
function ProductItem({ product, onEdit, onDelete }: any) {
  const colors = useColors();

  return (
    <View
      className="p-3 rounded-lg mb-3 flex-row items-center"
      style={{ backgroundColor: colors.surface }}
    >
      <View className="w-16 h-16 rounded-lg overflow-hidden bg-gray-200 mr-3">
        <Image
          source={product.image}
          style={{ width: "100%", height: "100%" }}
          contentFit="cover"
        />
      </View>

      <View className="flex-1">
        <Text className="font-semibold text-foreground" numberOfLines={1}>
          {product.name}
        </Text>
        <Text className="text-sm text-muted">{product.category}</Text>
        <Text className="text-primary font-bold mt-1">
          {product.price.toFixed(2)} ر.س
        </Text>
      </View>

      <View className="flex-row gap-2">
        <Pressable
          onPress={() => onEdit(product)}
          className="p-2 rounded"
          style={{ backgroundColor: colors.primary + "20" }}
        >
          <Text className="text-lg">✏️</Text>
        </Pressable>
        <Pressable
          onPress={() => onDelete(product.id)}
          className="p-2 rounded"
          style={{ backgroundColor: colors.error + "20" }}
        >
          <Text className="text-lg">🗑️</Text>
        </Pressable>
      </View>
    </View>
  );
}

/**
 * شاشة إدارة المنتجات
 */
export default function AdminProductsScreen() {
  const colors = useColors();
  const router = useRouter();
  const { products, addProduct, updateProduct, deleteProduct } = useDigitalStore();

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    category: "",
    description: "",
    image: "",
  });

  const handleAddProduct = () => {
    if (!formData.name || !formData.price || !formData.category) {
      Alert.alert("خطأ", "يرجى ملء جميع الحقول المطلوبة");
      return;
    }

    if (editingId) {
      updateProduct(editingId, {
        name: formData.name,
        price: parseFloat(formData.price),
        category: formData.category,
        description: formData.description,
        image: formData.image || "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=300&h=300&fit=crop",
      });
      Alert.alert("نجح", "تم تحديث المنتج بنجاح");
    } else {
      const newProduct = {
        id: Date.now().toString(),
        name: formData.name,
        price: parseFloat(formData.price),
        category: formData.category,
        description: formData.description,
        image: formData.image || "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=300&h=300&fit=crop",
        rating: 0,
        reviews: 0,
        inStock: true,
      };
      addProduct(newProduct);
      Alert.alert("نجح", "تم إضافة المنتج بنجاح");
    }

    setFormData({ name: "", price: "", category: "", description: "", image: "" });
    setEditingId(null);
    setShowForm(false);
  };

  const handleEdit = (product: any) => {
    setFormData({
      name: product.name,
      price: product.price.toString(),
      category: product.category,
      description: product.description,
      image: product.image,
    });
    setEditingId(product.id);
    setShowForm(true);
  };

  const handleDelete = (id: string) => {
    Alert.alert(
      "تأكيد الحذف",
      "هل تريد حقاً حذف هذا المنتج؟",
      [
        { text: "إلغاء" },
        {
          text: "حذف",
          onPress: () => {
            deleteProduct(id);
            Alert.alert("نجح", "تم حذف المنتج بنجاح");
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
        <View className="px-4 py-4 flex-row items-center justify-between">
          <Pressable onPress={() => router.back()}>
            <Text className="text-2xl">←</Text>
          </Pressable>
          <Text className="text-2xl font-bold text-foreground">إدارة المنتجات</Text>
          <Pressable
            onPress={() => {
              setShowForm(true);
              setEditingId(null);
              setFormData({ name: "", price: "", category: "", description: "", image: "" });
            }}
          >
            <Text className="text-2xl">➕</Text>
          </Pressable>
        </View>

        {showForm ? (
          // نموذج الإضافة/التعديل
          <View className="px-4 py-4">
            <Text className="text-lg font-semibold text-foreground mb-4">
              {editingId ? "تعديل المنتج" : "إضافة منتج جديد"}
            </Text>

            <View className="mb-3">
              <Text className="text-sm text-muted mb-1">اسم المنتج *</Text>
              <TextInput
                placeholder="أدخل اسم المنتج"
                placeholderTextColor={colors.muted}
                value={formData.name}
                onChangeText={(text) => setFormData({ ...formData, name: text })}
                className="px-3 py-2 rounded-lg border"
                style={{
                  borderColor: colors.border,
                  backgroundColor: colors.surface,
                  color: colors.foreground,
                }}
              />
            </View>

            <View className="mb-3">
              <Text className="text-sm text-muted mb-1">السعر *</Text>
              <TextInput
                placeholder="0.00"
                placeholderTextColor={colors.muted}
                value={formData.price}
                onChangeText={(text) => setFormData({ ...formData, price: text })}
                keyboardType="decimal-pad"
                className="px-3 py-2 rounded-lg border"
                style={{
                  borderColor: colors.border,
                  backgroundColor: colors.surface,
                  color: colors.foreground,
                }}
              />
            </View>

            <View className="mb-3">
              <Text className="text-sm text-muted mb-1">الفئة *</Text>
              <TextInput
                placeholder="مثال: قوالب، كتب، أدوات"
                placeholderTextColor={colors.muted}
                value={formData.category}
                onChangeText={(text) => setFormData({ ...formData, category: text })}
                className="px-3 py-2 rounded-lg border"
                style={{
                  borderColor: colors.border,
                  backgroundColor: colors.surface,
                  color: colors.foreground,
                }}
              />
            </View>

            <View className="mb-3">
              <Text className="text-sm text-muted mb-1">الوصف</Text>
              <TextInput
                placeholder="أدخل وصف المنتج"
                placeholderTextColor={colors.muted}
                value={formData.description}
                onChangeText={(text) => setFormData({ ...formData, description: text })}
                multiline
                numberOfLines={3}
                className="px-3 py-2 rounded-lg border"
                style={{
                  borderColor: colors.border,
                  backgroundColor: colors.surface,
                  color: colors.foreground,
                  textAlignVertical: "top",
                }}
              />
            </View>

            <View className="gap-2">
              <Pressable
                onPress={handleAddProduct}
                className="py-3 rounded-lg"
                style={{ backgroundColor: colors.primary }}
              >
                <Text className="text-white text-center font-bold">
                  {editingId ? "تحديث" : "إضافة"}
                </Text>
              </Pressable>

              <Pressable
                onPress={() => {
                  setShowForm(false);
                  setEditingId(null);
                  setFormData({ name: "", price: "", category: "", description: "", image: "" });
                }}
                className="py-3 rounded-lg"
                style={{ backgroundColor: colors.surface }}
              >
                <Text className="text-foreground text-center font-bold">إلغاء</Text>
              </Pressable>
            </View>
          </View>
        ) : (
          // قائمة المنتجات
          <View className="px-4 py-4">
            <Text className="text-lg font-semibold text-foreground mb-3">
              المنتجات ({products.length})
            </Text>

            {products.length > 0 ? (
              <FlatList
                data={products}
                keyExtractor={(item) => item.id}
                scrollEnabled={false}
                renderItem={({ item }) => (
                  <ProductItem
                    product={item}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                  />
                )}
              />
            ) : (
              <View className="items-center py-8">
                <Text className="text-muted">لا توجد منتجات</Text>
              </View>
            )}
          </View>
        )}
      </ScrollView>
    </ScreenContainer>
  );
}
