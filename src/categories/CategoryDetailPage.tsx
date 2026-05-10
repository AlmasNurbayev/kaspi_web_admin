import { useEffect, useState, useCallback } from 'react'
import { useParams, Link as RouterLink } from 'react-router'
import {
  Alert,
  Box,
  Button,
  Chip,
  CircularProgress,
  Divider,
  Snackbar,
  Stack,
  Typography
} from '@mui/material'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import SyncIcon from '@mui/icons-material/Sync'
import Header from '../layout/Header'
import Footer from '../layout/Footer'
import { getCategoryById, updateCategoryFromKaspi } from '../api/api'
import { categoryItem } from '../api/types'

function ChipList({ items }: { items: string[] }) {
  if (!items || items.length === 0) return <Typography color="text.secondary">—</Typography>
  return (
    <Stack direction="row" flexWrap="wrap" gap={0.5}>
      {items.map(item => (
        <Chip key={item} label={item} size="small" variant="outlined" />
      ))}
    </Stack>
  )
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <Box>
      <Typography variant="caption" color="text.secondary" fontWeight={600} textTransform="uppercase" letterSpacing={0.5}>
        {label}
      </Typography>
      <Box mt={0.5}>{children}</Box>
    </Box>
  )
}

export default function CategoryDetailPage() {
  const { id } = useParams<{ id: string }>()
  const categoryId = Number(id)

  const [category, setCategory] = useState<categoryItem | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isUpdating, setIsUpdating] = useState(false)

  const [openSnackbar, setOpenSnackbar] = useState(false)
  const [textSnackbar, setTextSnackbar] = useState('')
  const [severitySnackbar, setSeveritySnackbar] = useState<'success' | 'error'>('success')

  const fetchCategory = useCallback(async () => {
    setIsLoading(true)
    const { ok, data, error } = await getCategoryById(categoryId)
    if (ok && data) {
      setCategory(data)
    } else {
      setTextSnackbar('Ошибка загрузки категории' + (error ? ': ' + error : ''))
      setSeveritySnackbar('error')
      setOpenSnackbar(true)
    }
    setIsLoading(false)
  }, [categoryId])

  useEffect(() => {
    fetchCategory()
  }, [fetchCategory])

  const handleUpdate = async () => {
    setIsUpdating(true)
    const { ok, error } = await updateCategoryFromKaspi(categoryId)
    if (ok) {
      setTextSnackbar('Категория успешно обновлена из Kaspi')
      setSeveritySnackbar('success')
      setOpenSnackbar(true)
      await fetchCategory()
    } else {
      setTextSnackbar('Ошибка обновления' + (error ? ': ' + error : ''))
      setSeveritySnackbar('error')
      setOpenSnackbar(true)
    }
    setIsUpdating(false)
  }

  const busy = isLoading || isUpdating

  return (
    <>
      <Header />

      <Stack direction="row" spacing={2} alignItems="center" mb={2}>
        <Button
          component={RouterLink}
          to="/categories"
          startIcon={<ArrowBackIcon />}
          variant="text"
          size="small"
        >
          Категории
        </Button>
        {busy && <CircularProgress size={20} />}
      </Stack>

      {!isLoading && !category && (
        <Typography color="error">Категория не найдена</Typography>
      )}

      {category && (
        <Stack spacing={3} maxWidth={800}>
          {/* Header row */}
          <Stack direction="row" justifyContent="space-between" alignItems="flex-start" flexWrap="wrap" gap={2}>
            <Box>
              <Typography variant="h5" fontWeight={700}>{category.name_kaspi}</Typography>
              <Typography variant="body2" color="text.secondary">ID: {category.id}</Typography>
            </Box>
            <Button
              id="update-from-kaspi"
              variant="contained"
              startIcon={isUpdating ? <CircularProgress size={16} color="inherit" /> : <SyncIcon />}
              onClick={handleUpdate}
              disabled={busy}
            >
              Обновить из Kaspi
            </Button>
          </Stack>

          <Divider />

          {/* Main info */}
          <Stack spacing={2}>
            <Field label="Название (Kaspi)">
              <Typography>{category.name_kaspi}</Typography>
            </Field>
            <Field label="Заголовок (Kaspi)">
              <Typography>{category.title_kaspi || '—'}</Typography>
            </Field>
          </Stack>

          <Divider />

          {/* Sizes */}
          <Stack direction="row" spacing={4}>
            <Field label="Первый размер">
              <Typography>{category.first_size || '—'}</Typography>
            </Field>
            <Field label="Последний размер">
              <Typography>{category.last_size || '—'}</Typography>
            </Field>
          </Stack>

          <Field label="Все размеры">
            <ChipList items={category.size_kaspi} />
          </Field>

          <Divider />

          {/* Arrays */}
          <Field label="Пол">
            <ChipList items={category.gender_kaspi} />
          </Field>
          <Field label="Модель">
            <ChipList items={category.model_kaspi} />
          </Field>
          <Field label="Материал">
            <ChipList items={category.material_kaspi} />
          </Field>
          <Field label="Сезон">
            <ChipList items={category.season_kaspi} />
          </Field>
          <Field label="Цвет">
            <ChipList items={category.colour_kaspi} />
          </Field>

          <Divider />

          {/* Attributes */}
          <Field label="Атрибуты">
            {category.attributes_list?.length > 0 ? (
              <Stack spacing={0.5} mt={0.5}>
                {category.attributes_list.map(attr => (
                  <Stack key={attr.code} direction="row" spacing={1} alignItems="center">
                    <Typography variant="body2" sx={{ minWidth: 180, fontFamily: 'monospace' }}>
                      {attr.code}
                    </Typography>
                    <Chip label={attr.type} size="small" />
                    {attr.mandatory && <Chip label="обязательный" size="small" color="warning" />}
                    {attr.multiValued && <Chip label="мультизначение" size="small" color="info" />}
                  </Stack>
                ))}
              </Stack>
            ) : (
              <Typography color="text.secondary">—</Typography>
            )}
          </Field>

          <Divider />

          {/* Dates */}
          <Stack direction="row" spacing={4}>
            <Field label="Дата создания">
              <Typography variant="body2">{category.create_date || '—'}</Typography>
            </Field>
            <Field label="Дата изменения">
              <Typography variant="body2">{category.changed_date || '—'}</Typography>
            </Field>
          </Stack>
        </Stack>
      )}

      <Snackbar
        open={openSnackbar}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        autoHideDuration={severitySnackbar === 'error' ? null : 3000}
        onClose={() => setOpenSnackbar(false)}
      >
        <Alert
          onClose={() => setOpenSnackbar(false)}
          severity={severitySnackbar}
          variant="filled"
          sx={{ width: '100%' }}
        >
          {textSnackbar}
        </Alert>
      </Snackbar>

      <Footer />
    </>
  )
}
