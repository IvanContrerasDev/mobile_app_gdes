import { View, Pressable } from "react-native";
import { ClipboardIcon, HomeIcon, ProfileIcon } from "./Icons";

type TabType = "home" | "documentos" | "perfil";

interface BottomTabsProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
}

export function BottomTabs({ activeTab, onTabChange }: BottomTabsProps) {
  return (
    <View className="border-t border-[#EDF2F5] bg-white">
      <View className="flex flex-row items-center justify-around py-3 px-6">
        <Pressable
          onPress={() => onTabChange("documentos")}
          className="flex flex-col items-center gap-1"
        >
          <ClipboardIcon 
            size={24} 
            color={activeTab === "documentos" ? "#0D80AE" : "#9CA3AF"} 
          />
        </Pressable>

        <Pressable
          onPress={() => onTabChange("home")}
          className="flex flex-col items-center"
        >
          <HomeIcon 
            size={32} 
            color={activeTab === "home" ? "#0D80AE" : "#9CA3AF"} 
          />
        </Pressable>

        <Pressable
          onPress={() => onTabChange("perfil")}
          className="flex flex-col items-center gap-1"
        >
          <ProfileIcon 
            size={24} 
            color={activeTab === "perfil" ? "#0D80AE" : "#9CA3AF"} 
          />
        </Pressable>
      </View>
    </View>
  );
}
