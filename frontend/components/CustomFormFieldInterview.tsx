import type React from "react"
import { useFormContext } from "react-hook-form"

interface CustomFormFieldProps {
  name: string
  label: string
  type?: string
  options?: { value: string; label: string }[]
  placeholder?: string
  className?: string
  labelClassName?: string
  inputClassName?: string
}

export const CustomFormField: React.FC<CustomFormFieldProps> = ({
  name,
  label,
  type = "text",
  options = [],
  placeholder,
  className,
  labelClassName,
  inputClassName,
}) => {
  const {
    register,
    formState: { errors },
  } = useFormContext()

  return (
    <div className={className}>
      <label htmlFor={name} className={`block text-sm font-medium ${labelClassName}`}>
        {label}
      </label>

      {type === "select" ? (
        <select
          id={name}
          className={`mt-1 p-2 w-full border rounded-md shadow-sm focus:ring focus:ring-opacity-50 ${inputClassName} ${errors[name] ? "border-red-500" : ""}`}
          {...register(name)}
        >
          <option value="" disabled selected>
            {placeholder || "Select an option"}
          </option>
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      ) : (
        <input
          type={type}
          id={name}
          placeholder={placeholder}
          className={`mt-1 p-2 w-full border rounded-md shadow-sm focus:ring focus:ring-opacity-50 ${inputClassName} ${errors[name] ? "border-red-500" : ""}`}
          {...register(name)}
        />
      )}

      {errors[name] && <p className="mt-1 text-sm text-red-500">{errors[name]?.message?.toString()}</p>}
    </div>
  )
}
