import { useState } from "react";
import { View, Text, Pressable, ScrollView, Modal, FlatList } from "react-native";
import { UploadIcon, DocumentIcon, CloseIcon, AttachIcon, SuccessCheckIcon, CheckIcon } from "../components/Icons";
import { documents, months } from "../constants/data";

// Mock personal documents data
const personalDocuments = [
  { id: "p1", name: "DNI_frente.jpg", date: "10 Ene 2024", status: "Cargado" },
  { id: "p2", name: "DNI_dorso.jpg", date: "10 Ene 2024", status: "Cargado" },
  { id: "p3", name: "Certificado_estudios.pdf", date: "15 Feb 2024", status: "Pendiente" },
];

export function DocumentosScreen() {
  // Planillas state
  const [showPlanillaModal, setShowPlanillaModal] = useState(false);
  const [showPlanillaSuccess, setShowPlanillaSuccess] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState("");
  const [showMonthPicker, setShowMonthPicker] = useState(false);
  const [planillaFileAttached, setPlanillaFileAttached] = useState(false);

  // Personal documents state
  const [showDocumentoModal, setShowDocumentoModal] = useState(false);
  const [showDocumentoSuccess, setShowDocumentoSuccess] = useState(false);
  const [documentosAttached, setDocumentosAttached] = useState<string[]>([]);

  // Group planillas by month
  const groupedDocuments = documents.reduce((acc, doc) => {
    if (!acc[doc.month]) {
      acc[doc.month] = [];
    }
    acc[doc.month].push(doc);
    return acc;
  }, {} as Record<string, typeof documents>);

  const handleUploadPlanilla = () => {
    setShowPlanillaModal(false);
    setSelectedMonth("");
    setPlanillaFileAttached(false);
    setShowPlanillaSuccess(true);
  };

  const handleUploadDocumento = () => {
    setShowDocumentoModal(false);
    setDocumentosAttached([]);
    setShowDocumentoSuccess(true);
  };

  const canUploadPlanilla = selectedMonth !== "" && planillaFileAttached;
  const canUploadDocumento = documentosAttached.length > 0;

  const simulateFileSelection = () => {
    // Simulate selecting multiple files
    setDocumentosAttached(["documento1.pdf", "documento2.jpg"]);
  };

  return (
    <View className="flex-1 px-6 pb-4">
      <Text className="text-xl font-bold text-[#0F172A] mt-4">Documentos</Text>
      
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* SECTION 1: PLANILLAS */}
        <View className="mt-6">
          <Text className="text-base font-semibold text-[#0F172A] mb-3">Planillas</Text>
          
          <Pressable
            onPress={() => setShowPlanillaModal(true)}
            className="h-14 w-full rounded-2xl bg-[#0D80AE] flex-row items-center justify-center gap-2"
          >
            <UploadIcon size={20} color="white" />
            <Text className="text-white text-base font-semibold">Subir planilla</Text>
          </Pressable>
          <Text className="text-sm text-gray-400 text-center mt-2">
            Subi fotos de planillas fisicas
          </Text>

          {/* Planillas list grouped by month */}
          <View className="mt-4">
            {Object.entries(groupedDocuments).map(([month, docs]) => (
              <View key={month} className="mb-4">
                <Text className="text-sm font-semibold text-[#0F172A] mb-2">{month}</Text>
                
                <View className="flex flex-col gap-2">
                  {docs.map((doc) => (
                    <View
                      key={doc.id}
                      className="flex-row items-center gap-3 p-3 rounded-xl border border-[#CBD5E1] bg-white"
                    >
                      <View className="w-10 h-10 rounded-lg bg-[#EDF2F5] items-center justify-center">
                        <DocumentIcon size={20} color="#0D80AE" />
                      </View>
                      
                      <View className="flex-1">
                        <Text className="text-sm font-medium text-[#0F172A]" numberOfLines={1}>{doc.name}</Text>
                        <Text className="text-xs text-gray-400">{doc.date}</Text>
                      </View>
                      
                      <View
                        className={`px-2 py-1 rounded-full ${
                          doc.status === "Cargado"
                            ? "bg-[#62882B]/10"
                            : "bg-[#ED701E]/10"
                        }`}
                      >
                        <Text
                          className={`text-xs font-medium ${
                            doc.status === "Cargado"
                              ? "text-[#62882B]"
                              : "text-[#ED701E]"
                          }`}
                        >
                          {doc.status}
                        </Text>
                      </View>
                    </View>
                  ))}
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* SECTION 2: DOCUMENTOS PERSONALES */}
        <View className="mt-6 mb-8">
          <Text className="text-base font-semibold text-[#0F172A] mb-3">Documentos personales</Text>
          
          <Pressable
            onPress={() => setShowDocumentoModal(true)}
            className="h-14 w-full rounded-2xl bg-[#0D80AE] flex-row items-center justify-center gap-2"
          >
            <UploadIcon size={20} color="white" />
            <Text className="text-white text-base font-semibold">Subir documento</Text>
          </Pressable>
          <Text className="text-sm text-gray-400 text-center mt-2">
            Subi documentacion personal para tu legajo
          </Text>

          {/* Personal documents list */}
          <View className="mt-4 flex flex-col gap-2">
            {personalDocuments.map((doc) => (
              <View
                key={doc.id}
                className="flex-row items-center gap-3 p-3 rounded-xl border border-[#CBD5E1] bg-white"
              >
                <View className="w-10 h-10 rounded-lg bg-[#EDF2F5] items-center justify-center">
                  <DocumentIcon size={20} color="#0D80AE" />
                </View>
                
                <View className="flex-1">
                  <Text className="text-sm font-medium text-[#0F172A]" numberOfLines={1}>{doc.name}</Text>
                  <Text className="text-xs text-gray-400">{doc.date}</Text>
                </View>
                
                <View
                  className={`px-2 py-1 rounded-full ${
                    doc.status === "Cargado"
                      ? "bg-[#62882B]/10"
                      : "bg-[#ED701E]/10"
                  }`}
                >
                  <Text
                    className={`text-xs font-medium ${
                      doc.status === "Cargado"
                        ? "text-[#62882B]"
                        : "text-[#ED701E]"
                    }`}
                  >
                    {doc.status}
                  </Text>
                </View>
              </View>
            ))}
          </View>
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

      {/* Upload Documento Personal Modal */}
      <Modal visible={showDocumentoModal} transparent animationType="fade">
        <View className="flex-1 bg-black/50 items-center justify-center px-4">
          <View className="bg-white rounded-2xl w-full max-w-[340px] p-6">
            <View className="flex-row items-center justify-between mb-4">
              <Text className="text-lg font-bold text-[#0F172A]">Subir documento</Text>
              <Pressable onPress={() => setShowDocumentoModal(false)}>
                <CloseIcon size={20} color="#9CA3AF" />
              </Pressable>
            </View>

            <View className="flex flex-col gap-4">
              <Text className="text-sm text-gray-500">
                Selecciona uno o mas archivos (imagenes, PDF, documentos)
              </Text>

              <View className="flex flex-col gap-2">
                <Pressable
                  onPress={simulateFileSelection}
                  className={`h-12 w-full rounded-xl border flex-row items-center justify-center gap-2 ${
                    documentosAttached.length > 0
                      ? "border-[#62882B] bg-[#62882B]/10"
                      : "border-[#CBD5E1] bg-white"
                  }`}
                >
                  <AttachIcon size={16} color={documentosAttached.length > 0 ? "#62882B" : "#0F172A"} />
                  <Text className={`text-sm font-medium ${documentosAttached.length > 0 ? "text-[#62882B]" : "text-[#0F172A]"}`}>
                    {documentosAttached.length > 0 
                      ? `${documentosAttached.length} archivo(s) seleccionado(s)` 
                      : "Seleccionar archivos"}
                  </Text>
                </Pressable>
              </View>

              {documentosAttached.length > 0 && (
                <View className="flex flex-col gap-1">
                  {documentosAttached.map((file, index) => (
                    <Text key={index} className="text-xs text-gray-400">• {file}</Text>
                  ))}
                </View>
              )}

              <View className="flex flex-row gap-3 mt-2">
                <Pressable
                  onPress={() => {
                    setShowDocumentoModal(false);
                    setDocumentosAttached([]);
                  }}
                  className="flex-1 h-12 rounded-xl border border-[#CBD5E1] items-center justify-center"
                >
                  <Text className="text-sm font-medium text-[#0F172A]">Cancelar</Text>
                </Pressable>
                <Pressable
                  onPress={handleUploadDocumento}
                  disabled={!canUploadDocumento}
                  className={`flex-1 h-12 rounded-xl items-center justify-center ${
                    canUploadDocumento ? "bg-[#0D80AE]" : "bg-gray-200"
                  }`}
                >
                  <Text className={`text-sm font-semibold ${canUploadDocumento ? "text-white" : "text-gray-400"}`}>
                    Subir documento
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
