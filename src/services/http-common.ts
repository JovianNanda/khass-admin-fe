import { auth } from './utils'
import axios from 'axios'
import { useToast } from 'vuestic-ui'
import router from '../router'

const { init: notify } = useToast()

// create an axios instance
const service = axios.create({
  baseURL: import.meta.env.VITE_API_URL, // url = base url + request url
  // withCredentials: true, // send cookies when cross-domain requests
  // timeout: 10, // request timeout
})

// request interceptor
service.interceptors.request.use(
  (config) => {
    // do something before request is sent
    const accessToken = auth.getAuth()
    if (accessToken) {
      config.headers['authorization'] = 'Bearer ' + accessToken
    }

    return config
  },
  (error) => {
    // do something with request error
    console.error(error) // for debug

    return Promise.reject(error)
  },
)

// response interceptor
service.interceptors.response.use(
  /**
   * If you want to get http information such as headers or status
   * Please return  response => response
   */

  /**
   * Determine the request status by custom code
   * Here is just an example
   * You can also judge the status by HTTP Status Code
   */
  (response) => {
    const res = response.data

    // if the custom code is not 200, it is judged as an error.
    if (!res.success) {
      console.log(res.message)

      return Promise.reject(new Error(res.message || 'Error'))
    } else {
      return res
    }
  },
  (error) => {
    const statusCodes = [400, 401, 402, 403, 404, 405, 406, 407, 408, 409, 410]

    // const previousRequest = error?.config
    console.error('error kadjshajksd', error)

    // cors error
    if (typeof error.response === 'undefined') {
      notify({
        message: `${error.message || 'Error'}`,
        color: 'danger',
      })
    }

    if (error?.response && error.response.status === 401) {
      auth.removeAuth()
      router.push('/auth/login')
      notify({
        message: `System, You're not authenticated at the moment`,
        color: 'danger',
      })
      return
    }

    if (error?.response && error.response.status === 403) {
      // if (error?.response && error.response.data.status === 500) {
      auth.removeAuth()
      router.push('/auth/login')
      notify({
        message: `System, Your session has expired. Please login again.`,
        color: 'danger',
      })
      return
    }

    if (statusCodes.includes(error.response.status)) {
      notify({
        message: `${error.response.data.message || 'Error'}`,
        color: 'danger',
      })
    } else {
      notify({
        message: `${error.message || 'Error'}`,
        color: 'danger',
      })
    }

    // notify({
    //   message: `${error.message || 'Error'}`,
    //   color: 'danger',
    // })

    console.error(error)

    return Promise.reject(error)
  },
)

export default service
