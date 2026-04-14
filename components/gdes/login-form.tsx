import { InputField } from "./input-field"
import { Button } from "./button"
import { GoogleIcon } from "./google-icon"

export function LoginForm() {
  return (
    <form className="flex flex-col gap-6">
      {/* Email Input */}
      <InputField
        id="email"
        label="Email"
        type="email"
        placeholder="correo@empresa.com"
      />

      {/* Password Input */}
      <div className="flex flex-col gap-2">
        <InputField
          id="password"
          label="Contraseña"
          type="password"
          placeholder="Ingrese su contraseña"
        />
        <a
          href="#"
          className="self-end text-sm font-medium text-primary hover:text-primary/80 transition-colors"
        >
          Olvidé mi contraseña
        </a>
      </div>

      {/* Primary Button */}
      <div className="mt-2">
        <Button type="submit" variant="primary">
          Iniciar sesión
        </Button>
      </div>

      {/* Divider */}
      <div className="flex items-center gap-4">
        <div className="h-px flex-1 bg-border" />
        <span className="text-sm text-muted-foreground">o</span>
        <div className="h-px flex-1 bg-border" />
      </div>

      {/* Google Button */}
      <Button variant="outline">
        <GoogleIcon className="h-5 w-5" />
        Continuar con Google
      </Button>

      {/* Register Link */}
      <p className="text-center text-sm text-muted-foreground">
        ¿No tiene cuenta?{" "}
        <a
          href="#"
          className="font-medium text-primary hover:text-primary/80 transition-colors"
        >
          Registrarse
        </a>
      </p>
    </form>
  )
}
