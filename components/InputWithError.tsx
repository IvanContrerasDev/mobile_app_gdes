import type { ReactNode, Ref } from "react";
import { View, Text, TextInput, TextInputProps } from "react-native";

interface InputWithErrorProps extends Omit<TextInputProps, "onChange"> {
  label: string;
  inputRef?: Ref<TextInput>;
  rightAccessory?: ReactNode;
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
  inputRef,
  rightAccessory,
  ...props
}: InputWithErrorProps) {
  return (
    <View className="flex flex-col gap-1">
      <Text className="text-sm font-medium text-[#0F172A]">{label}</Text>
      <View className="relative">
        <TextInput
          ref={inputRef}
          accessibilityLabel={label}
          className={`h-12 w-full rounded-xl border px-4 text-base text-[#0F172A] ${rightAccessory ? "pr-14" : ""} ${
            error ? "border-red-500" : "border-[#CBD5E1]"
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
        {rightAccessory ? (
          <View className="absolute right-1 top-0 bottom-0 justify-center">
            {rightAccessory}
          </View>
        ) : null}
      </View>
      {error && <Text className="text-xs text-red-500 mt-1">{error}</Text>}
    </View>
  );
}
