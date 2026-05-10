import { useState } from 'react'
import { Link, Stack, Typography, CircularProgress } from '@mui/material'
import LogoutIcon from '@mui/icons-material/Logout'
import LoginIcon from '@mui/icons-material/Login'
import { logoutApi } from '../api/authApi'

export default function Header() {
  const [loggingOut, setLoggingOut] = useState(false)
  const [userEmail, setUserEmail] = useState<string>(() => localStorage.getItem('user_email') ?? '')

  const isAuthenticated = userEmail !== ''

  const handleLogout = async () => {
    setLoggingOut(true)
    await logoutApi()
    localStorage.removeItem('user_email')
    setUserEmail('')
    setLoggingOut(false)
  }

  const handleLogin = () => {
    window.location.href = '/login'
  }

  return (
    <>
      <Stack
        direction={'row'}
        sx={{ justifyContent: 'space-between', alignItems: 'center' }}
        marginBottom={1}
        spacing={2}
      >
        <img
          src="/cipo200-122.png"
          alt="logo"
          style={{ width: '150px', height: '92px' }}
        />

        <Stack>
          <Typography variant="h4">Админ-панель управления Kaspi для Cipo </Typography>
          <Stack direction={'row'} spacing={2} marginTop={1} alignItems="center">
            <Link href="/" underline="none">
              <Typography>Главная</Typography>
            </Link>
            <Link href="/products" underline="none">
              Товары
            </Link>
            <Link href="/prices" underline="none">
              Прайсы
            </Link>
            <Link href="/categories" underline="none">
              Категории
            </Link>

            <Stack
              id="auth-button"
              direction="row"
              alignItems="center"
              spacing={0.5}
              onClick={isAuthenticated ? handleLogout : handleLogin}
              sx={{
                cursor: loggingOut ? 'default' : 'pointer',
                opacity: loggingOut ? 0.5 : 1,
                pointerEvents: loggingOut ? 'none' : 'auto',
                color: 'text.primary',
                '&:hover': { opacity: 0.7 },
                transition: 'opacity 0.15s'
              }}
            >
              {loggingOut ? (
                <CircularProgress size={14} />
              ) : isAuthenticated ? (
                <LogoutIcon fontSize="small" />
              ) : (
                <LoginIcon fontSize="small" />
              )}
              <Typography>
                {loggingOut
                  ? 'Выход...'
                  : isAuthenticated
                    ? `Выйти (${userEmail})`
                    : 'Войти'}
              </Typography>
            </Stack>
          </Stack>
        </Stack>
      </Stack>
    </>
  )
}
