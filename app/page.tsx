"use client"

import { useState, useEffect } from "react"
import Image from "next/image"

// =============== ICONOS ===============
function ClipboardIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="8" y="2" width="8" height="4" rx="1" ry="1" />
      <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
      <line x1="9" y1="12" x2="15" y2="12" />
      <line x1="9" y1="16" x2="15" y2="16" />
    </svg>
  )
}

function HomeIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
      <polyline points="9 22 9 12 15 12 15 22" />
    </svg>
  )
}

function ProfileIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  )
}

function ChevronDownIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="6 9 12 15 18 9" />
    </svg>
  )
}

function UserAvatarIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="11" stroke="#000000" strokeWidth="1" />
      <circle cx="12" cy="9" r="3.5" stroke="#000000" strokeWidth="1" />
      <path d="M5.5 19.5c1-3 3.5-4.5 6.5-4.5s5.5 1.5 6.5 4.5" stroke="#000000" strokeWidth="1" strokeLinecap="round" />
    </svg>
  )
}

function CheckIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  )
}

function SuccessCheckIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="10" fill="#62882B" />
      <polyline points="8 12 11 15 16 9" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function DocumentIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="16" y1="13" x2="8" y2="13" />
      <line x1="16" y1="17" x2="8" y2="17" />
      <polyline points="10 9 9 9 8 9" />
    </svg>
  )
}

function UploadIcon({ className }: { className?: string }) {
  return (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
  <polyline points="17 8 12 3 7 8" />
  <line x1="12" y1="3" x2="12" y2="15" />
  </svg>
  )
}

function CloseIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  )
}

function MailIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="4" width="20" height="16" rx="2" />
      <polyline points="22,6 12,13 2,6" />
    </svg>
  )
}

function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
    </svg>
  )
}

function GoogleIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24">
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
    </svg>
  )
}

// =============== TIPOS ===============
type StepType = 
  | "login" 
  | "register" 
  | "verifyCodeRegister"
  | "emailSent" 
  | "registerSuccess"
  | "googleSuccess"
  | "verifyCodeGoogle"
  | "forgotPassword"
  | "forgotSuccess"
  | "verifyCode"
  | "loginSuccess"
  | "home"
  | "homeSuccess"
  | "documentos"
  | "perfil"
  | "perfilSuccess"

type StatusState = "initial" | "entrada" | "salida" | "ausencia"

type ActionType = "entrada" | "salida" | "ausencia"

// =============== DATOS MOCK ===============
const workplaces = [
  { id: "1", name: "Oficina Central" },
  { id: "2", name: "Sucursal Norte" },
  { id: "3", name: "Sucursal Sur" },
  { id: "4", name: "Bodega Principal" },
  { id: "5", name: "Centro de Distribucion" },
  { id: "6", name: "Oficina Administrativa" },
  { id: "7", name: "Planta de Produccion" },
]

const documents = [
  { id: "1", name: "planilla_enero_01.jpg", date: "15 Ene 2024", status: "Cargado", month: "Enero" },
  { id: "2", name: "planilla_enero_02.jpg", date: "16 Ene 2024", status: "Pendiente", month: "Enero" },
  { id: "3", name: "planilla_febrero_01.jpg", date: "01 Feb 2024", status: "Cargado", month: "Febrero" },
  { id: "4", name: "planilla_febrero_02.jpg", date: "05 Feb 2024", status: "Cargado", month: "Febrero" },
  { id: "5", name: "planilla_marzo_01.jpg", date: "10 Mar 2024", status: "Pendiente", month: "Marzo" },
]

const months = [
  "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
  "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
]

const userProfile = {
  nombre: "Gina",
  apellido: "Tini",
  fechaNacimiento: "1990-05-15",
  fechaInicioContrato: "2024-01-10",
  dni: "32.456.789",
  cuil: "27-32456789-4",
  legajo: "EMP-2024-0156",
  telefono: "+54 11 5678-1234",
  email: "gina.tini@gmail.com",
  domicilio: "Av. Corrientes 1234, CABA",
  puesto: "Analista de Operaciones",
}

const googleAccounts = [
  { id: "1", email: "gina.tini@gmail.com", name: "Gina Tini", avatar: "G" },
  { id: "2", email: "gina.trabajo@gmail.com", name: "Gina Trabajo", avatar: "G" },
  { id: "3", email: "usuario.demo@gmail.com", name: "Usuario Demo", avatar: "U" },
]

// =============== VALIDACIONES ===============
function validateEmailOrLegajo(value: string): string | null {
  if (!value.trim()) return "Este campo es obligatorio"
  
  // Si contiene @ -> validar como email
  if (value.includes("@")) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(value)) {
      return "El email debe tener un formato valido (ej: usuario@gmail.com)"
    }
    return null
  }
  
  // Si no contiene @ -> validar como legajo (solo numeros, min 5 dígitos)
  const legajoRegex = /^\d{5,}$/
  if (!legajoRegex.test(value)) {
    return "El legajo debe contener solo numeros (minimo 5 dígitos)"
  }
  return null
}

function validateEmail(email: string): string | null {
  if (!email.trim()) return "Este campo es obligatorio"
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(email)) {
    return "El email debe tener un formato valido (ej: usuario@gmail.com)"
  }
  return null
}

function validatePassword(password: string): string | null {
  if (!password.trim()) return "Este campo es obligatorio"
  
  const hasMinLength = password.length >= 8
  const hasUppercase = /[A-Z]/.test(password)
  const hasNumber = /[0-9]/.test(password)
  const hasSymbol = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)
  const hasNoSpaces = !/\s/.test(password)
  
  if (!hasMinLength || !hasUppercase || !hasNumber || !hasSymbol || !hasNoSpaces) {
    return "La contraseña debe tener al menos 8 caracteres, una mayúscula, un numero y un símbolo, sin espacios."
  }
  return null
}

function validatePhone(phone: string): string | null {
  if (!phone.trim()) return "Este campo es obligatorio"
  // Solo numeros, sin espacios ni símbolos
  if (!/^\d+$/.test(phone)) {
    return "Solo numeros, sin espacios ni símbolos"
  }
  if (phone.length < 10 || phone.length > 13) {
    return "El numero debe tener entre 10 y 13 dígitos"
  }
  return null
}

function validateDNI(dni: string): string | null {
  if (!dni.trim()) return "Este campo es obligatorio"
  // Solo numeros, sin puntos ni espacios
  if (!/^\d+$/.test(dni)) {
    return "Solo numeros, sin puntos ni espacios"
  }
  if (dni.length < 7 || dni.length > 8) {
    return "El DNI debe tener 7 u 8 dígitos"
  }
  return null
}

