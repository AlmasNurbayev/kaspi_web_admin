import { Box, Typography } from '@mui/material'
import './App.css'

import '@fontsource/roboto/300.css'
import '@fontsource/roboto/400.css'
import '@fontsource/roboto/500.css'
import '@fontsource/roboto/700.css'
import Header from './layout/Header'

function App() {
  return (
    <>
      <Box>
        <Header />
        <Typography variant="h3">Main page</Typography>
        Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ea a quod officiis amet
        maiores tenetur, libero inventore harum. Ducimus hic ut quo praesentium! Veritatis
        placeat, repellendus quo quidem asperiores molestias?
      </Box>
    </>
  )
}

export default App
