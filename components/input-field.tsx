import { View, Text, TextInput } from "react-native";

interface InputFieldProps {
  label: string;
  placeholder?: string;
  secureTextEntry?: boolean;
  keyboardType?: "default" | "email-address" | "numeric";
  autoCapitalize?: "none" | "sentences" | "words" | "characters";
}

export function InputField({
  label,
  placeholder,
  secureTextEntry = false,
  keyboardType = "default",
  autoCapitalize = "none",
}: InputFieldProps) {
  return (
    <View className="flex flex-col gap-2">
      <Text className="text-sm font-medium text-foreground">{label}</Text>
      <TextInput
        placeholder={placeholder}
        placeholderTextColor="#64748B"
        secureTextEntry={secureTextEntry}
        keyboardType={keyboardType}
        autoCapitalize={autoCapitalize}
        className="h-12 w-full rounded-lg border border-input bg-card px-4 text-base text-foreground"
      />
    </View>
  );
}
