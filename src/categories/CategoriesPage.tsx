import {
  Alert,
  Box,
  CircularProgress,
  IconButton,
  Snackbar,
  Stack,
  Typography
} from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import Header from '../layout/Header'
import { getCategoryList, getOrganizationList } from '../api/api'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router'
import { categoryItem, organizationItemT } from '../api/types'
import { DataGrid, GridRenderCellParams } from '@mui/x-data-grid'
import AddCategoryDialog from './AddCategoryDialog'
import Footer from '../layout/Footer'

export default function CategoriesPage() {
  const navigate = useNavigate()
  const [list, setList] = useState<categoryItem[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [organizationList, setOrganizationList] = useState<organizationItemT[]>([])

  const [openSnackbar, setOpenSnackbar] = useState<boolean>(false)
  const [textSnackbar, setTextSnackbar] = useState<string>('')
  const [severitySnackbar, setSeveritySnackbar] = useState<'success' | 'error'>('success')
  const [timeoutSnackbar, setTimeoutSnackbar] = useState<number | null>(2000)
  const [showModal, setShowModal] = useState<boolean>(false)

  // TODO - expand or accordion on click
  const columns = [
    { field: 'id', headerName: 'ID', width: 70, headerClassName: 'bg--header' },
    {
      field: 'name_kaspi',
      headerName: 'Название',
      width: 150,
      headerClassName: 'bg--header'
    },
    {
      field: 'title_kaspi',
      headerName: 'Заголовок',
      width: 200,
      headerClassName: 'bg--header'
    },
    {
      field: 'first_size',
      headerName: 'Первый размер',
      width: 50,
      headerClassName: 'bg--header'
    },
    {
      field: 'last_size',
      headerName: 'Последний размер',
      width: 50,
      headerClassName: 'bg--header'
    },
    {
      field: 'size_kaspi',
      headerName: 'Все размеры',
      width: 130,
      headerClassName: 'bg--header'
    }, //TODO
    {
      field: 'gender_kaspi',
      headerName: 'Пол',
      width: 130,
      headerClassName: 'bg--header'
    }, //TODO
    {
      field: 'model_kaspi',
      headerName: 'Модель',
      width: 150,
      headerClassName: 'bg--header',
      renderCell: (params: GridRenderCellParams<categoryItem, string[]>) => {
        return wrapCell(params)
      }
    },
    {
      field: 'material_kaspi',
      headerName: 'Материал',
      width: 250,
      headerClassName: 'bg--header',
      renderCell: (params: GridRenderCellParams<categoryItem, string[]>) => {
        return wrapCell(params)
      }
    },
    {
      field: 'season_kaspi',
      headerName: 'Сезон',
      width: 130,
      headerClassName: 'bg--header',
      renderCell: (params: GridRenderCellParams<categoryItem, string[]>) => {
        return wrapCell(params)
      }
    },
    {
      field: 'colour_kaspi',
      headerName: 'Цвет',
      width: 130,
      headerClassName: 'bg--header',
      renderCell: (params: GridRenderCellParams<categoryItem, string[]>) => {
        return wrapCell(params)
      }
    }
  ]

  useEffect(() => {
    fetchCategoryData()
    fetchOrganizationData()
  }, [showModal])

  function handleCloseModal() {
    setShowModal(false)
  }

  function wrapCell(params: GridRenderCellParams<categoryItem, string[]>) {
    const items = params.value?.join(', ')
    return (
      <div
        style={{
          whiteSpace: 'normal',
          wordBreak: 'break-word',
          lineHeight: '1.2'
        }}
      >
        {items}
      </div>
    )
  }

  async function fetchCategoryData() {
    setIsLoading(true)
    const { data, ok, error } = await getCategoryList()
    if (ok && data) {
      setList(data)
    } else {
      setTextSnackbar(
        'getCategoryList received failed ' + (error ? ' with errors: ' + error : '')
      )
      setSeveritySnackbar('error')
      setOpenSnackbar(true)
      setTimeoutSnackbar(null)
    }
    setIsLoading(false)
  }

  async function fetchOrganizationData() {
    const { data, ok, error } = await getOrganizationList()
    if (ok && data) {
      setOrganizationList(data.data)
    } else {
      setTextSnackbar(
        'getOrganizationList received failed ' + (error ? ' with errors: ' + error : '')
      )
      setSeveritySnackbar('error')
      setOpenSnackbar(true)
      setTimeoutSnackbar(null)
    }
  }

  return (
    <>
      <Header />
      <Stack direction="row" spacing={2} marginBottom={1}>
        <Typography variant="h4">Категории</Typography>
        {isLoading && <CircularProgress size="2rem" />}
      </Stack>

      <IconButton
        color="primary"
        aria-label="add"
        onClick={() => {
          setShowModal(true)
        }}
      >
        <AddIcon />
      </IconButton>
      <Box
        sx={{
          height: '70vh',
          width: '100%',
          '& .bg--header': {
            backgroundColor: 'rgba(224, 224, 224, 1)'
          }
        }}
      >
        <DataGrid
          rowHeight={45}
          rows={list}
          columns={columns}
          onRowClick={params => navigate(`/categories/${params.row.id}`)}
          sx={{ cursor: 'pointer' }}
        />
      </Box>

      {organizationList.length > 0 && (
        <AddCategoryDialog
          open={showModal}
          organizationList={organizationList}
          handleCloseModal={handleCloseModal}
        />
      )}

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
      <Footer />
    </>
  )
}
