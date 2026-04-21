import { useState } from "react";
import { View, Text, Pressable, ScrollView, TextInput } from "react-native";
import { UserAvatarIcon } from "../components/Icons";
import { userProfile } from "../constants/data";

interface PerfilScreenProps {
  onLogout: () => void;
}

export function PerfilScreen({ onLogout }: PerfilScreenProps) {
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const ProfileField = ({ label, value }: { label: string; value: string }) => (
    <View className="flex flex-col gap-1">
      <Text className="text-xs font-medium text-gray-400">{label}</Text>
      <View className="h-12 w-full rounded-xl border border-[#CBD5E1] bg-[#EDF2F5] px-4 justify-center">
        <Text className="text-base text-[#0F172A]">{value}</Text>
      </View>
    </View>
  );

  return (
    <View className="flex-1 px-6 pb-4">
      <Text className="text-xl font-bold text-[#0F172A] pt-6">Perfil</Text>
      
      <View className="flex flex-col items-center pt-4 pb-2">
        <View className="w-20 h-20">
          <UserAvatarIcon size={80} />
        </View>
        <Pressable>
          <Text className="text-sm font-medium text-[#0D80AE] mt-2">Agregar foto</Text>
        </Pressable>
      </View>
      
      <ScrollView className="flex-1 mt-6" showsVerticalScrollIndicator={false}>
        <View className="flex flex-col gap-4">
          <ProfileField label="Nombre/s" value={userProfile.nombre} />
          <ProfileField label="Apellido/s" value={userProfile.apellido} />
          <ProfileField label="Fecha de nacimiento" value={userProfile.fechaNacimiento} />
          <ProfileField label="Fecha de inicio del contrato" value={userProfile.fechaInicioContrato} />
          <ProfileField label="DNI" value={userProfile.dni} />
          <ProfileField label="CUIL" value={userProfile.cuil} />
          <ProfileField label="Legajo" value={userProfile.legajo} />
          <ProfileField label="Puesto" value={userProfile.puesto} />
          <ProfileField label="Domicilio" value={userProfile.domicilio} />
          <ProfileField label="Telefono" value={userProfile.telefono} />
          <ProfileField label="Email" value={userProfile.email} />

          <Pressable
            onPress={() => setShowLogoutModal(true)}
            className="h-14 w-full rounded-2xl bg-red-500 items-center justify-center mt-6 mb-4"
          >
            <Text className="text-white text-base font-semibold">Cerrar sesión</Text>
          </Pressable>
        </View>
      </ScrollView>

      {/* Logout Confirmation */}
      {showLogoutModal && (
        <View className="absolute bottom-16 left-0 right-0 px-4">
          <View className="bg-white rounded-xl shadow-lg w-full p-4">
            <Text className="text-sm font-medium text-[#0F172A] text-center mb-4">
              Estas seguro de que quieres cerrar sesión?
            </Text>
            
            <View className="flex flex-row gap-3">
              <Pressable
                onPress={() => setShowLogoutModal(false)}
                className="flex-1 h-10 rounded-xl border border-[#CBD5E1] items-center justify-center"
              >
                <Text className="text-sm font-medium text-[#0F172A]">No</Text>
              </Pressable>
              <Pressable
                onPress={onLogout}
                className="flex-1 h-10 rounded-xl bg-red-500 items-center justify-center"
              >
                <Text className="text-sm font-semibold text-white">Si</Text>
              </Pressable>
            </View>
          </View>
        </View>
      )}
    </View>
  );
}