function validateLegajo(legajo: string): string | null {
  if (!legajo.trim()) return "Este campo es obligatorio"
  if (!/^\d+$/.test(legajo)) {
    return "El legajo debe contener solo numeros"
  }
  if (legajo.length < 5) {
    return "El legajo debe tener al menos 5 dígitos"
  }
  return null
}

function validateOTPCode(code: string): string | null {
  if (!code || code.length < 6) {
    return "Código inválido. Debe contener 6 dígitos numéricos sin letras ni símbolos."
  }
  if (!/^\d{6}$/.test(code)) {
    return "Código inválido. Debe contener 6 dígitos numéricos sin letras ni símbolos."
  }
  return null
}

function validateRequired(value: string, fieldName: string): string | null {
  if (!value.trim()) return "Este campo es obligatorio"
  return null
}

// =============== PROVINCIAS ===============
const provincias = ["San Juan", "Mendoza", "Catamarca", "La Rioja", "Salta", "San Luis"]

// =============== COMPONENTE OTP INPUT ===============
function OTPInput({
  value,
  onChange,
  error,
}: {
  value: string
  onChange: (value: string) => void
  error?: string | null
}) {
  const inputRefs = Array(6).fill(null).map(() => ({ current: null as HTMLInputElement | null }))

  const handleChange = (index: number, char: string) => {
    // Solo permitir numeros
    if (char && !/^\d$/.test(char)) return
    
    const newValue = value.split('')
    newValue[index] = char
    const result = newValue.join('').slice(0, 6)
    onChange(result)
    
    // Auto-focus next input
    if (char && index < 5) {
      inputRefs[index + 1].current?.focus()
    }
  }

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !value[index] && index > 0) {
      inputRefs[index - 1].current?.focus()
    }
  }

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault()
    const pastedData = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6)
    onChange(pastedData)
  }

  return (
    <div className="flex flex-col gap-2">
      <div className="flex justify-center gap-2">
        {Array(6).fill(null).map((_, index) => (
          <input
            key={index}
            ref={(el) => { inputRefs[index].current = el }}
            type="text"
            inputMode="numeric"
            maxLength={1}
            value={value[index] || ''}
            onChange={(e) => handleChange(index, e.target.value)}
            onKeyDown={(e) => handleKeyDown(index, e)}
            onPaste={handlePaste}
            className={`w-11 h-14 text-center text-xl font-bold rounded-xl border focus:outline-none focus:ring-2 ${
              error 
                ? "border-red-500 focus:border-red-500 focus:ring-red-500/20" 
                : "border-[#CBD5E1] focus:border-[#0D80AE] focus:ring-[#0D80AE]/20"
            }`}
          />
        ))}
      </div>
      <p className="text-sm text-gray-500 text-center">
        Coloque el código de 6 dígitos
      </p>
      {error && <p className="text-xs text-red-500 text-center mt-1">{error}</p>}
    </div>
  )
}

// =============== COMPONENTE INPUT CON ERROR ===============
function InputWithError({
  id,
  label,
  type,
  placeholder,
  value,
  onChange,
  error,
}: {
  id: string
  label: string
  type: string
  placeholder: string
  value: string
  onChange: (value: string) => void
  error?: string | null
}) {
  return (
    <div className="flex flex-col gap-1">
      <label htmlFor={id} className="text-sm font-medium text-[#0F172A]">
        {label}
      </label>
      <input
        id={id}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`h-12 w-full rounded-xl border px-4 text-base text-[#0F172A] placeholder:text-gray-400 focus:outline-none focus:ring-2 ${
          error 
            ? "border-red-500 focus:border-red-500 focus:ring-red-500/20" 
            : "border-[#CBD5E1] focus:border-[#0D80AE] focus:ring-[#0D80AE]/20"
        }`}
      />
      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
    </div>
  )
}

// =============== PANTALLA LOGIN ===============
function LoginScreen({ 
  onLogin, 
  onGoogleLogin, 
  onForgotPassword,
  onRegister 
}: { 
  onLogin: () => void
  onGoogleLogin: () => void
  onForgotPassword: () => void
  onRegister: () => void
}) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [errors, setErrors] = useState<{ email?: string | null; password?: string | null }>({})

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    const emailError = validateEmailOrLegajo(email)
    const passwordError = validatePassword(password)
    
    setErrors({ email: emailError, password: passwordError })
    
    if (!emailError && !passwordError) {
      onLogin()
    }
  }

  return (
    <div className="flex-1 flex flex-col gap-8 overflow-y-auto px-6 py-8">
      <header className="flex flex-col items-center gap-4">
        <div className="w-[180px]">
          <Image
            src="/images/gdes-logo.png"
            alt="GdeS - Grupo de Servicios"
            width={180}
            height={180}
            className="w-full h-auto"
            priority
          />
        </div>
        <p className="text-xs font-semibold text-[#0F172A] whitespace-nowrap">
          SISTEMA DE REGISTRO HORARIO
        </p>
      </header>

      <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
        <InputWithError
          id="email"
          label="Email o Legajo"
          type="text"
          placeholder="correo@gmail.com o legajo"
          value={email}
          onChange={setEmail}
          error={errors.email}
        />

        <div className="flex flex-col gap-2">
          <InputWithError
            id="password"
            label="Contraseña"
            type="password"
            placeholder="Ingrese su contraseña"
            value={password}
            onChange={setPassword}
            error={errors.password}
          />
          <button
            type="button"
            onClick={onForgotPassword}
            className="self-end text-sm font-medium text-[#0D80AE] hover:text-[#0D80AE]/80 transition-colors"
          >
            Olvidé mi contraseña
          </button>
        </div>

        <div className="mt-2">
          <button
            type="submit"
            className="h-14 w-full rounded-xl bg-[#0D80AE] text-white text-base font-semibold"
          >
            Iniciar sesión
          </button>
        </div>

        <div className="flex items-center gap-4">
          <div className="h-px flex-1 bg-[#CBD5E1]" />
          <span className="text-sm text-gray-400">o</span>
          <div className="h-px flex-1 bg-[#CBD5E1]" />
        </div>

        <button
          type="button"
          onClick={onGoogleLogin}
          className="h-14 w-full rounded-xl border border-[#CBD5E1] bg-white text-[#0D80AE] text-base font-semibold flex items-center justify-center gap-2"
        >
          <GoogleIcon className="h-5 w-5" />
          Continuar con Google
        </button>

        <p className="text-center text-sm text-gray-400">
          No tiene cuenta?{" "}
          <button
            type="button"
            onClick={onRegister}
            className="font-medium text-[#0D80AE] hover:text-[#0D80AE]/80 transition-colors"
          >
            Registrarse
          </button>
        </p>
      </form>
    </div>
  )
}

