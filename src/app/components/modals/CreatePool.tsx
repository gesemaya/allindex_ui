import { isAddress, parseUnits } from 'viem'
import { T1, T2, T3 } from '../../components/typography/Typography'
import { ZERO_ADDRESS } from '../../constants/addresses'
import { colors } from '../../constants/colors'
import { useNetworkContext } from '../../context/NetworkContext'
import { useTrollboxContext } from '../../context/TrollboxContext'
import { useModalContext } from '../../context/naked/ModalContext'
import { createPoolAddLiqMulticall } from '../../contracts/createPoolAddLiqMulticall'
import { IToken, getTokenByAddress } from '../../lib/getToken'
import { useChainLoader } from '../../route/RouteWrapper'
import { getTickFromPrice } from '../../util/calculateTick'
import OrderBanners, { OrderBannerEnums } from '../banners/OrderBanners'
import CreatePoolFeeDropdown from '../dropdown/CreatePoolFee'
import CreatePoolRange from '../dropdown/CreatePoolRange'
import Input from '../inputs/NumberInput'
import { FormatNumber } from '../numbers/FormatNumber'
import BaseModal from './BaseModal'
import { TransactionReceipt } from '@ethersproject/providers'
import { FormEvent, useEffect, useMemo, useState } from 'react'
import { useAccount, useBalance } from 'wagmi'

export interface CreatePoolState {
  token0Address: string
  token1Address: string
  feeTier: number | undefined
  inputPrice: string
}

export interface AddLiquidityState {
  range: number | undefined
  minPrice: string
  maxPrice: string
  token0Amount: string
  token1Amount: string
}

export const CreatePoolModal = () => {
  const { setShowCreatePoolModal, showCreatePoolModal } = useModalContext()
  const [step, setStep] = useState<number>(0)
  const { currentChainInfo } = useChainLoader()
  const [createPoolState, setCreatePoolState] = useState<CreatePoolState>({
    token0Address: '',
    token1Address: '',
    feeTier: 3000,
    inputPrice: '',
  })

  const [addLiquidityState, setAddLiquidityState] = useState<AddLiquidityState>({
    range: undefined,
    minPrice: '',
    maxPrice: '',
    token0Amount: '',
    token1Amount: '',
  })

  useEffect(() => {
    setCreatePoolState({
      token0Address: '',
      token1Address: '',
      feeTier: 3000,
      inputPrice: '',
    })
    setAddLiquidityState({
      range: undefined,
      minPrice: '',
      maxPrice: '',
      token0Amount: '',
      token1Amount: '',
    })
  }, [showCreatePoolModal])

  const token0 = useMemo(() => {
    if (isAddress(createPoolState.token0Address)) {
      const tokenByAddress = getTokenByAddress(createPoolState.token0Address, currentChainInfo.id)
      if (tokenByAddress.address !== ZERO_ADDRESS) {
        return tokenByAddress
      }

      return { ...tokenByAddress, address: createPoolState.token0Address } as IToken
    }
    return undefined
  }, [createPoolState.token0Address])

  const token1 = useMemo(() => {
    if (isAddress(createPoolState.token1Address)) {
      const tokenByAddress = getTokenByAddress(createPoolState.token1Address, currentChainInfo.id)

      if (tokenByAddress.address !== ZERO_ADDRESS) {
        return tokenByAddress
      }

      return { ...tokenByAddress, address: createPoolState.token1Address } as IToken
    }
    return undefined
  }, [createPoolState.token1Address])

  return (
    <BaseModal
      showModal={showCreatePoolModal}
      showCloseButton={true}
      offsetTop="20vh"
      onClose={() => setShowCreatePoolModal(false)}
    >
      <div className="bg-[#0B0B0E] rounded-xl p-4 text-gray-400 border-[1px] border-gray-700">
        {step === 0 ? (
          <CreatePoolStep1
            onSubmit={() => setStep(1)}
            createPoolState={createPoolState}
            setCreatePoolState={setCreatePoolState}
          />
        ) : (
          <AddLiquidityStep2
            addLiquidityState={addLiquidityState}
            setAddLiquidityState={setAddLiquidityState}
            onBack={() => setStep(0)}
            createPoolState={createPoolState}
            token0={token0}
            token1={token1}
          />
        )}
      </div>
    </BaseModal>
  )
}

