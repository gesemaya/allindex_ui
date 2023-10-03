import { useChainLoader } from '../../route/RouteWrapper'
import { T1, T2 } from '../typography/Typography'
import { colors } from '../../constants/colors'
import { getChainIdFromName } from '../../constants/chainInfo'
import { useEffect, useState } from 'react'
import { useNetwork, useSwitchNetwork } from 'wagmi'

function SwitchNetworkBanner() {
  const [display, setDisplay] = useState('')
  const { currentChain, currentChainInfo } = useChainLoader()
  const { chain } = useNetwork()

  const { switchNetwork, isError } = useSwitchNetwork({
    onError(error) {
      window.log.log('Error', error)
    },
  })

  useEffect(() => {
    if (
      (chain && chain.id !== currentChain) ||
      (currentChainInfo.internalName && getChainIdFromName(currentChainInfo.internalName) === 0)
    ) {
      setDisplay('')
    } else {
      setDisplay('none')
    }
  }, [currentChain, chain, currentChainInfo])

  const onClose = () => setDisplay('none')

  return (
    <div className="absolute z-[100] flex right-10 bottom-10 " style={{ display: display }}>
      <button
        onClick={() => switchNetwork?.(currentChain)}
        className="relative   w-[347px] h-[97px] rounded-[10px] flex flex-row"
        style={{ backgroundColor: isError ? colors.yellow[800] : colors.blue[800] }}
      >
        <div className="h-full flex items-center p-4">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke={isError ? colors.yellow[100] : colors.blue[400]}
            className="w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
            />
          </svg>
        </div>
        <div className="flex flex-col items-start h-full py-4 gap-2 text-left">
          <T1 color={isError ? colors.yellow[100] : colors.blue[400]}>Switch networks</T1>
          <T2>Switch to {currentChainInfo.name} to continue trading on Oku</T2>
        </div>
        <div className="w-8 h-full h-full"></div>
      </button>
      <button onClick={onClose} className="absolute right-2 top-2">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth="1.5"
          stroke={isError ? colors.yellow[100] : colors.white}
          className="w-4 h-4"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  )
}

export default SwitchNetworkBanner
