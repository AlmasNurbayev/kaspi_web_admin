import {
  DialogContent,
  Stack,
  FormControl,
  TextField,
  DialogActions,
  Button,
  FormLabel,
  Alert,
  Snackbar,
  Dialog,
  DialogTitle
} from '@mui/material'
import { useState } from 'react'
import { organizationItemT } from '../api/types'
import { addCategory } from '../api/api'
import SelectOrganizationDialog from '../common/SelectOrganizationDialog'

export default function AddCategoryDialog({
  organizationList,
  handleCloseModal,
  open
}: {
  organizationList: organizationItemT[]
  handleCloseModal: () => void
  open: boolean
}) {
  const [inputName, setInputName] = useState('')
  const [sending, setSending] = useState(false)
  const [showOrgDialog, setShowOrgDialog] = useState(false)

  const [openSnackbar, setOpenSnackbar] = useState(false)
  const [textSnackbar, setTextSnackbar] = useState('')
  const [severitySnackbar, setSeveritySnackbar] = useState<'success' | 'error'>('success')
  const [timeoutSnackbar, setTimeoutSnackbar] = useState<number | null>(2000)

  /** Шаг 1: нажали «Добавить» — сначала проверяем имя, затем показываем выбор организации */
  function handleSubmitName() {
    if (!inputName.trim()) {
      setTextSnackbar('Введите название категории')
      setSeveritySnackbar('error')
      setOpenSnackbar(true)
      setTimeoutSnackbar(3000)
      return
    }
    setShowOrgDialog(true)
  }

  /** Шаг 2: пользователь выбрал организацию — отправляем запрос */
  async function handleOrgConfirm(org: organizationItemT) {
    setShowOrgDialog(false)
    setSending(true)
    const { ok, error, response } = await addCategory({
      name_kaspi: inputName,
      organization_id: org.id
    })

    if (!ok || response?.status !== 201) {
      console.log('error', error)
      setTextSnackbar('Ошибка добавления категории' + (error ? ': ' + error : ''))
      setSeveritySnackbar('error')
      setOpenSnackbar(true)
      setTimeoutSnackbar(null)
    } else {
      setTextSnackbar('Категория успешно добавлена')
      setSeveritySnackbar('success')
      setOpenSnackbar(true)
      setTimeoutSnackbar(2000)
      setInputName('')
    }
    setSending(false)
    handleCloseModal()
  }

  return (
    <>
      <Dialog open={open} onClose={handleCloseModal}>
        <DialogTitle>Добавление новой Kaspi категории в базу</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <FormControl>
              <FormLabel>Название категории (ENG)</FormLabel>
              <TextField
                required
                value={inputName}
                onChange={e => setInputName(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSubmitName()}
                placeholder="например: Sneakers"
                sx={{ mt: 0.5 }}
              />
            </FormControl>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button
            loading={sending}
            onClick={handleSubmitName}
            color="primary"
            variant="contained"
          >
            Далее: выбор организации
          </Button>
          <Button onClick={handleCloseModal}>Закрыть</Button>
        </DialogActions>
      </Dialog>

      {/* Второй шаг — выбор организации */}
      <SelectOrganizationDialog
        open={showOrgDialog}
        title="Выберите организацию"
        confirmLabel="Добавить"
        organizationList={organizationList}
        onConfirm={handleOrgConfirm}
        onClose={() => setShowOrgDialog(false)}
      />

      <Snackbar
        open={openSnackbar}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        autoHideDuration={timeoutSnackbar}
        key={'top center'}
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
    </>
  )
}
