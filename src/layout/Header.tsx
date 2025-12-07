import { Link, Stack, Typography } from '@mui/material'

export default function Header() {
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
          <Stack direction={'row'} spacing={2} marginTop={1}>
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
          </Stack>
        </Stack>
      </Stack>
    </>
  )
}
