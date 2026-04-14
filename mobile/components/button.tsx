import { Pressable, Text, View } from "react-native";
import type { ReactNode } from "react";

interface ButtonProps {
  children: ReactNode;
  variant?: "primary" | "outline";
  onPress?: () => void;
}

export function Button({
  children,
  variant = "primary",
  onPress,
}: ButtonProps) {
  const isPrimary = variant === "primary";

  return (
    <Pressable
      onPress={onPress}
      className={`h-14 w-full rounded-lg flex-row items-center justify-center gap-3 ${
        isPrimary
          ? "bg-primary"
          : "bg-card border border-input"
      }`}
      style={({ pressed }) => ({
        opacity: pressed ? 0.8 : 1,
      })}
    >
      {typeof children === "string" ? (
        <Text
          className={`text-base font-semibold ${
            isPrimary ? "text-white" : "text-primary"
          }`}
        >
          {children}
        </Text>
      ) : (
        children
      )}
    </Pressable>
  );
}
