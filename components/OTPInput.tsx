import { View, Text, TextInput } from "react-native";
import { useRef } from "react";

interface OTPInputProps {
  value: string;
  onChange: (value: string) => void;
  error?: string | null;
}

export function OTPInput({ value, onChange, error }: OTPInputProps) {
  const inputRefs = useRef<(TextInput | null)[]>([]);

  const handleChange = (index: number, char: string) => {
    if (char && !/^\d$/.test(char)) return;
    
    const newValue = value.split("");
    newValue[index] = char;
    const result = newValue.join("").slice(0, 6);
    onChange(result);
    
    if (char && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyPress = (index: number, key: string) => {
    if (key === "Backspace" && !value[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  return (
    <View className="flex flex-col gap-2">
      <View className="flex flex-row justify-center gap-2">
        {Array(6).fill(null).map((_, index) => (
          <TextInput
            key={index}
            ref={(el) => { inputRefs.current[index] = el; }}
            className={`w-11 h-14 text-center text-xl font-bold rounded-xl border ${
              error 
                ? "border-red-500" 
                : "border-[#CBD5E1]"
            }`}
            keyboardType="numeric"
            maxLength={1}
            value={value[index] || ""}
            onChangeText={(char) => handleChange(index, char)}
            onKeyPress={(e) => handleKeyPress(index, e.nativeEvent.key)}
          />
        ))}
      </View>
      <Text className="text-sm text-gray-500 text-center">
        Coloque el código de 6 dígitos
      </Text>
      {error && <Text className="text-xs text-red-500 text-center mt-1">{error}</Text>}
    </View>
  );
}
