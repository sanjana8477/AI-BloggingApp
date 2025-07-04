import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import { AppProvider } from './Context/AppContext.jsx'



createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    
    <AppProvider>  
      {/* Wrap the App component with AppProvider to provide context to all components */}
      {/* This allows all components within App to access the context values */}
      <App />
    </AppProvider>

  </BrowserRouter>,
)
