import { View, Text } from "react-native";

export function LoginHeader() {
  return (
    <View className="flex flex-col items-center gap-1">
      <Text className="text-3xl font-bold text-foreground">GdeS</Text>
      <Text className="text-base font-semibold text-foreground">
        Sistema de registro horario
      </Text>
    </View>
  );
}