const CreatePoolStep1 = ({
  onSubmit,
  createPoolState,
  setCreatePoolState,
}: {
  onSubmit: () => void
  createPoolState: CreatePoolState
  setCreatePoolState: React.Dispatch<React.SetStateAction<CreatePoolState>>
}) => {
  const [disabled, setDisabled] = useState<boolean>(true)

  useEffect(() => {
    setDisabled(
      !(
        isAddress(createPoolState.token1Address) &&
        isAddress(createPoolState.token0Address) &&
        createPoolState.feeTier !== undefined &&
        createPoolState.inputPrice !== ''
      )
    )
  }, [createPoolState])

  useEffect(() => {
    if (isAddress(createPoolState.token0Address) && isAddress(createPoolState.token1Address)) {
      const address0 = BigInt(createPoolState.token0Address)
      const address1 = BigInt(createPoolState.token1Address)
      if (address1 < address0) {
        setCreatePoolState((state) => {
          return {
            ...state,
            token0Address: createPoolState.token1Address,
            token1Address: createPoolState.token0Address,
          }
        })
      }
    }
  }, [createPoolState.token0Address, createPoolState.token1Address])

  return (
    <div>
      <T1 fontSize={24} color={colors.gray[50]}>
        {' '}
        Create a new pool
      </T1>

      <form onSubmit={onSubmit} className="flex flex-col gap-y-8 mt-8 mb-6">
        <div className="flex flex-row gap-2">
          <div className="flex flex-col">
            <T1 fontSize={17} color={colors.gray[400]}>
              {' '}
              Token 0 Address
            </T1>
            <input
              className="bg-[#0B0B0E] w-64 placeholder:text-[#5E6887] focus:outline-0 placeholder:text-[12px] text-xs placeholder:font-normal rounded-lg border border-gray-700 p-2 mt-2"
              value={createPoolState.token0Address}
              placeholder="0x9434...5543"
              onChange={(e) => {
                setCreatePoolState((state) => {
                  return { ...state, token0Address: e.target.value }
                })
              }}
            />
          </div>
          <div className="flex flex-col">
            <T1 fontSize={17} color={colors.gray[400]}>
              {' '}
              Token 1 Address
            </T1>
            <input
              className="bg-[#0B0B0E] w-64 border-gray-700 placeholder:text-[#5E6887] focus:outline-0 text-xs placeholder:text-[12px] placeholder:font-normal rounded-lg border p-2 mt-2"
              value={createPoolState.token1Address}
              placeholder="0x9434...5543"
              onChange={(e) => {
                setCreatePoolState((state) => {
                  return { ...state, token1Address: e.target.value }
                })
              }}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div className="flex flex-col w-full">
            <T1 fontSize={17} color={colors.gray[400]} className="mb-2">
              Choose Fee Tier
            </T1>

            <CreatePoolFeeDropdown
              fee={createPoolState.feeTier}
              setFee={(fee) => {
                setCreatePoolState((state) => {
                  return { ...state, feeTier: fee }
                })
              }}
            />
          </div>
          <div className="flex flex-col">
            <T1 fontSize={17} color={colors.gray[400]}>
              Input Price
            </T1>
            <Input
              classes="w-64 bg-[#0B0B0E] placeholder:text-[#5E6887] focus:outline-0 placeholder:text-[12px] placeholder:font-normal rounded-lg border-gray-700 p-2 mt-2 text-xs"
              style={{ borderStyle: 'solid', borderWidth: '1px' }}
              value={createPoolState.inputPrice}
              onUserInput={(value) =>
                setCreatePoolState((state) => {
                  return { ...state, inputPrice: value }
                })
              }
            />

            {createPoolState.inputPrice !== '' ? (
              <div className="h-3 pt-1">
                <T3 fontSize={12} color={colors.gray[400]}>
                  {createPoolState.inputPrice} Token1 per Token0
                </T3>
              </div>
            ) : (
              <div className="h-3"></div>
            )}
          </div>
        </div>

        <button
          className="flex w-full justify-center items-center h-[38px] rounded-[8px] text-[16px] font-semibold bg-blue-400 hover:bg-[#0050FF] disabled:bg-[#1B1F2D] disabled:text-gray-600 text-white"
          disabled={disabled}
        >
          Next
        </button>

        <div className="flex items-center m-auto">
          <span className="w-2 h-2 rounded-full bg-white mr-1"></span>
          <span className="w-2 h-2 rounded-full border border-white"></span>
        </div>
      </form>
    </div>
  )
}

