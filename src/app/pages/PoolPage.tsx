import { useConfigContext } from '../context/naked/ConfigContext'
import PoolPageLayout from '../components/layouts/mainPage/PoolPageLayout'
import { TrollBoxBar } from '../components/trollbox/trollbox'
import PairRow from '../components/navbar/PairRow'

export const PoolPage = () => {
  const {
    features: {
      Chat: { enabled: chatEnabled },
    },
  } = useConfigContext()
  return (
    <>
      <div className="pt-2 pb-1 px-1.5">
        <PairRow />
      </div>
      <PoolPageLayout />
      {/*{chatEnabled.toLowerCase() === 'true' ? <TrollBoxBar /> : <></>}*/}
    </>
  )
}
