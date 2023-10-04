import { track } from '@multibase/js'
import { PublicClient, erc20ABI } from '@wagmi/core'
import { useEffect, useState } from 'react'
import { CanoeClient } from '@/canoe/CanoeClient'
import { OrderBannerEnums } from '../components/banners/OrderBanners'
import { CHAIN_INFO, IChainInfo } from '../constants/chainInfo'
import { useConfigContext } from '../context/naked/ConfigContext'
import { useTelemetryContext } from '../context/naked/TelemetryContext'
import { recordTelemetry } from '../data/telemetry_record'
import { IToken, NewDefaultToken } from '../lib/getToken'
import { useDebounceState } from './useDebounce'
import { useQuery } from '@tanstack/react-query'
import { zkSync } from 'wagmi/chains'
import { Address, SendTransactionParameters, getContract } from 'viem'
import { getPermitData } from '@/app/v3-sdk/permit2'
import { WalletClientWithAccount } from '../context/NetworkContext'

export interface RequestQuoteParams {
  chain: string
  tokenAmount: string
  isExactIn: boolean
  gasPrice: number
  slippage: number
}

export interface ExecuteTradeParams {
  signer: WalletClientWithAccount
  provider: PublicClient
}

export interface ExecutionStatus {
  pending: boolean
  current: number
  total: number
}

