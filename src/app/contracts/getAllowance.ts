import { erc20ABI } from '@wagmi/core'
import { PublicClient, Address, getContract, Hex, WalletClient } from 'viem'
import { ZERO_ADDRESS } from '../constants/addresses'

type EnsureAllowanceArgs = {
  signer: WalletClient
  provider: PublicClient

  token: Address
  approvee: Address
  amount: bigint
}

// TODO: maybe there needs to be a version of this that is more transparent about loading states. (maybe there doesnt, and thats the wallets job?)
export const approveIfNeeded = async (args: EnsureAllowanceArgs): Promise<Hex | undefined> => {
  const { signer, provider, token, approvee, amount } = args
  let approvalTarget = amount
  const tokenInContract = getContract({
    address: token,
    abi: erc20ABI,
    walletClient: signer,
    publicClient: provider,
  })
  const owner = signer.account?.address || ZERO_ADDRESS
  // make sure approved to permit2

  let currentApproved = await tokenInContract.read.allowance([owner, approvee])
  // if there is not enough, request approval
  while (approvalTarget > currentApproved) {
    const approving = await tokenInContract.write.approve([approvee, amount], {
      chain: signer.chain,
      account: owner,
    })
    await provider.waitForTransactionReceipt({ hash: approving })
    currentApproved = await tokenInContract.read.allowance([owner, approvee])
  }
  return undefined
}
