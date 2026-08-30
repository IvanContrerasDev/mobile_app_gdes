import { useState } from "react";
import { View, Text, Pressable, ScrollView, Modal } from "react-native";
import { UserAvatarIcon } from "../components/Icons";
import { userProfile } from "../constants/data";

interface PerfilScreenProps {
  onLogout: () => void;
}

export function PerfilScreen({ onLogout }: PerfilScreenProps) {
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  // Avatar: show photo if it exists, otherwise show the initial.
  const photoUri: string | null = null; // mock: no photo uploaded
  const initial = userProfile.nombre.charAt(0).toUpperCase();

  const handleConfirmLogout = () => {
    setShowLogoutModal(false);
    // Clear session via auth store (handled by parent navigator).
    onLogout();
  };

  // Read-only field card
  const ProfileField = ({ label, value }: { label: string; value: string }) => (
    <View className="flex flex-col gap-1">
      <Text className="text-xs font-medium text-gray-400">{label}</Text>
      <View className="min-h-12 w-full rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] px-4 py-3 justify-center">
        <Text className="text-base text-[#0F172A]">{value}</Text>
      </View>
    </View>
  );

  return (
    <View className="flex-1 px-6 pb-4">
      <Text className="text-xl font-bold text-[#0F172A] pt-6">Perfil</Text>

      {/* Avatar */}
      <View className="flex flex-col items-center pt-4 pb-2">
        {photoUri ? (
          // If a photo exists, show it (placeholder for future implementation)
          <View className="w-20 h-20 rounded-full overflow-hidden bg-[#EDF2F5]" />
        ) : (
          // No photo: show the initial
          <View className="w-20 h-20 rounded-full bg-[#0D80AE] items-center justify-center">
            <Text className="text-2xl font-bold text-white">{initial}</Text>
          </View>
        )}
        <Text className="text-base font-semibold text-[#0F172A] mt-3">
          {userProfile.nombre} {userProfile.apellido}
        </Text>
        <Text className="text-sm text-gray-400">{userProfile.puesto}</Text>
      </View>

      <ScrollView
        className="flex-1 mt-4"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 24 }}
      >
        <View className="flex flex-col gap-4">
          <ProfileField label="Nombre/s" value={userProfile.nombre} />
          <ProfileField label="Apellido/s" value={userProfile.apellido} />
          <ProfileField label="DNI" value={userProfile.dni} />
          <ProfileField label="CUIL" value={userProfile.cuil} />
          <ProfileField label="Legajo" value={userProfile.legajo} />
          <ProfileField label="Fecha de nacimiento" value={userProfile.fechaNacimiento} />
          <ProfileField label="Teléfono" value={userProfile.telefono} />
          <ProfileField label="Email" value={userProfile.email} />
          <ProfileField label="Domicilio" value={userProfile.domicilio} />
          <ProfileField label="Fecha de ingreso" value={userProfile.fechaInicioContrato} />
          <ProfileField label="Puesto" value={userProfile.puesto} />

          <Pressable
            onPress={() => setShowLogoutModal(true)}
            className="h-14 w-full rounded-2xl bg-red-500 items-center justify-center mt-6"
          >
            <Text className="text-white text-base font-semibold">Cerrar sesión</Text>
          </Pressable>
        </View>
      </ScrollView>

      {/* Logout Confirmation Modal */}
      <Modal
        visible={showLogoutModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowLogoutModal(false)}
      >
        <View className="flex-1 bg-black/40 items-center justify-center px-8">
          <View className="bg-white rounded-2xl w-full p-6">
            <Text className="text-lg font-bold text-[#0F172A] text-center">
              Cerrar sesión
            </Text>
            <Text className="text-sm text-gray-500 text-center mt-2">
              {"¿Está seguro que desea cerrar sesión?"}
            </Text>

            <View className="flex flex-row gap-3 mt-6">
              <Pressable
                onPress={() => setShowLogoutModal(false)}
                className="flex-1 h-12 rounded-xl border border-[#CBD5E1] items-center justify-center"
              >
                <Text className="text-sm font-medium text-[#0F172A]">Cancelar</Text>
              </Pressable>
              <Pressable
                onPress={handleConfirmLogout}
                className="flex-1 h-12 rounded-xl bg-red-500 items-center justify-center"
              >
                <Text className="text-sm font-semibold text-white">Cerrar sesión</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}