// =============== PANTALLA REGISTRO ===============
function RegisterScreen({ 
  onRegister,
  onBack 
}: { 
  onRegister: () => void
  onBack: () => void
}) {
  const [nombre, setNombre] = useState("")
  const [apellido, setApellido] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [telefono, setTelefono] = useState("")
  const [legajo, setLegajo] = useState("")
  const [dni, setDni] = useState("")
  const [domicilio, setDomicilio] = useState("")
  const [site, setSite] = useState("")
  const [fechaNacimiento, setFechaNacimiento] = useState("")
  const [errors, setErrors] = useState<{ 
    nombre?: string | null
    apellido?: string | null
    email?: string | null
    password?: string | null
    telefono?: string | null
    legajo?: string | null
    dni?: string | null
    domicilio?: string | null
    site?: string | null
    fechaNacimiento?: string | null
  }>({})

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
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
    }
    
    setErrors(newErrors)
    
    const hasErrors = Object.values(newErrors).some(error => error !== null)
    if (!hasErrors) {
      onRegister()
    }
  }

  return (
    <div className="flex-1 flex flex-col gap-6 overflow-y-auto px-6 py-6">
      <header className="flex flex-col items-center gap-3">
        <div className="w-[100px]">
          <Image
            src="/images/gdes-logo.png"
            alt="GdeS - Grupo de Servicios"
            width={100}
            height={100}
            className="w-full h-auto"
            priority
          />
        </div>
        <h1 className="text-xl font-bold text-[#0F172A]">Crear cuenta</h1>
      </header>

      <form className="flex flex-col gap-3" onSubmit={handleSubmit}>
        <InputWithError
          id="nombre"
          label="Nombre"
          type="text"
          placeholder="Tu nombre"
          value={nombre}
          onChange={setNombre}
          error={errors.nombre}
        />
        <InputWithError
          id="apellido"
          label="Apellido"
          type="text"
          placeholder="Tu apellido"
          value={apellido}
          onChange={setApellido}
          error={errors.apellido}
        />
        <InputWithError
          id="legajo-register"
          label="Legajo (solo numeros)"
          type="text"
          placeholder="Ej: 12345"
          value={legajo}
          onChange={setLegajo}
          error={errors.legajo}
        />
        <InputWithError
          id="dni-register"
          label="DNI (sin puntos ni espacios)"
          type="text"
          placeholder="Ej: 32456789"
          value={dni}
          onChange={setDni}
          error={errors.dni}
        />
        <InputWithError
          id="email-register"
          label="Email"
          type="email"
          placeholder="correo@gmail.com"
          value={email}
          onChange={setEmail}
          error={errors.email}
        />
        <InputWithError
          id="password-register"
          label="Contraseña"
          type="password"
          placeholder="Crear contraseña"
          value={password}
          onChange={setPassword}
          error={errors.password}
        />
        <InputWithError
          id="telefono"
          label="Celular (solo numeros)"
          type="tel"
          placeholder="Ej: 1155556666"
          value={telefono}
          onChange={setTelefono}
          error={errors.telefono}
        />
        <InputWithError
          id="domicilio-register"
          label="Domicilio"
          type="text"
          placeholder="Tu dirección completa"
          value={domicilio}
          onChange={setDomicilio}
          error={errors.domicilio}
        />
        
        <div className="flex flex-col gap-1">
          <label htmlFor="site-register" className="text-sm font-medium text-[#0F172A]">
            Provincia
          </label>
          <select
            id="site-register"
            value={site}
            onChange={(e) => setSite(e.target.value)}
            className={`h-12 w-full rounded-xl border px-4 text-base text-[#0F172A] focus:outline-none focus:ring-2 ${
              errors.site 
                ? "border-red-500 focus:border-red-500 focus:ring-red-500/20" 
                : "border-[#CBD5E1] focus:border-[#0D80AE] focus:ring-[#0D80AE]/20"
            }`}
          >
            <option value="">Seleccionar...</option>
            {provincias.map((prov) => (
              <option key={prov} value={prov}>{prov}</option>
            ))}
          </select>
          {errors.site && <p className="text-xs text-red-500 mt-1">{errors.site}</p>}
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="fechaNacimiento" className="text-sm font-medium text-[#0F172A]">
            Fecha de nacimiento
          </label>
          <input
            id="fechaNacimiento"
            type="date"
            value={fechaNacimiento}
            onChange={(e) => setFechaNacimiento(e.target.value)}
            className={`h-12 w-full rounded-xl border px-4 text-base text-[#0F172A] focus:outline-none focus:ring-2 ${
              errors.fechaNacimiento 
                ? "border-red-500 focus:border-red-500 focus:ring-red-500/20" 
                : "border-[#CBD5E1] focus:border-[#0D80AE] focus:ring-[#0D80AE]/20"
            }`}
          />
          {errors.fechaNacimiento && <p className="text-xs text-red-500 mt-1">{errors.fechaNacimiento}</p>}
        </div>

        <div className="mt-2">
          <button
            type="submit"
            className="h-14 w-full rounded-xl bg-[#0D80AE] text-white text-base font-semibold"
          >
            Registrarse
          </button>
        </div>

        <p className="text-center text-sm text-gray-400 pb-4">
          Ya tiene cuenta?{" "}
          <button
            type="button"
            onClick={onBack}
            className="font-medium text-[#0D80AE] hover:text-[#0D80AE]/80 transition-colors"
          >
            Iniciar sesión
          </button>
        </p>
      </form>
    </div>
  )
}

// =============== PANTALLA EMAIL ENVIADO (REGISTRO) ===============
function EmailSentScreen({ onConfirm }: { onConfirm: () => void }) {
  return (
    <div className="flex-1 flex flex-col items-center justify-center gap-6 px-6 py-8">
      <div className="w-16 h-16 rounded-full bg-[#0D80AE]/10 flex items-center justify-center">
        <MailIcon className="h-8 w-8 text-[#0D80AE]" />
      </div>
      <div className="text-center">
        <h1 className="text-xl font-bold text-[#0F172A] mb-2">Te enviamos un correo</h1>
        <p className="text-sm text-gray-500">
          Revisa la bandeja de entrada
        </p>
      </div>
      <button
        onClick={onConfirm}
        className="h-14 w-full rounded-xl bg-[#0D80AE] text-white text-base font-semibold"
      >
        Entendido
      </button>
    </div>
  )
}

// =============== PANTALLA EXITO REGISTRO ===============
function RegisterSuccessScreen({ onContinue }: { onContinue: () => void }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onContinue()
    }, 2500)
    return () => clearTimeout(timer)
  }, [onContinue])

  return (
    <div className="flex-1 flex flex-col items-center justify-center gap-6 px-6 py-8">
      <SuccessCheckIcon className="h-20 w-20" />
      <div className="text-center">
        <h1 className="text-xl font-bold text-[#62882B] mb-2">Proceso exitoso</h1>
        <p className="text-sm text-[#62882B]">
          Redirigiendo al login
        </p>
      </div>
      <p className="text-xs text-gray-400">Redirigiendo...</p>
    </div>
  )
}

