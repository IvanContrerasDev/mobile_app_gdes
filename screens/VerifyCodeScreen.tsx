import { useEffect, useState } from 'react';
import { View, Text, Pressable, ScrollView, ActivityIndicator } from 'react-native';
import { OTPInput } from '../components/OTPInput';
import { WhatsAppIcon } from '../components/Icons';
import { validateOTPCode } from '../utils/validations';
import { verifyOTP, resendOTP } from '../services/authService';
import { HttpError } from '../services/httpClient';
interface VerifyCodeScreenProps {
  challengeId?: string;
  onVerify?: () => void;
  onBack: () => void;
}
export function VerifyCodeScreen({ challengeId, onVerify, onBack }: VerifyCodeScreenProps) {
  const [code, setCode] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [cooldown, setCooldown] = useState(challengeId ? 60 : 0);
  const [message, setMessage] = useState('');
  useEffect(() => {
    if (!cooldown) return;
    const timer = setTimeout(() => setCooldown(value => Math.max(0, value - 1)), 1000);
    return () => clearTimeout(timer);
  }, [cooldown]);
  const handleSubmit = async () => {
    const validation = validateOTPCode(code); setError(validation);
    if (validation || busy) return;
    if (!challengeId) { onVerify?.(); return; } // Registro mock, sin instalar sesión; migración F-013.
    setBusy(true); setMessage('');
    try { await verifyOTP(challengeId, code); }
    catch (failure) { setError(failure instanceof HttpError ? failure.message : 'No se pudo verificar el código. Reintentá.'); }
    finally { setBusy(false); }
  };
  const resend = async () => {
    if (!challengeId || busy || cooldown) return;
    setBusy(true); setError(null); setMessage('');
    try { await resendOTP(challengeId); setCode(''); setCooldown(60); setMessage('Código reenviado. Revisá WhatsApp.'); }
    catch (failure) {
      if (failure instanceof HttpError && failure.code === 'OTP_RESEND_COOLDOWN') setCooldown(60);
      setError(failure instanceof HttpError ? failure.message : 'No se pudo reenviar el código. Reintentá.');
    } finally { setBusy(false); }
  };
  return (
    <ScrollView className="flex-1 px-6 py-8" contentContainerStyle={{ flexGrow: 1 }}>
      <View className="flex flex-col items-center gap-4">
        <View className="w-16 h-16 rounded-full bg-[#25D366]/10 items-center justify-center"><WhatsAppIcon size={32} /></View>
        <Text className="text-xl font-bold text-[#0F172A]">Verificación por WhatsApp</Text>
        <Text className="text-sm text-gray-500 text-center">Te enviamos un código de verificación a tu WhatsApp.</Text>
      </View>
      <View className="flex flex-col gap-6 mt-8">
        <OTPInput value={code} onChange={setCode} error={error} />
        {message ? <Text accessibilityRole="alert" className="text-[#0D80AE]">{message}</Text> : null}
        <Pressable onPress={handleSubmit} disabled={busy} className="h-14 w-full rounded-xl bg-[#0D80AE] items-center justify-center">
          {busy ? <ActivityIndicator color="#FFFFFF" /> : <Text className="text-white text-base font-semibold">Verificar</Text>}
        </Pressable>
        {challengeId ? <Pressable disabled={busy || cooldown > 0} onPress={resend} className="h-12 items-center justify-center">
          <Text className={cooldown > 0 ? 'text-gray-500' : 'text-[#0D80AE]'}>{cooldown > 0 ? `Reenviar en ${cooldown} s` : 'Reenviar código'}</Text>
        </Pressable> : null}
        <Pressable onPress={onBack} className="h-12 items-center justify-center"><Text className="text-[#0D80AE]">Volver al inicio de sesión</Text></Pressable>
      </View>
    </ScrollView>
  );
}
