export type Transaction = {
  id: string
  total_price: number
  admin_fee: number
  status: string
  payment_method_type: string
  payment_method_name: string
  payment_url: string
  created_at: string
  updated_at: string
  username: string
  user_email: string
  bundle_name: string
  transaction_created_at: string
  transaction_updated_at: string
}
