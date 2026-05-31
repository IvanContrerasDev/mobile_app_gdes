import { useState } from "react";
import { View, Text, Pressable, ScrollView, TextInput, Modal, FlatList, ActivityIndicator } from "react-native";
import { ChevronDownIcon, CheckIcon, AttachIcon } from "../components/Icons";
import { workplaces } from "../constants/data";
import { useAppStore, ActionType } from "../store/useAppStore";

interface HomeScreenProps {
  onRegister: () => void;
}

// Registration record type (for simulation)
interface RegistrationRecord {
  workplace: string;
  action: ActionType;
  observation: string;
  timestamp: Date;
}

export function HomeScreen({ onRegister }: HomeScreenProps) {
  // Zustand store
  const {
    selectedAction,
    selectedWorkplace,
    observation,
    isWorking,
    setAction,
    setWorkplace,
    setObservation,
    setWorkingStatus,
    resetRegistration,
  } = useAppStore();

  // Local UI state
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [orderedWorkplaces, setOrderedWorkplaces] = useState(workplaces);
  const [motivoAusencia, setMotivoAusencia] = useState("");
  const [showMotivoDropdown, setShowMotivoDropdown] = useState(false);
  
  // Validation and feedback state
  const [workplaceError, setWorkplaceError] = useState("");
  const [actionError, setActionError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const buttonText = {
    entrada: "Registrar entrada",
    salida: "Registrar salida",
    ausencia: "Registrar ausencia",
  };

  const handleSelectWorkplace = (wpName: string) => {
    setWorkplace(wpName);
    setIsDropdownOpen(false);
    setWorkplaceError("");
    
    const selectedWp = workplaces.find(wp => wp.name === wpName);
    if (selectedWp) {
      const others = workplaces.filter(wp => wp.name !== wpName);
      setOrderedWorkplaces([selectedWp, ...others]);
    }
  };

  const handleSelectAction = (action: ActionType) => {
    setAction(action);
    setActionError("");
  };

  const validateForm = (): boolean => {
    let isValid = true;
    
    // Validate workplace
    if (!selectedWorkplace) {
      setWorkplaceError("Debe seleccionar un lugar de trabajo");
      isValid = false;
    } else {
      setWorkplaceError("");
    }
    
    // Validate action
    if (!selectedAction) {
      setActionError("Debe seleccionar un tipo de registro");
      isValid = false;
    } else {
      setActionError("");
    }
    
    return isValid;
  };

  const handleSubmit = async () => {
    // Run validations
    if (!validateForm()) {
      return;
    }
    
    // Set loading state
    setIsLoading(true);
    
    try {
      // Simulate registration - create record object (not sent anywhere)
      const registrationRecord: RegistrationRecord = {
        workplace: selectedWorkplace!,
        action: selectedAction!,
        observation: observation,
        timestamp: new Date(),
      };
      
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Update working status based on action
      if (selectedAction === "entrada") {
        setWorkingStatus(true);
      } else if (selectedAction === "salida") {
        setWorkingStatus(false);
      }
      // ausencia doesn't change working status
      
      // Clear observation after successful registration
      setObservation("");
      setMotivoAusencia("");
      
      // Call onRegister to show success screen
      onRegister();
      
    } catch (error) {
      // Fallback error handling (shouldn't happen in simulation)
      setWorkplaceError("Error al registrar. Intente nuevamente.");
    } finally {
      setIsLoading(false);
    }
  };

  const motivos = [
    { value: "enfermedad", label: "Enfermedad" },
    { value: "franco", label: "Franco" },
    { value: "otros", label: "Otros" },
  ];

  return (
    <ScrollView className="flex-1 px-6 pb-4" contentContainerStyle={{ flexGrow: 1 }}>
      {/* Status indicator - using Zustand isWorking state */}
      <View className="flex-row items-center justify-center gap-2 mt-4">
        <View className={`w-2.5 h-2.5 rounded-full ${isWorking ? "bg-[#62882B]" : "bg-[#ED701E]"}`} />
        <Text className={`text-xs font-medium ${isWorking ? "text-[#62882B]" : "text-[#ED701E]"}`}>
          {isWorking ? "En horario laboral" : "Fuera de horario"}
        </Text>
      </View>

      <View className="flex flex-col gap-2 mt-6">
        <Text className="text-sm font-semibold text-[#0F172A]">Lugar de trabajo</Text>
        <Pressable
          onPress={() => setIsDropdownOpen(true)}
          className="h-12 w-full rounded-xl border border-[#CBD5E1] bg-white px-4 flex-row items-center justify-between"
        >
          <Text className={selectedWorkplace ? "text-[#0F172A]" : "text-gray-400"}>
            {selectedWorkplace || "Seleccionar lugar de trabajo"}
          </Text>
          <ChevronDownIcon size={20} color="#9CA3AF" />
        </Pressable>
        {workplaceError && (
          <Text className="text-xs text-red-500 mt-1">{workplaceError}</Text>
        )}
      </View>

      {/* Workplace Modal */}
      <Modal visible={isDropdownOpen} transparent animationType="slide">
        <Pressable 
          className="flex-1 bg-black/50 justify-end"
          onPress={() => setIsDropdownOpen(false)}
        >
          <View className="bg-white rounded-t-2xl max-h-[60%]">
            <View className="p-4 border-b border-[#EDF2F5]">
              <Text className="text-lg font-semibold text-[#0F172A] text-center">
                Seleccionar lugar de trabajo
              </Text>
            </View>
            <FlatList
              data={orderedWorkplaces}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <Pressable
                  onPress={() => handleSelectWorkplace(item.name)}
                  className="px-4 py-4 border-b border-[#EDF2F5] flex-row items-center justify-between"
                >
                  <Text className="text-sm text-[#0F172A]">{item.name}</Text>
                  {selectedWorkplace === item.name && (
                    <CheckIcon size={16} color="#0D80AE" />
                  )}
                </Pressable>
              )}
            />
          </View>
        </Pressable>
      </Modal>

      <View className="flex flex-col gap-2 mt-6">
        <Text className="text-sm font-semibold text-[#0F172A]">Tipo de registro</Text>
        <View className="flex flex-row gap-3">
          {(["entrada", "salida", "ausencia"] as ActionType[]).map((action) => {
            const isSelected = selectedAction === action;
            const labels = {
              entrada: "Entrada",
              salida: "Salida",
              ausencia: "Ausencia",
            };
            
            return (
              <Pressable
                key={action}
                onPress={() => handleSelectAction(action)}
                className={`flex-1 h-12 rounded-xl items-center justify-center ${
                  isSelected
                    ? "bg-[#0D80AE]"
                    : "bg-white border border-[#CBD5E1]"
                }`}
              >
                <Text className={`text-sm font-medium ${isSelected ? "text-white" : "text-[#0F172A]"}`}>
                  {labels[action]}
                </Text>
              </Pressable>
            );
          })}
        </View>
        {actionError && (
          <Text className="text-xs text-red-500 mt-1">{actionError}</Text>
        )}
      </View>

      <View className="flex flex-col gap-2 mt-6">
        <Text className="text-sm font-semibold text-[#0F172A]">Observacion (opcional)</Text>
        <TextInput
          placeholder="Agregar una nota..."
          multiline
          numberOfLines={selectedAction === "ausencia" ? 2 : 3}
          value={observation}
          onChangeText={setObservation}
          className="w-full rounded-xl border border-[#CBD5E1] bg-white px-4 py-3 text-base text-[#0F172A]"
          placeholderTextColor="#9CA3AF"
          textAlignVertical="top"
        />
      </View>

      {selectedAction === "ausencia" && (
        <View className="flex flex-col gap-4 mt-6">
          <View className="flex flex-col gap-2">
            <Text className="text-sm font-semibold text-[#0F172A]">Motivo de la ausencia</Text>
            <Pressable
              onPress={() => setShowMotivoDropdown(true)}
              className="h-12 w-full rounded-xl border border-[#CBD5E1] bg-white px-4 flex-row items-center justify-between"
            >
              <Text className={motivoAusencia ? "text-[#0F172A]" : "text-gray-400"}>
                {motivos.find(m => m.value === motivoAusencia)?.label || "Seleccionar motivo..."}
              </Text>
              <ChevronDownIcon size={20} color="#9CA3AF" />
            </Pressable>
          </View>

          <Modal visible={showMotivoDropdown} transparent animationType="slide">
            <Pressable 
              className="flex-1 bg-black/50 justify-end"
              onPress={() => setShowMotivoDropdown(false)}
            >
              <View className="bg-white rounded-t-2xl">
                <View className="p-4 border-b border-[#EDF2F5]">
                  <Text className="text-lg font-semibold text-[#0F172A] text-center">
                    Seleccionar motivo
                  </Text>
                </View>
                {motivos.map((motivo) => (
                  <Pressable
                    key={motivo.value}
                    onPress={() => {
                      setMotivoAusencia(motivo.value);
                      setShowMotivoDropdown(false);
                    }}
                    className="px-4 py-4 border-b border-[#EDF2F5] flex-row items-center justify-between"
                  >
                    <Text className="text-sm text-[#0F172A]">{motivo.label}</Text>
                    {motivoAusencia === motivo.value && (
                      <CheckIcon size={16} color="#0D80AE" />
                    )}
                  </Pressable>
                ))}
              </View>
            </Pressable>
          </Modal>

          <Pressable className="h-12 w-full rounded-xl border border-[#CBD5E1] bg-white flex-row items-center justify-center gap-2">
            <AttachIcon size={16} color="#0F172A" />
            <Text className="text-sm font-medium text-[#0F172A]">Adjuntar archivo</Text>
          </Pressable>
        </View>
      )}

      <View className="flex-1 min-h-4" />

      <Pressable
        onPress={handleSubmit}
        disabled={isLoading}
        className={`h-14 w-full rounded-2xl items-center justify-center mt-4 ${
          isLoading ? "bg-[#0D80AE]/70" : "bg-[#0D80AE]"
        }`}
      >
        {isLoading ? (
          <ActivityIndicator color="#FFFFFF" />
        ) : (
          <Text className="text-white text-base font-semibold">
            {buttonText[selectedAction || "entrada"]}
          </Text>
        )}
      </Pressable>

      <Text className="text-sm text-gray-400 text-center py-3">
        El registro se realiza con su ubicacion actual
      </Text>
    </ScrollView>
  );
}
