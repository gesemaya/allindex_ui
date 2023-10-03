interface IButton {
  onClick: () => void
  children: string
  focus: boolean
}

function ChooseChartButton(props: IButton) {
  const { onClick, children, focus } = props
  return (
    <button
      onClick={onClick}
      className={'hover:bg-[#293249] w-[56px] py-[6px] rounded-lg text-[#C9D0E7] text-[12px] font-regular'}
      style={{ backgroundColor: focus ? '#293249' : undefined }}
    >
      {children}
    </button>
  )
}

export default ChooseChartButton
