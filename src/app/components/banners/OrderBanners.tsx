import { useChainLoader } from '../../route/RouteWrapper'
import { T2, T3 } from '../typography/Typography'
import { colors } from '../../constants/colors'
import { getHoverColor } from '../charts/utils/getHoverColor'
import styles from './orderBanner.module.css'
import { XMarkIcon } from '@heroicons/react/24/solid'
import { useState } from 'react'

export const SpinIcon = () => {
  return (
    <svg
      width="25"
      height="25"
      viewBox="0 0 25 25"
      className="animate-spin"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <mask id="mask0_702_848" maskUnits="userSpaceOnUse" x="5" y="5" width="15" height="15">
        <path d="M5.15625 5.15625H19.8437V19.8437H5.15625V5.15625Z" fill="white" />
      </mask>
      <g mask="url(#mask0_702_848)">
        <path
          d="M12.5 17.3438C9.80469 17.3438 7.65625 15.1562 7.65625 12.5C7.65625 9.80469 9.84375 7.65625 12.5 7.65625C15.1562 7.65625 17.3438 9.80469 17.3438 12.5C17.3438 15.1953 15.1953 17.3438 12.5 17.3438ZM12.5 5.15625C8.4375 5.15625 5.15625 8.47656 5.15625 12.5C5.15625 16.5625 8.47656 19.8437 12.5 19.8437C16.5234 19.8437 19.8437 16.5625 19.8437 12.5C19.8437 8.4375 16.5625 5.15625 12.5 5.15625Z"
          fill="#99A1BD"
        />
      </g>
      <mask id="mask1_702_848" maskUnits="userSpaceOnUse" x="5" y="5" width="15" height="15">
        <path d="M5.15625 5.15625H19.8437V19.8437H5.15625V5.15625Z" fill="white" />
      </mask>
      <g mask="url(#mask1_702_848)">
        <path
          d="M18.5937 11.25C17.8906 11.25 17.3438 11.7969 17.3438 12.5C17.3438 15.1953 15.1562 17.3438 12.5 17.3438C9.84375 17.3438 7.65625 15.1953 7.65625 12.5C7.65625 9.80469 9.80469 7.65625 12.5 7.65625C13.2031 7.65625 13.75 7.10937 13.75 6.40625C13.75 5.70312 13.2031 5.15625 12.5 5.15625C8.4375 5.15625 5.15625 8.47656 5.15625 12.5C5.15625 16.5234 8.4375 19.8437 12.5 19.8437C16.5625 19.8437 19.8437 16.5625 19.8437 12.5C19.8437 11.7969 19.2969 11.25 18.5937 11.25Z"
          fill="#4C82FB"
        />
      </g>
    </svg>
  )
}

