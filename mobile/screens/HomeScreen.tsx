import { useState, useEffect } from "react";
import { View, Text, Pressable, ScrollView, TextInput, Modal, FlatList, ActivityIndicator } from "react-native";
import { ChevronDownIcon, CheckIcon, AttachIcon, StarIcon } from "../components/Icons";
import { useAppStore, ActionType } from "../store/useAppStore";
import { registerEvent } from "../services/registerService";
import { getCurrentLocation } from "../services/locationService";
import { isOnline } from "../services/networkService";
import { getWorkplaces } from "../services/workplaceService";
import { getFavorites, addFavorite, removeFavorite } from "../services/favoriteWorkplaceService";
import { saveRecentWorkplace, getRecentWorkplaceForCurrentPeriod } from "../services/recentWorkplaceService";
import { RegisterRequest } from "../types/api";
import { Workplace } from "../types/workplace";

// TODO: Implementar almacenamiento offline y sincronización automática en una futura versión.
// import { saveOfflineRegister } from "../services/offlineRegisterService";

interface HomeScreenProps {
  onRegister: () => void;
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
  const [motivoAusencia, setMotivoAusencia] = useState("");
  const [showMotivoDropdown, setShowMotivoDropdown] = useState(false);

  // Workplaces state (local to Home, fetched from service)
  const [workplaces, setWorkplaces] = useState<Workplace[]>([]);
  const [orderedWorkplaces, setOrderedWorkplaces] = useState<Workplace[]>([]);
  const [isLoadingWorkplaces, setIsLoadingWorkplaces] = useState(true);
  const [workplacesError, setWorkplacesError] = useState("");

  // Favorite workplaces (IDs), persisted locally
  const [favorites, setFavorites] = useState<string[]>([]);

