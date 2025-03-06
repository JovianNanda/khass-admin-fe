import { defineStore } from 'pinia'
import { credetials, loginResponse } from '../types/auth'
import service from '../services/http-common'
import { auth } from '../services/utils'
import router from '../router'
import { useToast } from 'vuestic-ui/web-components'
const { init } = useToast()

export const useUserStore = defineStore('user', {
  state: () => {
    return {
      userName: '',
      email: '',
      token: '',
    }
  },
  getters: {
    getUsername() {
      const x = auth.getAuth()
      return x !== false ? auth.getPayload(x)?.name : ''
    },
    getEmail() {
      const x = auth.getAuth()
      return x !== false ? auth.getPayload(x)?.email : ''
    },
  },

  actions: {
    async doLogin(credetials: credetials) {
      // Do login here
      try {
        const { email, password } = credetials
        const result: loginResponse = await service.post('/login', {
          email,
          password,
        })
        // console.log(result)
        if (result.status !== 200) {
          init({ message: result.message, color: 'danger' })
          return
        }
        this.token = result.data.access_token
        this.email = result.data.email
        this.userName = result.data.name

        auth.setAuth(this.token)
        init({ message: "You've successfully logged in", color: 'success' })

        router.push('/dashboard')
      } catch (error: any) {
        console.error('Error while logging in', error)
      }
    },
    doLogout() {
      try {
        auth.removeAuth()

        console.log('You have logged out')
        init({ message: "You've successfully logged out", color: 'success' })

        router.push('/auth/login')
      } catch (error: any) {
        console.error('Error while logging out', error)
      }
    },
    changeUserName(userName: string) {
      this.userName = userName
    },
  },
})
