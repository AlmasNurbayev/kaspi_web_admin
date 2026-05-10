import {
  Alert,
  CircularProgress,
  IconButton,
  Link,
  Snackbar,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Typography
} from '@mui/material'
import PublishOutlinedIcon from '@mui/icons-material/PublishOutlined'
import Header from '../layout/Header'
import { getProductList } from '../api/backend'
import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router'
import { productItemT, sexLabels } from '../api/types'
import Footer from '../layout/Footer'

export default function ProductPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const take = parseInt(searchParams.get('take') || '20', 10)
  const skip = parseInt(searchParams.get('skip') || '0', 10)

  const [list, setList] = useState<productItemT[]>([])
  const [fullCount, setFullCount] = useState<number>(0)
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const [openSnackbar, setOpenSnackbar] = useState<boolean>(false)
  const [textSnackbar, setTextSnackbar] = useState<string>('')
  const [severitySnackbar, setSeveritySnackbar] = useState<'success' | 'error'>('success')
  const [timeoutSnackbar, setTimeoutSnackbar] = useState<number | null>(2000)
  //const data = await getCategoryList()

  useEffect(() => {
    fetchData()
  }, [take, skip])

  async function fetchData() {
    setIsLoading(true)
    const { data, ok, error } = await getProductList({ take: String(take), skip: String(skip) })
    if (ok && data) {
      setList(data.data)
      setFullCount(data.full_count)
    } else {
      setTextSnackbar(
        'getProductList received failed ' + (error ? ' with errors: ' + error : '')
      )
      setSeveritySnackbar('error')
      setOpenSnackbar(true)
      setTimeoutSnackbar(null)
    }
    setIsLoading(false)
  }

  const handleChangePage = (_event: unknown, newPage: number) => {
    const newSearchParams = new URLSearchParams(searchParams)
    newSearchParams.set('skip', String(newPage * take))
    setSearchParams(newSearchParams)
  }

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newTake = parseInt(event.target.value, 10)
    const newSearchParams = new URLSearchParams(searchParams)
    newSearchParams.set('take', String(newTake))
    newSearchParams.set('skip', '0')
    setSearchParams(newSearchParams)
  }

  interface Column {
    id: string
    label: string
    minWidth?: number
    align?: 'left' | 'right' | 'center'
    // format?: (value: number) => string;
  }

  const columns: Column[] = [
    { id: 'image_active_path', label: '', minWidth: 50, align: 'left' },
    { id: 'product_id', label: 'id', minWidth: 50, align: 'left' },
    { id: 'product_name', label: 'Имя', minWidth: 50, align: 'left' },
    { id: 'sex', label: 'Пол', minWidth: 50, align: 'left' },
    { id: 'artikul', label: 'Артикул', minWidth: 100, align: 'left' },
    { id: 'product_group_name', label: 'Группа', minWidth: 100, align: 'left' },
    { id: 'vid_modeli_name', label: 'Вид', minWidth: 100, align: 'left' },
    { id: 'qnt', label: 'Остатки и цена', minWidth: 100, align: 'left' },
    { id: 'export_button', label: '', minWidth: 30, align: 'left' }
  ]
  const staticURL = import.meta.env.VITE_STATIC_URL

  function renderCell(columnId: string, row: productItemT) {
    switch (columnId) {
      case 'image_active_path':
        return (
          <a href={`${staticURL}/${row.image_active_path}`}>
            <img
              src={`${staticURL}/${row.image_active_path}`}
              alt="product"
              style={{ width: '80px', height: '80px' }}
            />
          </a>
        )
      case 'qnt':
        return row.qnt_price.map((item) => {
          return (
            <div key={item.size}>
              {item.size} размер: {item.qnt} шт : {item.sum} тг
            </div>
          )
        })
      case 'sex':
        return (
          <div>
            {row.sex} {sexLabels[row.sex]}
          </div>
        )

      case 'export_button':
        return (
          <IconButton aria-label="export">
            <Link href={`/exportProduct/${row.product_id}`} underline="none">
              <PublishOutlinedIcon />
            </Link>
          </IconButton>
        )

      default:
        return String(row[columnId as keyof productItemT])
    }
  }

  return (
    <>
      <Header />
      <Stack direction="row" spacing={2} marginBottom={1}>
        <Typography variant="h4">Продукты</Typography>
        {isLoading && <CircularProgress size="2rem" />}
      </Stack>

      <TableContainer sx={{}}>
        <Table stickyHeader aria-label="product table">
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <TableCell
                  sx={{
                    minWidth: column.minWidth,
                    backgroundColor: 'grey.300' // или 'secondary.main', 'info.light', 'grey.200', и т.д.
                    //color: 'common.white' // если нужен белый текст
                  }}
                  key={column.id}
                  align={column.align}
                  style={{ minWidth: column.minWidth }}
                >
                  <Typography>{column.label}</Typography>
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {list.length > 0 &&
              list.map((row) => {
                return (
                  <TableRow hover role="checkbox" tabIndex={-1} key={row.product_id}>
                    {columns.map((column) => {
                      return (
                        <TableCell
                          key={column.id + row.product_id}
                          align={column.align}
                          sx={{ padding: '2px' }}
                        >
                          {renderCell(column.id, row)}
                        </TableCell>
                      )
                    })}
                  </TableRow>
                )
              })}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        component="div"
        count={fullCount}
        page={Math.floor(skip / take)}
        onPageChange={handleChangePage}
        rowsPerPage={take}
        onRowsPerPageChange={handleChangeRowsPerPage}
        rowsPerPageOptions={[10, 20, 50, 100]}
        labelRowsPerPage="Строк на странице:"
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
      <Footer />
    </>
  )
}