export const ErrorIcon = ({ color = '#99A1BD' }: { color?: string }) => {
  return (
    <svg width="15" height="14" viewBox="0 0 15 14" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M7.73847 5.498V7.998M1.53647 10.2487C0.959134 11.2487 1.68113 12.498 2.83513 12.498H12.6418C13.7951 12.498 14.5171 11.2487 13.9405 10.2487L9.0378 1.75C8.46047 0.75 7.01647 0.75 6.43913 1.75L1.53647 10.2487ZM7.73847 9.998H7.74313V10.0033H7.73847V9.998Z"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export const GreenCheck = () => {
  return (
    <svg width="14" height="12" viewBox="0 0 14 12" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M12.5125 1.0125L4.375 9.15L1.4875 6.2625C1.1375 5.9125 0.6125 5.9125 0.2625 6.2625C-0.0875 6.6125 -0.0875 7.1375 0.2625 7.4875L3.7625 10.9875C3.9375 11.1625 4.1125 11.25 4.375 11.25C4.6375 11.25 4.8125 11.1625 4.9875 10.9875L13.7375 2.2375C14.0875 1.8875 14.0875 1.3625 13.7375 1.0125C13.3875 0.6625 12.8625 0.6625 12.5125 1.0125Z"
        fill="#5CFE9D"
      />
    </svg>
  )
}

export enum OrderBannerEnums {
  EXECUTE_TRADE = 'execute',
  EXECUTE_TRADE_IN_PROGRESS = 'executePending',
  EXECUTE_TRADE_SUCCESS = 'executeSuccess',
  EXECUTE_TRADE_ERROR = 'executeError',

  SIGNATURE = 'signature',
  SIGNATURE_IN_PROGRESS = 'signatureInProgress',
  SIGNED = 'signed',
  SIGNATURE_ERROR = 'signatureError',

  TOKEN_APPROVAL = 'tokenApproval',
  TOKEN_APPROVAL_IN_PROGRESS = 'tokenApprovalInProgress',
  TOKEN_APPROVED = 'tokenApproved',
  TOKEN_APPROVAL_ERROR = 'tokenApprovalError',

  EXECUTE_CLAIM = 'executeClaim',
  EXECUTE_CLAIM_IN_PROGRESS = 'executePendingClaim',
  EXECUTE_CLAIM_SUCCESS = 'executeSuccessClaim',
  EXECUTE_CLAIM_ERROR = 'executeErrorClaim',

  EXECUTE_CANCEL = 'executeCancel',
  EXECUTE_CANCEL_IN_PROGRESS = 'executePendingCancel',
  EXECUTE_CANCEL_SUCCESS = 'executeSuccessCancel',
  EXECUTE_CANCEL_ERROR = 'executeErrorCancel',

  EXECUTE_TRANSACTION = 'executeTransaction',
  EXECUTE_TRANSACTION_IN_PROGRESS = 'executePendingTransaction',
  EXECUTE_TRANSACTION_SUCCESS = 'executeSuccessTransaction',
  EXECUTE_TRANSACTION_ERROR = 'executeErrorTransaction',

  QUOTE_ERROR = 'quoteError',
  QUOTE_IN_PROGRESS = 'quoteInProgress',
  QUOTE_SUCCESS = 'quoteSuccess',
}

interface IOrderBanners {
  bannerState: OrderBannerEnums
  setBannerState: (value: undefined | OrderBannerEnums) => void
  transactionHash: undefined | string
}

const title = {
  tokenApproval: 'Approve token in wallet',
  tokenApprovalInProgress: 'Token approval in progress',
  tokenApproved: 'Token approved',
  tokenApprovalError: 'Error',

  signature: 'Sign order in wallet',
  signatureInProgress: 'Signature in progress',
  signed: 'Order Signed',
  signatureError: 'Error',

  execute: 'Confirm trade in wallet',
  executePending: 'Transaction in progress',
  executeSuccess: 'Transaction successful!',
  executeError: 'Error',

  executeClaim: 'Confirm claim in wallet',
  executePendingClaim: 'Transaction in progress',
  executeSuccessClaim: 'Transaction successful!',
  executeErrorClaim: 'Error',

  executeCancel: 'Confirm cancel in wallet',
  executePendingCancel: 'Transaction in progress',
  executeSuccessCancel: 'Transaction successful!',
  executeErrorCancel: 'Error',

  executeTransaction: 'Confirm transaction in wallet',
  executePendingTransaction: 'Transaction in progress',
  executeSuccessTransaction: 'Transaction successful!',
  executeErrorTransaction: 'Error',

  quoteError: 'Error',
  quoteInProgress: 'Quote in progress',
  quoteSuccess: 'Quote successful!',
}

const subTitle = {
  signature: { info: 'To continue with your transaction', link: false },
  signatureInProgress: { info: 'Your status will appear soon', link: false },
  signed: { info: 'To continue with your transaction', link: false },
  signatureError: { info: 'Check your wallet and try again', link: true },

  tokenApproval: { info: 'To continue with your transaction', link: false },
  tokenApprovalInProgress: { info: 'Your status will appear soon', link: false },
  tokenApproved: { info: 'To continue with your transaction', link: false },
  tokenApprovalError: { info: 'Check your wallet and try again', link: true },

  execute: { info: 'To continue with your transaction', link: false },
  executePending: { info: 'Your status will appear soon', link: false },
  executeSuccess: { info: 'View on block explorer', link: true },
  executeError: { info: 'Check your wallet and try again', link: true },

  executeClaim: { info: 'To continue with your transaction', link: false },
  executePendingClaim: { info: 'Your status will appear soon', link: false },
  executeSuccessClaim: { info: 'View on block explorer', link: true },
  executeErrorClaim: { info: 'Check your wallet and try again', link: true },

  executeCancel: { info: 'To continue with your transaction', link: false },
  executePendingCancel: { info: 'Your status will appear soon', link: false },
  executeSuccessCancel: { info: 'View on block explorer', link: true },
  executeErrorCancel: { info: 'Check your wallet and try again', link: true },

  executeTransaction: { info: 'To continue with your transaction', link: false },
  executePendingTransaction: { info: 'Your status will appear soon', link: false },
  executeSuccessTransaction: { info: 'View on block explorer', link: true },
  executeErrorTransaction: { info: 'Check your wallet and try again', link: true },

  quoteError: { info: 'Check your wallet and try again', link: false },
  quoteInProgress: { info: 'Your status will appear soon', link: false },
  quoteSuccess: { info: 'To continue with your transaction', link: false },
}

const icon = {
  executeError: <ErrorIcon />,
  execute: <SpinIcon />,
  executePending: <SpinIcon />,
  executeSuccess: <GreenCheck />,

  signature: <SpinIcon />,
  signatureInProgress: <SpinIcon />,
  signed: <GreenCheck />,
  signatureError: <ErrorIcon />,

  tokenApproval: <SpinIcon />,
  tokenApprovalInProgress: <SpinIcon />,
  tokenApproved: <GreenCheck />,
  tokenApprovalError: <ErrorIcon />,

  executeClaim: <SpinIcon />,
  executePendingClaim: <SpinIcon />,
  executeSuccessClaim: <GreenCheck />,
  executeErrorClaim: <ErrorIcon />,

  executeCancel: <SpinIcon />,
  executePendingCancel: <SpinIcon />,
  executeSuccessCancel: <GreenCheck />,
  executeErrorCancel: <ErrorIcon />,

  executeTransaction: <SpinIcon />,
  executePendingTransaction: <SpinIcon />,
  executeSuccessTransaction: <GreenCheck />,
  executeErrorTransaction: <ErrorIcon />,

  quoteError: <ErrorIcon />,
  quoteInProgress: <SpinIcon />,
  quoteSuccess: <GreenCheck />,
}

function OrderBanners(props: IOrderBanners) {
  const { currentChainInfo } = useChainLoader()
  const { bannerState, setBannerState, transactionHash } = props
  const [hover, setHover] = useState(false)
  // window.log.log(transactionHash)

  return (
    <div className={styles.banner}>
      <div
        className="w-[320px] h-[66px] rounded-[8px] flex flex-row items-center border-[1px] justify-between px-4"
        style={{
          backgroundColor: colors.gray[800],
          borderColor: OrderBannerEnums.EXECUTE_TRADE_SUCCESS === bannerState ? colors.blue[400] : colors.gray[600],
        }}
      >
        <div className="flex flex-row items-center">
          <div className=" pr-3">{icon[bannerState]}</div>
          <div className="flex flex-col gap-2">
            <T2>{title[bannerState]}</T2>
            {subTitle[bannerState].link && transactionHash ? (
              <a
                onMouseEnter={() => {
                  setHover(true)
                }}
                onMouseLeave={() => {
                  setHover(false)
                }}
                href={`${currentChainInfo.scanUrl}tx/${transactionHash}`}
                target="_blank"
                rel="noreferrer"
                className="border-b-[1px] w-fit"
                style={{ borderColor: !hover ? colors.blue[400] : getHoverColor(colors.blue[400]) }}
              >
                <T3 color={!hover ? colors.blue[400] : getHoverColor(colors.blue[400])}>
                  {subTitle[bannerState].info}
                </T3>
              </a>
            ) : (
              <T3 color={!hover ? colors.white : getHoverColor(colors.white)}>{subTitle[bannerState].info}</T3>
            )}
          </div>
        </div>
        <div className="h-full flex py-2 ">
          <button
            className="h-fit flex "
            onClick={() => {
              setBannerState(undefined)
            }}
          >
            <XMarkIcon fill={hover ? getHoverColor(colors.white) : colors.white} width={16} />
          </button>
        </div>
      </div>
    </div>
  )
}

export default OrderBanners

export const MinPendingBanner = () => {
  return (
    <div
      className={`px-5 py-3  fixed left-6 z-[40] bottom-6 flex items-center justify-center rounded-[8px] border-[1px] border-[${colors.gray[600]}] bg-[${colors.gray[800]}]`}
    >
      <SpinIcon />
    </div>
  )
}
