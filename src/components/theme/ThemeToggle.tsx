
import { Moon, Sun } from "lucide-react"
import { useTheme } from "@/contexts/ThemeContext"
import { Button } from "@/components/ui/button"
import { Toggle } from "@/components/ui/toggle"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Toggle
          variant="outline"
          size="sm"
          pressed={theme === "dark"}
          onPressedChange={() => setTheme(theme === "dark" ? "light" : "dark")}
          aria-label="Alternar tema"
          className="h-8 w-8 rounded-full"
        >
          {theme === "dark" ? (
            <Moon className="h-4 w-4" />
          ) : (
            <Sun className="h-4 w-4" />
          )}
        </Toggle>
      </TooltipTrigger>
      <TooltipContent>
        <p>{theme === "dark" ? "Modo claro" : "Modo escuro"}</p>
      </TooltipContent>
    </Tooltip>
  )
}
