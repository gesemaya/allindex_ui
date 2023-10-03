import { useChainLoader } from '../../route/RouteWrapper'
import { orderPath } from '../../util/pathHelper'
import { useNavigate } from 'react-router-dom'

function ExpandOrderHistoryButton() {
  const navigate = useNavigate()
  const { currentChainInfo } = useChainLoader()
  return (
    <button
      className=" flex items-center"
      onClick={() => navigate(orderPath(currentChainInfo.internalName), { state: 'order' })}
    >
      <svg
        width="18"
        height="18"
        viewBox="0 0 18 18"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-4 h-6 stroke-[#6B7280] hover:stroke-[#7C85A2] stroke-current"
      >
        <path
          d="M10.125 4.5H3.9375C3.48995 4.5 3.06072 4.67779 2.74426 4.99426C2.42779 5.31073 2.25 5.73995 2.25 6.1875V14.0625C2.25 14.5101 2.42779 14.9393 2.74426 15.2557C3.06072 15.5722 3.48995 15.75 3.9375 15.75H11.8125C12.2601 15.75 12.6893 15.5722 13.0057 15.2557C13.3222 14.9393 13.5 14.5101 13.5 14.0625V7.875M10 7.875L15.75 2.25M15.75 2.25H11.8125M15.75 2.25V6.1875"
          strokeWidth="1.3"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </button>
  )
}

export default ExpandOrderHistoryButton
