import { useEffect } from "react";
import { View, Text, ActivityIndicator, KeyboardAvoidingView, Platform } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

// Navigation
import { AuthNavigator } from "../navigation/AuthNavigator";
import { AppNavigator } from "../navigation/AppNavigator";

// Store
import { useAuthStore } from "../stores/authStore";
import { bootstrapSession } from "../services/authService";
import { getApiConfigurationError } from "../services/httpClient";

export default function App() {
  const configurationError = getApiConfigurationError();
  useEffect(() => { if (!configurationError) void bootstrapSession(); }, [configurationError?.code]);
  // La identidad solo se publica después de validar la sesión con el servidor.
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const hydrated = useAuthStore((state) => state.hydrated);
  const userId = useAuthStore((state) => state.user?.id);

  return (
    <View className="flex-1 bg-[#EDF2F5]">
      <SafeAreaView className="flex-1">
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          className="flex-1"
        >
          <View className="flex-1 bg-white">
            {configurationError ? (
              <View accessibilityRole="alert" className="flex-1 justify-center gap-4 px-6">
                <Text className="text-xl font-bold text-[#0D80AE]">Configuración de API pendiente</Text>
                <Text className="text-base text-black">{configurationError.message}</Text>
                <Text className="text-base text-black">
                  Configurá EXPO_PUBLIC_API_BASE_URL en .env con la URL de la API terminada en /api/v1 y reiniciá Metro y la app. En desarrollo usá la IP LAN de la PC; en release la URL debe usar HTTPS.
                </Text>
              </View>
            ) : !hydrated ? (
              // Esperar validación de la sesión antes de navegar
              <View className="flex-1 items-center justify-center">
                <ActivityIndicator color="#0D80AE" />
              </View>
            ) : isAuthenticated ? (
              <AppNavigator key={userId} />
            ) : (
              <AuthNavigator />
            )}
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
}
