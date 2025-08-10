import './App.css'
import Pages from "@/pages/index.jsx"
import { Toaster } from "@/components/ui/toaster"
import { TeamThemeProvider } from "@/contexts/TeamThemeContext"
import { AuthProvider } from "@/contexts/AuthContext"

function App() {
  return (
    <AuthProvider>
      <TeamThemeProvider>
        <Pages />
        <Toaster />
      </TeamThemeProvider>
    </AuthProvider>
  )
}

export default App
