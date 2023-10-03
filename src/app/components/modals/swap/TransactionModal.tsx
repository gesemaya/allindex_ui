import { useChainLoader } from '../../../route/RouteWrapper'
import Check from '../../../assets/check.svg'
import Error from '../../../assets/error.svg'
import Loader from '../../../assets/loader.svg'
import { TransactionContent, useModalContext } from '../../../context/naked/ModalContext'
import { IChainInfo } from '../../../constants/chainInfo'
import BaseModal from '../BaseModal'

function TransactionModal() {
  const { setShowTransactionsModal, showTransactionsModal, transactionContent } = useModalContext()
  const { currentChainInfo } = useChainLoader()
  return (
    <BaseModal
      showModal={showTransactionsModal}
      onClose={() => setShowTransactionsModal(false)}
      showOverlay={false}
      showCloseButton={true}
    >
      <div className="transaction-modal flex flex-col gap-y-4 w-80 items-center text-white bg-[#0E0E0E] p-5 rounded-lg border-2 border-[#141B2B]">
        {TransactionStateSwitch(transactionContent, currentChainInfo)}
        <button
          className="transaction-modal-footer-button-close w-full px-8 py-1 bg-[#4C82FB] rounded-lg text-s font-semibold"
          onClick={() => setShowTransactionsModal(false)}
        >
          Close
        </button>
      </div>
    </BaseModal>
  )
}

export default TransactionModal

const TransactionStateSwitch = (transaction: TransactionContent | undefined, currentChain: IChainInfo) => {
  if (!transaction)
    return (
      <>
        <img src={Loader} alt="spinning loader" className="center mx-auto my-4 animate-spin" />
        <div className="transaction-modal-body-title">Confirm Transaction in wallet</div>
      </>
    )

  switch (transaction.state) {
    case 'PENDING':
      return (
        <>
          <img src={Loader} alt="spinning loader" className="center mx-auto my-4 animate-spin" />
          <div className="transaction-modal-body-title">Confirm Transaction in wallet</div>
          <div className="transaction-modal-body-description">{transaction.message}</div>
        </>
      )
    case 'SUBMITTED':
      return (
        <>
          <img src={Loader} alt="spinning loader" className="center mx-auto my-4 animate-spin" />
          <div className="transaction-modal-body-title">Transaction Submitted</div>
          <div className="transaction-modal-body-description">Your status will appear soon.</div>
        </>
      )
    case 'SUCCESSFUL':
      return (
        <>
          <img src={Check} alt="check" className="center mx-auto my-4" />
          <div className="transaction-modal-body-title">Success!</div>
          <a
            className="transaction-modal-body-description text-blue-400 underline"
            href={`${currentChain.scanUrl}/tx/${transaction.transaction}`}
            target="_blank"
            rel="noreferrer"
          >
            View on {currentChain.scanSite}
          </a>
        </>
      )
    case 'ERROR':
      return (
        <>
          <img src={Error} alt="error" className="center mx-auto my-4" />
          <div className="transaction-modal-body-title">Transaction Error</div>
          <div className="transaction-modal-body-description">{transaction.message}</div>
          {transaction.transaction ? (
            <a
              className="transaction-modal-body-description text-blue-400 underline"
              href={`${currentChain.scanUrl}tx/${transaction.transaction}`}
              target="_blank"
              rel="noreferrer"
            >
              View on {currentChain.scanSite}
            </a>
          ) : (
            <></>
          )}
        </>
      )
    default:
      return (
        <>
          <img src={Error} alt="error" className="center mx-auto my-4" />
          <div>Please try again later</div>
        </>
      )
  }
}
