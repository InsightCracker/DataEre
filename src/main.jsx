import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { ChakraProvider } from "@chakra-ui/react";
import App from './App.jsx'
import { AuthProvider } from './util/AuthContext.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ChakraProvider>
      <AuthProvider>
        <App />
      </AuthProvider>
    </ChakraProvider>
  </StrictMode>,
)