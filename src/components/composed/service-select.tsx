import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { cn } from "@/utils/cn"

export interface ServiceOption {
  value: string
  label: string
}

interface ServiceSelectProps {
  serviceOptions: ServiceOption[]
  value: string
  onValueChange: (value: string) => void
  id?: string
  className?: string
}

function ServiceSelect({ serviceOptions, value, onValueChange, id, className }: ServiceSelectProps) {
  return (
    <Select value={value} onValueChange={onValueChange}>
      <SelectTrigger id={id} className={cn(className)}>
        <SelectValue placeholder="Select a product" />
      </SelectTrigger>
      <SelectContent>
        {serviceOptions.map((option) => (
          <SelectItem key={option.value} value={option.value}>
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}

export { ServiceSelect }
