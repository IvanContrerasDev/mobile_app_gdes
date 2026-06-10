import { useState } from "react";
import { View, Text, Pressable, ScrollView, Modal, FlatList, Image, ActivityIndicator } from "react-native";
import * as ImagePicker from "expo-image-picker";
import * as DocumentPicker from "expo-document-picker";
import { UploadIcon, CloseIcon, SuccessCheckIcon, CheckIcon } from "../components/Icons";
import { documentWorkplaces, DocumentUploadRequest, SelectedFile, ALLOWED_EXTENSIONS, ContingencyUploadRequest } from "../types/document";
import { uploadDocuments as uploadPlanilla } from "../services/uploadDocumentService";
import { uploadDocuments } from "../services/documentService";
import { isOnline } from "../services/networkService";

// Format a byte size into a human readable string.
function formatFileSize(bytes: number): string {
  if (!bytes || bytes <= 0) return "0 KB";
  const kb = bytes / 1024;
  if (kb < 1024) return `${kb.toFixed(0)} KB`;
  return `${(kb / 1024).toFixed(1)} MB`;
}

// Extract a lowercase extension from a file name.
function getExtension(name: string): string {
  const parts = name.split(".");
  return parts.length > 1 ? parts[parts.length - 1].toLowerCase() : "";
}

function isAllowedExtension(ext: string): boolean {
  return (ALLOWED_EXTENSIONS as readonly string[]).includes(ext);
}