// =============== MODAL GOOGLE SELECT ===============
function GoogleModal({ 
  onSelect,
  onClose 
}: { 
  onSelect: () => void
  onClose: () => void 
}) {
  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center">
      {/* Overlay oscuro */}
      <div 
        className="absolute inset-0 bg-black/50"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-xl w-[90%] max-w-[360px] p-6 z-10">
        <header className="flex flex-col items-center gap-3 mb-6">
          <GoogleIcon className="h-10 w-10" />
          <h1 className="text-lg font-bold text-[#0F172A]">Seleccionar cuenta</h1>
          <p className="text-sm text-gray-500 text-center">
            Elige una cuenta para continuar con GdeS
          </p>
        </header>

        <div className="flex flex-col gap-2">
          {googleAccounts.map((account) => (
            <button
              key={account.id}
              onClick={onSelect}
              className="flex items-center gap-3 p-3 rounded-xl border border-[#E5E7EB] bg-white hover:bg-[#F9FAFB] transition-colors"
            >
              <div className="w-9 h-9 rounded-full bg-[#4285F4] flex items-center justify-center text-white font-semibold text-sm">
                {account.avatar}
              </div>
              <div className="text-left">
                <p className="text-sm font-medium text-[#0F172A]">{account.name}</p>
                <p className="text-xs text-gray-400">{account.email}</p>
              </div>
            </button>
          ))}
        </div>

        <button
          onClick={onClose}
          className="w-full mt-4 text-sm text-gray-400 hover:text-gray-600"
        >
          Cancelar
        </button>
      </div>
    </div>
  )
}

// =============== PANTALLA EXITO GOOGLE ===============
function GoogleSuccessScreen({ onContinue }: { onContinue: () => void }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onContinue()
    }, 2000)
    return () => clearTimeout(timer)
  }, [onContinue])

  return (
    <div className="flex-1 flex flex-col items-center justify-center gap-6 px-6 py-8">
      <SuccessCheckIcon className="h-20 w-20" />
      <div className="text-center">
        <h1 className="text-xl font-bold text-[#62882B] mb-2">Autenticación exitosa con Google</h1>
        <p className="text-sm text-[#62882B]">
          Bienvenido de vuelta.
        </p>
      </div>
      <p className="text-xs text-gray-400">Continuando...</p>
    </div>
  )
}

// =============== PANTALLA INGRESO CELULAR ===============
function PhoneInputScreen({ onContinue }: { onContinue: () => void }) {
  const [phone, setPhone] = useState("")
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    const phoneError = validatePhone(phone)
    setError(phoneError)
    
    if (!phoneError) {
      onContinue()
    }
  }

  return (
    <div className="flex-1 flex flex-col gap-6 overflow-y-auto px-6 py-8">
      <header className="flex flex-col items-center gap-4">
        <div className="w-[120px]">
          <Image
            src="/images/gdes-logo.png"
            alt="GdeS - Grupo de Servicios"
            width={120}
            height={120}
            className="w-full h-auto"
            priority
          />
        </div>
        <h1 className="text-xl font-bold text-[#0F172A]">Verificar celular</h1>
        <p className="text-sm text-gray-500 text-center">
          Ingresa tu numero de celular para continuar.
        </p>
      </header>

      <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
        <InputWithError
          id="phone-verify"
          label="Numero de celular"
          type="tel"
          placeholder="Ej: 1155556666"
          value={phone}
          onChange={setPhone}
          error={error}
        />

        <button
          type="submit"
          className="h-14 w-full rounded-xl bg-[#0D80AE] text-white text-base font-semibold"
        >
          Continuar
        </button>
      </form>
    </div>
  )
}

// =============== PANTALLA OLVIDÉ CONTRASEÑA ===============
function ForgotPasswordScreen({ 
  onSend,
  onBack 
}: { 
  onSend: () => void
  onBack: () => void
}) {
  const [email, setEmail] = useState("")
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    const emailError = validateEmail(email)
    setError(emailError)
    
    if (!emailError) {
      onSend()
    }
  }

  return (
    <div className="flex-1 flex flex-col gap-6 overflow-y-auto px-6 py-8">
      <header className="flex flex-col items-center gap-4">
        <div className="w-[120px]">
          <Image
            src="/images/gdes-logo.png"
            alt="GdeS - Grupo de Servicios"
            width={120}
            height={120}
            className="w-full h-auto"
            priority
          />
        </div>
        <h1 className="text-xl font-bold text-[#0F172A]">Recuperar contraseña</h1>
        <p className="text-sm text-gray-500 text-center">
          Ingresa tu email y te enviaremos instrucciones para recuperar tu contraseña.
        </p>
      </header>

      <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
        <InputWithError
          id="email-forgot"
          label="Email"
          type="email"
          placeholder="correo@gmail.com"
          value={email}
          onChange={setEmail}
          error={error}
        />

        <button
          type="submit"
          className="h-14 w-full rounded-xl bg-[#0D80AE] text-white text-base font-semibold"
        >
          Enviar
        </button>

        <button
          type="button"
          onClick={onBack}
          className="text-sm font-medium text-[#0D80AE] hover:text-[#0D80AE]/80 transition-colors text-center"
        >
          Volver al login
        </button>
      </form>
    </div>
  )
}

// =============== PANTALLA EXITO FORGOT PASSWORD ===============
function ForgotSuccessScreen({ onBack }: { onBack: () => void }) {
  return (
    <div className="flex-1 flex flex-col items-center justify-center gap-6 px-6 py-8">
      <SuccessCheckIcon className="h-20 w-20" />
      <div className="text-center">
        <h1 className="text-xl font-bold text-[#62882B] mb-2">Instrucciones enviadas</h1>
        <p className="text-sm text-[#62882B]">
          Te enviamos instrucciones para recuperar tu contraseña.
        </p>
      </div>
      <button
        onClick={onBack}
        className="h-14 w-full rounded-xl bg-[#0D80AE] text-white text-base font-semibold"
      >
        Volver al login
      </button>
    </div>
  )
}

