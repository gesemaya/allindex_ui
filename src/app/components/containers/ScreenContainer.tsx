import SwitchNetworkBanner from '../banners/SwitchNetworkBanner'
import TopBar from '../navbar/TopBar'
import DashboardBackground from './DashboardBackground'
import { ReactElement } from 'react'
import { useAccount } from 'wagmi'

function ScreenContainer({ children }: { children: ReactElement }) {
  const { isConnected } = useAccount()
  return (
    <>
      {isConnected && <SwitchNetworkBanner />}
      <DashboardBackground>
        <TopBar />
        {children}
      </DashboardBackground>
    </>
  )
}

export default ScreenContainer
