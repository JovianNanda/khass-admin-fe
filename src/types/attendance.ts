export type Attendance = {
  id_participant: number
  bundle_name: string
  name: string
  phone: string
  organization: string
  identity_number: string
  check_in: Date | null
  check_out: Date | null
}
