import { useState } from "react";
import { View, Text, Pressable, ScrollView, Image } from "react-native";
import { InputWithError } from "../components/InputWithError";
import { validateEmail } from "../utils/validations";

interface ForgotPasswordScreenProps {
  onSend: () => void;
  onBack: () => void;
}

export function ForgotPasswordScreen({ onSend, onBack }: ForgotPasswordScreenProps) {
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = () => {
    const emailError = validateEmail(email);
    setError(emailError);
    
    if (!emailError) {
      onSend();
    }
  };

  return (
    <ScrollView className="flex-1 px-6 py-8" contentContainerStyle={{ flexGrow: 1 }}>
      <View className="flex flex-col items-center gap-4">
        <View className="w-[120px] h-[120px]">
          <Image
            source={require("../assets/gdes-logo.png")}
            style={{ width: 120, height: 120 }}
            resizeMode="contain"
          />
        </View>
        <Text className="text-xl font-bold text-[#0F172A]">Recuperar contraseña</Text>
        <Text className="text-sm text-gray-500 text-center">
          Ingresa tu email y te enviaremos instrucciones para recuperar tu contraseña.
        </Text>
      </View>

      <View className="flex flex-col gap-6 mt-8">
        <InputWithError
          label="Email"
          placeholder="correo@gmail.com"
          value={email}
          onChangeText={setEmail}
          error={error}
          keyboardType="email-address"
        />

        <Pressable
          onPress={handleSubmit}
          className="h-14 w-full rounded-xl bg-[#0D80AE] items-center justify-center"
        >
          <Text className="text-white text-base font-semibold">Enviar</Text>
        </Pressable>

        <Pressable onPress={onBack} className="items-center">
          <Text className="text-sm font-medium text-[#0D80AE]">Volver al login</Text>
        </Pressable>
      </View>
    </ScrollView>
  );
}
