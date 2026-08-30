import { View, ActivityIndicator, KeyboardAvoidingView, Platform } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

// Navigation
import { AuthNavigator } from "../navigation/AuthNavigator";
import { AppNavigator } from "../navigation/AppNavigator";

// Store
import { useAuthStore } from "../stores/authStore";

export default function App() {
  // Session state (persisted via zustand/persist + AsyncStorage)
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const hydrated = useAuthStore((state) => state.hydrated);

  return (
    <View className="flex-1 bg-[#EDF2F5]">
      <SafeAreaView className="flex-1">
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          className="flex-1"
        >
          <View className="flex-1 bg-white">
            {!hydrated ? (
              // Wait for persisted session to load before routing
              <View className="flex-1 items-center justify-center">
                <ActivityIndicator color="#0D80AE" />
              </View>
            ) : isAuthenticated ? (
              <AppNavigator />
            ) : (
              <AuthNavigator />
            )}
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
}
