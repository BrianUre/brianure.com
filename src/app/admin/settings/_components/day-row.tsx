'use client'

import { Switch } from "@/components/ui/switch"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { cn } from "@/utils"

export type DaySchedule = {
  enabled: boolean
  from: string
  to: string
}

interface TimeSelectProps {
  value: string
  slots: string[]
  disabled: boolean
  placeholder: string
  onChange: (value: string) => void
}

function TimeSelect({
  value,
  slots,
  disabled,
  placeholder,
  onChange,
}: TimeSelectProps) {
  return (
    <Select value={value} onValueChange={onChange} disabled={disabled}>
      <SelectTrigger className="w-32">
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        {slots.map((slot) => (
          <SelectItem key={slot} value={slot}>
            {slot}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}

interface DayRowProps {
  day: string
  schedule: DaySchedule
  timeSlots: string[]
  timesDisabled?: boolean
  onUpdate: (updates: Partial<DaySchedule>) => void
}

export function DayRow({ day, schedule, timeSlots, timesDisabled = false, onUpdate }: DayRowProps) {
  const timesInputDisabled = !schedule.enabled || timesDisabled
  return (
    <div
      className={cn(
        "flex items-center gap-6 rounded-lg border border-border/50 bg-card p-4 transition-opacity",
        !schedule.enabled && "opacity-50"
      )}
    >
      <div className="flex w-32 items-center gap-3">
        <Switch
          checked={schedule.enabled}
          onCheckedChange={(checked) => onUpdate({ enabled: checked })}
        />
        <span className="text-sm font-medium text-foreground">{day}</span>
      </div>

      <div className="flex flex-1 items-center gap-3">
        <TimeSelect
          value={schedule.from}
          slots={timeSlots}
          disabled={timesInputDisabled}
          placeholder="From"
          onChange={(value) => onUpdate({ from: value })}
        />
        <span className="text-sm text-muted-foreground">to</span>
        <TimeSelect
          value={schedule.to}
          slots={timeSlots}
          disabled={timesInputDisabled}
          placeholder="To"
          onChange={(value) => onUpdate({ to: value })}
        />
      </div>
    </div>
  )
}
