import { useState } from "react";
import { View } from "react-native";

// Screens
import { HomeScreen } from "../screens/HomeScreen";
import { DocumentosScreen } from "../screens/DocumentosScreen";
import { PerfilScreen } from "../screens/PerfilScreen";
import { HomeSuccessScreen } from "../screens/SuccessScreens";

// Components
import { AppHeader } from "../components/AppHeader";
import { BottomTabs } from "../components/BottomTabs";

// Store
import { useAppStore } from "../store/useAppStore";
import { useAuthStore } from "../stores/authStore";

type AppStep = "home" | "homeSuccess" | "documentos" | "perfil";

/**
 * AppNavigator
 * Handles the authenticated flow (home, documentos, perfil tabs).
 * Logout is triggered from Perfil and flips the auth store, which makes the
 * root navigator swap back to the AuthNavigator automatically.
 */
export function AppNavigator() {
  const [step, setStep] = useState<AppStep>("home");

  const { selectedAction, resetRegistration } = useAppStore();
  const logout = useAuthStore((state) => state.logout);

  const handleTabChange = (tab: "home" | "documentos" | "perfil") => {
    setStep(tab);
  };

  return (
    <View className="flex-1">
      {step === "home" && <AppHeader />}

      {step === "home" && (
        <HomeScreen onRegister={() => setStep("homeSuccess")} />
      )}

      {step === "homeSuccess" && (
        <HomeSuccessScreen
          action={selectedAction || "entrada"}
          onContinue={() => {
            resetRegistration();
            setStep("home");
          }}
        />
      )}

      {step === "documentos" && <DocumentosScreen />}

      {step === "perfil" && (
        <PerfilScreen
          onLogout={() => {
            // Clear session; root navigator swaps to AuthNavigator.
            logout();
          }}
        />
      )}

      {step !== "homeSuccess" && (
        <BottomTabs
          activeTab={step as "home" | "documentos" | "perfil"}
          onTabChange={handleTabChange}
        />
      )}
    </View>
  );
}