const AddLiquidityStep2 = ({
  addLiquidityState,
  setAddLiquidityState,
  onBack,
  createPoolState,
  token0,
  token1,
}: {
  addLiquidityState: AddLiquidityState
  setAddLiquidityState: React.Dispatch<React.SetStateAction<AddLiquidityState>>
  onBack: () => void
  createPoolState: CreatePoolState
  token0: IToken | undefined
  token1: IToken | undefined
}) => {
  const [disabled, setDisabled] = useState<boolean>(true)
  const { currentChainInfo } = useChainLoader()
  const { provider, signer } = useNetworkContext()
  const { address } = useAccount()
  const [orderFormState, setOrderFormState] = useState<undefined | OrderBannerEnums>()
  const [isTransactionPending, setIsTransactionPending] = useState<boolean>(false)
  const [txHash, setTxHash] = useState<string>('')
  const { maximized, trollboxX } = useTrollboxContext()

  const balanceToken0 = useBalance({
    address: address,
    token: token0?.address as `0x${string}`,
    chainId: currentChainInfo.id,
    watch: true,
  })

  const balanceToken1 = useBalance({
    address: address,
    token: token1?.address as `0x${string}`,
    chainId: currentChainInfo.id,
    watch: true,
  })

  useEffect(() => {
    if (!token0 || !token1 || addLiquidityState.token0Amount === '' || addLiquidityState.token1Amount === '') {
      setDisabled(true)
      return
    }
    const token0Parsed = parseUnits(addLiquidityState.token0Amount, token0.decimals)
    const token1Parsed = parseUnits(addLiquidityState.token1Amount, token1.decimals)

    if (balanceToken0?.data && balanceToken1.data) {
      if (balanceToken0.data?.value < token0Parsed || balanceToken1?.data?.value < token1Parsed) {
        setDisabled(true)
        return
      }
    }

    setDisabled(addLiquidityState.minPrice === '' || addLiquidityState.maxPrice === '')
  }, [addLiquidityState])

  useEffect(() => {
    // use createPoolState.inputPrice and range to calculate minPrice and maxPrice
    if (addLiquidityState.range && token0 && token1 && addLiquidityState.range !== undefined) {
      const rangeHalf = addLiquidityState.range / 2

      const priceMin = parseFloat(createPoolState.inputPrice) * (1 - rangeHalf / 100)
      const priceMax = parseFloat(createPoolState.inputPrice) * (1 + rangeHalf / 100)

      setAddLiquidityState((prevState) => {
        return {
          ...prevState,
          minPrice: priceMin.toString(),
          maxPrice: priceMax.toString(),
        }
      })
    }
  }, [addLiquidityState.range])

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const { feeTier, inputPrice } = createPoolState
    const { token0Amount, token1Amount, minPrice, maxPrice } = addLiquidityState
    window.log.log(token0, token1)
    if (!token0 || !token1 || !signer || !address || !provider) return
    try {
      setOrderFormState(OrderBannerEnums.EXECUTE_TRANSACTION)
      const minTick = getTickFromPrice(parseFloat(minPrice), token0.decimals, token1.decimals, true)
      const maxTick = getTickFromPrice(parseFloat(maxPrice), token0.decimals, token1.decimals, true)

      const txn = await createPoolAddLiqMulticall(
        token0,
        token1,
        feeTier!,
        parseFloat(inputPrice),
        parseFloat(token0Amount),
        parseFloat(token1Amount),
        address,
        { lower: minTick, upper: maxTick },
        signer,
        provider,
        currentChainInfo.id
      )
      setOrderFormState(OrderBannerEnums.EXECUTE_TRANSACTION_IN_PROGRESS)

      const txnReceipt = await provider.waitForTransactionReceipt({ hash: txn })

      setOrderFormState(OrderBannerEnums.EXECUTE_TRANSACTION_SUCCESS)
      setTxHash(txnReceipt.transactionHash)

      return txnReceipt
    } catch (err) {
      const error = err as TransactionReceipt

      window.log.log(error)

      setTxHash(error.transactionHash)
      setOrderFormState(OrderBannerEnums.EXECUTE_TRANSACTION_ERROR)
    }
  }

  return (
    <div>
      <T1 fontSize={24} color={colors.gray[50]}>
        {' '}
        Add Liquidity
      </T1>
      {createPoolState.feeTier && (
        <div className="text-white text-sm mt-5">Fee Tier: {createPoolState.feeTier / 10000}%</div>
      )}
      <form onSubmit={onSubmit} className="flex flex-col gap-y-4 mt-8 mb-6 ">
        <div className="flex flex-col gap-y-2">
          <T1 fontSize={17} color={colors.gray[400]}>
            Set Range
          </T1>

          <CreatePoolRange setAddLiquidityState={setAddLiquidityState} addLiquidityState={addLiquidityState} />
        </div>
        <div className="grid grid-cols-2 gap-2">
          <div className="flex flex-col w-full">
            <T1 fontSize={17} color={colors.gray[400]}>
              {' '}
              Min Price
            </T1>
            <Input
              classes="bg-[#0B0B0E] placeholder:text-[#5E6887] focus:outline-0 placeholder:text-[12px] placeholder:font-normal rounded-lg border border-gray-700 p-2 mt-2 w-full"
              style={{ borderStyle: 'solid', borderWidth: '1px', minWidth: 275 }}
              value={addLiquidityState.minPrice}
              onUserInput={(value) =>
                setAddLiquidityState((state) => {
                  return { ...state, range: undefined, minPrice: value }
                })
              }
            />
          </div>
          <div className="flex flex-col w-full">
            <T1 fontSize={17} color={colors.gray[400]}>
              {' '}
              Max Price
            </T1>
            <Input
              classes="bg-[#0B0B0E] w-full border-gray-700 placeholder:text-[#5E6887] focus:outline-0 placeholder:text-[12px] placeholder:font-normal rounded-lg border p-2 mt-2"
              style={{ borderStyle: 'solid', borderWidth: '1px', minWidth: 275 }}
              value={addLiquidityState.maxPrice}
              onUserInput={(value) =>
                setAddLiquidityState((state) => {
                  return { ...state, range: undefined, maxPrice: value }
                })
              }
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2 items-end">
          <div className="flex flex-col">
            <T1 fontSize={17} color={colors.gray[400]}>
              {' '}
              Enter Amount
            </T1>
            <div className="rounded-lg border-gray-700 border flex flex-row items-center mt-2 px-1 gap-x-1">
              <div className="flex items-center gap-1 bg-gray-700 rounded-lg py-1 px-2 h-fit">
                <img src={token0?.logoURI} alt={token0?.symbol} className="h-3 w-3 rounded-full" />
                <T2>{token0?.symbol}</T2>
              </div>
              <Input
                classes="w-auto bg-[#0B0B0E] h-10 placeholder:text-[#5E6887] focus:outline-0 placeholder:text-[12px] placeholder:font-normal p-2 "
                style={{ width: 'auto' }}
                value={addLiquidityState.token0Amount}
                onUserInput={(value) =>
                  setAddLiquidityState((state) => {
                    return { ...state, token0Amount: value }
                  })
                }
              />
            </div>
            {balanceToken0.data && balanceToken0.data?.formatted && (
              <T3 color={colors.gray[400]} className="mt-2">
                {<FormatNumber num={balanceToken0.data?.formatted} />} {balanceToken0.data?.symbol}{' '}
              </T3>
            )}
          </div>
          <div>
            <div className="rounded-lg border-gray-700 border flex flex-row items-center mt-2 px-1 gap-x-1">
              <div className="flex items-center gap-1 bg-gray-700 rounded-lg py-1 px-2 h-fit">
                <img src={token1?.logoURI} alt={token1?.symbol} className="h-3 w-3 rounded-full" />
                <T2>{token1?.symbol}</T2>
              </div>
              <Input
                classes="w-auto bg-[#0B0B0E] h-10 placeholder:text-[#5E6887] focus:outline-0 placeholder:text-[12px] placeholder:font-normal  p-2 "
                style={{ width: 'auto' }}
                value={addLiquidityState.token1Amount}
                onUserInput={(value) =>
                  setAddLiquidityState((state) => {
                    return { ...state, token1Amount: value }
                  })
                }
              />
            </div>
            {balanceToken1.data && balanceToken1.data?.formatted && (
              <T3 color={colors.gray[400]} className="mt-2">
                {<FormatNumber num={balanceToken1.data?.formatted} />} {balanceToken1.data?.symbol}{' '}
              </T3>
            )}
          </div>
        </div>

        <button
          className="flex w-full justify-center items-center h-[38px] rounded-[8px] text-[16px] font-semibold bg-blue-400 hover:bg-[#0050FF] disabled:bg-[#1B1F2D] disabled:text-gray-600 text-white"
          disabled={disabled}
          type="submit"
        >
          Create Position
        </button>

        <div className="flex items-center m-auto">
          <span className="w-2 h-2 rounded-full border border-white mr-1 cursor-pointer" onClick={onBack}></span>
          <span className="w-2 h-2 rounded-full bg-white"></span>
        </div>
      </form>
      {orderFormState && (
        <BaseModal
          showModal={orderFormState !== undefined}
          onClose={() => {
            setOrderFormState(undefined)
          }}
          showOverlay={true}
          offsetTop={window.innerHeight - (maximized && trollboxX > -340 ? 550 : 120)}
          offsetRight={10}
        >
          <OrderBanners bannerState={orderFormState} setBannerState={setOrderFormState} transactionHash={txHash} />
        </BaseModal>
      )}
    </div>
  )
}
