import { GeoblockProtected } from '@/app/components/geoblock/geoblock'
import { WhitelistProtected } from '@/app/components/whitelist/protected'
import OfacList from '@/ofac.json'
import RouteWrapper from './route/RouteWrapper'
import './style.css'
import { useAccount } from 'wagmi'

function Main() {
  const { isConnected, address } = useAccount()
  const userAddress = address as string

  const onOfacList =
    address &&
    OfacList.some((item) => {
      return item.toLowerCase() === userAddress.toLowerCase()
    })
  const showSite = isConnected ? !onOfacList : true

  return (
    <WhitelistProtected>
      <GeoblockProtected>{showSite && <RouteWrapper />}</GeoblockProtected>
    </WhitelistProtected>
  )
}

export default Main
