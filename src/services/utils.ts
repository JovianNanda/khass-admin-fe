import { jwtPayload } from '../types/auth'
import { useToast } from 'vuestic-ui/web-components'
const { init } = useToast()

export const sleep = (ms = 0) => {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

/** Validation */
export const validators = {
  email: (v: string) => {
    const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return pattern.test(v) || 'Please enter a valid email address'
  },
  required: (v: any) => !!v || 'This field is required',
}

export const auth = {
  key: 'khass-auth-data',
  getAuth: () => {
    const x = localStorage.getItem(auth.key)
    // if (x !== null) return JSON.parse(x)
    if (x !== null) return x
    return false
  },
  setAuth: (params: string) => {
    return localStorage.setItem(auth.key, params)
  },
  removeAuth: () => {
    localStorage.removeItem(auth.key)
  },
  getPayload(access_token: string): jwtPayload {
    const payload = access_token.split('.')[1]
    const decoded = window.atob(payload)
    return JSON.parse(decoded)
  },
  validateToken: (access_token: string) => {
    const rightNow = Math.floor(new Date().getTime() / 1000).toString()
    const expireToken = auth.getPayload(access_token).exp
    // console.log('rightNow', rightNow);
    // console.log('expireToken', expireToken);

    return rightNow < expireToken
  },
}

export const rupiah = (number: number) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(number)
}

export const formatDate = {
  today: new Date(),
  monthNames: [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ],
  formatDateFn: function (date: any) {
    let day: any = date.getDate()
    if (day < 10) {
      day = '0' + day
    }
    return `${day} ${this.monthNames[date.getMonth()]} ${date.getFullYear()}`
  },
  parseDateFn: function (text: string) {
    const [day, monthName, year] = text.split('-')

    const month = this.monthNames.findIndex((m) => m === monthName)

    return new Date(parseInt(year), month, parseInt(day))
  },
  closeDateDefault: function () {
    let day: number | string = this.today.getDate()
    let month: number | string = this.today.getMonth() + 1
    const year = this.today.getFullYear()
    if (day < 10) {
      day = '0' + day
    }

    if (month < 10) {
      month = `0${month}`
    }

    return `${day}/${month}/${year}`
  },
  formatDataDate: function (date: Date | null) {
    if (!date) return ''
    let day: number | string = date.getDate()
    let month: number | string = date.getMonth() + 1
    const year = date.getFullYear()
    if (day < 10) {
      day = '0' + day
    }

    if (month < 10) {
      month = `0${month}`
    }

    return `${year}-${month}-${day}`
  },
  formatDataTime: function (time: string): string {
    return `${time.slice(0, 2)}:${time.slice(2)}:00`
  },
  parseDateFromData: function (text: string) {
    if (!text) return null
    const [day, month, year] = text.split('-')
    return new Date(parseInt(year), parseInt(month), parseInt(day))
  },
  formatTimeFromData: function (time: string) {
    if (!time) return null
    return time.slice(0, 5)
  },
  addOneMonth: function (date: Date | null) {
    if (!date) return null
    const newDate = new Date(date)
    newDate.setMonth(newDate.getMonth() + 1)
    return newDate
  },
  subtracOneMonth: function (date: Date | null) {
    if (!date) return null
    const newDate = new Date(date)
    newDate.setMonth(newDate.getMonth() - 1)
    return newDate
  },
}

export const transactionStatusBadgeColor = (status: string) => {
  const paymentStatus: { [key: string]: string } = {
    paid: 'success',
    canceled: 'danger',
    expired: 'danger',
    unpaid: 'warning',
  }
  return paymentStatus[status]
}

export const transactionStatus = ['paid', 'canceled', 'expired', 'unpaid']

export const copyToClipboard = (text: string) => {
  const el = document.createElement('textarea')
  el.value = text
  document.body.appendChild(el)
  el.select()
  document.execCommand('copy')
  document.body.removeChild(el)
  init({
    message: 'Copied to clipboard',
    color: 'success',
    duration: 3000,
  })
}
