import { useConfigContext } from './ConfigContext'
import { createContext, useContext, useEffect, useState } from 'react'

interface IAuthContext {
  idToken?: string
  nonce?: string
  address?: `0x${string}`
  whitelisted: boolean

  login(): Promise<void>

  logout(): Promise<void>
}

const AuthContext = createContext<IAuthContext>({
  login: async () => {},
  logout: async () => {},
  whitelisted: false,
})

export const AuthContextProvider = ({ children }: { children: React.ReactNode }) => {
  const {
    features: {
      Login: { url, app_id, path_prefix },
    },
  } = useConfigContext()
  const [idToken, setIdToken] = useState<string | undefined>(localStorage.getItem('id_token') ?? undefined)
  const [nonce, setNonce] = useState<string | undefined>(localStorage.getItem('nonce') ?? undefined)
  const [address, setAddress] = useState<`0x${string}` | undefined>(undefined)
  const [whitelisted, setWhitelisted] = useState(false)

  const randomNonce = (length: number) => {
    // stolen from https://auth0.com/docs/get-started/authentication-and-authorization-flow/mitigate-replay-attacks-when-using-the-implicit-flow
    const charset = '0123456789ABCDEFGHIJKLMNOPQRSTUVXYZabcdefghijklmnopqrstuvwxyz'
    let result = ''

    while (length > 0) {
      const bytes = new Uint8Array(16)
      let random = window.crypto.getRandomValues(bytes)

      for (let i = 0; i < random.length; i++) {
        if (length === 0) {
          break
        }
        if (random[i] < charset.length) {
          result += charset[random[i]]
          length--
        }
      }
    }
    return result
  }

  const login = (): Promise<void> => {
    return new Promise<void>((resolve) => {
      const nonce = randomNonce(32)
      localStorage.setItem('nonce', nonce)
      setNonce(nonce)
      localStorage.removeItem('id_token')
      setIdToken(undefined)

      const target_url = `${new URL('/authorize', url).href}?${new URLSearchParams({
        response_type: 'id_token',
        scope: 'openid eth_address whitelisted',
        client_id: app_id,
        redirect_uri: new URL(`${path_prefix}/auth/`, window.location.href).href,
        prompt: 'switch_account',
        nonce: nonce,
      }).toString()}`
      //window.log.log(target_url)
      const win = window.open(target_url, '_blank', 'toolbar=no,innerWidth=500,innerHeight=700')
      const ival = window.setInterval(() => {
        if (win === null || win.closed) {
          window.clearInterval(ival)
          const idToken = localStorage.getItem('id_token') ?? undefined
          setIdToken(idToken)
          if (idToken === undefined) {
            localStorage.removeItem('nonce')
            setNonce(undefined)
          }
          resolve()
        }
      }, 100)
    })
  }

  const logout = async () => {
    localStorage.removeItem('id_token')
    localStorage.removeItem('nonce')
    setIdToken(undefined)
    setNonce(undefined)
  }

  const decodeJWT = (jwt: string): { [key: string]: any } => {
    const dataJWT = jwt.split('.')[1]
    if (!dataJWT) {
      return {}
    }
    const dataBase64 = dataJWT.replace(/-/g, '+').replace(/_/g, '/')
    const dataValue = decodeURIComponent(
      atob(dataBase64)
        .split('')
        .map(function (c) {
          return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)
        })
        .join('')
    )

    return JSON.parse(dataValue)
  }

  useEffect(() => {
    if (idToken === undefined) {
      return
    }

    if (nonce === null) {
      ;(async () => await logout())()
      return
    }

    const { eth_address, whitelisted, exp, nonce: jwtNonce } = decodeJWT(idToken)

    if (nonce !== jwtNonce) {
      // replay attack might be happening, reject the token
      ;(async () => await logout())()
      return
    }

    setAddress(eth_address)
    setWhitelisted(whitelisted !== undefined)

    let now = Date.now()

    if (now > exp * 1000) {
      ;(async () => await logout())()
      return
    }

    /* if we want to log out after that amount of time, could also silently login
        setTimeout(async () => {
          if (idToken === localStorage.getItem("id_token")) {
            await logout()
          }
        }, exp * 1000 - now)
         */
  }, [idToken])

  return (
    <AuthContext.Provider
      value={{
        idToken,
        nonce,
        login,
        logout,
        address,
        whitelisted,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuthContext = () => useContext(AuthContext)
