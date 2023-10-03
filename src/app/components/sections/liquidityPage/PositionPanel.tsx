import useMobile from '../../../hooks/useMobile'
import { usePositionMakerContext } from '../../../context/PositionMakerContext'
import BaseSwitch from '../../switch/BaseSwitch'
import DeployPositionPanel from './DeployPositionPanel'

function PositionPanel() {
  const { editPosition, updatePosition, setUpdatePosition } = usePositionMakerContext()
  const { isMobile } = useMobile()

  return (
    <>
      <div className="flex flex-col w-fill gap-2">
        {editPosition || isMobile ? (
          <BaseSwitch item={updatePosition} setItem={setUpdatePosition} item1={'Increase'} item2={'Decrease'} />
        ) : (
          <></>
        )}
        <div className="h-full">
          <DeployPositionPanel />
        </div>
      </div>
    </>
  )
}

export default PositionPanel
