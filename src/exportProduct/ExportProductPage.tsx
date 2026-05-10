import {
  Alert,
  Button,
  CircularProgress,
  FormControl,
  FormLabel,
  Grid,
  Input,
  List,
  ListItem,
  MenuItem,
  Select,
  Snackbar,
  Stack,
  Table,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
  TableContainer,
  Typography,
  Tabs,
  Tab,
  Box,
  Tooltip
} from '@mui/material'
import GirlIcon from '@mui/icons-material/Girl'
import BoyIcon from '@mui/icons-material/Boy'
import {
  categoryItem,
  exportProductItemsT,
  exportProductJSON,
  organizationItemT,
  productItemT,
  exportRegistryItemT
} from '../api/types'
import { useEffect, useState } from 'react'
import { exportProductToKaspi, getCategoryList, getOrganizationList, getProductList, getExportRegistry } from '../api/backend'
import { useParams } from 'react-router'
import Header from '../layout/Header'
import Footer from '../layout/Footer'
import { convertSeason } from '../common/convert'

export default function ExportProductPage() {
  const { id } = useParams<{ id: string }>()
  const [product, setProduct] = useState<productItemT>()

  const [sending, setSending] = useState(false)
  const [categoryList, setCategoryList] = useState<categoryItem[]>([])
  const [findedCategories, setFindedCategories] = useState<categoryItem[]>([])
  const [neededSizes, setNeededSizes] = useState<string[]>([])
  const [existsSizes, setExistsSizes] = useState<string[]>([])
  const [organizationList, setOrganizationList] = useState<organizationItemT[]>([])
  const [selectedOrganization, setSelectedOrganization] = useState<string>('')
  const [selectArray, setSelectArray] = useState<FullRow[]>([])
  const [sizeOffset, setSizeOffset] = useState<number>(0)

  const [isLoadingOrganization, setIsLoadingOrganization] = useState(false)
  const [isLoadingProduct, setIsLoadingProduct] = useState(false)
  const [isLoadingCategory, setIsLoadingCategory] = useState(false)

  const [openSnackbar, setOpenSnackbar] = useState<boolean>(false)
  const [textSnackbar, setTextSnackbar] = useState<string>('')
  const [severitySnackbar, setSeveritySnackbar] = useState<'success' | 'error'>('success')
  const [timeoutSnackbar, setTimeoutSnackbar] = useState<number | null>(2000)

  const [tabIndex, setTabIndex] = useState(0)
  const [historyData, setHistoryData] = useState<exportRegistryItemT[]>([])

  const staticURL = import.meta.env.VITE_STATIC_URL

  useEffect(() => {
    fetchProductData()
    fetchCategoryData()
    fetchOrganizationData()
  }, [])

  useEffect(() => {
    if (product) {
      setNeededSizes(product.qnt_price.map((item) => item.size))
      setExistsSizes(product.qnt_price.map((item) => item.size))
    }
  }, [product])

  useEffect(() => {
    if (tabIndex === 1 && id) {
      fetchHistory()
    }
  }, [tabIndex, id])

  async function fetchHistory() {
    if (!id) return
    const { data, ok } = await getExportRegistry(id)
    if (ok && data) {
      setHistoryData(data)
    }
  }

  const allSizes: string[] = []
  for (let i = 18; i <= 40; i++) {
    allSizes.push(String(i))
  }

  interface Column {
    id: string
    label: string
    minWidth?: number
    align?: 'left' | 'right' | 'center'
    // format?: (value: number) => string;
  }
  interface FullRow {
    product_id: number
    product_name: string
    size: string
    size_real: string
    product_gender: string[]
    category_name: string
    category_title: string
    category_gender: string[]
    category_sizes: string[]
    organization_name: string
    warn: string[]
  }

  async function handleSend() {
    //setSending(true)

    if (!product || selectArray.length === 0) return
    const fullJSON: exportProductItemsT[] = []
    const productIdArr: number[] = []

    selectArray.forEach((item, index) => {
      if (!item.category_name) {
        setTextSnackbar('Категория не задана дял строки ' + String(index + 1))
        setSeveritySnackbar('error')
        setOpenSnackbar(true)
        setTimeoutSnackbar(null)
        return
      }

      if (item.warn.length > 0) return

      const images: { url: string }[] = []
      //const atrributes: { code: string; value: string }[] = []

      for (const image of product.image_registry) {
        images.push({
          url: `${staticURL}/${image.full_name}`
        })
      }

      // check colour
      const fullCat = categoryList.find((cat) => {
        return cat.name_kaspi === item.category_name
      })
      if (!fullCat) {
        setTextSnackbar('Категория не найдена')
        setSeveritySnackbar('error')
        setOpenSnackbar(true)
        setTimeoutSnackbar(null)
        return
      }
      if (!product.main_color || !fullCat.colour_kaspi.includes(product.main_color)) {
        setTextSnackbar('Цвет ' + product.main_color + ' не подходит для категории')
        setSeveritySnackbar('error')
        setOpenSnackbar(true)
        setTimeoutSnackbar(null)
        return
      }
      if (!product.material_up || !fullCat.material_kaspi.includes(product.material_up)) {
        setTextSnackbar(
          'Материал ' + product.material_up + ' не задан или не подходит для категории'
        )
        setSeveritySnackbar('error')
        setOpenSnackbar(true)
        setTimeoutSnackbar(null)
        return
      }

      productIdArr.push(product.product_id)

      fullJSON.push({
        sku: product.artikul + '|' + item.size,
        title: product.name,
        brand: product.name.split(' ')[0],
        category: item.category_name,
        description: "Удобная анатомическая и качественная детская обувь Cipo "
          + product.description + " " + product.name + " из материала вверха: "
          + product.material_up + " материал подошвы: " + product.material_podoshva,
        familyId: product.artikul,
        attributes: [
          {
            code: 'Shoes*Size',
            value: item.size_real
          },
          {
            code: 'Shoes*Manufacturer size',
            value: item.size
          },
          {
            code: 'Shoes*Manufacturer code',
            value: product.artikul
          },
          { code: 'Shoes*Season', value: convertSeason(product.product_group_name) },
          { code: 'Shoes*Colour', value: product.main_color },
          { code: 'Shoes*Model', value: product.vid_modeli_name.toLowerCase() },
          { code: 'Shoes*Gender', value: item.category_gender },
          {
            code: 'Shoes*Material',
            value: product.material_up ? product.material_up : ''
          }
        ],

        images
      })
    })

    const organization = organizationList.find((org) => org.name === selectedOrganization)
    if (!organization) {
      setTextSnackbar('Организация не найдена')
      setSeveritySnackbar('error')
      setOpenSnackbar(true)
      setTimeoutSnackbar(null)
      return
    }

    const body: exportProductJSON = {
      organization_id: organization.id,
      product_ids: productIdArr,
      data: fullJSON
    }
    console.log(body)
    const { data, ok, error } = await exportProductToKaspi(body)

    if (ok && !error) {
      setTextSnackbar('Товар успешно отправлен в Kaspi')
      setSeveritySnackbar('success')
      setOpenSnackbar(true)
    } else {
      setTextSnackbar(
        'exportProductToKaspi received failed ' + (error ? ' with errors: ' + error : '')
      )
      setSeveritySnackbar('error')
      setOpenSnackbar(true)
      setTimeoutSnackbar(null)
    }
    // TODO - результаты отправить на бэкенд в регистр экспорта товаров
    console.log(data)
  }

  async function fetchProductData() {
    setIsLoadingProduct(true)
    const { data, ok, error } = await getProductList({ id: id })

    if (ok && data) {
      if (data.data.length > 0) {
        setProduct(data.data[0])
      } else {
        setTextSnackbar('Product not found or too many products')
        setSeveritySnackbar('error')
        setOpenSnackbar(true)
        setTimeoutSnackbar(null)
      }
    } else {
      setTextSnackbar(
        'getOrganizationList received failed ' + (error ? ' with errors: ' + error : '')
      )
      setSeveritySnackbar('error')
      setOpenSnackbar(true)
      setTimeoutSnackbar(null)
    }
    setIsLoadingProduct(false)
  } //fetchProductData()

  async function fetchCategoryData() {
    setIsLoadingCategory(true)
    const { data, ok, error } = await getCategoryList()
    if (ok && data) {
      setCategoryList(data)
    } else {
      setTextSnackbar(
        'getCategoryList received failed ' + (error ? ' with errors: ' + error : '')
      )
      setSeveritySnackbar('error')
      setOpenSnackbar(true)
      setTimeoutSnackbar(null)
    }
    setIsLoadingCategory(false)
  }

  async function fetchOrganizationData() {
    setIsLoadingOrganization(true)
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
    setIsLoadingOrganization(false)
  }

  function findCategories() {
    let filteredCats: categoryItem[] = []

    if (!product) return

    if (product.sex === 0 || product.sex === null) {
      {
        setTextSnackbar('Пол не указан')
        setSeveritySnackbar('error')
        setOpenSnackbar(true)
        setTimeoutSnackbar(null)
        return
      }
    }
    const gender: string[] = []
    if (product.sex === 1) {
      gender.push('для мальчиков')
    } else if (product.sex === 2) {
      gender.push('для девочек')
    } else if (product.sex === 3) {
      gender.push('для мальчиков')
      gender.push('для девочек')
    }

    // 1 step - gender
    for (const cat of categoryList) {
      if (gender.length === 1) {
        if (cat.gender_kaspi.includes(gender[0])) {
          filteredCats.push(cat)
        }
      } else if (gender.length === 2) {
        if (
          cat.gender_kaspi.includes(gender[0]) ||
          cat.gender_kaspi.includes(gender[1])
        ) {
          filteredCats.push(cat)
        }
      }
    }
    // 2 step - models
    filteredCats = filteredCats.filter((cat) =>
      cat.model_kaspi.includes(product.vid_modeli_name.toLowerCase())
    )

    // 3 step - заполняем массив для таблицы
    const newItems: FullRow[] = []
    for (const needSize of neededSizes) {
      const category = filteredCats.find((cat) => {
        return (
          Number(cat.first_size) <= Number(needSize) &&
          Number(cat.last_size) >= Number(needSize) &&
          cat.model_kaspi.includes(product.vid_modeli_name.toLowerCase())
        )
      })

      const warn: string[] = []
      if (category && gender.length > category?.gender_kaspi.length) {
        warn.push('не все полы')
      }
      if (!category) {
        warn.push('не найдена категория')
      }

      newItems.push({
        product_id: product.product_id,
        product_name: product.product_name,
        size: needSize,
        size_real: String(Number(needSize) + sizeOffset),
        product_gender: gender,
        category_name: category?.name_kaspi ?? '',
        category_title: category?.title_kaspi ?? '',
        category_gender: category?.gender_kaspi ?? [],
        category_sizes: category?.size_kaspi ?? [],
        organization_name: selectedOrganization,
        warn: warn
      })
    }

    // исправляем проблемы
    for (const item of newItems) {
      if (item.warn.includes('не все полы')) {
        // проходим требования по полу, находим что не достает
        const neededGenders: string[] = []
        item.product_gender.map((itemGender) => {
          if (!item.category_gender.includes(itemGender)) {
            neededGenders.push(itemGender)
          }
        })
        if (neededGenders.length > 0) {
          for (const needGaneder of neededGenders) {
            for (const cat of filteredCats) {
              if (
                cat.gender_kaspi.includes(needGaneder) &&
                cat.size_kaspi.includes(item.size)
              ) {
                newItems.push({
                  product_id: product.product_id,
                  product_name: product.product_name,
                  size: item.size,
                  size_real: String(Number(item.size) + sizeOffset),
                  product_gender: gender,
                  category_name: cat.name_kaspi,
                  category_title: cat.title_kaspi ?? '',
                  category_gender: cat.gender_kaspi ?? [],
                  category_sizes: cat?.size_kaspi ?? [],
                  organization_name: selectedOrganization,
                  warn: []
                })
              }
            }
          }
        }
      }
    }

    newItems.sort((a, b) => Number(a.size) - Number(b.size))

    // очищаем проблемы
    for (const item of newItems) {
      if (item.product_gender.length > item.category_gender.length) {
        for (const searchedGender of item.product_gender) {
          const finded = newItems.find((item2) => {
            return (
              item2.category_gender.includes(searchedGender) &&
              item2.category_sizes.includes(item.size)
            )
          })

          if (finded) {
            item.warn = item.warn.filter((item) => item !== 'не все полы')
          }
        }
      }
    }

    setSelectArray(newItems)

    setFindedCategories(filteredCats)
  }

  function ChangeNeededSizes(type: string) {
    if (type === 'all') {
      setNeededSizes(allSizes)
    } else if (type === 'none') {
      setNeededSizes([])
    } else if (type === 'current') {
      setNeededSizes(existsSizes)
    }
  }

  const columns: Column[] = [
    { id: 'select', label: '', minWidth: 50, align: 'left' },
    // { id: 'product_id', label: 'id', minWidth: 50, align: 'left' },
    // { id: 'product_name', label: 'Имя', minWidth: 50, align: 'left' },
    { id: 'size', label: 'Размер произв.', minWidth: 50, align: 'left' },
    { id: 'size_real', label: 'Размер истинный', minWidth: 50, align: 'left' },
    { id: 'product_gender', label: 'Пол продукта', minWidth: 50, align: 'left' },
    { id: 'category_gender', label: 'Пол категории', minWidth: 50, align: 'left' },
    { id: 'category_name', label: 'Категория', minWidth: 50, align: 'left' },
    { id: 'category_title', label: 'Категория', minWidth: 50, align: 'left' },
    { id: 'warn', label: 'Проблемы', minWidth: 50, align: 'left' }
  ]

  function renderCell(columnId: string, row: FullRow) {
    switch (columnId) {
      case 'select':
        return <input type="checkbox" />
      case 'product_gender':
        return row.product_gender.map((item) => {
          return <div key={item}>{item}</div>
        })
      case 'category_gender':
        return row.category_gender.map((item) => {
          return <div key={item}>{item}</div>
        })
      case 'warn':
        return row.warn.map((item) => {
          return (
            <Stack color={'red'} key={item}>
              {item}
            </Stack>
          )
        })
      default:
        return String(row[columnId as keyof FullRow])
    }
  }

  return (
    <>
      <Header />

      {!product || !categoryList || !organizationList ? (
        <>
          <CircularProgress size="2rem" />
          Подождите, загрузка данных...
        </>
      ) : (
        <>
          <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
            <Tabs value={tabIndex} onChange={(e, val) => setTabIndex(val)}>
              <Tab label="Экспорт" />
              <Tab label="История экспорта" />
            </Tabs>
          </Box>

          {tabIndex === 0 && (
            <>
              <Stack sx={{ display: 'flex' }}>
            <Stack direction={'row'} spacing={2}>
              <Stack direction={'column'} spacing={1} sx={{ mb: 2 }}>
                <Typography variant="h5">Основная информация</Typography>
                <Stack direction={'row'} gap={1}>
                  <b>наименование:</b>
                  {product.product_name}
                </Stack>
                <Stack direction={'row'} gap={1}>
                  <b>бренд:</b> {product.product_name.split(' ')[0]}
                </Stack>
                <Stack color={product.main_color ? '' : 'red'} direction={'row'} gap={1}>
                  <b>цвет:</b> {product.main_color}
                </Stack>
                <Stack direction={'row'} gap={1}>
                  <b>артикул:</b> {product.artikul}
                </Stack>
                <Stack
                  color={product.product_group_name ? '' : 'red'}
                  direction={'row'}
                  gap={1}
                >
                  <b>сезон:</b> {product.product_group_name}
                </Stack>
                <Stack color={product.sex ? '' : 'red'} direction={'row'} gap={1}>
                  <b>пол:</b>
                  <>
                    {product.sex === 1 ? <BoyIcon fontSize="large" /> : ''}
                    {product.sex === 2 ? <GirlIcon fontSize="large" /> : ''}
                    {product.sex === 3 ? (
                      <>
                        <BoyIcon fontSize="large" />
                        <GirlIcon fontSize="large" />
                      </>
                    ) : (
                      ''
                    )}
                  </>
                </Stack>
                <Stack
                  direction={'row'}
                  gap={1}
                  color={product.vid_modeli_name ? '' : 'red'}
                >
                  <b>вид модели:</b> {product.vid_modeli_name}
                </Stack>
                <Stack flexWrap={'wrap'} direction={'row'} gap={2}>
                  <b>наименьший / наибольший размер сейчас в базе:</b>
                  {Math.min(...existsSizes.map((item) => Number(item)))}
                  {' / '}
                  {Math.max(...existsSizes.map((item) => Number(item)))}
                </Stack>
                <Stack direction="row" flexWrap="wrap" gap={2}>
                  {product.image_registry?.map((image) => (
                    <a href={`${staticURL}/${image.full_name}`} key={image.id}>
                      <img
                        src={`${staticURL}/${image.full_name}`}
                        alt="product"
                        style={{ width: '150px', height: '150px', objectFit: 'cover' }}
                      />
                    </a>
                  ))}
                </Stack>
              </Stack>

              <Stack direction={'column'} spacing={2} maxWidth={'60%'}>
                <FormControl>
                  <FormLabel>1. Выберите организацию</FormLabel>
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
                  <FormLabel>2. Установите требуемые размеры</FormLabel>
                  <Grid direction={'row'} spacing={1} sx={{ mb: 2 }} flexWrap={'wrap'}>
                    {allSizes.map((item) => (
                      <Button
                        sx={{ mb: 1, mr: 1 }}
                        variant={neededSizes.includes(item) ? 'contained' : 'outlined'}
                        key={item}
                        onClick={() => {
                          if (neededSizes.includes(item)) {
                            setNeededSizes(neededSizes.filter((size) => size !== item))
                          } else {
                            setNeededSizes([...neededSizes, item])
                          }
                        }}
                      >
                        {item}
                      </Button>
                    ))}
                  </Grid>
                  <Stack direction={'row'} spacing={1} sx={{ mb: 2 }} flexWrap={'wrap'}>
                    <Button onClick={() => ChangeNeededSizes('all')}>все</Button>
                    <Button onClick={() => ChangeNeededSizes('none')}>ничего</Button>
                    <Button onClick={() => ChangeNeededSizes('current')}>
                      по наличию
                    </Button>
                  </Stack>
                </FormControl>
                <Stack direction={'row'} gap={2}>
                  <FormLabel>3. Сдвиг размера (относительно производителя)</FormLabel>
                  <Input
                    type="number"
                    size="medium"
                    value={sizeOffset}
                    onChange={(e) => setSizeOffset(Number(e.target.value))}
                  ></Input>
                </Stack>

                <FormControl>
                  <Button onClick={findCategories} variant="outlined">
                    4. Подобрать категории
                  </Button>
                  {/* <FormLabel>Подобрать категории</FormLabel> */}
                  <TableContainer sx={{}}>
                    <Table stickyHeader aria-label="export table">
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
                        {selectArray.map((row) => {
                          return (
                            <TableRow
                              hover
                              role="checkbox"
                              tabIndex={-1}
                              key={row.size + row.product_id + row.category_name}
                              sx={row.warn.length > 0 ? { outline: '2px solid red', outlineOffset: '-2px' } : undefined}
                            >
                              {columns.map((column) => {
                                return (
                                  <TableCell
                                    key={column.id}
                                    align={column.align}
                                    sx={{ minWidth: column.minWidth }}
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
                </FormControl>
              </Stack>
            </Stack>
          </Stack>
          <Button
            loading={sending}
            onClick={handleSend}
            color="primary"
            variant="contained"
          >
            Отправить
          </Button>
            </>
          )}

          {tabIndex === 1 && (
            <TableContainer>
              <Table stickyHeader size="small" aria-label="history table">
                <TableHead>
                  <TableRow>
                    <TableCell>ID</TableCell>
                    <TableCell>Org ID</TableCell>
                    <TableCell>Product ID</TableCell>
                    <TableCell>Категория</TableCell>
                    <TableCell>Отправленное тело</TableCell>
                    <TableCell>Статус</TableCell>
                    <TableCell>Статус Kaspi</TableCell>
                    <TableCell>Response ID</TableCell>
                    <TableCell>Дата создания</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {historyData.map((row) => (
                    <TableRow key={row.id}>
                      <TableCell>{row.id}</TableCell>
                      <TableCell>{row.kaspi_organization_id}</TableCell>
                      <TableCell>{row.product_id}</TableCell>
                      <TableCell>{row.sended_category}</TableCell>
                      <TableCell>
                        <Tooltip title={row.sended_body} placement="top" arrow>
                          <span style={{ cursor: 'help' }}>
                            {row.sended_body && row.sended_body.length > 30
                              ? row.sended_body.slice(0, 30) + '...'
                              : row.sended_body}
                          </span>
                        </Tooltip>
                      </TableCell>
                      <TableCell>{row.sended_status}</TableCell>
                      <TableCell>{row.response_status}</TableCell>
                      <TableCell>{row.response_id}</TableCell>
                      <TableCell>{new Date(row.create_at).toLocaleString('ru-RU')}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </>
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
