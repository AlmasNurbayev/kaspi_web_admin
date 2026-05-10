export type categoryItem = {
  id: number
  name_kaspi: string
  title_kaspi: string
  first_size: string
  last_size: string
  size_kaspi: string[]
  gender_kaspi: string[]
  model_kaspi: string[]
  material_kaspi: string[]
  season_kaspi: string[]
  colour_kaspi: string[]
  attributes_list: {
    code: string
    mandatory: boolean
    multiValued: boolean
    type: string
  }[]
  changed_date: string
  create_date: string
}

export type productsListT = {
  data: productItemT[]
  full_count: number
  current_count: number
}

export type productItemT = {
  product_id: number
  product_create_date: string
  sum: number
  product_group_id: number
  product_name: string
  qnt_price: qntPriceItemT[]
  artikul: string
  name: string
  description: string | null
  material_podoshva: string | null
  material_up: string | null
  material_inside: string | null
  sex: number
  product_group_name: string
  vid_modeli_name: string
  vid_modeli_id: number
  image_registry: imageRegistryT[]
  image_active_path: string
  create_date: string
  kaspi_in_sale: boolean
  kaspi_category: string
  main_color: string
}

export type qntPriceItemT = {
  size: string
  sum: number
  qnt: 2
  store_id: [number]
}

export type imageRegistryT = {
  id: number
  name: string
  active: boolean
  main: boolean
  full_name: string
}

export type organizationItemT = {
  id: number
  name: string
  kaspi_id: string
  changed_date: string
  create_date: string
}

export type organizationsListT = {
  data: organizationItemT[]
}

export type categoryAddT = {
  name_kaspi: string
  organization_id: number
}

export const sexLabels: Record<number, string> = {
  1: 'для мальчиков',
  2: 'для девочек',
  3: 'для мальчиков,для девочек'
}

export type exportProductItemsT = {
  sku: string
  title: string
  brand: string
  category: string
  description: string
  familyId: string
  attributes: {
    code: string
    value: string | string[]
  }[]
  images: {
    url: string
  }[]
}

export type exportProductJSON = {
  organization_id: number
  product_ids: number[]
  data: exportProductItemsT[]
}

export type updateCategoryRequest = {
  id: number
  organization_id: number
}

export type exportProductResponse = {
  errors: number
  warnings: number
  skipped: number
  total: number
  result: { [key: string]: { state: string } }
}