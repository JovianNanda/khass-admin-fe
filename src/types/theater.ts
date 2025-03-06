export type Theater = {
  id: number
  name: string
  kuota: number
}

export type Pagination = {
  page: number
  perPage: number
  total: number
}

export type Sorting = {
  sortBy: keyof Theater | undefined
  sortingOrder: 'asc' | 'desc' | null
}
