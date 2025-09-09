import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { TooltipProvider } from "@/components/ui/tooltip";
import './index.css'
import AppWithSheet from './AppWithSheet'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <TooltipProvider>
      <AppWithSheet />
    </TooltipProvider>
  </StrictMode>,
)
