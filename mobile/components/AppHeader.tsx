import { View, Text, Image } from "react-native";
import { UserAvatarIcon } from "./Icons";

interface AppHeaderProps {
  statusColor: string;
  statusText: string;
  showLogoAndProfile?: boolean;
}

export function AppHeader({ statusColor, statusText, showLogoAndProfile = true }: AppHeaderProps) {
  return (
    <View className="px-6 pt-6 pb-4">
      <View className="flex flex-row items-start justify-between">
        {showLogoAndProfile ? (
          <View className="w-[70px]">
            <Image
              source={require("../assets/gdes-logo.png")}
              className="w-full h-auto"
              resizeMode="contain"
              style={{ width: 70, height: 70 }}
            />
          </View>
        ) : (
          <View />
        )}
        
        <View className="flex flex-col items-center gap-2">
          <View className="flex flex-row items-center gap-1.5">
            <View
              className="w-2.5 h-2.5 rounded-full"
              style={{ backgroundColor: statusColor }}
            />
            <Text
              className="text-xs font-medium"
              style={{ color: statusColor }}
            >
              {statusText}
            </Text>
          </View>
          
          {showLogoAndProfile && (
            <View className="flex flex-col items-center">
              <View className="w-14 h-14">
                <UserAvatarIcon size={56} />
              </View>
              <Text className="text-xs font-medium text-[#0F172A] mt-0.5">Gina Tini</Text>
            </View>
          )}
        </View>
      </View>
    </View>
  );
}
