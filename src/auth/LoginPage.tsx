import { useState } from 'react'
import { useNavigate } from 'react-router'
import {
  Box,
  Button,
  CircularProgress,
  TextField,
  Typography,
  Alert,
  InputAdornment,
  IconButton,
  Divider
} from '@mui/material'
import { Visibility, VisibilityOff } from '@mui/icons-material'
import { loginApi } from '../api/authApi'

export default function LoginPage() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)
    const result = await loginApi({ email, password })
    setLoading(false)
    if (result.ok) {
      localStorage.setItem('user_email', result.user.email)
      navigate('/', { replace: true })
    } else {
      setError(result.error ?? 'Произошла ошибка')
    }
  }

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        bgcolor: 'background.default'
      }}
    >
      <Box sx={{ width: '100%', maxWidth: 380, px: 2 }}>
        <img
          src="/cipo200-122.png"
          alt="logo"
          style={{ display: 'block', margin: '0 auto 24px', height: 72 }}
        />

        <Typography variant="h5" fontWeight={600} textAlign="center" mb={0.5}>
          Вход в систему
        </Typography>
        <Typography variant="body2" textAlign="center" color="text.secondary" mb={3}>
          Kaspi Admin Panel
        </Typography>

        <Divider sx={{ mb: 3 }} />

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <Box component="form" onSubmit={handleSubmit} noValidate>
          <TextField
            id="login-email"
            label="Email"
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
            fullWidth
            autoComplete="email"
            autoFocus
            sx={{ mb: 2 }}
          />

          <TextField
            id="login-password"
            label="Пароль"
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
            fullWidth
            autoComplete="current-password"
            sx={{ mb: 3 }}
            slotProps={{
              input: {
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      id="toggle-password-visibility"
                      onClick={() => setShowPassword(v => !v)}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                )
              }
            }}
          />

          <Button
            id="login-submit"
            type="submit"
            fullWidth
            variant="contained"
            disabled={loading}
            size="large"
          >
            {loading ? <CircularProgress size={24} color="inherit" /> : 'Войти'}
          </Button>
        </Box>
      </Box>
    </Box>
  )
}
