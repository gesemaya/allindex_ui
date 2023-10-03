import { UserPositions } from '@gfxlabs/oku'
import React, { createContext, useContext, useEffect, useState } from 'react'

interface IPositionMakerContext {
  editPosition: boolean
  setEditPosition: (value: boolean) => void
  slidePercent: string
  setSlidePercent: (value: string) => void
  updatePosition: boolean
  setUpdatePosition: (value: boolean) => void
  position: UserPositions | undefined
  setPosition: (position: UserPositions | undefined) => void
  setInputToken0: (value: string) => void
  setInputToken1: (value: string) => void
  inputToken0: string
  inputToken1: string
  lastInput: string
  setLastInput: (value: string) => void
}

const PositionMakerContext = createContext<IPositionMakerContext>({
  editPosition: false,
  setEditPosition: () => {},
  slidePercent: '0',
  setSlidePercent: () => {},
  updatePosition: true,
  setUpdatePosition: () => {},
  position: undefined,
  setPosition: () => {},
  setInputToken0: () => {},
  setInputToken1: () => {},
  inputToken0: '',
  inputToken1: '',
  lastInput: '',
  setLastInput: () => {},
})

interface IContext {
  children: React.ReactNode
}

export const PositionMakerContextProvider = (props: IContext) => {
  const { children } = props
  const [editPosition, setEditPosition] = useState<boolean>(false)
  const [updatePosition, setUpdatePosition] = useState<boolean>(true)
  const [slidePercent, setSlidePercent] = useState<string>('0')
  const [position, setPosition] = useState<UserPositions>()
  const [inputToken0, setInputToken0] = useState<string>('')
  const [inputToken1, setInputToken1] = useState<string>('')
  const [lastInput, setLastInput] = useState<string>('')

  useEffect(() => {
    setSlidePercent('0')
  }, [position])

  return (
    <PositionMakerContext.Provider
      value={{
        editPosition,
        setEditPosition,
        slidePercent,
        setSlidePercent,
        updatePosition,
        setUpdatePosition,
        position,
        setPosition,
        setInputToken0,
        setInputToken1,
        inputToken0,
        inputToken1,
        lastInput,
        setLastInput,
      }}
    >
      {children}
    </PositionMakerContext.Provider>
  )
}

export const usePositionMakerContext = () => useContext(PositionMakerContext)
