import './App.css'
import Pages from "@/pages/index.jsx"
import { Toaster } from "@/components/ui/toaster"
import { TeamThemeProvider } from "@/contexts/TeamThemeContext"

function App() {
  return (
    <TeamThemeProvider>
      <Pages />
      <Toaster />
    </TeamThemeProvider>
  )
}

export default App
