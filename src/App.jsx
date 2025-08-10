import './App.css'
import Pages from "@/pages/index.jsx"
import { Toaster } from "@/components/ui/toaster"
import { TeamThemeProvider } from "@/contexts/TeamThemeContext"
import { AuthProvider } from "@/contexts/AuthContext"
import { ThemeProvider } from "@/contexts/ThemeContext"

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <TeamThemeProvider>
          <Pages />
          <Toaster />
        </TeamThemeProvider>
      </AuthProvider>
    </ThemeProvider>
  )
}

export default App
