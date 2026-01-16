import * as React from "react"
import * as RechartsPrimitive from "recharts"
import { cn } from "@/lib/utils"
const ChartContext = React.createContext<{ config: any } | null>(null)
export function ChartContainer({ config, children, className, ...props }: any) {
  return (
    <ChartContext.Provider value={{ config }}>
      <div className={cn("flex aspect-video justify-center text-xs", className)} {...props}>
        {children}
      </div>
    </ChartContext.Provider>
  )
}
export function ChartTooltip({ ...props }: any) {
  return <RechartsPrimitive.Tooltip {...props} />
}
export function ChartTooltipContent({ active, payload, className, label, labelClassName, hideLabel = false }: any) {
  const { config } = React.useContext(ChartContext) || { config: {} }
  if (!active || !payload?.length) {
    return null
  }
  return (
    <div className={cn("grid min-w-[8rem] items-start gap-1.5 rounded-lg border border-border/50 bg-background px-2.5 py-1.5 text-xs shadow-xl", className)}>
      {!hideLabel && <div className={cn("font-medium", labelClassName)}>{label}</div>}
      <div className="grid gap-1.5">
        {payload.map((item: any, index: number) => {
          const key = item.name || item.dataKey
          const configItem = config[key]
          return (
            <div key={index} className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full" style={{ backgroundColor: item.color || item.fill }} />
              <span className="text-muted-foreground">{configItem?.label || key}:</span>
              <span className="font-mono font-medium tabular-nums">{item.value}</span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
export function ChartLegend({ ...props }: any) {
  return <RechartsPrimitive.Legend {...props} />
}
export function ChartLegendContent({ payload, className }: any) {
  const { config } = React.useContext(ChartContext) || { config: {} }
  if (!payload?.length) return null
  return (
    <div className={cn("flex items-center justify-center gap-4", className)}>
      {payload.map((item: any, index: number) => {
        const key = item.value || item.dataKey
        const configItem = config[key]
        return (
          <div key={index} className="flex items-center gap-1.5">
            <div className="h-2 w-2 rounded-full" style={{ backgroundColor: item.color }} />
            <span className="text-xs text-muted-foreground">{configItem?.label || key}</span>
          </div>
        )
      })}
    </div>
  )
}