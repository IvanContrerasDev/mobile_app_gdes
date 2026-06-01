import { useState, useEffect } from "react";
import { View, KeyboardAvoidingView, Platform } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

// Screens
import { LoginScreen } from "../screens/LoginScreen";
import { RegisterScreen } from "../screens/RegisterScreen";
import { VerifyCodeScreen } from "../screens/VerifyCodeScreen";
import { ForgotPasswordScreen } from "../screens/ForgotPasswordScreen";
import { HomeScreen } from "../screens/HomeScreen";
import { DocumentosScreen } from "../screens/DocumentosScreen";
import { PerfilScreen } from "../screens/PerfilScreen";
import {
  LoginSuccessScreen,
  RegisterSuccessScreen,
  GoogleSuccessScreen,
  EmailSentScreen,
  ForgotSuccessScreen,
  HomeSuccessScreen,
} from "../screens/SuccessScreens";

// Components
import { AppHeader } from "../components/AppHeader";
import { BottomTabs } from "../components/BottomTabs";
import { GoogleModal } from "../components/GoogleModal";

// Store
import { useAppStore } from "../store/useAppStore";

// Services
import { subscribeToConnectivity } from "../services/networkService";
import { syncPendingRegisters } from "../services/syncService";

type StepType = 
  | "login" 
  | "register" 
  | "verifyCodeRegister"
  | "emailSent" 
  | "registerSuccess"
  | "googleSuccess"
  | "verifyCodeGoogle"
  | "forgotPassword"
  | "forgotSuccess"
  | "verifyCode"
  | "loginSuccess"
  | "home"
  | "homeSuccess"
  | "documentos"
  | "perfil";

export default function App() {
  const [step, setStep] = useState<StepType>("login");
  const [showGoogleModal, setShowGoogleModal] = useState(false);

  // Zustand store
  const { isWorking, selectedAction, resetRegistration } = useAppStore();

  // Setup connectivity listener for auto-sync
  useEffect(() => {
    const unsubscribe = subscribeToConnectivity(() => {
      // When connectivity is restored, sync pending registers
      syncPendingRegisters();
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const statusColor = isWorking ? "#62882B" : "#ED701E";
  const statusText = isWorking ? "En horario laboral" : "Fuera de horario";

  const isAppScreen = step === "home" || step === "homeSuccess" || step === "documentos" || step === "perfil";

  const handleTabChange = (tab: "home" | "documentos" | "perfil") => {
    setStep(tab);
  };

  const handleGoogleLogin = () => {
    setShowGoogleModal(true);
  };

  const handleGoogleSelect = () => {
    setShowGoogleModal(false);
    setStep("googleSuccess");
  };

  return (
    <View className="flex-1 bg-[#EDF2F5]">
      <SafeAreaView className="flex-1">
        <KeyboardAvoidingView 
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          className="flex-1"
        >
          <View className="flex-1 bg-white">
            
            {/* Google Modal */}
            <GoogleModal 
              visible={showGoogleModal}
              onSelect={handleGoogleSelect}
              onClose={() => setShowGoogleModal(false)}
            />
            
            {step === "login" && (
              <LoginScreen 
                onLogin={() => setStep("verifyCode")}
                onGoogleLogin={handleGoogleLogin}
                onForgotPassword={() => setStep("forgotPassword")}
                onRegister={() => setStep("register")}
              />
            )}

            {step === "register" && (
              <RegisterScreen 
                onRegister={() => setStep("verifyCodeRegister")}
                onBack={() => setStep("login")}
              />
            )}

            {step === "verifyCodeRegister" && (
              <VerifyCodeScreen onVerify={() => setStep("emailSent")} />
            )}

            {step === "emailSent" && (
              <EmailSentScreen onConfirm={() => setStep("registerSuccess")} />
            )}

            {step === "registerSuccess" && (
              <RegisterSuccessScreen onContinue={() => setStep("login")} />
            )}

            {step === "googleSuccess" && (
              <GoogleSuccessScreen onContinue={() => setStep("verifyCodeGoogle")} />
            )}

            {step === "verifyCodeGoogle" && (
              <VerifyCodeScreen onVerify={() => setStep("home")} />
            )}

            {step === "forgotPassword" && (
              <ForgotPasswordScreen 
                onSend={() => setStep("forgotSuccess")}
                onBack={() => setStep("login")}
              />
            )}

            {step === "forgotSuccess" && (
              <ForgotSuccessScreen onBack={() => setStep("login")} />
            )}

            {step === "verifyCode" && (
              <VerifyCodeScreen onVerify={() => setStep("loginSuccess")} />
            )}

            {step === "loginSuccess" && (
              <LoginSuccessScreen onContinue={() => setStep("home")} />
            )}

            {isAppScreen && (
              <View className="flex-1">
                {step !== "perfil" && (
                  <AppHeader 
                    statusColor={statusColor} 
                    statusText={statusText}
                    showLogoAndProfile={step !== "documentos"}
                  />
                )}

                {step === "home" && (
                  <HomeScreen 
                    onRegister={() => {
                      setStep("homeSuccess");
                    }}
                  />
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
                  <PerfilScreen onLogout={() => setStep("login")} />
                )}

                {step !== "homeSuccess" && (
                  <BottomTabs activeTab={step as "home" | "documentos" | "perfil"} onTabChange={handleTabChange} />
                )}
              </View>
            )}
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
}
