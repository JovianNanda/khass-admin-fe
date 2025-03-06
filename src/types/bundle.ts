import { selectOption } from './helpers'

export type Bundle = {
  id: string | number
  theater_name: string
  name: string
  theaters: number[]
  kuota: number
  date: string
  description: string
  price: number
  close_at: string
  visibility: number | boolean
  image_url: string
  show_type: string
}

export type Pagination = {
  page: number
  perPage: number
  total: number
}

export type Sorting = {
  sortBy: keyof Bundle | undefined
  sortingOrder: 'asc' | 'desc' | null
}

export type formBundle = {
  name: string
  kuota: number
  theater: selectOption[]
  showDate: Date
  // closeDate: closeDateDefault(),
  closeDate: Date
  closeTime: string
  desc: string
  price: number
  visibility: number | boolean
  image_url: string
  show_type: string
}
