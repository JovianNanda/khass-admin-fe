export type loginResponse = {
  success: boolean
  message: string
  status: number
  data: {
    access_token: string
    email: string
    name: string
  }
}

export type credetials = {
  email: string
  password: string
}

export type jwtPayload = {
  iss: string
  iat: string
  exp: string
  subject: string
  email: string
  name: string
  role: string
}
