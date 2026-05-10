import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  FormLabel,
  MenuItem,
  Select,
  Typography
} from '@mui/material'
import { useState } from 'react'
import { organizationItemT } from '../api/types'

/**
 * Переиспользуемый диалог выбора организации.
 *
 * Props:
 *  - open            — показывать ли диалог
 *  - title           — заголовок (по умолчанию «Выберите организацию»)
 *  - confirmLabel    — текст кнопки подтверждения (по умолчанию «Подтвердить»)
 *  - organizationList — список организаций для выбора
 *  - onConfirm(org)  — вызывается при подтверждении с выбранной организацией
 *  - onClose         — вызывается при закрытии/отмене
 */
export default function SelectOrganizationDialog({
  open,
  title = 'Выберите организацию',
  confirmLabel = 'Подтвердить',
  organizationList,
  onConfirm,
  onClose
}: {
  open: boolean
  title?: string
  confirmLabel?: string
  organizationList: organizationItemT[]
  onConfirm: (org: organizationItemT) => void
  onClose: () => void
}) {
  const [selectedId, setSelectedId] = useState<number | ''>('')

  const handleConfirm = () => {
    const org = organizationList.find(o => o.id === selectedId)
    if (!org) return
    onConfirm(org)
    setSelectedId('')
  }

  const handleClose = () => {
    setSelectedId('')
    onClose()
  }

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="xs" fullWidth>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <FormControl fullWidth sx={{ mt: 1 }}>
          <FormLabel sx={{ mb: 0.5 }}>Организация</FormLabel>
          <Select
            id="select-organization"
            value={selectedId}
            onChange={e => setSelectedId(e.target.value as number)}
            displayEmpty
          >
            <MenuItem value="" disabled>
              <Typography color="text.secondary">— не выбрано —</Typography>
            </MenuItem>
            {organizationList.map(org => (
              <MenuItem key={org.id} value={org.id}>
                {org.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Отмена</Button>
        <Button
          id="select-org-confirm"
          variant="contained"
          onClick={handleConfirm}
          disabled={selectedId === ''}
        >
          {confirmLabel}
        </Button>
      </DialogActions>
    </Dialog>
  )
}
