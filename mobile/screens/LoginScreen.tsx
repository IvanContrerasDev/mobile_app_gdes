import { useState } from "react";
import { View, Text, Pressable, ScrollView, Image } from "react-native";
import { InputWithError } from "../components/InputWithError";
import { GoogleIcon } from "../components/Icons";
import { validateEmailOrLegajo, validatePassword } from "../utils/validations";

interface LoginScreenProps {
  onLogin: () => void;
  onGoogleLogin: () => void;
  onForgotPassword: () => void;
  onRegister: () => void;
}

export function LoginScreen({ onLogin, onGoogleLogin, onForgotPassword, onRegister }: LoginScreenProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<{ email?: string | null; password?: string | null }>({});

  const handleSubmit = () => {
    const emailError = validateEmailOrLegajo(email);
    const passwordError = validatePassword(password);
    
    setErrors({ email: emailError, password: passwordError });
    
    if (!emailError && !passwordError) {
      onLogin();
    }
  };

  return (
    <ScrollView className="flex-1 px-6 py-8" contentContainerStyle={{ flexGrow: 1 }}>
      <View className="flex flex-col items-center gap-4">
        <View className="w-[180px] h-[180px]">
          <Image
            source={require("../assets/gdes-logo.png")}
            style={{ width: 180, height: 180 }}
            resizeMode="contain"
          />
        </View>
        <Text className="text-xs font-semibold text-[#0F172A]">
          SISTEMA DE REGISTRO HORARIO
        </Text>
      </View>

      <View className="flex flex-col gap-6 mt-8">
        <InputWithError
          label="Email o Legajo"
          placeholder="correo@gmail.com o legajo"
          value={email}
          onChangeText={setEmail}
          error={errors.email}
          keyboardType="email-address"
        />

        <View className="flex flex-col gap-2">
          <InputWithError
            label="Contraseña"
            placeholder="Ingrese su contraseña"
            value={password}
            onChangeText={setPassword}
            error={errors.password}
            secureTextEntry
          />
          <Pressable onPress={onForgotPassword} className="self-end">
            <Text className="text-sm font-medium text-[#0D80AE]">
              Olvidé mi contraseña
            </Text>
          </Pressable>
        </View>

        <Pressable
          onPress={handleSubmit}
          className="h-14 w-full rounded-xl bg-[#0D80AE] items-center justify-center mt-2"
        >
          <Text className="text-white text-base font-semibold">Iniciar sesión</Text>
        </Pressable>

        <View className="flex flex-row items-center gap-4">
          <View className="h-px flex-1 bg-[#CBD5E1]" />
          <Text className="text-sm text-gray-400">o</Text>
          <View className="h-px flex-1 bg-[#CBD5E1]" />
        </View>

        <Pressable
          onPress={onGoogleLogin}
          className="h-14 w-full rounded-xl border border-[#CBD5E1] bg-white flex-row items-center justify-center gap-2"
        >
          <GoogleIcon size={20} />
          <Text className="text-[#0D80AE] text-base font-semibold">Continuar con Google</Text>
        </Pressable>

        <View className="flex flex-row justify-center">
          <Text className="text-sm text-gray-400">No tiene cuenta? </Text>
          <Pressable onPress={onRegister}>
            <Text className="text-sm font-medium text-[#0D80AE]">Registrarse</Text>
          </Pressable>
        </View>
      </View>
    </ScrollView>
  );
}
