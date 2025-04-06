import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { createTheme, CssBaseline, ThemeProvider } from '@mui/material'
import { BrowserRouter, Routes, Route } from 'react-router'
import ProductPage from './products/ProductPage.tsx'
import PricesPage from './prices/PricesPage.tsx'

const theme = createTheme({
  colorSchemes: {
    dark: true
  }
})

createRoot(document.getElementById('root')!).render(
  // <StrictMode>
  <BrowserRouter>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Routes>
        <Route index element={<App />} />
        <Route path="products" element={<ProductPage />} />
        <Route path="prices" element={<PricesPage />} />
      </Routes>
    </ThemeProvider>
  </BrowserRouter>
  // </StrictMode>
)
