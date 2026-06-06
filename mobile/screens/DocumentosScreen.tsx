import { useState } from "react";
import { View, Text, Pressable, ScrollView, Modal, FlatList } from "react-native";
import { UploadIcon, CloseIcon, AttachIcon, SuccessCheckIcon, CheckIcon } from "../components/Icons";
import { months } from "../constants/data";

export function DocumentosScreen() {
  // Planillas state
  const [showPlanillaModal, setShowPlanillaModal] = useState(false);
  const [showPlanillaSuccess, setShowPlanillaSuccess] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState("");
  const [showMonthPicker, setShowMonthPicker] = useState(false);
  const [planillaFileAttached, setPlanillaFileAttached] = useState(false);

  // Documentos state
  const [showDocumentoSuccess, setShowDocumentoSuccess] = useState(false);

  const handleUploadPlanilla = () => {
    setShowPlanillaModal(false);
    setSelectedMonth("");
    setPlanillaFileAttached(false);
    setShowPlanillaSuccess(true);
  };

  const handleUploadDocumento = () => {
    // Simulate file picker and show success
    setShowDocumentoSuccess(true);
  };

  const canUploadPlanilla = selectedMonth !== "" && planillaFileAttached;

  return (
    <View className="flex-1 pt-10 px-6 pb-4">

      {/* Add empty view to balance the header spacing since we removed the profile icon */}
      <View className="h-14"></View>

      <Text className="text-xl font-bold text-[#0F172A] mt-4">Documentos</Text>
      
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* SECTION 1: PLANILLAS */}
        <View className="mt-16">
          <Text className="text-lg font-bold text-[#0F172A] mb-3">Planillas</Text>
          
          <Pressable
            onPress={() => setShowPlanillaModal(true)}
            className="h-12 rounded-xl bg-[#0D80AE] flex-row items-center justify-center gap-2"
            style={{ width: 200 }}
          >
            <UploadIcon size={18} color="white" />
            <Text className="text-white text-base font-semibold">Subir planilla</Text>
          </Pressable>
        </View>

        {/* SECTION 2: DOCUMENTOS */}
        <View className="mt-12">
          <Text className="text-lg font-bold text-[#0F172A] mb-3">Documentos</Text>
          
          <Pressable
            onPress={handleUploadDocumento}
            className="h-12 rounded-xl bg-[#0D80AE] flex-row items-center justify-center gap-2"
            style={{ width: 200 }}
          >
            <UploadIcon size={18} color="white" />
            <Text className="text-white text-base font-semibold">Subir documentos</Text>
          </Pressable>
        </View>
      </ScrollView>

      {/* Upload Planilla Modal */}
      <Modal visible={showPlanillaModal} transparent animationType="fade">
        <View className="flex-1 bg-black/50 items-center justify-center px-4">
          <View className="bg-white rounded-2xl w-full max-w-[340px] p-6">
            <View className="flex-row items-center justify-between mb-4">
              <Text className="text-lg font-bold text-[#0F172A]">Subir planilla</Text>
              <Pressable onPress={() => setShowPlanillaModal(false)}>
                <CloseIcon size={20} color="#9CA3AF" />
              </Pressable>
            </View>

            <View className="flex flex-col gap-4">
              <View className="flex flex-col gap-2">
                <Text className="text-sm font-medium text-[#0F172A]">Seleccionar mes</Text>
                <Pressable
                  onPress={() => setShowMonthPicker(true)}
                  className="h-12 w-full rounded-xl border border-[#CBD5E1] bg-white px-4 flex-row items-center justify-between"
                >
                  <Text className={selectedMonth ? "text-[#0F172A]" : "text-gray-400"}>
                    {selectedMonth || "Seleccionar..."}
                  </Text>
                </Pressable>
              </View>

              <View className="flex flex-col gap-2">
                <Text className="text-sm font-medium text-[#0F172A]">Archivo</Text>
                <Pressable
                  onPress={() => setPlanillaFileAttached(true)}
                  className={`h-12 w-full rounded-xl border flex-row items-center justify-center gap-2 ${
                    planillaFileAttached
                      ? "border-[#62882B] bg-[#62882B]/10"
                      : "border-[#CBD5E1] bg-white"
                  }`}
                >
                  <AttachIcon size={16} color={planillaFileAttached ? "#62882B" : "#0F172A"} />
                  <Text className={`text-sm font-medium ${planillaFileAttached ? "text-[#62882B]" : "text-[#0F172A]"}`}>
                    {planillaFileAttached ? "Archivo adjunto" : "Adjuntar archivo"}
                  </Text>
                </Pressable>
              </View>

              {selectedMonth && planillaFileAttached && (
                <Text className="text-xs text-gray-400 text-center">
                  Se guardara como: planilla_{selectedMonth.toLowerCase()}_XX.jpg
                </Text>
              )}

              <View className="flex flex-row gap-3 mt-2">
                <Pressable
                  onPress={() => setShowPlanillaModal(false)}
                  className="flex-1 h-12 rounded-xl border border-[#CBD5E1] items-center justify-center"
                >
                  <Text className="text-sm font-medium text-[#0F172A]">Cancelar</Text>
                </Pressable>
                <Pressable
                  onPress={handleUploadPlanilla}
                  disabled={!canUploadPlanilla}
                  className={`flex-1 h-12 rounded-xl items-center justify-center ${
                    canUploadPlanilla ? "bg-[#0D80AE]" : "bg-gray-200"
                  }`}
                >
                  <Text className={`text-sm font-semibold ${canUploadPlanilla ? "text-white" : "text-gray-400"}`}>
                    Subir planilla
                  </Text>
                </Pressable>
              </View>
            </View>
          </View>
        </View>
      </Modal>

      {/* Month Picker Modal */}
      <Modal visible={showMonthPicker} transparent animationType="slide">
        <Pressable 
          className="flex-1 bg-black/50 justify-end"
          onPress={() => setShowMonthPicker(false)}
        >
          <View className="bg-white rounded-t-2xl max-h-[60%]">
            <View className="p-4 border-b border-[#EDF2F5]">
              <Text className="text-lg font-semibold text-[#0F172A] text-center">
                Seleccionar mes
              </Text>
            </View>
            <FlatList
              data={months}
              keyExtractor={(item) => item}
              renderItem={({ item }) => (
                <Pressable
                  onPress={() => {
                    setSelectedMonth(item);
                    setShowMonthPicker(false);
                  }}
                  className="px-4 py-4 border-b border-[#EDF2F5] flex-row items-center justify-between"
                >
                  <Text className="text-sm text-[#0F172A]">{item}</Text>
                  {selectedMonth === item && (
                    <CheckIcon size={16} color="#0D80AE" />
                  )}
                </Pressable>
              )}
            />
          </View>
        </Pressable>
      </Modal>

      {/* Planilla Success Modal */}
      <Modal visible={showPlanillaSuccess} transparent animationType="fade">
        <View className="flex-1 bg-black/50 items-center justify-center px-4">
          <View className="bg-white rounded-2xl w-full max-w-[340px] p-6 items-center gap-4">
            <SuccessCheckIcon size={64} />
            <Text className="text-lg font-bold text-[#62882B] text-center">
              Archivos subidos correctamente
            </Text>
            <Pressable
              onPress={() => setShowPlanillaSuccess(false)}
              className="h-12 w-full rounded-xl bg-[#0D80AE] items-center justify-center"
            >
              <Text className="text-white text-base font-semibold">Continuar</Text>
            </Pressable>
          </View>
        </View>
      </Modal>

      {/* Documento Success Modal */}
      <Modal visible={showDocumentoSuccess} transparent animationType="fade">
        <View className="flex-1 bg-black/50 items-center justify-center px-4">
          <View className="bg-white rounded-2xl w-full max-w-[340px] p-6 items-center gap-4">
            <SuccessCheckIcon size={64} />
            <Text className="text-lg font-bold text-[#62882B] text-center">
              Archivos subidos correctamente
            </Text>
            <Pressable
              onPress={() => setShowDocumentoSuccess(false)}
              className="h-12 w-full rounded-xl bg-[#0D80AE] items-center justify-center"
            >
              <Text className="text-white text-base font-semibold">Continuar</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </View>
  );
}
