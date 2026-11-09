import { useState } from 'react';
import { Alert, Text, View, Pressable } from 'react-native';
import { LoginScreen } from '../screens/LoginScreen';
import { RegisterScreen } from '../screens/RegisterScreen';
import { VerifyCodeScreen } from '../screens/VerifyCodeScreen';
import { ForgotPasswordScreen } from '../screens/ForgotPasswordScreen';
import { RegisterSuccessScreen, EmailSentScreen } from '../screens/SuccessScreens';
import { logout, type LoginChallenge } from '../services/authService';
import { useAuthStore } from '../stores/authStore';

type AuthStep = 'login' | 'verifyLogin' | 'register' | 'verifyRegister' | 'emailSent' | 'registerSuccess' | 'forgotPassword';
export function AuthNavigator() {
  const [step, setStep] = useState<AuthStep>('login');
  const [challenge, setChallenge] = useState<LoginChallenge | null>(null);
  const sessionError = useAuthStore(state => state.error);
  const go = (next: AuthStep) => {
    // Cancela cualquier login/OTP pendiente antes de abandonar su pantalla.
    void logout().catch(() => {});
    setChallenge(null); setStep(next);
  };
  return (
    <View className="flex-1">
      {sessionError ? <View className="px-6 py-3 gap-2">
        <Text accessibilityRole="alert" className="text-red-600">{sessionError}</Text>
        <Pressable onPress={() => { void logout().catch(() => {}); }}><Text className="text-[#0D80AE]">Reintentar cierre de sesión</Text></Pressable>
      </View> : null}
      {step === 'login' && <LoginScreen
        onLogin={value => { setChallenge(value); setStep('verifyLogin'); }}
        onGoogleLogin={() => Alert.alert('Google no configurado', 'El acceso con Google requiere la integración del proveedor. Usá email o legajo y OTP para iniciar sesión.')}
        onForgotPassword={() => go('forgotPassword')}
        onRegister={() => go('register')}
      />}
      {step === 'verifyLogin' && challenge ? <VerifyCodeScreen challengeId={challenge.challengeId} onBack={() => go('login')} /> : null}
      {step === 'register' && <RegisterScreen onRegister={() => setStep('verifyRegister')} onBack={() => go('login')} />}
      {step === 'verifyRegister' && <VerifyCodeScreen onVerify={() => setStep('emailSent')} onBack={() => go('login')} />}
      {step === 'emailSent' && <EmailSentScreen onConfirm={() => setStep('registerSuccess')} />}
      {step === 'registerSuccess' && <RegisterSuccessScreen onContinue={() => go('login')} />}
      {step === 'forgotPassword' && <ForgotPasswordScreen onBack={() => go('login')} />}
    </View>
  );
}
