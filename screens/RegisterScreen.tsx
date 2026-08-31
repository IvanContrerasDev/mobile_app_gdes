import { useRef, useState } from "react";
import {
  View,
  Text,
  Pressable,
  ScrollView,
  Image,
  Modal,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  type FocusEvent,
} from "react-native";
import { InputWithError } from "../components/InputWithError";
import { ChevronDownIcon, ChevronLeftIcon, CheckIcon } from "../components/Icons";
import { validateEmail, validatePassword, validatePhone, validateLegajo, validateDNI, validateRequired } from "../utils/validations";
import { provincias } from "../constants/data";

interface RegisterScreenProps {
  onRegister: () => void;
  onBack: () => void;
}

export function RegisterScreen({ onRegister, onBack }: RegisterScreenProps) {
  const scrollViewRef = useRef<ScrollView>(null);
  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [telefono, setTelefono] = useState("");
  const [legajo, setLegajo] = useState("");
  const [dni, setDni] = useState("");
  const [domicilio, setDomicilio] = useState("");
  const [site, setSite] = useState("");
  const [fechaNacimiento, setFechaNacimiento] = useState("");
  const [errors, setErrors] = useState<Record<string, string | null>>({});
  const [showSitePicker, setShowSitePicker] = useState(false);

  const keepFocusedFieldVisible = (event: FocusEvent) => {
    const focusedFieldHandle = event.target;

    if (focusedFieldHandle == null) return;

    requestAnimationFrame(() => {
      const scrollResponder = scrollViewRef.current?.getScrollResponder();

      scrollResponder?.scrollResponderScrollNativeHandleToKeyboard(
        focusedFieldHandle,
        24,
        true,
      );
    });
  };

  const handleSubmit = () => {
    const newErrors = {
      nombre: validateRequired(nombre, "Nombre"),
      apellido: validateRequired(apellido, "Apellido"),
      email: validateEmail(email),
      password: validatePassword(password),
      telefono: validatePhone(telefono),
      legajo: validateLegajo(legajo),
      dni: validateDNI(dni),
      domicilio: validateRequired(domicilio, "Domicilio"),
      site: validateRequired(site, "Site"),
      fechaNacimiento: validateRequired(fechaNacimiento, "Fecha de nacimiento"),
    };
    
    setErrors(newErrors);
    
    const hasErrors = Object.values(newErrors).some(error => error !== null);
    if (!hasErrors) {
      onRegister();
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="flex-1"
      keyboardVerticalOffset={0}
    >
      <ScrollView
        ref={scrollViewRef}
        className="flex-1"
        contentContainerStyle={{
          flexGrow: 1,
          paddingHorizontal: 24,
          paddingTop: 24,
          paddingBottom: 24,
        }}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode={Platform.OS === "ios" ? "interactive" : "on-drag"}
        showsVerticalScrollIndicator={false}
      >
      <Pressable
        onPress={onBack}
        accessibilityRole="button"
        accessibilityLabel="Volver al inicio de sesión"
        hitSlop={8}
        className="self-start flex-row items-center gap-1"
      >
        <ChevronLeftIcon size={20} color="#0D80AE" />
        <Text className="text-sm font-medium text-[#0D80AE]">Volver</Text>
      </Pressable>

      <View className="flex flex-col items-center gap-3">
        <View className="w-[100px] h-[100px]">
          <Image
            source={require("../assets/gdes-logo.png")}
            style={{ width: 100, height: 100 }}
            resizeMode="contain"
          />
        </View>
        <Text className="text-xl font-bold text-[#0F172A]">Crear cuenta</Text>
      </View>

      <View className="flex flex-col gap-3 mt-6">
        <InputWithError
          label="Nombre"
          placeholder="Tu nombre"
          value={nombre}
          onChangeText={setNombre}
          error={errors.nombre}
          onFocus={keepFocusedFieldVisible}
        />
        <InputWithError
          label="Apellido"
          placeholder="Tu apellido"
          value={apellido}
          onChangeText={setApellido}
          error={errors.apellido}
          onFocus={keepFocusedFieldVisible}
        />
        <InputWithError
          label="Legajo (solo numeros)"
          placeholder="Ej: 12345"
          value={legajo}
          onChangeText={setLegajo}
          error={errors.legajo}
          keyboardType="numeric"
          onFocus={keepFocusedFieldVisible}
        />
        <InputWithError
          label="DNI (sin puntos ni espacios)"
          placeholder="Ej: 32456789"
          value={dni}
          onChangeText={setDni}
          error={errors.dni}
          keyboardType="numeric"
          onFocus={keepFocusedFieldVisible}
        />
        <InputWithError
          label="Email"
          placeholder="correo@gmail.com"
          value={email}
          onChangeText={setEmail}
          error={errors.email}
          keyboardType="email-address"
          onFocus={keepFocusedFieldVisible}
        />
        <InputWithError
          label="Contraseña"
          placeholder="Crear contraseña"
          value={password}
          onChangeText={setPassword}
          error={errors.password}
          secureTextEntry
          onFocus={keepFocusedFieldVisible}
        />
        <InputWithError
          label="Celular (solo numeros)"
          placeholder="Ej: 1155556666"
          value={telefono}
          onChangeText={setTelefono}
          error={errors.telefono}
          keyboardType="phone-pad"
          onFocus={keepFocusedFieldVisible}
        />
        <InputWithError
          label="Domicilio"
          placeholder="Tu dirección completa"
          value={domicilio}
          onChangeText={setDomicilio}
          error={errors.domicilio}
          onFocus={keepFocusedFieldVisible}
        />
        
        <View className="flex flex-col gap-1">
          <Text className="text-sm font-medium text-[#0F172A]">Provincia</Text>
          <Pressable
            onPress={() => setShowSitePicker(true)}
            className={`h-12 w-full rounded-xl border ${errors.site ? "border-red-500" : "border-[#CBD5E1]"} bg-white px-4 flex-row items-center justify-between`}
          >
            <Text className={site ? "text-[#0F172A]" : "text-gray-400"}>
              {site || "Seleccionar..."}
            </Text>
            <ChevronDownIcon size={20} color="#9CA3AF" />
          </Pressable>
          {errors.site && <Text className="text-xs text-red-500 mt-1">{errors.site}</Text>}
        </View>

        {/* Province Picker Modal */}
        <Modal visible={showSitePicker} transparent animationType="slide">
          <Pressable 
            className="flex-1 bg-black/50 justify-end"
            onPress={() => setShowSitePicker(false)}
          >
            <View className="bg-white rounded-t-2xl max-h-[60%]">
              <View className="p-4 border-b border-[#EDF2F5]">
                <Text className="text-lg font-semibold text-[#0F172A] text-center">
                  Seleccionar provincia
                </Text>
              </View>
              <FlatList
                data={provincias}
                keyExtractor={(item) => item}
                renderItem={({ item }) => (
                  <Pressable
                    onPress={() => {
                      setSite(item);
                      setShowSitePicker(false);
                    }}
                    className="px-4 py-4 border-b border-[#EDF2F5] flex-row items-center justify-between"
                  >
                    <Text className="text-sm text-[#0F172A]">{item}</Text>
                    {site === item && (
                      <CheckIcon size={16} color="#0D80AE" />
                    )}
                  </Pressable>
                )}
              />
            </View>
          </Pressable>
        </Modal>

        <InputWithError
          label="Fecha de nacimiento"
          placeholder="DD/MM/AAAA"
          value={fechaNacimiento}
          onChangeText={setFechaNacimiento}
          error={errors.fechaNacimiento}
          onFocus={keepFocusedFieldVisible}
        />

        <Pressable
          onPress={handleSubmit}
          className="h-14 w-full rounded-xl bg-[#0D80AE] items-center justify-center mt-2"
        >
          <Text className="text-white text-base font-semibold">Registrarse</Text>
        </Pressable>

        <View className="flex flex-row justify-center pb-4">
          <Text className="text-sm text-gray-400">Ya tiene cuenta? </Text>
          <Pressable onPress={onBack}>
            <Text className="text-sm font-medium text-[#0D80AE]">Iniciar sesión</Text>
          </Pressable>
        </View>
      </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
