import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { createTheme, CssBaseline, ThemeProvider } from '@mui/material'
import { BrowserRouter, Routes, Route } from 'react-router'
import ProductPage from './products/ProductPage.tsx'
import PricesPage from './prices/PricesPage.tsx'
import CategoriesPage from './categories/CategoriesPage.tsx'
import ExportProductPage from './exportProduct/ExportProductPage.tsx'
import LoginPage from './auth/LoginPage.tsx'
import CategoryDetailPage from './categories/CategoryDetailPage.tsx'

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
        <Route path="login" element={<LoginPage />} />
        <Route index element={<App />} />
        <Route path="products" element={<ProductPage />} />
        <Route path="prices" element={<PricesPage />} />
        <Route path="categories" element={<CategoriesPage />} />
        <Route path="categories/:id" element={<CategoryDetailPage />} />
        <Route path="exportProduct/:id" element={<ExportProductPage />} />
      </Routes>
    </ThemeProvider>
  </BrowserRouter>
  // </StrictMode>
)
