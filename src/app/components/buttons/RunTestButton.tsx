import Loader from '../../assets/loader.svg'
import { colors } from '../../constants/colors'

interface IButton {
  onClick: () => void
  disabled?: boolean
  loading?: boolean
}

function RunTestButton(props: IButton) {
  const { onClick, disabled, loading } = props

  const btnBackgroundColor = disabled ? `bg-[${colors.gray[800]}]` : `bg-[${colors.blue[400]}] hover:opacity-80`
  const textColor = disabled ? `text-[#587BFF]` : `text-white`

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`w-[109px] h-[28px] flex items-center justify-center rounded-[8px] $ ${btnBackgroundColor}`}
    >
      {loading ? (
        // spinning loader
        <img src={Loader} alt="spinning loader" className="h-[16px] center mx-auto my-4 animate-spin" />
      ) : (
        <div className={`font-semibold text-xs ${textColor}`}>Run back tests</div>
      )}
    </button>
  )
}

export default RunTestButton