// =============== PANTALLA VERIFICACION WHATSAPP (REUTILIZABLE) ===============
function VerifyCodeScreen({ onVerify }: { onVerify: () => void }) {
  const [code, setCode] = useState("")
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    const codeError = validateOTPCode(code)
    setError(codeError)
    
    if (!codeError) {
      onVerify()
    }
  }

  return (
    <div className="flex-1 flex flex-col gap-6 overflow-y-auto px-6 py-8">
      <header className="flex flex-col items-center gap-4">
        <div className="w-16 h-16 rounded-full bg-[#25D366]/10 flex items-center justify-center">
          <WhatsAppIcon className="h-8 w-8 text-[#25D366]" />
        </div>
        <h1 className="text-xl font-bold text-[#0F172A]">Verificación por WhatsApp</h1>
        <p className="text-sm text-gray-500 text-center">
          Te enviamos un código de verificación a tu WhatsApp.
        </p>
      </header>

      <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
        <OTPInput
          value={code}
          onChange={setCode}
          error={error}
        />

        <button
          type="submit"
          className="h-14 w-full rounded-xl bg-[#0D80AE] text-white text-base font-semibold"
        >
          Verificar
        </button>
      </form>
    </div>
  )
}

// =============== PANTALLA EXITO LOGIN ===============
function LoginSuccessScreen({ onContinue }: { onContinue: () => void }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onContinue()
    }, 2000)
    return () => clearTimeout(timer)
  }, [onContinue])

  return (
    <div className="flex-1 flex flex-col items-center justify-center gap-6 px-6 py-8">
      <SuccessCheckIcon className="h-20 w-20" />
      <div className="text-center">
        <h1 className="text-xl font-bold text-[#62882B] mb-2">Autenticación exitosa</h1>
        <p className="text-sm text-[#62882B]">
          Bienvenido de vuelta.
        </p>
      </div>
      <p className="text-xs text-gray-400">Redirigiendo...</p>
    </div>
  )
}

// =============== HEADER COMPARTIDO ===============
function AppHeader({
  statusColor,
  statusText,
  showLogoAndProfile = true
  }: {
  statusColor: string
  statusText: string
  showLogoAndProfile?: boolean
  }) {
  return (
  <div className="px-6 pt-6 pb-4">
  <div className="flex items-start justify-between">
  {showLogoAndProfile ? (
    <div className="w-[70px] flex-shrink-0">
      <Image
        src="/images/gdes-logo.png"
        alt="GdeS"
        width={70}
        height={70}
        className="w-full h-auto"
      />
    </div>
  ) : (
    <div />
  )}
  
  <div className="flex flex-col items-center gap-2">
  <div className="flex items-center gap-1.5">
  <div
  className="w-2.5 h-2.5 rounded-full"
  style={{ backgroundColor: statusColor }}
  />
  <span
  className="text-xs font-medium"
  style={{ color: statusColor }}
  >
  {statusText}
  </span>
  </div>
  
  {showLogoAndProfile && (
    <div className="flex flex-col items-center">
      <div className="w-14 h-14">
        <UserAvatarIcon className="w-full h-full" />
      </div>
      <span className="text-xs font-medium text-[#0F172A] mt-0.5">Gina Tini</span>
    </div>
  )}
  </div>
      </div>
    </div>
  )
}

// =============== BOTTOM TABS ===============
function BottomTabs({ 
  activeTab, 
  onTabChange 
}: { 
  activeTab: StepType
  onTabChange: (tab: StepType) => void 
}) {
  return (
    <div className="border-t border-[#EDF2F5] bg-white">
      <div className="flex items-center justify-around py-3 px-6">
        <button
          onClick={() => onTabChange("documentos")}
          className={`flex flex-col items-center gap-1 ${
            activeTab === "documentos" ? "text-[#0D80AE]" : "text-gray-400"
          }`}
        >
          <ClipboardIcon className="h-6 w-6" />
        </button>

        <button
          onClick={() => onTabChange("home")}
          className={`flex flex-col items-center ${
            activeTab === "home" ? "text-[#0D80AE]" : "text-gray-400"
          }`}
        >
          <HomeIcon className="h-8 w-8" />
        </button>

        <button
          onClick={() => onTabChange("perfil")}
          className={`flex flex-col items-center gap-1 ${
            activeTab === "perfil" ? "text-[#0D80AE]" : "text-gray-400"
          }`}
        >
          <ProfileIcon className="h-6 w-6" />
        </button>
      </div>
    </div>
  )
}

// =============== ICONO ADJUNTAR ===============
function AttachIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48" />
    </svg>
  )
}