export const useSwapRouter = (args: {
  chainInfo: IChainInfo
  signer?: WalletClientWithAccount
  provider?: PublicClient
}) => {
  const { chainInfo, signer, provider } = args
  const defaultToken = NewDefaultToken(chainInfo.id)
  const [fromToken, setFromTokenRaw] = useState<IToken>(defaultToken)
  const [toToken, setToTokenRaw] = useState<IToken>(defaultToken)
  const [currentRequest, setCurrentRequest] = useDebounceState<RequestQuoteParams | undefined>(undefined, 50)
  const [orderFormState, setOrderFormState] = useState<undefined | OrderBannerEnums>()

  const [inExecution, setInExecution] = useState(false)

  const { telemetryRpc } = useTelemetryContext()
  const {
    features: { Telemetry },
  } = useConfigContext()

  const [currentTransaction, setCurrentTransaction] = useState<string | undefined>(undefined)
  const [transactionPending, setTransactionPending] = useState(false)

  const setFromToken = (t?: IToken) => {
    if (t) {
      setFromTokenRaw(t)
    } else {
      setFromTokenRaw(defaultToken)
    }
  }
  const setToToken = (t?: IToken) => {
    if (t) {
      setToTokenRaw(t)
    } else {
      setToTokenRaw(defaultToken)
    }
  }

  const {
    data: routeData,
    isFetching: isFetchingPrice,
    refetch: refetchRouteData,
  } = useQuery({
    cacheTime: 0,
    refetchOnWindowFocus: false,
    queryKey: ['swap_order_quote', currentRequest],
    queryFn: ({ signal }) => {
      const args = currentRequest
      if (!fromToken || !toToken || !args || !signer) {
        return null
      }
      const { chain, tokenAmount, isExactIn } = args
      const payload = {
        chain: chain,
        account: signer.account.address,
        inTokenAddress: fromToken.address,
        outTokenAddress: toToken.address,
        isExactIn: isExactIn,
        gasPrice: args.gasPrice,
        slippage: args.slippage,
      } as any
      if (isExactIn) {
        payload.inTokenAmount = tokenAmount.toString()
      } else {
        payload.outTokenAmount = tokenAmount.toString()
      }
      const request = canoe.default.postMarketSwapQuote('usor', payload)
      signal?.addEventListener('abort', () => {
        request.cancel()
      })
      return request
    },
  })

  const refetchCurrentRequest = () => {
    setCurrentRequest(currentRequest)
  }

  useEffect(() => {
    if (inExecution) {
      return
    }
    refetchRouteData()
  }, [currentRequest])

  const canoe = new CanoeClient({
    //BASE: 'http://localhost:3333',
    BASE: 'https://oku-canoe.fly.dev',
  })

  //const canoe = new CanoeClient(

  // executeTrade executes the trade
  const executeTrade = async () => {
    setInExecution(true)
    try {
      // if fetching, don't do anything
      if (isFetchingPrice || !routeData || !signer || !provider) {
        return
      }

      const currentRoute = { ...routeData }
      const coupon = { ...currentRoute.coupon }
      const signingRequest = { ...currentRoute.signingRequest }

      // now populate any signatures that exist
      setOrderFormState(OrderBannerEnums.SIGNATURE)
      //if (signingRequest && signingRequest.typedData) {
      //  for (const [idx, toSign] of signingRequest.typedData.entries()) {
      //    const { domain, types, values } = toSign.payload
      //    signer.signTypedData
      //    const signature = await signer.signTypedData({domain, types, primaryType: "Permit2", message: (values})
      //    signingRequest.typedData[idx].signature = signature
      //  }
      //}

      // TODO: we only support one permit signature. supporting more is sorta complicated so we will not do that for now.
      if (signingRequest && signingRequest.permit2Address && signingRequest.permitSignature) {
        const thisPermit = signingRequest.permitSignature[0]
        if (thisPermit && !thisPermit.signature) {
          const args = getPermitData(
            signer.account.address,
            thisPermit.permit,
            signingRequest.permit2Address,
            currentRoute.chainId
          )
          const signature = await signer.signTypedData(args)
          signingRequest.permitSignature[0].signature = signature
        }
      }
      setOrderFormState(OrderBannerEnums.SIGNED)

      const executionRequest = {
        coupon: coupon,
        signingRequest: signingRequest,
      }
      window.log.log('execution request', executionRequest)

      // obtain the execution info after returning the correctly signed permit2
      const executionInfo = await canoe.default.postExecutionInformation('usor', executionRequest)

      window.log.log('execution info', executionInfo)

      // first do any approvals
      setOrderFormState(OrderBannerEnums.TOKEN_APPROVAL)
      if (executionInfo.approvals) {
        for (const approval of executionInfo.approvals) {
          let tokenInAmount = BigInt(approval.amount)
          const tokenInContract = getContract({
            address: approval.address as `0x${string}`,
            abi: erc20ABI,
            walletClient: signer,
            publicClient: provider,
          })
          // make sure approved to permit2

          let currentApproved = await tokenInContract.read.allowance([
            signer.account.address,
            approval.approvee as `0x${string}`,
          ])
          window.log.log('current approval', tokenInAmount, currentApproved, approval, approval.amount)
          // if there is not enough, request approval
          while (tokenInAmount > currentApproved) {
            const approving = await tokenInContract.write.approve(
              [approval.approvee as Address, BigInt(approval.amount)],
              {
                chain: signer.chain,
                account: signer.account,
              }
            )
            setCurrentTransaction(approving)
            setOrderFormState(OrderBannerEnums.TOKEN_APPROVAL_IN_PROGRESS)
            setTransactionPending(true)
            await provider.waitForTransactionReceipt({ hash: approving })
            setTransactionPending(false)
            setOrderFormState(OrderBannerEnums.TOKEN_APPROVED)
            currentApproved = await tokenInContract.read.allowance([
              signer.account.address,
              approval.approvee as `0x${string}`,
            ])
          }
        }
      }
      setOrderFormState(OrderBannerEnums.TOKEN_APPROVED)

      // TODO: apply the helper transactions
      //    if (executionInfo.transactions) {
      //      for (const txn of executionInfo.transactions) {
      //      }
      //    }

      // now execute the tr11ade itself
      setOrderFormState(OrderBannerEnums.EXECUTE_TRADE)
      const swapTxn = executionInfo.trade
      const transaction: SendTransactionParameters = {
        data: swapTxn.data as `0x${string}`,
        to: swapTxn.to as `0x${string}`,
        value: swapTxn.value ? BigInt(swapTxn.value) : undefined,
        account: signer.account.address,
        gasPrice: undefined,
        chain: signer.chain,
      }
      if (currentRoute.chainId !== zkSync.id) {
        transaction.accessList = swapTxn.accessList
      }
      // gas estimate
      const gasEstimate = await provider.estimateGas(transaction)
      const gasPrice = await provider.getGasPrice()
      transaction.gas = (gasEstimate * 12n) / 10n
      transaction.gasPrice = gasPrice
      window.log.log('sending txn', transaction)
      const tx = await signer.sendTransaction(transaction)
      setOrderFormState(OrderBannerEnums.EXECUTE_TRADE_IN_PROGRESS)
      setCurrentTransaction(tx)
      setTransactionPending(true)
      const receipt = await provider.waitForTransactionReceipt({ hash: tx }).finally(() => {
        setTransactionPending(false)
      })
      setOrderFormState(OrderBannerEnums.EXECUTE_TRADE_SUCCESS)
      if (Telemetry.enabled) {
        await recordTelemetry(
          telemetryRpc,
          currentRoute.chainId,
          'trade',
          'market_order',
          signer.account.address,
          receipt.transactionHash,
          {}
        )
      }
      const currentChainInfo = CHAIN_INFO[currentRoute.chainId]
      if (currentChainInfo) {
        track('market_order', {
          chain: currentChainInfo.name,
          tokenIn: currentRoute.inToken.address,
          tokenOut: currentRoute.outToken.address,
          amountIn: currentRoute.inAmount,
          transaction: receipt.transactionHash,
        })
      }
    } catch (e) {
      window.log.error('failed to execute', e)
      setOrderFormState(OrderBannerEnums.EXECUTE_TRADE_ERROR)
    } finally {
      setCurrentRequest(undefined)
      setInExecution(false)
    }
    return
  }

  return {
    fromToken,
    toToken,
    setFromToken,
    setToToken,
    routeData,
    isFetchingPrice,
    currentRequest,
    inExecution,
    setCurrentRequest,
    executeTrade,
    currentTransaction,
    refetchCurrentRequest,
    transactionPending,
  }
}
