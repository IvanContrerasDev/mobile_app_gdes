import { useState } from "react";
import { View, Text, Pressable, ScrollView } from "react-native";
import { OTPInput } from "../components/OTPInput";
import { WhatsAppIcon } from "../components/Icons";
import { validateOTPCode } from "../utils/validations";

interface VerifyCodeScreenProps {
  onVerify: () => void;
}

export function VerifyCodeScreen({ onVerify }: VerifyCodeScreenProps) {
  const [code, setCode] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = () => {
    const codeError = validateOTPCode(code);
    setError(codeError);
    
    if (!codeError) {
      onVerify();
    }
  };

  return (
    <ScrollView className="flex-1 px-6 py-8" contentContainerStyle={{ flexGrow: 1 }}>
      <View className="flex flex-col items-center gap-4">
        <View className="w-16 h-16 rounded-full bg-[#25D366]/10 items-center justify-center">
          <WhatsAppIcon size={32} />
        </View>
        <Text className="text-xl font-bold text-[#0F172A]">Verificación por WhatsApp</Text>
        <Text className="text-sm text-gray-500 text-center">
          Te enviamos un código de verificación a tu WhatsApp.
        </Text>
      </View>

      <View className="flex flex-col gap-6 mt-8">
        <OTPInput
          value={code}
          onChange={setCode}
          error={error}
        />

        <Pressable
          onPress={handleSubmit}
          className="h-14 w-full rounded-xl bg-[#0D80AE] items-center justify-center"
        >
          <Text className="text-white text-base font-semibold">Verificar</Text>
        </Pressable>
      </View>
    </ScrollView>
  );
}
