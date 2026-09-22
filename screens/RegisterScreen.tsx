import { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  Pressable,
  ScrollView,
  Image,
  Modal,
  FlatList,
  Keyboard,
  InputAccessoryView,
  Platform,
  type TextInput,
  type TextInputProps,
} from "react-native";
import { useKeyboardFormScroll } from "../components/useKeyboardFormScroll";
import { formatBirthDate, validateBirthDate, validatePasswordConfirmation } from "../utils/registration";
import { InputWithError } from "../components/InputWithError";
import { ChevronDownIcon, ChevronLeftIcon, CheckIcon, EyeIcon } from "../components/Icons";
import { validateEmail, validatePassword, validatePhone, validateLegajo, validateDNI, validateRequired } from "../utils/validations";
import { provincias } from "../constants/data";

interface RegisterScreenProps {
  onRegister: () => void;
  onBack: () => void;
}

export function RegisterScreen({ onRegister, onBack }: RegisterScreenProps) {
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

  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmationVisible, setConfirmationVisible] = useState(false);
  const [keyboardNext, setKeyboardNext] = useState<string | undefined>();
  const inputRefs = useRef<Record<string, TextInput | null>>({});
  const focusDateAfterPicker = useRef(false);
  const { scrollViewRef, bottomOverlap, ensureVisible, onFocus, onBlur, onScroll } = useKeyboardFormScroll();

  const openProvincePicker = () => {
    Keyboard.dismiss();
    setShowSitePicker(true);
  };

  const focusBirthDate = () => {
    if (!focusDateAfterPicker.current) return;
    focusDateAfterPicker.current = false;
    inputRefs.current.fechaNacimiento?.focus();
  };

  useEffect(() => {
    if (showSitePicker || Platform.OS === "ios") return;
    const frame = requestAnimationFrame(focusBirthDate);
    return () => cancelAnimationFrame(frame);
  }, [showSitePicker]);

  const advanceTo = (next?: string) => {
    if (next === "provincia") openProvincePicker();
    else if (next) inputRefs.current[next]?.focus();
    else Keyboard.dismiss();
  };

  const fieldProps = (name: string, next?: string): Partial<TextInputProps> & { inputRef: (input: TextInput | null) => void } => ({
    inputRef: (input) => { inputRefs.current[name] = input; },
    onFocus: () => {
      setKeyboardNext(next);
      onFocus(inputRefs.current[name]);
    },
    inputAccessoryViewID: Platform.OS === "ios" && ["legajo", "dni", "telefono", "fechaNacimiento"].includes(name) ? "register-numeric-navigation" : undefined,
    onBlur: () => onBlur(inputRefs.current[name]),
    returnKeyType: next ? "next" : "done",
    submitBehavior: "submit",
    onSubmitEditing: (event) => {
      const nativeEvent = event.nativeEvent as typeof event.nativeEvent & { isComposing?: boolean; keyCode?: number };
      if (nativeEvent.isComposing || nativeEvent.keyCode === 229) return;
      advanceTo(next);
    },
  });

  const passwordToggle = (visible: boolean, toggle: () => void, label: string) => (
    <Pressable
      onPress={toggle}
      accessibilityRole="button"
      accessibilityLabel={`${visible ? "Ocultar" : "Mostrar"} ${label}`}
      accessibilityState={{ checked: visible }}
      className="h-12 w-12 items-center justify-center"
    >
      <EyeIcon size={22} color="#000000" hidden={visible} />
    </Pressable>
  );

  const handleSubmit = () => {
    const newErrors = {
      nombre: validateRequired(nombre, "Nombre"),
      apellido: validateRequired(apellido, "Apellido"),
      email: validateEmail(email),
      password: validatePassword(password),
      confirmPassword: validatePasswordConfirmation(password, confirmPassword),
      telefono: validatePhone(telefono),
      legajo: validateLegajo(legajo),
      dni: validateDNI(dni),
      domicilio: validateRequired(domicilio, "Domicilio"),
      site: validateRequired(site, "Site"),
      fechaNacimiento: validateBirthDate(fechaNacimiento),
    };
    
    setErrors(newErrors);
    
    const hasErrors = Object.values(newErrors).some(error => error !== null);
    if (!hasErrors) {
      onRegister();
    }
  };

  return (
    <>
    <ScrollView
      ref={scrollViewRef}
      className="flex-1"
      onLayout={ensureVisible}
      onContentSizeChange={ensureVisible}
      onScroll={onScroll}
      scrollEventThrottle={16}
      contentContainerStyle={{
        flexGrow: 1,
        paddingHorizontal: 24,
        paddingTop: 24,
        paddingBottom: 24 + bottomOverlap,
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
          {...fieldProps("nombre", "apellido")}
          label="Nombre"
          placeholder="Tu nombre"
          value={nombre}
          onChangeText={setNombre}
          error={errors.nombre}
        />
        <InputWithError
          {...fieldProps("apellido", "legajo")}
          label="Apellido"
          placeholder="Tu apellido"
          value={apellido}
          onChangeText={setApellido}
          error={errors.apellido}
        />
        <InputWithError
          {...fieldProps("legajo", "dni")}
          label="Legajo (solo numeros)"
          placeholder="Ej: 12345"
          value={legajo}
          onChangeText={setLegajo}
          error={errors.legajo}
          keyboardType="numeric"
        />
        <InputWithError
          {...fieldProps("dni", "email")}
          label="DNI (sin puntos ni espacios)"
          placeholder="Ej: 32456789"
          value={dni}
          onChangeText={setDni}
          error={errors.dni}
          keyboardType="numeric"
        />
        <InputWithError
          {...fieldProps("email", "password")}
          label="Email"
          placeholder="correo@gmail.com"
          value={email}
          onChangeText={setEmail}
          error={errors.email}
          keyboardType="email-address"
        />
        <InputWithError
          {...fieldProps("password", "confirmPassword")}
          label="Contraseña"
          placeholder="Crear contraseña"
          value={password}
          onChangeText={setPassword}
          error={errors.password}
          secureTextEntry={!passwordVisible}
          autoCorrect={false}
          rightAccessory={passwordToggle(passwordVisible, () => setPasswordVisible((visible) => !visible), "contraseña")}
        />
        <InputWithError
          {...fieldProps("confirmPassword", "telefono")}
          label="Repetir contraseña"
          placeholder="Repetí tu contraseña"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          error={confirmPassword || errors.confirmPassword !== undefined ? validatePasswordConfirmation(password, confirmPassword) : null}
          secureTextEntry={!confirmationVisible}
          autoCorrect={false}
          rightAccessory={passwordToggle(confirmationVisible, () => setConfirmationVisible((visible) => !visible), "contraseña repetida")}
        />
        <InputWithError
          {...fieldProps("telefono", "domicilio")}
          label="Celular (solo numeros)"
          placeholder="Ej: 1155556666"
          value={telefono}
          onChangeText={setTelefono}
          error={errors.telefono}
          keyboardType="phone-pad"
        />
        <InputWithError
          {...fieldProps("domicilio", "provincia")}
          label="Domicilio"
          multiline
          style={{ height: 90, paddingTop: 12, paddingBottom: 12, textAlignVertical: "top" }}
          placeholder="Tu dirección completa"
          value={domicilio}
          onChangeText={setDomicilio}
          error={errors.domicilio}
        />
        
        <View className="flex flex-col gap-1">
          <Text className="text-sm font-medium text-[#0F172A]">Provincia</Text>
          <Pressable
            onPress={openProvincePicker}
            accessibilityRole="button"
            accessibilityLabel="Seleccionar provincia"
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
        <Modal visible={showSitePicker} transparent animationType="slide" onRequestClose={() => setShowSitePicker(false)} onDismiss={focusBirthDate}>
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
                      focusDateAfterPicker.current = true;
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
          {...fieldProps("fechaNacimiento")}
          label="Fecha de nacimiento"
          placeholder="DD/MM/AAAA"
          keyboardType="numeric"
          maxLength={10}
          value={fechaNacimiento}
          onChangeText={(value) => setFechaNacimiento((previous) => formatBirthDate(value, previous))}
          error={errors.fechaNacimiento}
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
    {Platform.OS === "ios" ? (
      <InputAccessoryView nativeID="register-numeric-navigation">
        <View className="bg-white border-t border-[#CBD5E1] items-end px-4">
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={keyboardNext ? "Siguiente campo" : "Cerrar teclado"}
            onPress={() => advanceTo(keyboardNext)}
            className="min-h-12 justify-center px-4"
          >
            <Text className="text-base font-semibold text-[#0D80AE]">{keyboardNext ? "Siguiente" : "Listo"}</Text>
          </Pressable>
        </View>
      </InputAccessoryView>
    ) : null}
    </>
  );
}
