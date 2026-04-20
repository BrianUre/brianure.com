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
  triggerTestId?: string
  itemTestId?: string
}

function ServiceSelect({
  serviceOptions,
  value,
  onValueChange,
  id,
  className,
  triggerTestId,
  itemTestId,
}: ServiceSelectProps) {
  return (
    <Select value={value} onValueChange={onValueChange}>
      <SelectTrigger id={id} className={cn('w-full', className)} data-testid={triggerTestId}>
        <SelectValue placeholder="Select a product" />
      </SelectTrigger>
      <SelectContent>
        {serviceOptions.map((option) => (
          <SelectItem key={option.value} value={option.value} data-testid={itemTestId}>
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}

export { ServiceSelect }
