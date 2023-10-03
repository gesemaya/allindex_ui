import { useWeb3Modal } from '@web3modal/wagmi/react'
import React, { createContext, useContext, useEffect, useState } from 'react'
import { Hex } from 'viem'

export type TransactionState = 'PENDING' | 'SUBMITTED' | 'SUCCESSFUL' | 'ERROR'

export interface TransactionContent {
  state: TransactionState
  transaction?: Hex
  message?: string
}

interface IModalContext {
  open: (options?: { uri: string; standaloneChains?: string[] | undefined } | undefined) => void
  close: () => void
  showSettingsModal: boolean
  setShowSettingsModal: (value: boolean) => void
  showChartLayoutModal: boolean
  setShowChartLayoutModal: (value: boolean) => void
  showMobileMenu: boolean
  setShowMobileMenu: (value: boolean) => void
  showClosePositionModal: boolean
  setShowClosePositionModal: (value: boolean) => void
  showClaimFeesModal: boolean
  setShowClaimFeesModal: (value: boolean) => void
  isLoading: boolean
  setIsLoading: (value: boolean) => void
  showTransactionsModal: boolean
  setShowTransactionsModal: (value: boolean) => void

  transactionContent: TransactionContent | undefined
  setTransactionContent: (value: TransactionContent | undefined) => void

  showCreatePoolModal: boolean
  setShowCreatePoolModal: React.Dispatch<React.SetStateAction<boolean>>
}

const ModalContext = createContext<IModalContext>({
  open: () => {},
  close: () => {},
  showSettingsModal: false,
  setShowSettingsModal: () => {},
  showChartLayoutModal: false,
  setShowChartLayoutModal: () => {},
  showMobileMenu: false,
  setShowMobileMenu: () => {},
  showClosePositionModal: false,
  setShowClosePositionModal: () => {},
  showClaimFeesModal: false,
  setShowClaimFeesModal: () => {},
  isLoading: true,
  setIsLoading: () => {},
  showTransactionsModal: false,
  setShowTransactionsModal: () => {},

  transactionContent: undefined,
  showCreatePoolModal: false,
  setShowCreatePoolModal: () => {},
  setTransactionContent: () => {},
})

interface IContext {
  children: React.ReactNode
}

export const ModalContextProvider = (props: IContext) => {
  const { children } = props
  const [showSettingsModal, setShowSettingsModal] = useState<boolean>(false)
  const [showChartLayoutModal, setShowChartLayoutModal] = useState<boolean>(false)
  const [showMobileMenu, setShowMobileMenu] = useState<boolean>(false)
  const [showClosePositionModal, setShowClosePositionModal] = useState<boolean>(false)
  const [showClaimFeesModal, setShowClaimFeesModal] = useState<boolean>(false)
  const [showTransactionsModal, setShowTransactionsModal] = useState<boolean>(false)
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [transactionContent, setTransactionContent] = useState<TransactionContent>()
  const { open, close } = useWeb3Modal()
  const [showCreatePoolModal, setShowCreatePoolModal] = useState<boolean>(false)

  useEffect(() => {
    if (!showTransactionsModal) {
      setTransactionContent(undefined)
    }
  }, [showTransactionsModal])

  return (
    <ModalContext.Provider
      value={{
        open: () => {
          open()
        },
        close,
        showSettingsModal,
        setShowSettingsModal,
        showChartLayoutModal,
        setShowChartLayoutModal,
        setShowMobileMenu,
        showMobileMenu,
        showClosePositionModal,
        setShowClosePositionModal,
        showClaimFeesModal,
        setShowClaimFeesModal,
        isLoading,
        setIsLoading,
        showTransactionsModal,
        setShowTransactionsModal,

        transactionContent,
        setTransactionContent,

        showCreatePoolModal,
        setShowCreatePoolModal,
      }}
    >
      {children}
    </ModalContext.Provider>
  )
}

export const useModalContext = () => useContext(ModalContext)
