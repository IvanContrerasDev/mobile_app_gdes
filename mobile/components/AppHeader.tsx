import { View, Image } from "react-native";

export function AppHeader() {
  return (
    <View className="px-6 pt-6 pb-4">
      <View className="flex flex-row items-center justify-between">
          <View className="w-[70px]">
            <Image
              source={require("../assets/gdes-logo.png")}
              className="w-full h-auto"
              resizeMode="contain"
              style={{ width: 70, height: 70 }}
            />
          </View>
      </View>
    </View>
  );
}