  // Validation and feedback state
  const [workplaceError, setWorkplaceError] = useState("");
  const [actionError, setActionError] = useState("");
  const [generalError, setGeneralError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState("");

  // Fetch workplaces on mount
  const loadWorkplaces = async () => {
    setIsLoadingWorkplaces(true);
    setWorkplacesError("");
    try {
      const data = await getWorkplaces();
      setWorkplaces(data);
      setOrderedWorkplaces(data);

      // Preselect the last workplace used in the current time period (if any)
      const recentId = await getRecentWorkplaceForCurrentPeriod();
      if (recentId) {
        const recentWp = data.find((wp) => wp.id === recentId);
        if (recentWp) {
          setWorkplace(recentWp.name);
          const others = data.filter((wp) => wp.id !== recentId);
          setOrderedWorkplaces([recentWp, ...others]);
        }
      }
    } catch (error) {
      setWorkplacesError("No fue posible obtener los lugares de trabajo.\n\nPor favor, intente nuevamente.");
    } finally {
      setIsLoadingWorkplaces(false);
    }
  };

  useEffect(() => {
    loadWorkplaces();
    loadFavorites();
  }, []);

  // Load persisted favorites
  const loadFavorites = async () => {
    const stored = await getFavorites();
    setFavorites(stored);
  };

  // Toggle favorite state with immediate visual feedback + persistence
  const handleToggleFavorite = async (workplaceId: string) => {
    const isFav = favorites.includes(workplaceId);
    // Optimistic UI update
    setFavorites((prev) =>
      isFav ? prev.filter((id) => id !== workplaceId) : [...prev, workplaceId]
    );
    // Persist
    if (isFav) {
      await removeFavorite(workplaceId);
    } else {
      await addFavorite(workplaceId);
    }
  };

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
    // Clear previous errors
    setGeneralError("");
    
    // Run validations
    if (!validateForm()) {
      return;
    }
    
    // Set loading state
    setIsLoading(true);
    setLoadingMessage("Obteniendo ubicación...");
    
    let location;
    try {
      // Get current location first (required for registration)
      location = await getCurrentLocation();
    } catch (error) {
      // Handle location errors - cannot proceed without GPS
      setIsLoading(false);
      setLoadingMessage("");
      
      // Show detailed location error message
      setGeneralError("No fue posible obtener su ubicación actual.\n\nVerifique que el GPS esté habilitado e intente nuevamente.\n\nSi el problema persiste o no puede resolverlo, utilice la planilla física de contingencia para registrar su jornada laboral.");
      return;
    }
    
    // Check connectivity before attempting registration
    setLoadingMessage("Verificando conexión...");
    const online = await isOnline();
    
    if (!online) {
      // No internet connection - reject registration
      setIsLoading(false);
      setLoadingMessage("");
      
      // TODO: Implementar almacenamiento offline y sincronización automática en una futura versión.
      setGeneralError("No posee conexión a Internet.\n\nPor favor, conéctese a una red e intente nuevamente.\n\nSi no puede realizar el registro digital, utilice la planilla física de contingencia correspondiente a su lugar de trabajo.");
      return;
    }
    
    // Build request using service types (includes location data)
    const workplace = workplaces.find(wp => wp.name === selectedWorkplace);
    const request: RegisterRequest = {
      workplaceId: workplace?.id || "",
      action: selectedAction!,
      observation: observation || undefined,
      timestamp: new Date().toISOString(),
      latitude: location.latitude,
      longitude: location.longitude,
      accuracy: location.accuracy,
      locationTimestamp: location.timestamp,
    };
    
    console.log("[v0] RegisterRequest:", request);
    
    // Online mode - send to API
    setLoadingMessage("Registrando...");
    
    try {
      const response = await registerEvent(request);
      
      if (response.success) {
        // Remember this workplace for the current time period
        if (workplace?.id) {
          await saveRecentWorkplace(workplace.id);
        }

        // Update working status based on action
        if (selectedAction === "entrada") {
          setWorkingStatus(true);
        } else if (selectedAction === "salida") {
          setWorkingStatus(false);
        }
        
        // Clear observation after successful registration
        setObservation("");
        setMotivoAusencia("");
        
        // Call onRegister to show success screen
        onRegister();
      } else {
        // Handle API error response
        setGeneralError(response.message + "\n\nSi el problema persiste, utilice la planilla física de contingencia.");
      }
      
    } catch (error) {
      // Fallback error handling with clear instructions
      setGeneralError("No fue posible completar el registro debido a un error de comunicación con el servidor.\n\nPor favor, verifique su conexión e intente nuevamente.\n\nSi el problema persiste, utilice la planilla física de contingencia.");
    } finally {
      setIsLoading(false);
      setLoadingMessage("");
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
        <Text className={`font-medium ${isWorking ? "text-[#62882B]" : "text-[#ED701E]"}`}>
          {isWorking ? "En horario laboral" : "Fuera de horario"}
        </Text>
      </View>

      <View className="flex flex-col gap-2 mt-6">
        <Text className="text-sm font-semibold text-[#0F172A]">Lugar de trabajo</Text>

        {isLoadingWorkplaces ? (
          <View className="h-12 w-full rounded-xl border border-[#CBD5E1] bg-white px-4 flex-row items-center gap-2">
            <ActivityIndicator size="small" color="#0D80AE" />
            <Text className="text-gray-400">Cargando lugares de trabajo...</Text>
          </View>
        ) : workplacesError ? (
          <View className="flex flex-col gap-2">
            <View className="bg-red-50 border border-red-200 rounded-xl px-4 py-3">
              <Text className="text-sm text-red-600">{workplacesError}</Text>
            </View>
            <Pressable
              onPress={loadWorkplaces}
              className="h-11 w-full rounded-xl border border-[#0D80AE] bg-white items-center justify-center"
            >
              <Text className="text-sm font-medium text-[#0D80AE]">Reintentar</Text>
            </Pressable>
          </View>
        ) : (
          <Pressable
            onPress={() => setIsDropdownOpen(true)}
            className="h-12 w-full rounded-xl border border-[#CBD5E1] bg-white px-4 flex-row items-center justify-between"
          >
            <Text className={selectedWorkplace ? "text-[#0F172A]" : "text-gray-400"}>
              {selectedWorkplace || "Seleccionar lugar de trabajo"}
            </Text>
            <ChevronDownIcon size={20} color="#9CA3AF" />
          </Pressable>
        )}

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
              renderItem={({ item }) => {
                const isFav = favorites.includes(item.id);
                return (
                  <View className="px-4 py-4 border-b border-[#EDF2F5] flex-row items-center justify-between">
                    <Pressable
                      onPress={() => handleSelectWorkplace(item.name)}
                      className="flex-1 flex-row items-center gap-2"
                    >
                      <Text className="text-sm text-[#0F172A]">{item.name}</Text>
                      {selectedWorkplace === item.name && (
                        <CheckIcon size={16} color="#0D80AE" />
                      )}
                    </Pressable>
                    <Pressable
                      onPress={() => handleToggleFavorite(item.id)}
                      hitSlop={8}
                      className="pl-3"
                      accessibilityLabel={isFav ? "Quitar de favoritos" : "Agregar a favoritos"}
                    >
                      <StarIcon size={20} color="#ED701E" filled={isFav} />
                    </Pressable>
                  </View>
                );
              }}
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

          {/* <Pressable className="h-12 w-full rounded-xl border border-[#CBD5E1] bg-white flex-row items-center justify-center gap-2">
            <AttachIcon size={16} color="#0F172A" />
            <Text className="text-sm font-medium text-[#0F172A]">Adjuntar archivo</Text>
          </Pressable> */}
        </View>
      )}

      <View className="flex-1 min-h-4" />

      {generalError && (
        <View className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 mt-4">
          <Text className="text-sm text-red-600 text-center">{generalError}</Text>
        </View>
      )}

      <Pressable
        onPress={handleSubmit}
        disabled={isLoading}
        className={`h-14 w-full rounded-2xl items-center justify-center mt-4 ${
          isLoading ? "bg-[#0D80AE]/70" : "bg-[#0D80AE]"
        }`}
      >
        {isLoading ? (
          <View className="flex-row items-center gap-2">
            <ActivityIndicator color="#FFFFFF" size="small" />
            <Text className="text-white text-sm font-medium">{loadingMessage}</Text>
          </View>
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
