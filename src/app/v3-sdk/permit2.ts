import { Address, SignTypedDataParameters } from 'viem'

type PermitDetails = {
  token: string
  amount: string
  expiration: string
  nonce: string
}

type PermitSingle = {
  details: PermitDetails
  spender: string
  sigDeadline: string
}

const PERMIT_DETAILS = [
  { name: 'token', type: 'address' },
  { name: 'amount', type: 'uint160' },
  { name: 'expiration', type: 'uint48' },
  { name: 'nonce', type: 'uint48' },
] as const

const PERMIT_TYPES = {
  PermitSingle: [
    { name: 'details', type: 'PermitDetails' },
    { name: 'spender', type: 'address' },
    { name: 'sigDeadline', type: 'uint256' },
  ],
  PermitDetails: PERMIT_DETAILS,
} as const

function permit2Domain(permit2Address: string, chainId: number) {
  return {
    name: 'Permit2',
    chainId,
    verifyingContract: permit2Address as `0x${string}`,
  }
}

export function getPermitData(
  account: Address,
  permit: PermitSingle,
  permit2Address: string,
  chainId: number
): SignTypedDataParameters {
  const domain = permit2Domain(permit2Address, chainId)
  return {
    account,
    domain,
    types: PERMIT_TYPES,
    message: {
      spender: permit.spender as `0x${string}`,
      details: {
        nonce: Number(permit.details.nonce),
        token: permit.details.token as `0x{string}`,
        amount: BigInt(permit.details.amount),
        expiration: Number(permit.details.expiration),
      },
      sigDeadline: BigInt(permit.sigDeadline),
    },
    primaryType: 'PermitSingle' as keyof typeof PERMIT_TYPES,
  }
}
