import type {
  InputHTMLAttributes,
  SelectHTMLAttributes,
  TextareaHTMLAttributes,
  ReactNode,
} from "react";

interface FieldWrapperProps {
  label: string;
  error?: string;
  required?: boolean;
  children: ReactNode;
  hint?: string;
}

export function FieldWrapper({
  label,
  error,
  required,
  children,
  hint,
}: FieldWrapperProps) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-300 mb-1.5">
        {label}
        {required && <span className="text-emerald2-400 ml-0.5">*</span>}
      </label>
      {children}
      {hint && !error && <p className="text-xs text-gray-500 mt-1">{hint}</p>}
      {error && <p className="text-xs text-red-400 mt-1">{error}</p>}
    </div>
  );
}

const baseInput =
  "w-full px-3 py-2 rounded-lg bg-forest-900/60 border text-sm text-gray-200 placeholder-gray-500 transition-colors focus:outline-none focus:ring-2 focus:ring-emerald2-500/30";

interface TextInputProps extends InputHTMLAttributes<HTMLInputElement> {
  error?: boolean;
}

export function TextInput({ error, className = "", ...props }: TextInputProps) {
  return (
    <input
      className={`${baseInput} ${error ? "border-red-500/50" : "border-forest-600"} focus:border-emerald2-500 ${className}`}
      {...props}
    />
  );
}

interface SelectInputProps extends SelectHTMLAttributes<HTMLSelectElement> {
  error?: boolean;
  children: ReactNode;
}

export function SelectInput({
  error,
  className = "",
  children,
  ...props
}: SelectInputProps) {
  return (
    <select
      className={`${baseInput} ${error ? "border-red-500/50" : "border-forest-600"} focus:border-emerald2-500 ${className}`}
      {...props}
    >
      {children}
    </select>
  );
}

interface TextAreaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: boolean;
}

export function TextArea({ error, className = "", ...props }: TextAreaProps) {
  return (
    <textarea
      className={`${baseInput} ${error ? "border-red-500/50" : "border-forest-600"} focus:border-emerald2-500 ${className}`}
      {...props}
    />
  );
}

interface FormRowProps {
  children: ReactNode;
  cols?: number;
}

export function FormRow({ children, cols = 2 }: FormRowProps) {
  return (
    <div className={`grid grid-cols-1 md:grid-cols-${cols} gap-4`}>
      {children}
    </div>
  );
}
