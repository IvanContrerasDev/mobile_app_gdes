import { useState } from "react";

// Screens
import { LoginScreen } from "../screens/LoginScreen";
import { RegisterScreen } from "../screens/RegisterScreen";
import { VerifyCodeScreen } from "../screens/VerifyCodeScreen";
import { ForgotPasswordScreen } from "../screens/ForgotPasswordScreen";
import {
  RegisterSuccessScreen,
  GoogleSuccessScreen,
  EmailSentScreen,
} from "../screens/SuccessScreens";

// Components
import { GoogleModal } from "../components/GoogleModal";

// Store
import { useAuthStore } from "../stores/authStore";

type AuthStep =
  | "login"
  | "register"
  | "verifyCodeRegister"
  | "emailSent"
  | "registerSuccess"
  | "googleSuccess"
  | "verifyCodeGoogle"
  | "forgotPassword";

/**
 * AuthNavigator
 * Handles the unauthenticated flow (login, register, forgot password, etc.).
 * When login succeeds, the auth store flips isAuthenticated and the root
 * navigator swaps to the AppNavigator automatically.
 *
 * TODO: Reemplazar autenticación mock por API real (Google Login, OTP, registro real).
 */
export function AuthNavigator() {
  const [step, setStep] = useState<AuthStep>("login");
  const [showGoogleModal, setShowGoogleModal] = useState(false);

  // Mock login for the Google flow (MVP)
  const loginToStore = useAuthStore((state) => state.login);

  const handleGoogleLogin = () => setShowGoogleModal(true);

  const handleGoogleSelect = () => {
    setShowGoogleModal(false);
    setStep("googleSuccess");
  };

  const completeGoogleAuth = () => {
    // TODO: Reemplazar por autenticación real de Google.
    loginToStore({
      id: "usr-google",
      nombre: "Usuario",
      apellido: "Google",
      email: "google@gdes.com",
      legajo: "00000",
    });
  };

  return (
    <>
      <GoogleModal
        visible={showGoogleModal}
        onSelect={handleGoogleSelect}
        onClose={() => setShowGoogleModal(false)}
      />

      {step === "login" && (
        <LoginScreen
          // Email/password login is handled inside LoginScreen via authService.
          // On success it sets the session; nothing else needed here.
          onLogin={() => {}}
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
        <VerifyCodeScreen onVerify={completeGoogleAuth} />
      )}

      {step === "forgotPassword" && (
        <ForgotPasswordScreen onBack={() => setStep("login")} />
      )}
    </>
  );
}