// =============== PANTALLA HOME ===============
function HomeScreen({ 
  selectedAction, 
  setSelectedAction,
  onRegister
}: { 
  selectedAction: ActionType
  setSelectedAction: (action: ActionType) => void
  onRegister: () => void
}) {
  const [selectedWorkplace, setSelectedWorkplace] = useState("")
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [orderedWorkplaces, setOrderedWorkplaces] = useState(workplaces)
  const [motivoAusencia, setMotivoAusencia] = useState("")
  const [workplaceError, setWorkplaceError] = useState("")

  const buttonText = {
    entrada: "Registrar entrada",
    salida: "Registrar salida",
    ausencia: "Registrar ausencia",
  }

  const handleSelectWorkplace = (wpName: string) => {
    setSelectedWorkplace(wpName)
    setIsDropdownOpen(false)
    setWorkplaceError("")
    
    // Move selected workplace to first position
    const selectedWp = workplaces.find(wp => wp.name === wpName)
    if (selectedWp) {
      const others = workplaces.filter(wp => wp.name !== wpName)
      setOrderedWorkplaces([selectedWp, ...others])
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!selectedWorkplace) {
      setWorkplaceError("Debes seleccionar un lugar de trabajo")
      return
    }
    
    onRegister()
  }

  return (
    <div className="flex-1 px-6 pb-4 overflow-y-auto">
      <form className="flex flex-col h-full" onSubmit={handleSubmit}>
        
        <div className="flex flex-col gap-2 mt-8">
          <label className="text-sm font-semibold text-[#0F172A]">
            Lugar de trabajo
          </label>
          <div className="relative">
            <button
              type="button"
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="h-12 w-full rounded-xl border border-[#CBD5E1] bg-white px-4 text-left text-base flex items-center justify-between"
            >
              <span className={selectedWorkplace ? "text-[#0F172A]" : "text-gray-400"}>
                {selectedWorkplace || "Seleccionar lugar de trabajo"}
              </span>
              <ChevronDownIcon className={`h-5 w-5 text-gray-400 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
            </button>
            
            {isDropdownOpen && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-[#CBD5E1] rounded-xl shadow-lg z-10 max-h-48 overflow-y-auto">
                {orderedWorkplaces.map((wp) => (
                  <button
                    key={wp.id}
                    type="button"
                    onClick={() => handleSelectWorkplace(wp.name)}
                    className="w-full px-4 py-3 text-left text-sm text-[#0F172A] hover:bg-[#EDF2F5] flex items-center justify-between"
                  >
                    <span>{wp.name}</span>
                    {selectedWorkplace === wp.name && (
                      <CheckIcon className="h-4 w-4 text-[#0D80AE]" />
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>
          {workplaceError && (
            <p className="text-xs text-red-500 mt-1">{workplaceError}</p>
          )}
        </div>

        <div className="flex flex-col gap-2 mt-6">
          <label className="text-sm font-semibold text-[#0F172A]">
            Tipo de registro
          </label>
          <div className="flex gap-3">
            {(["entrada", "salida", "ausencia"] as ActionType[]).map((action) => {
              const isSelected = selectedAction === action
              const labels = {
                entrada: "Entrada",
                salida: "Salida",
                ausencia: "Ausencia",
              }
              
              return (
                <button
                  key={action}
                  type="button"
                  onClick={() => setSelectedAction(action)}
                  className={`flex-1 h-12 rounded-xl text-sm font-medium transition-colors flex items-center justify-center ${
                    isSelected
                      ? "bg-[#0D80AE] text-white"
                      : "bg-white border border-[#CBD5E1] text-[#0F172A]"
                  }`}
                >
                  {labels[action]}
                </button>
              )
            })}
          </div>
        </div>

        <div className="flex flex-col gap-2 mt-6">
          <label className="text-sm font-semibold text-[#0F172A]">
            Observación (opcional)
          </label>
          <textarea
            placeholder="Agregar una nota..."
            rows={selectedAction === "ausencia" ? 2 : 3}
            className="w-full rounded-xl border border-[#CBD5E1] bg-white px-4 py-3 text-base text-[#0F172A] placeholder:text-gray-400 resize-none focus:border-[#0D80AE] focus:outline-none focus:ring-2 focus:ring-[#0D80AE]/20"
          />
        </div>

        {selectedAction === "ausencia" && (
          <div className="flex flex-col gap-4 mt-6">
            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-[#0F172A]">
                Motivo de la ausencia
              </label>
              <select
                value={motivoAusencia}
                onChange={(e) => setMotivoAusencia(e.target.value)}
                className="h-12 w-full rounded-xl border border-[#CBD5E1] bg-white px-4 text-base text-[#0F172A] focus:border-[#0D80AE] focus:outline-none focus:ring-2 focus:ring-[#0D80AE]/20"
              >
                <option value="">Seleccionar motivo...</option>
                <option value="enfermedad">Enfermedad</option>
                <option value="franco">Franco</option>
                <option value="otros">Otros</option>
              </select>
            </div>
            <button
              type="button"
              className="h-12 w-full rounded-xl border border-[#CBD5E1] bg-white text-[#0F172A] text-sm font-medium flex items-center justify-center gap-2"
            >
              <AttachIcon className="h-4 w-4" />
              Adjuntar archivo
            </button>
          </div>
        )}

        <div className="flex-1 min-h-4" />

        <button
          type="submit"
          className="h-14 w-full rounded-2xl bg-[#0D80AE] text-white text-base font-semibold mt-4"
        >
          {buttonText[selectedAction]}
        </button>

        <p className="text-sm text-gray-400 text-center py-3">
          El registro se realiza con su ubicación actual
        </p>
      </form>
    </div>
  )
}

// =============== PANTALLA EXITO REGISTRO ===============
function HomeSuccessScreen({ 
  action, 
  onContinue 
}: { 
  action: ActionType
  onContinue: () => void 
}) {
  const messages = {
    entrada: "Entrada registrada",
    salida: "Salida registrada",
    ausencia: "Ausencia registrada",
  }

  useEffect(() => {
    const timer = setTimeout(() => {
      onContinue()
    }, 2000)
    return () => clearTimeout(timer)
  }, [onContinue])

  return (
    <div className="flex-1 flex flex-col items-center justify-center gap-6 px-6 py-8">
      <SuccessCheckIcon className="h-20 w-20" />
      <div className="text-center">
        <h1 className="text-xl font-bold text-[#62882B] mb-2">{messages[action]}</h1>
        <p className="text-sm text-[#62882B]">
          Tu registro fue guardado correctamente.
        </p>
      </div>
      <p className="text-xs text-gray-400">Volviendo al inicio...</p>
    </div>
  )
}

// =============== PANTALLA DOCUMENTOS ===============
function DocumentosScreen() {
  const [showModal, setShowModal] = useState(false)
  const [showSuccessModal, setShowSuccessModal] = useState(false)
  const [selectedMonth, setSelectedMonth] = useState("")
  const [fileAttached, setFileAttached] = useState(false)

  // Group documents by month
  const groupedDocuments = documents.reduce((acc, doc) => {
    if (!acc[doc.month]) {
      acc[doc.month] = []
    }
    acc[doc.month].push(doc)
    return acc
  }, {} as Record<string, typeof documents>)

  const handleUpload = () => {
    // Close upload modal and show success modal
    setShowModal(false)
    setSelectedMonth("")
    setFileAttached(false)
    setShowSuccessModal(true)
  }

  const canUpload = selectedMonth !== "" && fileAttached

  return (
    <div className="flex-1 px-6 pb-4 overflow-y-auto relative">
      <h1 className="text-xl font-bold text-[#0F172A] mt-4">Documentos</h1>
      
      <div className="mt-6">
        <button
          type="button"
          onClick={() => setShowModal(true)}
          className="h-14 w-full rounded-2xl bg-[#0D80AE] text-white text-base font-semibold flex items-center justify-center gap-2"
        >
          <UploadIcon className="h-5 w-5" />
          Subir documento
        </button>
        <p className="text-sm text-gray-400 text-center mt-2">
          Subi fotos de planillas fisicas
        </p>
      </div>

      <div className="mt-8">
        {Object.entries(groupedDocuments).map(([month, docs]) => (
          <div key={month} className="mb-6">
            <h2 className="text-sm font-semibold text-[#0F172A] mb-3">{month}</h2>
            
            <div className="flex flex-col gap-3">
              {docs.map((doc) => (
                <div
                  key={doc.id}
                  className="flex items-center gap-3 p-3 rounded-xl border border-[#CBD5E1] bg-white"
                >
                  <div className="w-10 h-10 rounded-lg bg-[#EDF2F5] flex items-center justify-center flex-shrink-0">
                    <DocumentIcon className="h-5 w-5 text-[#0D80AE]" />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-[#0F172A] truncate">{doc.name}</p>
                    <p className="text-xs text-gray-400">{doc.date}</p>
                  </div>
                  
                  <span
                    className={`text-xs font-medium px-2 py-1 rounded-full ${
                      doc.status === "Cargado"
                        ? "bg-[#62882B]/10 text-[#62882B]"
                        : "bg-[#ED701E]/10 text-[#ED701E]"
                    }`}
                  >
                    {doc.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Modal de subida */}
      {showModal && (
        <div className="absolute inset-0 z-50 flex items-center justify-center">
          <div 
            className="absolute inset-0 bg-black/50"
            onClick={() => setShowModal(false)}
          />
          
          <div className="relative bg-white rounded-2xl shadow-xl w-[90%] max-w-[340px] p-6 z-10">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-[#0F172A]">Subir documento</h2>
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <CloseIcon className="h-5 w-5" />
              </button>
            </div>

            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-[#0F172A]">
                  Seleccionar mes
                </label>
                <select
                  value={selectedMonth}
                  onChange={(e) => setSelectedMonth(e.target.value)}
                  className="h-12 w-full rounded-xl border border-[#CBD5E1] bg-white px-4 text-base text-[#0F172A] focus:border-[#0D80AE] focus:outline-none focus:ring-2 focus:ring-[#0D80AE]/20"
                >
                  <option value="">Seleccionar...</option>
                  {months.map((month) => (
                    <option key={month} value={month}>{month}</option>
                  ))}
                </select>
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-[#0F172A]">
                  Archivo
                </label>
                <button
                  type="button"
                  onClick={() => setFileAttached(true)}
                  className={`h-12 w-full rounded-xl border text-sm font-medium flex items-center justify-center gap-2 ${
                    fileAttached
                      ? "border-[#62882B] bg-[#62882B]/10 text-[#62882B]"
                      : "border-[#CBD5E1] bg-white text-[#0F172A]"
                  }`}
                >
                  <AttachIcon className="h-4 w-4" />
                  {fileAttached ? "Archivo adjunto" : "Adjuntar archivo"}
                </button>
              </div>

              {selectedMonth && fileAttached && (
                <p className="text-xs text-gray-400 text-center">
                  Se guardara como: planilla_{selectedMonth.toLowerCase()}_XX.jpg
                </p>
              )}

              <div className="flex gap-3 mt-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 h-12 rounded-xl border border-[#CBD5E1] text-sm font-medium text-[#0F172A]"
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  onClick={handleUpload}
                  disabled={!canUpload}
                  className={`flex-1 h-12 rounded-xl text-sm font-semibold ${
                    canUpload
                      ? "bg-[#0D80AE] text-white"
                      : "bg-gray-200 text-gray-400 cursor-not-allowed"
                  }`}
                >
                  Subir documento
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal de exito */}
      {showSuccessModal && (
        <div className="absolute inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/50" />
          
          <div className="relative bg-white rounded-2xl shadow-xl w-[90%] max-w-[340px] p-6 z-10 flex flex-col items-center gap-4">
            <SuccessCheckIcon className="h-16 w-16" />
            <h2 className="text-lg font-bold text-[#62882B] text-center">
              Documento subido correctamente
            </h2>
            <button
              type="button"
              onClick={() => setShowSuccessModal(false)}
              className="h-12 w-full rounded-xl bg-[#0D80AE] text-white text-base font-semibold"
            >
              Continuar
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

// =============== PANTALLA PERFIL ===============
function PerfilScreen({ onLogout }: { onLogout: () => void }) {
  const [showLogoutModal, setShowLogoutModal] = useState(false)

  return (
    <div className="flex-1 px-6 pb-4 overflow-y-auto relative">
      {/* Titulo alineado a la izquierda */}
      <h1 className="text-xl font-bold text-[#0F172A] pt-6">Perfil</h1>
      
      {/* Avatar grande centrado */}
      <div className="flex flex-col items-center pt-4 pb-2">
        <div className="w-20 h-20">
          <UserAvatarIcon className="w-full h-full" />
        </div>
        <button
          type="button"
          className="text-sm font-medium text-[#0D80AE] mt-2"
        >
          Agregar foto
        </button>
      </div>
      
      <div className="mt-6 flex flex-col gap-4">
        {/* Nuevos campos (no editables) */}
        <div className="flex flex-col gap-1">
          <label className="text-xs font-medium text-gray-400">Nombre/s</label>
          <input
            type="text"
            value={userProfile.nombre}
            disabled
            className="h-12 w-full rounded-xl border border-[#CBD5E1] bg-[#EDF2F5] px-4 text-base text-[#0F172A] cursor-not-allowed"
          />
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-xs font-medium text-gray-400">Apellido/s</label>
          <input
            type="text"
            value={userProfile.apellido}
            disabled
            className="h-12 w-full rounded-xl border border-[#CBD5E1] bg-[#EDF2F5] px-4 text-base text-[#0F172A] cursor-not-allowed"
          />
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-xs font-medium text-gray-400">Fecha de nacimiento</label>
          <input
            type="date"
            value={userProfile.fechaNacimiento}
            disabled
            className="h-12 w-full rounded-xl border border-[#CBD5E1] bg-[#EDF2F5] px-4 text-base text-[#0F172A] cursor-not-allowed"
          />
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-xs font-medium text-gray-400">Fecha de inicio del contrato</label>
          <input
            type="date"
            value={userProfile.fechaInicioContrato}
            disabled
            className="h-12 w-full rounded-xl border border-[#CBD5E1] bg-[#EDF2F5] px-4 text-base text-[#0F172A] cursor-not-allowed"
          />
        </div>

        {/* Campos existentes (no editables) */}
        <div className="flex flex-col gap-1">
          <label className="text-xs font-medium text-gray-400">DNI</label>
          <input
            type="text"
            value={userProfile.dni}
            disabled
            className="h-12 w-full rounded-xl border border-[#CBD5E1] bg-[#EDF2F5] px-4 text-base text-[#0F172A] cursor-not-allowed"
          />
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-xs font-medium text-gray-400">CUIL</label>
          <input
            type="text"
            value={userProfile.cuil}
            disabled
            className="h-12 w-full rounded-xl border border-[#CBD5E1] bg-[#EDF2F5] px-4 text-base text-[#0F172A] cursor-not-allowed"
          />
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-xs font-medium text-gray-400">Legajo</label>
          <input
            type="text"
            value={userProfile.legajo}
            disabled
            className="h-12 w-full rounded-xl border border-[#CBD5E1] bg-[#EDF2F5] px-4 text-base text-[#0F172A] cursor-not-allowed"
          />
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-xs font-medium text-gray-400">Puesto</label>
          <input
            type="text"
            value={userProfile.puesto}
            disabled
            className="h-12 w-full rounded-xl border border-[#CBD5E1] bg-[#EDF2F5] px-4 text-base text-[#0F172A] cursor-not-allowed"
          />
        </div>

        {/* Campos solo lectura */}
        <div className="flex flex-col gap-1">
          <label className="text-xs font-medium text-gray-400">Domicilio</label>
          <input
            type="text"
            value={userProfile.domicilio}
            disabled
            className="h-12 w-full rounded-xl border border-[#CBD5E1] bg-[#EDF2F5] px-4 text-base text-[#0F172A] cursor-not-allowed"
          />
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-xs font-medium text-gray-400">Telefono</label>
          <input
            type="tel"
            value={userProfile.telefono}
            disabled
            className="h-12 w-full rounded-xl border border-[#CBD5E1] bg-[#EDF2F5] px-4 text-base text-[#0F172A] cursor-not-allowed"
          />
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-xs font-medium text-gray-400">Email</label>
          <input
            type="email"
            value={userProfile.email}
            disabled
            className="h-12 w-full rounded-xl border border-[#CBD5E1] bg-[#EDF2F5] px-4 text-base text-[#0F172A] cursor-not-allowed"
          />
        </div>

        <button
          type="button"
          onClick={() => setShowLogoutModal(true)}
          className="h-14 w-full rounded-2xl bg-red-500 text-white text-base font-semibold mt-6 mb-4"
        >
          Cerrar sesión
        </button>
      </div>

      {/* Recuadro de confirmación de cierre de sesión */}
      {showLogoutModal && (
        <div className="fixed bottom-16 left-0 right-0 z-50 px-4 flex justify-center">
          <div className="bg-white rounded-xl shadow-lg w-full max-w-[388px] p-4">
            <p className="text-sm font-medium text-[#0F172A] text-center mb-4">
              Estas seguro de que quieres cerrar sesión?
            </p>
            
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setShowLogoutModal(false)}
                className="flex-1 h-10 rounded-xl border border-[#CBD5E1] text-sm font-medium text-[#0F172A]"
              >
                No
              </button>
              <button
                type="button"
                onClick={onLogout}
                className="flex-1 h-10 rounded-xl bg-red-500 text-white text-sm font-semibold"
              >
                Si
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// =============== PANTALLA EXITO PERFIL ===============
function PerfilSuccessScreen({ onContinue }: { onContinue: () => void }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onContinue()
    }, 2000)
    return () => clearTimeout(timer)
  }, [onContinue])

  return (
    <div className="flex-1 flex flex-col items-center justify-center gap-6 px-6 py-8">
      <SuccessCheckIcon className="h-20 w-20" />
      <div className="text-center">
        <h1 className="text-xl font-bold text-[#62882B] mb-2">Cambios guardados</h1>
        <p className="text-sm text-[#62882B]">
          Tu perfil fue actualizado correctamente.
        </p>
      </div>
      <p className="text-xs text-gray-400">Volviendo al perfil...</p>
    </div>
  )
}

// =============== APP PRINCIPAL ===============
export default function App() {
  const [step, setStep] = useState<StepType>("login")
  const [selectedAction, setSelectedAction] = useState<ActionType>("entrada")
  const [showGoogleModal, setShowGoogleModal] = useState(false)
  const [statusState, setStatusState] = useState<StatusState>("initial")

  // Status color based on last registered action (not selection)
  const getStatusColor = () => {
    if (statusState === "entrada") return "#62882B"
    if (statusState === "salida") return "#DC2626"
    return "#9CA3AF" // gray-400 for initial and ausencia
  }
  
  const getStatusText = () => {
    if (statusState === "entrada") return "En horario laboral"
    if (statusState === "salida") return "Fuera de horario"
    return "Sin registro"
  }

  const statusColor = getStatusColor()
  const statusText = getStatusText()

  const isAppScreen = step === "home" || step === "homeSuccess" || step === "documentos" || step === "perfil" || step === "perfilSuccess"

  const handleTabChange = (tab: StepType) => {
    if (tab === "home" || tab === "documentos" || tab === "perfil") {
      setStep(tab)
    }
  }

  const handleGoogleLogin = () => {
    setShowGoogleModal(true)
  }

  const handleGoogleSelect = () => {
    setShowGoogleModal(false)
    setStep("googleSuccess")
  }

  return (
    <main className="h-screen bg-[#EDF2F5] flex items-center justify-center px-2 py-2 overflow-hidden">
      <div className="w-full max-w-[420px] h-full max-h-[900px]">
        <div className="bg-white h-full rounded-[32px] shadow-lg flex flex-col overflow-hidden relative">
          
          {/* Modal de Google */}
          {showGoogleModal && (
            <GoogleModal 
              onSelect={handleGoogleSelect}
              onClose={() => setShowGoogleModal(false)}
            />
          )}
          
          {step === "login" && (
            <LoginScreen 
              onLogin={() => setStep("verifyCode")}
              onGoogleLogin={handleGoogleLogin}
              onForgotPassword={() => setStep("forgotPassword")}
              onRegister={() => setStep("register")}
            />
          )}

          {step === "register" && (
            <RegisterScreen 
              onRegister={() => setStep("verifyCodeRegister")}
              onBack={() => setStep("login")}
            />
          )}

          {step === "verifyCodeRegister" && (
            <VerifyCodeScreen onVerify={() => setStep("emailSent")} />
          )}

          {step === "emailSent" && (
            <EmailSentScreen onConfirm={() => setStep("registerSuccess")} />
          )}

          {step === "registerSuccess" && (
            <RegisterSuccessScreen onContinue={() => setStep("login")} />
          )}

          {step === "googleSuccess" && (
            <GoogleSuccessScreen onContinue={() => setStep("verifyCodeGoogle")} />
          )}

          {step === "verifyCodeGoogle" && (
            <VerifyCodeScreen onVerify={() => setStep("home")} />
          )}

          {step === "forgotPassword" && (
            <ForgotPasswordScreen 
              onSend={() => setStep("forgotSuccess")}
              onBack={() => setStep("login")}
            />
          )}

          {step === "forgotSuccess" && (
            <ForgotSuccessScreen onBack={() => setStep("login")} />
          )}

          {step === "verifyCode" && (
            <VerifyCodeScreen onVerify={() => setStep("loginSuccess")} />
          )}

          {step === "loginSuccess" && (
            <LoginSuccessScreen onContinue={() => setStep("home")} />
          )}

          {isAppScreen && (
            <>
              {step !== "perfil" && step !== "perfilSuccess" && (
                <AppHeader 
                  statusColor={statusColor} 
                  statusText={statusText}
                  showLogoAndProfile={step !== "documentos"}
                />
              )}

              {step === "home" && (
                <HomeScreen 
                  selectedAction={selectedAction} 
                  setSelectedAction={setSelectedAction}
                  onRegister={() => {
                    setStatusState(selectedAction)
                    setStep("homeSuccess")
                  }}
                />
              )}
              
              {step === "homeSuccess" && (
                <HomeSuccessScreen 
                  action={selectedAction}
                  onContinue={() => setStep("home")}
                />
              )}
              
              {step === "documentos" && <DocumentosScreen />}
              
              {step === "perfil" && (
                <PerfilScreen onLogout={() => setStep("login")} />
              )}

              {step !== "homeSuccess" && step !== "perfilSuccess" && (
                <BottomTabs activeTab={step} onTabChange={handleTabChange} />
              )}
            </>
          )}
        </div>
      </div>
    </main>
  )
}
