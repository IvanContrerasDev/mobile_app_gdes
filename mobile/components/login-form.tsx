import { View, Text, Pressable } from "react-native";
import { InputField } from "./input-field";
import { Button } from "./button";
import { GoogleIcon } from "./google-icon";

export function LoginForm() {
  return (
    <View className="flex flex-col gap-6">
      {/* Email Input */}
      <InputField
        label="Email"
        placeholder="correo@empresa.com"
        keyboardType="email-address"
        autoCapitalize="none"
      />

      {/* Password Input */}
      <View className="flex flex-col gap-2">
        <InputField
          label="Contraseña"
          placeholder="Ingrese su contraseña"
          secureTextEntry
        />
        <Pressable className="self-end">
          <Text className="text-sm font-medium text-primary">
            Olvidé mi contraseña
          </Text>
        </Pressable>
      </View>

      {/* Primary Button */}
      <View className="mt-2">
        <Button variant="primary">Iniciar sesión</Button>
      </View>

      {/* Divider */}
      <View className="flex-row items-center gap-4">
        <View className="h-px flex-1 bg-border" />
        <Text className="text-sm text-muted-foreground">o</Text>
        <View className="h-px flex-1 bg-border" />
      </View>

      {/* Google Button */}
      <Button variant="outline">
        <View className="flex-row items-center justify-center gap-3">
          <GoogleIcon size={20} />
          <Text className="text-base font-semibold text-primary">
            Continuar con Google
          </Text>
        </View>
      </Button>

      {/* Register Link */}
      <View className="flex-row justify-center">
        <Text className="text-sm text-muted-foreground">
          ¿No tiene cuenta?{" "}
        </Text>
        <Pressable>
          <Text className="text-sm font-medium text-primary">Registrarse</Text>
        </Pressable>
      </View>
    </View>
  );
}
