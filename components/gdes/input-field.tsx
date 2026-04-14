interface InputFieldProps {
  label: string
  type?: string
  placeholder?: string
  id: string
}

export function InputField({
  label,
  type = "text",
  placeholder,
  id,
}: InputFieldProps) {
  return (
    <div className="flex flex-col gap-2">
      <label
        htmlFor={id}
        className="text-sm font-medium text-foreground"
      >
        {label}
      </label>
      <input
        type={type}
        id={id}
        name={id}
        placeholder={placeholder}
        className="h-12 w-full rounded-lg border border-input bg-card px-4 text-base text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-colors"
      />
    </div>
  )
}
