import React, { useCallback, useContext, useEffect, useState } from 'react'

export type WindowContextProps = {
  height: number
  width: number
}

export const WindowContext = React.createContext<WindowContextProps>({
  height: window.innerHeight,
  width: window.innerWidth,
})

interface IContext {
  children: React.ReactNode
}
export const WindowContextProvider = (props: IContext) => {
  const { children } = props

  const getVh = useCallback(() => {
    return Math.max(document.documentElement.clientHeight || 0, window.innerHeight || 0)
  }, [])
  const getVw = useCallback(() => {
    return Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0)
  }, [])
  const [height, setVh] = useState<number>(getVh())

  const [width, setVw] = useState<number>(getVw())
  useEffect(() => {
    const handleResize = () => {
      setVh(getVh())
      setVw(getVw())
    }
    window.addEventListener('resize', handleResize)
    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [getVh, getVw])
  return <WindowContext.Provider value={{ height, width }}>{children}</WindowContext.Provider>
}

export const useWindowContext = (): WindowContextProps => {
  const context = useContext<WindowContextProps>(WindowContext)

  if (context === null) {
    throw new Error('"useWindowContext" should be used inside a "WindowContextProvider"')
  }

  return context
}
