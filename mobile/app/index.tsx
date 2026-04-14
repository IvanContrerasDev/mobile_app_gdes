import { View, ScrollView, KeyboardAvoidingView, Platform } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LoginHeader } from "@/components/login-header";
import { LoginForm } from "@/components/login-form";

export default function LoginScreen() {
  return (
    <SafeAreaView className="flex-1 bg-muted">
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
      >
        <ScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View className="flex-1 justify-center px-5 py-8">
            {/* Card Container */}
            <View
              className="w-full max-w-[420px] self-center rounded-xl bg-card p-6"
              style={{
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.08,
                shadowRadius: 8,
                elevation: 3,
              }}
            >
              {/* Header */}
              <View className="mb-8">
                <LoginHeader />
              </View>

              {/* Form */}
              <LoginForm />
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
