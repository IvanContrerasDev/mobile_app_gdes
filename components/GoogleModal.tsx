import { View, Text, Pressable, Modal } from "react-native";
import { GoogleIcon } from "./Icons";
import { googleAccounts } from "../constants/data";

interface GoogleModalProps {
  visible: boolean;
  onSelect: () => void;
  onClose: () => void;
}

export function GoogleModal({ visible, onSelect, onClose }: GoogleModalProps) {
  return (
    <Modal visible={visible} transparent animationType="fade">
      <View className="flex-1 bg-black/50 items-center justify-center px-4">
        <View className="bg-white rounded-2xl w-full max-w-[360px] p-6">
          <View className="flex flex-col items-center gap-3 mb-6">
            <GoogleIcon size={40} />
            <Text className="text-lg font-bold text-[#0F172A]">Seleccionar cuenta</Text>
            <Text className="text-sm text-gray-500 text-center">
              Elige una cuenta para continuar con GdeS
            </Text>
          </View>

          <View className="flex flex-col gap-2">
            {googleAccounts.map((account) => (
              <Pressable
                key={account.id}
                onPress={onSelect}
                className="flex-row items-center gap-3 p-3 rounded-xl border border-[#E5E7EB] bg-white"
              >
                <View className="w-9 h-9 rounded-full bg-[#4285F4] items-center justify-center">
                  <Text className="text-white font-semibold text-sm">{account.avatar}</Text>
                </View>
                <View>
                  <Text className="text-sm font-medium text-[#0F172A]">{account.name}</Text>
                  <Text className="text-xs text-gray-400">{account.email}</Text>
                </View>
              </Pressable>
            ))}
          </View>

          <Pressable onPress={onClose} className="mt-4 items-center">
            <Text className="text-sm text-gray-400">Cancelar</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}
