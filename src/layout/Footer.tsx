import { Stack } from '@mui/material'
import './Footer.css'

export default function Footer() {
  return <>
    <Stack direction={'row'} className="footer" spacing={2}>
      <Stack >ИП Incore (c) 2026</Stack>
      <Stack className='footer_second'>v 1.0.1</Stack>
    </Stack>

  </>


}
