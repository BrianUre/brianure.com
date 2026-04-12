// "11:00:00" → "11:00 AM"
function dbTimeToDisplay(dbTime: string): string {
  const [hourStr, minuteStr] = dbTime.split(":")
  const hour = parseInt(hourStr, 10)
  const minute = minuteStr.padStart(2, "0")
  const period = hour < 12 ? "AM" : "PM"
  const displayHour = hour % 12 || 12
  return `${displayHour}:${minute} ${period}`
}

// "11:00 AM" → "11:00:00"
function displayTimeToDb(display: string): string {
  const [time, period] = display.split(" ")
  const [hourStr, minuteStr] = time.split(":")
  let hour = parseInt(hourStr, 10)
  if (period === "AM" && hour === 12) hour = 0
  if (period === "PM" && hour !== 12) hour += 12
  return `${hour.toString().padStart(2, "0")}:${minuteStr}:00`
}

export { dbTimeToDisplay, displayTimeToDb }
