import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css'
import { useToast } from 'vuestic-ui'
import router from './router'
import { auth } from './services/utils'

// progress bar style
NProgress.configure({ showSpinner: false }) // NProgress Configuration

const { init: notify } = useToast()

const whiteList = ['/auth/login', '/auth/logout'] // no redirect whitelist

const loginPath = '/auth/login'

router.beforeEach(async (to, from, next) => {
  // start progress bar
  NProgress.start()

  // determine whether the user has logged in
  const accessToken = auth.getAuth() as string | boolean

  if (accessToken == 'undefined') {
    auth.removeAuth()
    console.log('auth removed')
    next(loginPath)
  }

  if (accessToken) {
    /** have token */

    if (auth.validateToken(accessToken as string) === false) {
      auth.removeAuth()
      notify({
        message: `System, Your session has expired`,
        color: 'danger',
      })
      next(loginPath)
    } else if (to.path === loginPath) {
      /** already login, but go to login page */
      next({ path: '/dashboard' })
    } else {
      try {
        next()
      } catch (error) {
        // remove token and go to login page to re-login
        auth.removeAuth()
        notify({
          message: `${error || 'Has Error'}`,
          color: 'danger',
        })
        console.error(error)
        next(loginPath)
      }
    }
  } else {
    /* has no token*/
    if (whiteList.indexOf(to.path) !== -1) {
      // in the free login whitelist, go directly
      next()
    } else {
      // other pages that do not have permission to access are redirected to the login page.

      notify({
        message: `System, You're not authenticated at the moment`,
        color: 'danger',
      })
      next(loginPath)
    }
  }
})

router.afterEach(() => {
  // finish progress bar
  NProgress.done()
})
