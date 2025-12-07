import {
  DialogContent,
  DialogContentText,
  Stack,
  FormControl,
  Select,
  MenuItem,
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

export default function AddCategoryDialog({
  organizationList,
  handleCloseModal,
  open
}: {
  organizationList: organizationItemT[]
  handleCloseModal: () => void
  open: boolean
}) {
  const [selectedOrganization, setSelectedOrganization] = useState<string>('')
  const [inputName, setInputName] = useState<string>('')
  const [sending, setSending] = useState(false)

  const [openSnackbar, setOpenSnackbar] = useState<boolean>(false)
  const [textSnackbar, setTextSnackbar] = useState<string>('')
  const [severitySnackbar, setSeveritySnackbar] = useState<'success' | 'error'>('success')
  const [timeoutSnackbar, setTimeoutSnackbar] = useState<number | null>(2000)

  async function handleAddCategory() {
    const findOrg = organizationList.find((org) => org.name === selectedOrganization)
    if (!findOrg) {
      setTextSnackbar('organization not selected')
      setSeveritySnackbar('error')
      setOpenSnackbar(true)
      setTimeoutSnackbar(null)
      return
    }
    setSending(true)
    const { ok, error, response } = await addCategory({
      name_kaspi: inputName,
      organization_id: findOrg.id
    })

    if (!ok || response?.status !== 201) {
      console.log('error', error)
      setTextSnackbar('add category failed ' + (error ? ' with errors: ' + error : ''))
      setSeveritySnackbar('error')
      setOpenSnackbar(true)
      setTimeoutSnackbar(null)
    }
    setSending(false)
    handleCloseModal()
  }
  // TODO - add category to kaspi}

  return (
    <>
      <Dialog open={open} onClose={handleCloseModal}>
        <DialogTitle id="alert-dialog-title">
          Добавление новой Kaspi кaтегории в базу
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            <Stack spacing={2}>
              <FormControl>
                <FormLabel>Выберите организацию</FormLabel>
                <Select
                  id="organization-select"
                  // variant="outlined"
                  value={selectedOrganization}
                  onChange={(e) => setSelectedOrganization(e.target.value)}
                >
                  {organizationList.map((org) => (
                    <MenuItem value={org.name} key={org.id}>
                      {org.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <FormControl>
                <FormLabel>Введите название категории ENG</FormLabel>
                <TextField
                  required
                  value={inputName}
                  onChange={(e) => setInputName(e.target.value)}
                />
              </FormControl>
            </Stack>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            loading={sending}
            onClick={handleAddCategory}
            color="primary"
            variant="contained"
          >
            Добавить
          </Button>
          <Button onClick={handleCloseModal}>Закрыть</Button>
        </DialogActions>
      </Dialog>
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
