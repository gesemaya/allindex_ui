interface IModalOverlay {
  onClose: () => void
  showOverlay: boolean
}

function ModalOverlay(props: IModalOverlay) {
  const { onClose, showOverlay = true } = props
  const overlayColor = showOverlay ? '#00000061' : '#00000000'
  return (
    <div className={`fixed h-full w-full left-0 top-0`} onClick={onClose} style={{ background: overlayColor }}></div>
  )
}

export default ModalOverlay
