import { ChevronDown } from 'lucide-react'

export interface Option {
  label: string
  value: string
}

interface CustomSelectProps {
  options: Option[]
  value: string
  onChange: (value: string) => void
  className?: string
  disabled?: boolean
}

export default function CustomSelect({
  options,
  value,
  onChange,
  className = '',
  disabled = false,
}: CustomSelectProps) {
  return (
    <div className={`relative inline-block w-full ${className}`}>
      <select
        disabled={disabled}
        value={value}
        onChange={e => onChange(e.target.value)}
        className={`
          appearance-none
          w-full
          bg-white
          border border-gray-300
          rounded
          px-3 py-2
          pr-8
          focus:outline-none focus:ring
          ${disabled ? 'bg-gray-100 cursor-not-allowed' : ''}
        `}
      >
        {options.map(opt => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      <ChevronDown
        size={20}
        className="
          absolute
          right-2 top-1/2
          transform -translate-y-1/2
          pointer-events-none
          text-gray-500
        "
      />
    </div>
  )
}
