import useBreakpoint from '../../hooks/useBreakpoint'

const ConnectWalletButton = () => {
  const labelText = useBreakpoint({ base: 'Connect', lg: 'Connect Wallet' })
  return (
    <div className="web3container">
      <w3m-button size={'sm'} balance="hide" label={labelText} />
    </div>
  )
}

export default ConnectWalletButton
