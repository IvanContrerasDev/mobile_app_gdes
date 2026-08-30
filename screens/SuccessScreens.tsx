import { useEffect } from "react";
import { View, Text, Pressable } from "react-native";
import { SuccessCheckIcon, MailIcon } from "../components/Icons";
import { ActionType } from "../constants/data";

// Login Success
export function LoginSuccessScreen({ onContinue }: { onContinue: () => void }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onContinue();
    }, 2000);
    return () => clearTimeout(timer);
  }, [onContinue]);

  return (
    <View className="flex-1 items-center justify-center gap-6 px-6 py-8">
      <SuccessCheckIcon size={80} />
      <View className="items-center">
        <Text className="text-xl font-bold text-[#62882B] mb-2">Autenticación exitosa</Text>
        <Text className="text-sm text-[#62882B]">Bienvenido de vuelta.</Text>
      </View>
      <Text className="text-xs text-gray-400">Redirigiendo...</Text>
    </View>
  );
}

// Register Success
export function RegisterSuccessScreen({ onContinue }: { onContinue: () => void }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onContinue();
    }, 2500);
    return () => clearTimeout(timer);
  }, [onContinue]);

  return (
    <View className="flex-1 items-center justify-center gap-6 px-6 py-8">
      <SuccessCheckIcon size={80} />
      <View className="items-center">
        <Text className="text-xl font-bold text-[#62882B] mb-2">Proceso exitoso</Text>
        <Text className="text-sm text-[#62882B]">Redirigiendo al login</Text>
      </View>
      <Text className="text-xs text-gray-400">Redirigiendo...</Text>
    </View>
  );
}

// Google Success
export function GoogleSuccessScreen({ onContinue }: { onContinue: () => void }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onContinue();
    }, 2000);
    return () => clearTimeout(timer);
  }, [onContinue]);

  return (
    <View className="flex-1 items-center justify-center gap-6 px-6 py-8">
      <SuccessCheckIcon size={80} />
      <View className="items-center">
        <Text className="text-xl font-bold text-[#62882B] mb-2">Autenticación exitosa con Google</Text>
        <Text className="text-sm text-[#62882B]">Bienvenido de vuelta.</Text>
      </View>
      <Text className="text-xs text-gray-400">Continuando...</Text>
    </View>
  );
}

// Email Sent
export function EmailSentScreen({ onConfirm }: { onConfirm: () => void }) {
  return (
    <View className="flex-1 items-center justify-center gap-6 px-6 py-8">
      <View className="w-16 h-16 rounded-full bg-[#0D80AE]/10 items-center justify-center">
        <MailIcon size={32} color="#0D80AE" />
      </View>
      <View className="items-center">
        <Text className="text-xl font-bold text-[#0F172A] mb-2">Te enviamos un correo</Text>
        <Text className="text-sm text-gray-500">Revisa la bandeja de entrada</Text>
      </View>
      <Pressable
        onPress={onConfirm}
        className="h-14 w-full rounded-xl bg-[#0D80AE] items-center justify-center"
      >
        <Text className="text-white text-base font-semibold">Entendido</Text>
      </Pressable>
    </View>
  );
}

// Forgot Success
export function ForgotSuccessScreen({ onBack }: { onBack: () => void }) {
  return (
    <View className="flex-1 items-center justify-center gap-6 px-6 py-8">
      <SuccessCheckIcon size={80} />
      <View className="items-center">
        <Text className="text-xl font-bold text-[#62882B] mb-2">Instrucciones enviadas</Text>
        <Text className="text-sm text-[#62882B]">
          Te enviamos instrucciones para recuperar tu contraseña.
        </Text>
      </View>
      <Pressable
        onPress={onBack}
        className="h-14 w-full rounded-xl bg-[#0D80AE] items-center justify-center"
      >
        <Text className="text-white text-base font-semibold">Volver al login</Text>
      </Pressable>
    </View>
  );
}

// Home Success
export function HomeSuccessScreen({ action, onContinue }: { action: ActionType; onContinue: () => void }) {
  const messages = {
    entrada: "Entrada registrada",
    salida: "Salida registrada",
    ausencia: "Ausencia registrada",
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      onContinue();
    }, 2000);
    return () => clearTimeout(timer);
  }, [onContinue]);

  return (
    <View className="flex-1 items-center justify-center gap-6 px-6 py-8">
      <SuccessCheckIcon size={80} />
      <View className="items-center">
        <Text className="text-xl font-bold text-[#62882B] mb-2">{messages[action]}</Text>
        <Text className="text-sm text-[#62882B]">Tu registro fue guardado correctamente.</Text>
      </View>
      <Text className="text-xs text-gray-400">Volviendo al inicio...</Text>
    </View>
  );
}
