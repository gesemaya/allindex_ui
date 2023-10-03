import { Address, Hex, PublicClient, SendTransactionParameters, WalletClient } from 'viem'
import { ZERO_ADDRESS } from '../constants/addresses'

/**
 * Returns the gas value plus a margin (30%) for unexpected or variable gas costs
 * @param value the gas value to pad
 */
export function calculateGasMargin(value: bigint): bigint {
  return (value * 130n) / 100n
}

export async function updateGasMargin(provider: PublicClient, transaction: SendTransactionParameters) {
  // build transaction
  const gasLimit = await provider.estimateGas(transaction)
  transaction.gas = gasLimit
  return transaction
}

export async function sendEncodedFunctionData(
  provider: PublicClient,
  signer: WalletClient,
  target: Address,
  data: Hex,
  options?: {
    value?: bigint
  }
) {
  return signer.sendTransaction(
    await updateGasMargin(provider, {
      to: target,
      data: data,
      chain: signer.chain,
      account: signer.account?.address || ZERO_ADDRESS,
      value: options?.value,
    })
  )
}
