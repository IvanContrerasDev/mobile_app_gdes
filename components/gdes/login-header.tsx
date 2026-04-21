import Image from "next/image"

export function LoginHeader() {
  return (
    <header className="flex flex-col items-center gap-4">
      {/* Logo GRANDE centrado */}
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
      {/* Solo subtitulo - NO texto GdeS */}
      <p className="text-xs font-semibold text-foreground whitespace-nowrap">
        SISTEMA DE REGISTRO HORARIO
      </p>
    </header>
  )
}
