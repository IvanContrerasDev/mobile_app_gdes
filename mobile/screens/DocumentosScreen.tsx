import { useState } from "react";
import { View, Text, Pressable, ScrollView, Modal, FlatList, Image, ActivityIndicator } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { UploadIcon, CloseIcon, SuccessCheckIcon, CheckIcon } from "../components/Icons";
import { months } from "../constants/data";
import { documentWorkplaces, DocumentUploadRequest } from "../types/document";
import { uploadDocuments } from "../services/uploadDocumentService";
import { isOnline } from "../services/networkService";

export function DocumentosScreen() {
  // Planillas state
  const [showPlanillaModal, setShowPlanillaModal] = useState(false);
  const [showPlanillaSuccess, setShowPlanillaSuccess] = useState(false);
  const [selectedWorkplace, setSelectedWorkplace] = useState("");
  const [showWorkplacePicker, setShowWorkplacePicker] = useState(false);
  const [selectedMonths, setSelectedMonths] = useState<string[]>([]);
  const [showMonthPicker, setShowMonthPicker] = useState(false);
  const [selectedImages, setSelectedImages] = useState<string[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");

  // Documentos state
  const [showDocumentoSuccess, setShowDocumentoSuccess] = useState(false);

  const pickImages = async () => {
    // Request permission
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (status !== "granted") {
      setUploadError("Se requiere permiso para acceder a la galeria de imagenes.");
      return;
    }

    // Launch image picker
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: true,
      quality: 0.8,
    });

    if (!result.canceled && result.assets) {
      const uris = result.assets.map((asset) => asset.uri);
      setSelectedImages((prev) => [...prev, ...uris]);
      setUploadError("");
    }
  };

  const removeImage = (uri: string) => {
    setSelectedImages((prev) => prev.filter((img) => img !== uri));
  };

  const toggleMonth = (month: string) => {
    setSelectedMonths((prev) =>
      prev.includes(month)
        ? prev.filter((m) => m !== month)
        : [...prev, month]
    );
  };

  const resetPlanillaForm = () => {
    setSelectedWorkplace("");
    setSelectedMonths([]);
    setSelectedImages([]);
    setUploadError("");
  };

  const handleUploadPlanilla = async () => {
    setUploadError("");
    setIsUploading(true);

    // Check connectivity
    const online = await isOnline();
    if (!online) {
      setIsUploading(false);
      setUploadError("No posee conexion a Internet.\n\nPara cargar una planilla debe conectarse a una red e intentar nuevamente.");
      return;
    }

    // Build request
    const request: DocumentUploadRequest = {
      workplace: selectedWorkplace,
      months: selectedMonths,
      files: selectedImages,
      uploadedAt: new Date().toISOString(),
    };

    // Upload documents
    const response = await uploadDocuments(request);

    setIsUploading(false);

    if (response.success) {
      setShowPlanillaModal(false);
      resetPlanillaForm();
      setShowPlanillaSuccess(true);
    } else {
      setUploadError(response.message);
    }
  };

  const handleUploadDocumento = () => {
    // Simulate file picker and show success
    setShowDocumentoSuccess(true);
  };

  const canUploadPlanilla = selectedWorkplace !== "" && selectedMonths.length > 0 && selectedImages.length > 0;

  return (
    <View className="flex-1 px-6 pb-4">
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
          <View className="bg-white rounded-2xl w-full max-w-[360px] p-5">
            <View className="flex-row items-center justify-between mb-4">
              <Text className="text-lg font-bold text-[#0F172A]">Subir planilla</Text>
              <Pressable onPress={() => { setShowPlanillaModal(false); resetPlanillaForm(); }}>
                <CloseIcon size={20} color="#9CA3AF" />
              </Pressable>
            </View>

            <ScrollView style={{ maxHeight: 450 }} showsVerticalScrollIndicator={false}>
              <View className="flex flex-col gap-4">
                {/* Workplace Selector */}
                <View className="flex flex-col gap-2">
                  <Text className="text-sm font-medium text-[#0F172A]">Lugar de trabajo *</Text>
                  <Pressable
                    onPress={() => setShowWorkplacePicker(true)}
                    className="h-12 w-full rounded-xl border border-[#CBD5E1] bg-white px-4 flex-row items-center justify-between"
                  >
                    <Text className={selectedWorkplace ? "text-[#0F172A]" : "text-gray-400"}>
                      {selectedWorkplace || "Seleccionar..."}
                    </Text>
                  </Pressable>
                </View>

                {/* Months Multi-select */}
                <View className="flex flex-col gap-2">
                  <Text className="text-sm font-medium text-[#0F172A]">Meses comprendidos *</Text>
                  <Pressable
                    onPress={() => setShowMonthPicker(true)}
                    className="min-h-[48px] w-full rounded-xl border border-[#CBD5E1] bg-white px-4 py-3 flex-row items-center flex-wrap"
                  >
                    {selectedMonths.length > 0 ? (
                      <Text className="text-[#0F172A]">{selectedMonths.join(", ")}</Text>
                    ) : (
                      <Text className="text-gray-400">Seleccionar meses...</Text>
                    )}
                  </Pressable>
                </View>

                {/* Image Selection */}
                <View className="flex flex-col gap-2">
                  <Text className="text-sm font-medium text-[#0F172A]">Imagenes *</Text>
                  <Pressable
                    onPress={pickImages}
                    className="h-12 w-full rounded-xl border border-dashed border-[#0D80AE] bg-[#0D80AE]/5 flex-row items-center justify-center gap-2"
                  >
                    <UploadIcon size={16} color="#0D80AE" />
                    <Text className="text-sm font-medium text-[#0D80AE]">Seleccionar imagenes</Text>
                  </Pressable>

                  {/* Image Previews */}
                  {selectedImages.length > 0 && (
                    <View className="flex-row flex-wrap gap-2 mt-2">
                      {selectedImages.map((uri, index) => (
                        <View key={index} className="relative">
                          <Image
                            source={{ uri }}
                            style={{ width: 70, height: 70, borderRadius: 8 }}
                          />
                          <Pressable
                            onPress={() => removeImage(uri)}
                            className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-red-500 items-center justify-center"
                          >
                            <CloseIcon size={12} color="white" />
                          </Pressable>
                        </View>
                      ))}
                    </View>
                  )}
                  <Text className="text-xs text-gray-400">
                    {selectedImages.length} imagen(es) seleccionada(s)
                  </Text>
                </View>

                {/* Error Message */}
                {uploadError && (
                  <View className="bg-red-50 border border-red-200 rounded-xl px-4 py-3">
                    <Text className="text-sm text-red-600 text-center">{uploadError}</Text>
                  </View>
                )}

                {/* Action Buttons */}
                <View className="flex flex-row gap-3 mt-2">
                  <Pressable
                    onPress={() => { setShowPlanillaModal(false); resetPlanillaForm(); }}
                    className="flex-1 h-12 rounded-xl border border-[#CBD5E1] items-center justify-center"
                  >
                    <Text className="text-sm font-medium text-[#0F172A]">Cancelar</Text>
                  </Pressable>
                  <Pressable
                    onPress={handleUploadPlanilla}
                    disabled={!canUploadPlanilla || isUploading}
                    className={`flex-1 h-12 rounded-xl items-center justify-center ${
                      canUploadPlanilla && !isUploading ? "bg-[#0D80AE]" : "bg-gray-200"
                    }`}
                  >
                    {isUploading ? (
                      <ActivityIndicator color="#FFFFFF" size="small" />
                    ) : (
                      <Text className={`text-sm font-semibold ${canUploadPlanilla ? "text-white" : "text-gray-400"}`}>
                        Subir planilla
                      </Text>
                    )}
                  </Pressable>
                </View>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Workplace Picker Modal */}
      <Modal visible={showWorkplacePicker} transparent animationType="slide">
        <Pressable 
          className="flex-1 bg-black/50 justify-end"
          onPress={() => setShowWorkplacePicker(false)}
        >
          <View className="bg-white rounded-t-2xl max-h-[50%]">
            <View className="p-4 border-b border-[#EDF2F5]">
              <Text className="text-lg font-semibold text-[#0F172A] text-center">
                Seleccionar lugar de trabajo
              </Text>
            </View>
            <FlatList
              data={documentWorkplaces}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <Pressable
                  onPress={() => {
                    setSelectedWorkplace(item.name);
                    setShowWorkplacePicker(false);
                  }}
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

      {/* Month Picker Modal (Multi-select) */}
      <Modal visible={showMonthPicker} transparent animationType="slide">
        <Pressable 
          className="flex-1 bg-black/50 justify-end"
          onPress={() => setShowMonthPicker(false)}
        >
          <View className="bg-white rounded-t-2xl max-h-[60%]">
            <View className="p-4 border-b border-[#EDF2F5] flex-row items-center justify-between">
              <Text className="text-lg font-semibold text-[#0F172A]">
                Seleccionar meses
              </Text>
              <Pressable onPress={() => setShowMonthPicker(false)}>
                <Text className="text-sm font-medium text-[#0D80AE]">Listo</Text>
              </Pressable>
            </View>
            <FlatList
              data={months}
              keyExtractor={(item) => item}
              renderItem={({ item }) => (
                <Pressable
                  onPress={() => toggleMonth(item)}
                  className="px-4 py-4 border-b border-[#EDF2F5] flex-row items-center justify-between"
                >
                  <Text className="text-sm text-[#0F172A]">{item}</Text>
                  {selectedMonths.includes(item) && (
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
              La planilla fue cargada correctamente
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