export function DocumentosScreen() {
  // Planillas state
  const [showPlanillaModal, setShowPlanillaModal] = useState(false);
  const [showPlanillaSuccess, setShowPlanillaSuccess] = useState(false);
  const [selectedWorkplace, setSelectedWorkplace] = useState("");
  const [showWorkplacePicker, setShowWorkplacePicker] = useState(false);
  const [selectedImages, setSelectedImages] = useState<string[]>([]);
  const [showImageOptions, setShowImageOptions] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");

  // Contingency documents state
  const [showDocModal, setShowDocModal] = useState(false);
  const [showDocSuccess, setShowDocSuccess] = useState(false);
  const [docFiles, setDocFiles] = useState<SelectedFile[]>([]);
  const [showDocFileOptions, setShowDocFileOptions] = useState(false);
  const [isUploadingDoc, setIsUploadingDoc] = useState(false);
  const [docError, setDocError] = useState("");

  // ---------- Planilla handlers (existing) ----------
  const takePhoto = async () => {
    setShowImageOptions(false);
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== "granted") {
      setUploadError("Se requiere permiso para acceder a la camara.");
      return;
    }
    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.8,
    });
    if (!result.canceled && result.assets) {
      const uris = result.assets.map((asset) => asset.uri);
      setSelectedImages((prev) => [...prev, ...uris]);
      setUploadError("");
    }
  };

  const pickImages = async () => {
    setShowImageOptions(false);
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      setUploadError("Se requiere permiso para acceder a la galeria de imagenes.");
      return;
    }
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

  const resetPlanillaForm = () => {
    setSelectedWorkplace("");
    setSelectedImages([]);
    setUploadError("");
  };

  const handleUploadPlanilla = async () => {
    setUploadError("");
    setIsUploading(true);
    const online = await isOnline();
    if (!online) {
      setIsUploading(false);
      setUploadError("No posee conexion a Internet.\n\nPara cargar una planilla debe conectarse a una red e intentar nuevamente.");
      return;
    }
    const request: DocumentUploadRequest = {
      workplace: selectedWorkplace,
      months: [],
      files: selectedImages,
      uploadedAt: new Date().toISOString(),
    };
    const response = await uploadPlanilla(request);
    setIsUploading(false);
    if (response.success) {
      setShowPlanillaModal(false);
      resetPlanillaForm();
      setShowPlanillaSuccess(true);
    } else {
      setUploadError(response.message);
    }
  };

  const canUploadPlanilla = selectedImages.length > 0;

  // ---------- Contingency document handlers ----------
  const openDocModal = () => {
    setShowDocModal(true);
  };

  // Select a document/file from gallery or storage.
  const pickDocFile = async () => {
    setShowDocFileOptions(false);
    const result = await DocumentPicker.getDocumentAsync({
      type: [
        "application/pdf",
        "image/jpeg",
        "image/png",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "text/plain",
      ],
      multiple: true,
      copyToCacheDirectory: true,
    });

    if (result.canceled || !result.assets) return;

    const validFiles: SelectedFile[] = [];
    let hasInvalid = false;

    for (const asset of result.assets) {
      const ext = getExtension(asset.name);
      if (!isAllowedExtension(ext)) {
        hasInvalid = true;
        continue;
      }
      validFiles.push({
        uri: asset.uri,
        name: asset.name,
        type: ext,
        size: asset.size ?? 0,
      });
    }

    if (validFiles.length > 0) {
      setDocFiles((prev) => [...prev, ...validFiles]);
      setDocError("");
    }
    if (hasInvalid) {
      setDocError("Algunos archivos no son validos. Permitidos: PDF, JPG, JPEG, PNG, DOCX, DOC, TXT.");
    }
  };

  // Take a photo with the camera and add it to the file list.
  const takeDocPhoto = async () => {
    setShowDocFileOptions(false);
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== "granted") {
      setDocError("Se requiere permiso para acceder a la camara.");
      return;
    }
    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.8,
    });
    if (!result.canceled && result.assets && result.assets.length > 0) {
      const asset = result.assets[0];
      const fileName = `foto-${Date.now()}.jpg`;
      setDocFiles((prev) => [
        ...prev,
        {
          uri: asset.uri,
          name: fileName,
          type: "jpg",
          size: asset.fileSize ?? 0,
        },
      ]);
      setDocError("");
    }
  };

  const removeDocFile = (uri: string) => {
    setDocFiles((prev) => prev.filter((f) => f.uri !== uri));
  };

  const resetDocForm = () => {
    setDocFiles([]);
    setDocError("");
  };

  const handleUploadDoc = async () => {
    setDocError("");

    // Validation: at least one file required.
    if (docFiles.length === 0) {
      setDocError("Debe seleccionar al menos un archivo.");
      return;
    }

    setIsUploadingDoc(true);

    // Connectivity check before uploading.
    const online = await isOnline();
    if (!online) {
      setIsUploadingDoc(false);
      setDocError("No posee conexion a Internet.\n\nPara enviar documentacion debe conectarse a una red e intentar nuevamente.\n\nSi necesita registrar asistencia utilice la planilla fisica de contingencia.");
      return;
    }

    const request: ContingencyUploadRequest = {
      workplaceId: null,
      files: docFiles,
      uploadedAt: new Date().toISOString(),
    };

    const response = await uploadDocuments(request);
    setIsUploadingDoc(false);

    if (response.success) {
      setShowDocModal(false);
      resetDocForm();
      setShowDocSuccess(true);
    } else {
      setDocError(response.message);
    }
  };

  return (
    <View className="flex-1 pt-10 px-6 pb-4">
      <View className="h-14" />

      <Text className="text-xl font-bold text-[#0F172A] mt-4">Documentos</Text>

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* SECTION 1: PLANILLAS */}
        <View className="mt-16">
          <Text className="text-lg font-bold text-[#0F172A] mb-1">Planillas</Text>
          <Text className="text-sm text-gray-500 mb-3">
            Suba una foto de la planilla utilizada cuando no pudo registrar su ingreso o salida desde la aplicación.
          </Text>
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
          <Text className="text-lg font-bold text-[#0F172A] mb-1">Documentos</Text>
          <Text className="text-sm text-gray-500 mb-3">
            Cargar documentos que serán almacenados en su legajo de empleado.
          </Text>
          <Pressable
            onPress={openDocModal}
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
                <View className="flex flex-col gap-2">
                  <Text className="text-sm font-medium text-[#0F172A]">Lugar de trabajo</Text>
                  <Pressable
                    onPress={() => setShowWorkplacePicker(true)}
                    className="h-12 w-full rounded-xl border border-[#CBD5E1] bg-white px-4 flex-row items-center justify-between"
                  >
                    <Text className={selectedWorkplace ? "text-[#0F172A]" : "text-gray-400"}>
                      {selectedWorkplace || "Seleccionar..."}
                    </Text>
                  </Pressable>
                </View>

                <View className="flex flex-col gap-2">
                  <Text className="text-sm font-medium text-[#0F172A]">Imagenes *</Text>
                  <Pressable
                    onPress={() => setShowImageOptions(true)}
                    className="h-12 w-full rounded-xl border border-dashed border-[#0D80AE] bg-[#0D80AE]/5 flex-row items-center justify-center gap-2"
                  >
                    <UploadIcon size={16} color="#0D80AE" />
                    <Text className="text-sm font-medium text-[#0D80AE]">Seleccionar imagenes</Text>
                  </Pressable>

                  {selectedImages.length > 0 && (
                    <View className="flex-row flex-wrap gap-2 mt-2">
                      {selectedImages.map((uri, index) => (
                        <View key={index} className="relative">
                          <Image source={{ uri }} style={{ width: 70, height: 70, borderRadius: 8 }} />
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

                {uploadError && (
                  <View className="bg-red-50 border border-red-200 rounded-xl px-4 py-3">
                    <Text className="text-sm text-red-600 text-center">{uploadError}</Text>
                  </View>
                )}

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

      {/* Planilla Workplace Picker Modal */}
      <Modal visible={showWorkplacePicker} transparent animationType="slide">
        <Pressable className="flex-1 bg-black/50 justify-end" onPress={() => setShowWorkplacePicker(false)}>
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
                  {selectedWorkplace === item.name && <CheckIcon size={16} color="#0D80AE" />}
                </Pressable>
              )}
            />
          </View>
        </Pressable>
      </Modal>

      {/* Planilla Image Options Action Sheet */}
      <Modal visible={showImageOptions} transparent animationType="slide">
        <Pressable className="flex-1 bg-black/50 justify-end" onPress={() => setShowImageOptions(false)}>
          <View className="bg-white rounded-t-2xl p-4 pb-8">
            <View className="p-2 border-b border-[#EDF2F5]">
              <Text className="text-base font-semibold text-[#0F172A] text-center">Agregar imagen</Text>
            </View>
            <Pressable onPress={takePhoto} className="py-4 border-b border-[#EDF2F5] items-center">
              <Text className="text-base text-[#0D80AE] font-medium">Tomar foto</Text>
            </Pressable>
            <Pressable onPress={pickImages} className="py-4 border-b border-[#EDF2F5] items-center">
              <Text className="text-base text-[#0D80AE] font-medium">Elegir desde galeria</Text>
            </Pressable>
            <Pressable onPress={() => setShowImageOptions(false)} className="py-4 items-center">
              <Text className="text-base text-[#9CA3AF] font-medium">Cancelar</Text>
            </Pressable>
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

      {/* Upload Documentos Modal */}
      <Modal visible={showDocModal} transparent animationType="fade">
        <View className="flex-1 bg-black/50 items-center justify-center px-4">
          <View className="bg-white rounded-2xl w-full max-w-[360px] p-5">
            <View className="flex-row items-center justify-between mb-4">
              <Text className="text-lg font-bold text-[#0F172A]">Subir documentos</Text>
              <Pressable onPress={() => { setShowDocModal(false); resetDocForm(); }}>
                <CloseIcon size={20} color="#9CA3AF" />
              </Pressable>
            </View>

            <ScrollView style={{ maxHeight: 480 }} showsVerticalScrollIndicator={false}>
              <View className="flex flex-col gap-4">
                {/* File selection */}
                <View className="flex flex-col gap-2">
                  <Pressable
                    onPress={() => setShowDocFileOptions(true)}
                    className="h-12 w-full rounded-xl border border-dashed border-[#0D80AE] bg-[#0D80AE]/5 flex-row items-center justify-center gap-2"
                  >
                    <UploadIcon size={16} color="#0D80AE" />
                    <Text className="text-sm font-medium text-[#0D80AE]">Agregar archivo</Text>
                  </Pressable>
                  <Text className="text-xs text-gray-400">
                    Permitidos: PDF, JPG, JPEG, PNG, DOCX, DOC, TXT
                  </Text>
                </View>

                {/* Selected files list */}
                {docFiles.length > 0 && (
                  <View className="flex flex-col gap-2">
                    {docFiles.map((file) => (
                      <View
                        key={file.uri}
                        className="flex-row items-center justify-between rounded-xl border border-[#EDF2F5] bg-[#F8FAFC] px-3 py-2"
                      >
                        <View className="flex-1 pr-2">
                          <Text className="text-sm font-medium text-[#0F172A]" numberOfLines={1}>
                            {file.name}
                          </Text>
                          <Text className="text-xs text-gray-500">
                            {file.type.toUpperCase()} · {formatFileSize(file.size)}
                          </Text>
                        </View>
                        <Pressable
                          onPress={() => removeDocFile(file.uri)}
                          className="px-3 py-1.5 rounded-lg bg-red-50"
                        >
                          <Text className="text-xs font-medium text-red-600">Eliminar</Text>
                        </Pressable>
                      </View>
                    ))}
                  </View>
                )}

                {/* Error message */}
                {docError && (
                  <View className="bg-red-50 border border-red-200 rounded-xl px-4 py-3">
                    <Text className="text-sm text-red-600 text-center">{docError}</Text>
                  </View>
                )}

                {/* Action buttons */}
                <View className="flex flex-row gap-3 mt-2">
                  <Pressable
                    onPress={() => { setShowDocModal(false); resetDocForm(); }}
                    className="flex-1 h-12 rounded-xl border border-[#CBD5E1] items-center justify-center"
                  >
                    <Text className="text-sm font-medium text-[#0F172A]">Cancelar</Text>
                  </Pressable>
                  <Pressable
                    onPress={handleUploadDoc}
                    disabled={isUploadingDoc}
                    className={`flex-1 h-12 rounded-xl items-center justify-center ${
                      !isUploadingDoc ? "bg-[#0D80AE]" : "bg-gray-200"
                    }`}
                  >
                    {isUploadingDoc ? (
                      <ActivityIndicator color="#FFFFFF" size="small" />
                    ) : (
                      <Text className="text-sm font-semibold text-white">Enviar</Text>
                    )}
                  </Pressable>
                </View>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Documentos File Options Action Sheet */}
      <Modal visible={showDocFileOptions} transparent animationType="slide">
        <Pressable className="flex-1 bg-black/50 justify-end" onPress={() => setShowDocFileOptions(false)}>
          <View className="bg-white rounded-t-2xl p-4 pb-8">
            <View className="p-2 border-b border-[#EDF2F5]">
              <Text className="text-base font-semibold text-[#0F172A] text-center">Agregar archivo</Text>
            </View>
            <Pressable onPress={pickDocFile} className="py-4 border-b border-[#EDF2F5] items-center">
              <Text className="text-base text-[#0D80AE] font-medium">Seleccionar archivo</Text>
            </Pressable>
            <Pressable onPress={takeDocPhoto} className="py-4 border-b border-[#EDF2F5] items-center">
              <Text className="text-base text-[#0D80AE] font-medium">Tomar foto</Text>
            </Pressable>
            <Pressable onPress={() => setShowDocFileOptions(false)} className="py-4 items-center">
              <Text className="text-base text-[#9CA3AF] font-medium">Cancelar</Text>
            </Pressable>
          </View>
        </Pressable>
      </Modal>

      {/* Documentos Success Modal */}
      <Modal visible={showDocSuccess} transparent animationType="fade">
        <View className="flex-1 bg-black/50 items-center justify-center px-4">
          <View className="bg-white rounded-2xl w-full max-w-[340px] p-6 items-center gap-4">
            <SuccessCheckIcon size={64} />
            <Text className="text-lg font-bold text-[#62882B] text-center">
              Documentación enviada correctamente.
            </Text>
            <Pressable
              onPress={() => setShowDocSuccess(false)}
              className="h-12 w-full rounded-xl bg-[#0D80AE] items-center justify-center"
            >
              <Text className="text-white text-base font-semibold">Volver</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </View>
  );
}
