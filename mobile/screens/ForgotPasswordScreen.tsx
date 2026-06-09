import { useState } from "react";
import { View, Text, Pressable, ScrollView, Image, ActivityIndicator } from "react-native";
import { InputWithError } from "../components/InputWithError";
import { SuccessCheckIcon } from "../components/Icons";
import { validateEmail } from "../utils/validations";
import { isOnline } from "../services/networkService";
import { requestPasswordRecovery } from "../services/passwordRecoveryService";

interface ForgotPasswordScreenProps {
  onBack: () => void;
}

export function ForgotPasswordScreen({ onBack }: ForgotPasswordScreenProps) {
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [generalError, setGeneralError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async () => {
    // Clear previous feedback
    setGeneralError("");

    // Validate email field (required + format)
    const emailError = validateEmail(email);
    setError(emailError);
    if (emailError) {
      return;
    }

    // Verify connectivity before attempting the request
    setIsLoading(true);
    const online = await isOnline();
    if (!online) {
      setIsLoading(false);
      setGeneralError(
        "No posee conexión a Internet.\n\nConéctese a una red e intente nuevamente."
      );
      return;
    }

    // Request password recovery (mock)
    try {
      const response = await requestPasswordRecovery(email);
      if (response.success) {
        setIsSuccess(true);
      } else {
        setGeneralError(
          "No fue posible procesar la solicitud.\n\nPor favor, intente nuevamente."
        );
      }
    } catch (e) {
      setGeneralError(
        "No fue posible procesar la solicitud.\n\nPor favor, intente nuevamente."
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Confirmation screen after a successful request
  if (isSuccess) {
    return (
      <ScrollView className="flex-1 px-6 py-8" contentContainerStyle={{ flexGrow: 1, justifyContent: "center" }}>
        <View className="flex flex-col items-center gap-6">
          <SuccessCheckIcon size={80} />
          <View className="items-center gap-2">
            <Text className="text-xl font-bold text-[#62882B] text-center">Correo enviado</Text>
            <Text className="text-sm text-gray-500 text-center leading-relaxed">
              Si existe una cuenta asociada al correo ingresado, recibirá instrucciones para
              restablecer su contraseña.
            </Text>
          </View>
          <Pressable
            onPress={onBack}
            className="h-14 w-full rounded-xl bg-[#0D80AE] items-center justify-center"
          >
            <Text className="text-white text-base font-semibold">Volver al inicio de sesión</Text>
          </Pressable>
        </View>
      </ScrollView>
    );
  }

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
        <Text className="text-sm text-gray-500 text-center leading-relaxed">
          Ingresa tu correo electrónico y te enviaremos instrucciones para restablecer tu
          contraseña.
        </Text>
      </View>

      <View className="flex flex-col gap-6 mt-8">
        <InputWithError
          label="Correo electrónico"
          placeholder="correo@gmail.com"
          value={email}
          onChangeText={(text) => {
            setEmail(text);
            if (error) setError(null);
            if (generalError) setGeneralError("");
          }}
          error={error}
          keyboardType="email-address"
          editable={!isLoading}
        />

        {generalError ? (
          <View className="bg-red-50 border border-red-200 rounded-xl px-4 py-3">
            <Text className="text-sm text-red-600 text-center">{generalError}</Text>
          </View>
        ) : null}

        <Pressable
          onPress={handleSubmit}
          disabled={isLoading}
          className={`h-14 w-full rounded-xl items-center justify-center flex-row gap-2 ${
            isLoading ? "bg-[#0D80AE]/60" : "bg-[#0D80AE]"
          }`}
        >
          {isLoading ? (
            <>
              <ActivityIndicator size="small" color="#FFFFFF" />
              <Text className="text-white text-base font-semibold">Enviando instrucciones...</Text>
            </>
          ) : (
            <Text className="text-white text-base font-semibold">
              {generalError ? "Reintentar" : "Enviar instrucciones"}
            </Text>
          )}
        </Pressable>

        <Pressable onPress={onBack} className="items-center" disabled={isLoading}>
          <Text className="text-sm font-medium text-[#0D80AE]">Volver al inicio de sesión</Text>
        </Pressable>
      </View>
    </ScrollView>
  );
}
