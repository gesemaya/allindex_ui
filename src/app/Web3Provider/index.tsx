import wagmiConfig from './client_config'
import { WagmiConfig } from 'wagmi'

export const Web3Provider = ({ children }: { children: JSX.Element }) => {
  return <WagmiConfig config={wagmiConfig}>{children}</WagmiConfig>
}
