import { View, Text, TextInput, TextInputProps } from "react-native";

interface InputWithErrorProps extends Omit<TextInputProps, "onChange"> {
  label: string;
  error?: string | null;
  onChangeText: (text: string) => void;
}

export function InputWithError({
  label,
  error,
  onChangeText,
  value,
  placeholder,
  secureTextEntry,
  keyboardType,
  ...props
}: InputWithErrorProps) {
  return (
    <View className="flex flex-col gap-1">
      <Text className="text-sm font-medium text-[#0F172A]">{label}</Text>
      <TextInput
        className={`h-12 w-full rounded-xl border px-4 text-base text-[#0F172A] ${
          error 
            ? "border-red-500" 
            : "border-[#CBD5E1]"
        }`}
        placeholder={placeholder}
        placeholderTextColor="#9CA3AF"
        value={value}
        onChangeText={onChangeText}
        secureTextEntry={secureTextEntry}
        keyboardType={keyboardType}
        autoCapitalize="none"
        {...props}
      />
      {error && <Text className="text-xs text-red-500 mt-1">{error}</Text>}
    </View>
  );
}
