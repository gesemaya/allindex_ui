import {
  getContract,
  GetContractArgs,
  readContract,
  ReadContractConfig,
  writeContract,
  WriteContractArgs,
  WriteContractPreparedArgs,
  WriteContractUnpreparedArgs,
  prepareWriteContract,
  PrepareWriteContractConfig,
} from 'wagmi/actions'

import {
  useContractRead,
  UseContractReadConfig,
  useContractWrite,
  UseContractWriteConfig,
  usePrepareContractWrite,
  UsePrepareContractWriteConfig,
  useContractEvent,
  UseContractEventConfig,
} from 'wagmi'
import { ReadContractResult, WriteContractMode, PrepareWriteContractResult } from 'wagmi/actions'

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// ERC20
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const erc20ABI = [
  {
    type: 'event',
    inputs: [
      { name: 'owner', type: 'address', indexed: true },
      { name: 'spender', type: 'address', indexed: true },
      { name: 'value', type: 'uint256', indexed: false },
    ],
    name: 'Approval',
  },
  {
    type: 'event',
    inputs: [
      { name: 'from', type: 'address', indexed: true },
      { name: 'to', type: 'address', indexed: true },
      { name: 'value', type: 'uint256', indexed: false },
    ],
    name: 'Transfer',
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [
      { name: 'owner', type: 'address' },
      { name: 'spender', type: 'address' },
    ],
    name: 'allowance',
    outputs: [{ type: 'uint256' }],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [
      { name: 'spender', type: 'address' },
      { name: 'amount', type: 'uint256' },
    ],
    name: 'approve',
    outputs: [{ type: 'bool' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [{ name: 'account', type: 'address' }],
    name: 'balanceOf',
    outputs: [{ type: 'uint256' }],
  },
  { stateMutability: 'view', type: 'function', inputs: [], name: 'decimals', outputs: [{ type: 'uint8' }] },
  { stateMutability: 'view', type: 'function', inputs: [], name: 'name', outputs: [{ type: 'string' }] },
  { stateMutability: 'view', type: 'function', inputs: [], name: 'symbol', outputs: [{ type: 'string' }] },
  { stateMutability: 'view', type: 'function', inputs: [], name: 'totalSupply', outputs: [{ type: 'uint256' }] },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [
      { name: 'recipient', type: 'address' },
      { name: 'amount', type: 'uint256' },
    ],
    name: 'transfer',
    outputs: [{ type: 'bool' }],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [
      { name: 'sender', type: 'address' },
      { name: 'recipient', type: 'address' },
      { name: 'amount', type: 'uint256' },
    ],
    name: 'transferFrom',
    outputs: [{ type: 'bool' }],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [
      { name: 'spender', type: 'address' },
      { name: 'addedValue', type: 'uint256' },
    ],
    name: 'increaseAllowance',
    outputs: [{ type: 'bool' }],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [
      { name: 'spender', type: 'address' },
      { name: 'subtractedValue', type: 'uint256' },
    ],
    name: 'decreaseAllowance',
    outputs: [{ type: 'bool' }],
  },
] as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// ERC721
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const erc721ABI = [
  {
    type: 'event',
    inputs: [
      { name: 'owner', type: 'address', indexed: true },
      { name: 'spender', type: 'address', indexed: true },
      { name: 'tokenId', type: 'uint256', indexed: true },
    ],
    name: 'Approval',
  },
  {
    type: 'event',
    inputs: [
      { name: 'owner', type: 'address', indexed: true },
      { name: 'operator', type: 'address', indexed: true },
      { name: 'approved', type: 'bool', indexed: false },
    ],
    name: 'ApprovalForAll',
  },
  {
    type: 'event',
    inputs: [
      { name: 'from', type: 'address', indexed: true },
      { name: 'to', type: 'address', indexed: true },
      { name: 'tokenId', type: 'uint256', indexed: true },
    ],
    name: 'Transfer',
  },
  {
    stateMutability: 'payable',
    type: 'function',
    inputs: [
      { name: 'spender', type: 'address' },
      { name: 'tokenId', type: 'uint256' },
    ],
    name: 'approve',
    outputs: [],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [{ name: 'account', type: 'address' }],
    name: 'balanceOf',
    outputs: [{ type: 'uint256' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [{ name: 'tokenId', type: 'uint256' }],
    name: 'getApproved',
    outputs: [{ type: 'address' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [
      { name: 'owner', type: 'address' },
      { name: 'operator', type: 'address' },
    ],
    name: 'isApprovedForAll',
    outputs: [{ type: 'bool' }],
  },
  { stateMutability: 'view', type: 'function', inputs: [], name: 'name', outputs: [{ type: 'string' }] },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [{ name: 'tokenId', type: 'uint256' }],
    name: 'ownerOf',
    outputs: [{ name: 'owner', type: 'address' }],
  },
  {
    stateMutability: 'payable',
    type: 'function',
    inputs: [
      { name: 'from', type: 'address' },
      { name: 'to', type: 'address' },
      { name: 'tokenId', type: 'uint256' },
    ],
    name: 'safeTransferFrom',
    outputs: [],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [
      { name: 'from', type: 'address' },
      { name: 'to', type: 'address' },
      { name: 'id', type: 'uint256' },
      { name: 'data', type: 'bytes' },
    ],
    name: 'safeTransferFrom',
    outputs: [],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [
      { name: 'operator', type: 'address' },
      { name: 'approved', type: 'bool' },
    ],
    name: 'setApprovalForAll',
    outputs: [],
  },
  { stateMutability: 'view', type: 'function', inputs: [], name: 'symbol', outputs: [{ type: 'string' }] },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [{ name: 'index', type: 'uint256' }],
    name: 'tokenByIndex',
    outputs: [{ type: 'uint256' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [
      { name: 'owner', type: 'address' },
      { name: 'index', type: 'uint256' },
    ],
    name: 'tokenByIndex',
    outputs: [{ name: 'tokenId', type: 'uint256' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [{ name: 'tokenId', type: 'uint256' }],
    name: 'tokenURI',
    outputs: [{ type: 'string' }],
  },
  { stateMutability: 'view', type: 'function', inputs: [], name: 'totalSupply', outputs: [{ type: 'uint256' }] },
  {
    stateMutability: 'payable',
    type: 'function',
    inputs: [
      { name: 'sender', type: 'address' },
      { name: 'recipient', type: 'address' },
      { name: 'tokenId', type: 'uint256' },
    ],
    name: 'transferFrom',
    outputs: [],
  },
] as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// chainlinkLimitOrder
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const chainlinkLimitOrderABI = [
  {
    stateMutability: 'nonpayable',
    type: 'constructor',
    inputs: [
      { name: '_owner', internalType: 'address', type: 'address' },
      { name: '_positionManager', internalType: 'contract NonFungiblePositionManager', type: 'address' },
      { name: 'wrappedNative', internalType: 'contract ERC20', type: 'address' },
      { name: 'link', internalType: 'contract LinkTokenInterface', type: 'address' },
      { name: '_registrar', internalType: 'contract IKeeperRegistrar', type: 'address' },
      { name: '_fastGasFeed', internalType: 'address', type: 'address' },
    ],
  },
  { type: 'error', inputs: [], name: 'LimitOrderRegistry__AmountShouldBeZero' },
  { type: 'error', inputs: [], name: 'LimitOrderRegistry__CenterITM' },
  { type: 'error', inputs: [], name: 'LimitOrderRegistry__ContractNotShutdown' },
  { type: 'error', inputs: [], name: 'LimitOrderRegistry__ContractShutdown' },
  { type: 'error', inputs: [], name: 'LimitOrderRegistry__DirectionMisMatch' },
  { type: 'error', inputs: [], name: 'LimitOrderRegistry__InvalidBatchId' },
  { type: 'error', inputs: [], name: 'LimitOrderRegistry__InvalidFillsPerUpkeep' },
  { type: 'error', inputs: [], name: 'LimitOrderRegistry__InvalidGasLimit' },
  { type: 'error', inputs: [], name: 'LimitOrderRegistry__InvalidGasPrice' },
  { type: 'error', inputs: [], name: 'LimitOrderRegistry__InvalidPositionId' },
  {
    type: 'error',
    inputs: [
      { name: 'targetTick', internalType: 'int24', type: 'int24' },
      { name: 'tickSpacing', internalType: 'int24', type: 'int24' },
    ],
    name: 'LimitOrderRegistry__InvalidTargetTick',
  },
  {
    type: 'error',
    inputs: [
      { name: 'upper', internalType: 'int24', type: 'int24' },
      { name: 'lower', internalType: 'int24', type: 'int24' },
    ],
    name: 'LimitOrderRegistry__InvalidTickRange',
  },
  {
    type: 'error',
    inputs: [
      { name: 'asset', internalType: 'address', type: 'address' },
      { name: 'minimum', internalType: 'uint256', type: 'uint256' },
      { name: 'amount', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'LimitOrderRegistry__MinimumNotMet',
  },
  {
    type: 'error',
    inputs: [{ name: 'asset', internalType: 'address', type: 'address' }],
    name: 'LimitOrderRegistry__MinimumNotSet',
  },
  { type: 'error', inputs: [], name: 'LimitOrderRegistry__NoLiquidityInOrder' },
  { type: 'error', inputs: [], name: 'LimitOrderRegistry__NoOrdersToFulfill' },
  {
    type: 'error',
    inputs: [
      { name: 'currentTick', internalType: 'int24', type: 'int24' },
      { name: 'targetTick', internalType: 'int24', type: 'int24' },
      { name: 'direction', internalType: 'bool', type: 'bool' },
    ],
    name: 'LimitOrderRegistry__OrderITM',
  },
  {
    type: 'error',
    inputs: [{ name: 'tokenId', internalType: 'uint256', type: 'uint256' }],
    name: 'LimitOrderRegistry__OrderNotInList',
  },
  {
    type: 'error',
    inputs: [{ name: 'batchId', internalType: 'uint128', type: 'uint128' }],
    name: 'LimitOrderRegistry__OrderNotReadyToClaim',
  },
  {
    type: 'error',
    inputs: [{ name: 'pool', internalType: 'address', type: 'address' }],
    name: 'LimitOrderRegistry__PoolAlreadySetup',
  },
  {
    type: 'error',
    inputs: [{ name: 'pool', internalType: 'address', type: 'address' }],
    name: 'LimitOrderRegistry__PoolNotSetup',
  },
  {
    type: 'error',
    inputs: [
      { name: 'user', internalType: 'address', type: 'address' },
      { name: 'batchId', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'LimitOrderRegistry__UserNotFound',
  },
  {
    type: 'error',
    inputs: [{ name: 'token', internalType: 'address', type: 'address' }],
    name: 'LimitOrderRegistry__ZeroFeesToWithdraw',
  },
  { type: 'error', inputs: [], name: 'LimitOrderRegistry__ZeroNativeBalance' },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'user', internalType: 'address', type: 'address', indexed: false },
      { name: 'amount0', internalType: 'uint128', type: 'uint128', indexed: false },
      { name: 'amount1', internalType: 'uint128', type: 'uint128', indexed: false },
      {
        name: 'affectedOrder',
        internalType: 'struct LimitOrderRegistry.BatchOrder',
        type: 'tuple',
        components: [
          { name: 'direction', internalType: 'bool', type: 'bool' },
          { name: 'tickUpper', internalType: 'int24', type: 'int24' },
          { name: 'tickLower', internalType: 'int24', type: 'int24' },
          { name: 'userCount', internalType: 'uint64', type: 'uint64' },
          { name: 'batchId', internalType: 'uint128', type: 'uint128' },
          { name: 'token0Amount', internalType: 'uint128', type: 'uint128' },
          { name: 'token1Amount', internalType: 'uint128', type: 'uint128' },
          { name: 'head', internalType: 'uint256', type: 'uint256' },
          { name: 'tail', internalType: 'uint256', type: 'uint256' },
        ],
        indexed: false,
      },
    ],
    name: 'CancelOrder',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'user', internalType: 'address', type: 'address', indexed: false },
      { name: 'batchId', internalType: 'uint128', type: 'uint128', indexed: false },
      { name: 'amount', internalType: 'uint256', type: 'uint256', indexed: false },
    ],
    name: 'ClaimOrder',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [{ name: 'pool', internalType: 'address', type: 'address', indexed: false }],
    name: 'LimitOrderSetup',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'user', internalType: 'address', type: 'address', indexed: false },
      { name: 'pool', internalType: 'address', type: 'address', indexed: false },
      { name: 'amount', internalType: 'uint128', type: 'uint128', indexed: false },
      { name: 'userTotal', internalType: 'uint128', type: 'uint128', indexed: false },
      {
        name: 'affectedOrder',
        internalType: 'struct LimitOrderRegistry.BatchOrder',
        type: 'tuple',
        components: [
          { name: 'direction', internalType: 'bool', type: 'bool' },
          { name: 'tickUpper', internalType: 'int24', type: 'int24' },
          { name: 'tickLower', internalType: 'int24', type: 'int24' },
          { name: 'userCount', internalType: 'uint64', type: 'uint64' },
          { name: 'batchId', internalType: 'uint128', type: 'uint128' },
          { name: 'token0Amount', internalType: 'uint128', type: 'uint128' },
          { name: 'token1Amount', internalType: 'uint128', type: 'uint128' },
          { name: 'head', internalType: 'uint256', type: 'uint256' },
          { name: 'tail', internalType: 'uint256', type: 'uint256' },
        ],
        indexed: false,
      },
    ],
    name: 'NewOrder',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'batchId', internalType: 'uint256', type: 'uint256', indexed: false },
      { name: 'pool', internalType: 'address', type: 'address', indexed: false },
    ],
    name: 'OrderFilled',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'user', internalType: 'address', type: 'address', indexed: true },
      { name: 'newOwner', internalType: 'address', type: 'address', indexed: true },
    ],
    name: 'OwnershipTransferred',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [{ name: 'isShutdown', internalType: 'bool', type: 'bool', indexed: false }],
    name: 'ShutdownChanged',
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [],
    name: 'FAST_GAS_HEARTBEAT',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [],
    name: 'LINK',
    outputs: [{ name: '', internalType: 'contract LinkTokenInterface', type: 'address' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [],
    name: 'MAX_FILLS_PER_UPKEEP',
    outputs: [{ name: '', internalType: 'uint16', type: 'uint16' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [],
    name: 'MAX_GAS_LIMIT',
    outputs: [{ name: '', internalType: 'uint32', type: 'uint32' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [],
    name: 'MAX_GAS_PRICE',
    outputs: [{ name: '', internalType: 'uint32', type: 'uint32' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [],
    name: 'POSITION_MANAGER',
    outputs: [{ name: '', internalType: 'contract NonFungiblePositionManager', type: 'address' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [],
    name: 'WRAPPED_NATIVE',
    outputs: [{ name: '', internalType: 'contract ERC20', type: 'address' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [],
    name: 'batchCount',
    outputs: [{ name: '', internalType: 'uint128', type: 'uint128' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [
      { name: '', internalType: 'uint128', type: 'uint128' },
      { name: '', internalType: 'address', type: 'address' },
    ],
    name: 'batchIdToUserDepositAmount',
    outputs: [{ name: '', internalType: 'uint128', type: 'uint128' }],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [
      { name: 'pool', internalType: 'contract UniswapV3Pool', type: 'address' },
      { name: 'targetTick', internalType: 'int24', type: 'int24' },
      { name: 'direction', internalType: 'bool', type: 'bool' },
      { name: 'deadline', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'cancelOrder',
    outputs: [
      { name: 'amount0', internalType: 'uint128', type: 'uint128' },
      { name: 'amount1', internalType: 'uint128', type: 'uint128' },
      { name: 'batchId', internalType: 'uint128', type: 'uint128' },
    ],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [{ name: 'checkData', internalType: 'bytes', type: 'bytes' }],
    name: 'checkUpkeep',
    outputs: [
      { name: 'upkeepNeeded', internalType: 'bool', type: 'bool' },
      { name: 'performData', internalType: 'bytes', type: 'bytes' },
    ],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [{ name: '', internalType: 'uint128', type: 'uint128' }],
    name: 'claim',
    outputs: [
      { name: 'pool', internalType: 'contract UniswapV3Pool', type: 'address' },
      { name: 'token0Amount', internalType: 'uint128', type: 'uint128' },
      { name: 'token1Amount', internalType: 'uint128', type: 'uint128' },
      { name: 'feePerUser', internalType: 'uint128', type: 'uint128' },
      { name: 'direction', internalType: 'bool', type: 'bool' },
      { name: 'isReadyForClaim', internalType: 'bool', type: 'bool' },
    ],
  },
  {
    stateMutability: 'payable',
    type: 'function',
    inputs: [
      { name: 'batchId', internalType: 'uint128', type: 'uint128' },
      { name: 'user', internalType: 'address', type: 'address' },
    ],
    name: 'claimOrder',
    outputs: [
      { name: '', internalType: 'contract ERC20', type: 'address' },
      { name: '', internalType: 'uint256', type: 'uint256' },
    ],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [],
    name: 'fastGasFeed',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [
      { name: 'pool', internalType: 'contract UniswapV3Pool', type: 'address' },
      { name: 'startingNode', internalType: 'uint256', type: 'uint256' },
      { name: 'targetTick', internalType: 'int24', type: 'int24' },
      { name: 'direction', internalType: 'bool', type: 'bool' },
    ],
    name: 'findSpot',
    outputs: [
      { name: 'proposedHead', internalType: 'uint256', type: 'uint256' },
      { name: 'proposedTail', internalType: 'uint256', type: 'uint256' },
    ],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [{ name: 'batchId', internalType: 'uint128', type: 'uint128' }],
    name: 'getClaim',
    outputs: [
      {
        name: '',
        internalType: 'struct LimitOrderRegistry.Claim',
        type: 'tuple',
        components: [
          { name: 'pool', internalType: 'contract UniswapV3Pool', type: 'address' },
          { name: 'token0Amount', internalType: 'uint128', type: 'uint128' },
          { name: 'token1Amount', internalType: 'uint128', type: 'uint128' },
          { name: 'feePerUser', internalType: 'uint128', type: 'uint128' },
          { name: 'direction', internalType: 'bool', type: 'bool' },
          { name: 'isReadyForClaim', internalType: 'bool', type: 'bool' },
        ],
      },
    ],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [{ name: 'batchId', internalType: 'uint128', type: 'uint128' }],
    name: 'getFeePerUser',
    outputs: [{ name: '', internalType: 'uint128', type: 'uint128' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [],
    name: 'getGasPrice',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [{ name: 'id', internalType: 'uint256', type: 'uint256' }],
    name: 'getOrderBook',
    outputs: [
      {
        name: '',
        internalType: 'struct LimitOrderRegistry.BatchOrder',
        type: 'tuple',
        components: [
          { name: 'direction', internalType: 'bool', type: 'bool' },
          { name: 'tickUpper', internalType: 'int24', type: 'int24' },
          { name: 'tickLower', internalType: 'int24', type: 'int24' },
          { name: 'userCount', internalType: 'uint64', type: 'uint64' },
          { name: 'batchId', internalType: 'uint128', type: 'uint128' },
          { name: 'token0Amount', internalType: 'uint128', type: 'uint128' },
          { name: 'token1Amount', internalType: 'uint128', type: 'uint128' },
          { name: 'head', internalType: 'uint256', type: 'uint256' },
          { name: 'tail', internalType: 'uint256', type: 'uint256' },
        ],
      },
    ],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [
      { name: '', internalType: 'contract UniswapV3Pool', type: 'address' },
      { name: '', internalType: 'bool', type: 'bool' },
      { name: '', internalType: 'int24', type: 'int24' },
      { name: '', internalType: 'int24', type: 'int24' },
    ],
    name: 'getPositionFromTicks',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
  },
  { stateMutability: 'nonpayable', type: 'function', inputs: [], name: 'initiateShutdown', outputs: [] },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [{ name: 'batchId', internalType: 'uint128', type: 'uint128' }],
    name: 'isOrderReadyForClaim',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [],
    name: 'isShutdown',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
  },
  { stateMutability: 'nonpayable', type: 'function', inputs: [], name: 'liftShutdown', outputs: [] },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [{ name: '', internalType: 'contract ERC20', type: 'address' }],
    name: 'minimumAssets',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [
      { name: 'pool', internalType: 'contract UniswapV3Pool', type: 'address' },
      { name: 'targetTick', internalType: 'int24', type: 'int24' },
      { name: 'amount', internalType: 'uint128', type: 'uint128' },
      { name: 'direction', internalType: 'bool', type: 'bool' },
      { name: 'startingNode', internalType: 'uint256', type: 'uint256' },
      { name: 'deadline', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'newOrder',
    outputs: [{ name: '', internalType: 'uint128', type: 'uint128' }],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [
      { name: '', internalType: 'address', type: 'address' },
      { name: '', internalType: 'address', type: 'address' },
      { name: '', internalType: 'uint256', type: 'uint256' },
      { name: '', internalType: 'bytes', type: 'bytes' },
    ],
    name: 'onERC721Received',
    outputs: [{ name: '', internalType: 'bytes4', type: 'bytes4' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    name: 'orderBook',
    outputs: [
      { name: 'direction', internalType: 'bool', type: 'bool' },
      { name: 'tickUpper', internalType: 'int24', type: 'int24' },
      { name: 'tickLower', internalType: 'int24', type: 'int24' },
      { name: 'userCount', internalType: 'uint64', type: 'uint64' },
      { name: 'batchId', internalType: 'uint128', type: 'uint128' },
      { name: 'token0Amount', internalType: 'uint128', type: 'uint128' },
      { name: 'token1Amount', internalType: 'uint128', type: 'uint128' },
      { name: 'head', internalType: 'uint256', type: 'uint256' },
      { name: 'tail', internalType: 'uint256', type: 'uint256' },
    ],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [],
    name: 'owner',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [{ name: 'performData', internalType: 'bytes', type: 'bytes' }],
    name: 'performUpkeep',
    outputs: [],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [{ name: '', internalType: 'contract UniswapV3Pool', type: 'address' }],
    name: 'poolToData',
    outputs: [
      { name: 'centerHead', internalType: 'uint256', type: 'uint256' },
      { name: 'centerTail', internalType: 'uint256', type: 'uint256' },
      { name: 'token0', internalType: 'contract ERC20', type: 'address' },
      { name: 'token1', internalType: 'contract ERC20', type: 'address' },
      { name: 'fee', internalType: 'uint24', type: 'uint24' },
    ],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [],
    name: 'registrar',
    outputs: [{ name: '', internalType: 'contract IKeeperRegistrar', type: 'address' }],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [{ name: 'feed', internalType: 'address', type: 'address' }],
    name: 'setFastGasFeed',
    outputs: [],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [{ name: 'newVal', internalType: 'uint16', type: 'uint16' }],
    name: 'setMaxFillsPerUpkeep',
    outputs: [],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [
      { name: 'amount', internalType: 'uint256', type: 'uint256' },
      { name: 'asset', internalType: 'contract ERC20', type: 'address' },
    ],
    name: 'setMinimumAssets',
    outputs: [],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [{ name: '_registrar', internalType: 'contract IKeeperRegistrar', type: 'address' }],
    name: 'setRegistrar',
    outputs: [],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [{ name: 'gasLimit', internalType: 'uint32', type: 'uint32' }],
    name: 'setUpkeepGasLimit',
    outputs: [],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [{ name: 'gasPrice', internalType: 'uint32', type: 'uint32' }],
    name: 'setUpkeepGasPrice',
    outputs: [],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [
      { name: 'pool', internalType: 'contract UniswapV3Pool', type: 'address' },
      { name: 'initialUpkeepFunds', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'setupLimitOrder',
    outputs: [],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [{ name: '', internalType: 'address', type: 'address' }],
    name: 'tokenToSwapFees',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [{ name: 'newOwner', internalType: 'address', type: 'address' }],
    name: 'transferOwnership',
    outputs: [],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [],
    name: 'upkeepGasLimit',
    outputs: [{ name: '', internalType: 'uint32', type: 'uint32' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [],
    name: 'upkeepGasPrice',
    outputs: [{ name: '', internalType: 'uint32', type: 'uint32' }],
  },
  { stateMutability: 'nonpayable', type: 'function', inputs: [], name: 'withdrawNative', outputs: [] },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [{ name: 'tokenFeeIsIn', internalType: 'address', type: 'address' }],
    name: 'withdrawSwapFees',
    outputs: [],
  },
] as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// permit2
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const permit2ABI = [
  { type: 'error', inputs: [{ name: 'deadline', internalType: 'uint256', type: 'uint256' }], name: 'AllowanceExpired' },
  { type: 'error', inputs: [], name: 'ExcessiveInvalidation' },
  {
    type: 'error',
    inputs: [{ name: 'amount', internalType: 'uint256', type: 'uint256' }],
    name: 'InsufficientAllowance',
  },
  { type: 'error', inputs: [{ name: 'maxAmount', internalType: 'uint256', type: 'uint256' }], name: 'InvalidAmount' },
  { type: 'error', inputs: [], name: 'InvalidContractSignature' },
  { type: 'error', inputs: [], name: 'InvalidNonce' },
  { type: 'error', inputs: [], name: 'InvalidSignature' },
  { type: 'error', inputs: [], name: 'InvalidSignatureLength' },
  { type: 'error', inputs: [], name: 'InvalidSigner' },
  { type: 'error', inputs: [], name: 'LengthMismatch' },
  {
    type: 'error',
    inputs: [{ name: 'signatureDeadline', internalType: 'uint256', type: 'uint256' }],
    name: 'SignatureExpired',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'owner', internalType: 'address', type: 'address', indexed: true },
      { name: 'token', internalType: 'address', type: 'address', indexed: true },
      { name: 'spender', internalType: 'address', type: 'address', indexed: true },
      { name: 'amount', internalType: 'uint160', type: 'uint160', indexed: false },
      { name: 'expiration', internalType: 'uint48', type: 'uint48', indexed: false },
    ],
    name: 'Approval',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'owner', internalType: 'address', type: 'address', indexed: true },
      { name: 'token', internalType: 'address', type: 'address', indexed: false },
      { name: 'spender', internalType: 'address', type: 'address', indexed: false },
    ],
    name: 'Lockdown',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'owner', internalType: 'address', type: 'address', indexed: true },
      { name: 'token', internalType: 'address', type: 'address', indexed: true },
      { name: 'spender', internalType: 'address', type: 'address', indexed: true },
      { name: 'newNonce', internalType: 'uint48', type: 'uint48', indexed: false },
      { name: 'oldNonce', internalType: 'uint48', type: 'uint48', indexed: false },
    ],
    name: 'NonceInvalidation',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'owner', internalType: 'address', type: 'address', indexed: true },
      { name: 'token', internalType: 'address', type: 'address', indexed: true },
      { name: 'spender', internalType: 'address', type: 'address', indexed: true },
      { name: 'amount', internalType: 'uint160', type: 'uint160', indexed: false },
      { name: 'expiration', internalType: 'uint48', type: 'uint48', indexed: false },
      { name: 'nonce', internalType: 'uint48', type: 'uint48', indexed: false },
    ],
    name: 'Permit',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'owner', internalType: 'address', type: 'address', indexed: true },
      { name: 'word', internalType: 'uint256', type: 'uint256', indexed: false },
      { name: 'mask', internalType: 'uint256', type: 'uint256', indexed: false },
    ],
    name: 'UnorderedNonceInvalidation',
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [],
    name: 'DOMAIN_SEPARATOR',
    outputs: [{ name: '', internalType: 'bytes32', type: 'bytes32' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [
      { name: '', internalType: 'address', type: 'address' },
      { name: '', internalType: 'address', type: 'address' },
      { name: '', internalType: 'address', type: 'address' },
    ],
    name: 'allowance',
    outputs: [
      { name: 'amount', internalType: 'uint160', type: 'uint160' },
      { name: 'expiration', internalType: 'uint48', type: 'uint48' },
      { name: 'nonce', internalType: 'uint48', type: 'uint48' },
    ],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [
      { name: 'token', internalType: 'address', type: 'address' },
      { name: 'spender', internalType: 'address', type: 'address' },
      { name: 'amount', internalType: 'uint160', type: 'uint160' },
      { name: 'expiration', internalType: 'uint48', type: 'uint48' },
    ],
    name: 'approve',
    outputs: [],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [
      { name: 'token', internalType: 'address', type: 'address' },
      { name: 'spender', internalType: 'address', type: 'address' },
      { name: 'newNonce', internalType: 'uint48', type: 'uint48' },
    ],
    name: 'invalidateNonces',
    outputs: [],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [
      { name: 'wordPos', internalType: 'uint256', type: 'uint256' },
      { name: 'mask', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'invalidateUnorderedNonces',
    outputs: [],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [
      {
        name: 'approvals',
        internalType: 'struct IAllowanceTransfer.TokenSpenderPair[]',
        type: 'tuple[]',
        components: [
          { name: 'token', internalType: 'address', type: 'address' },
          { name: 'spender', internalType: 'address', type: 'address' },
        ],
      },
    ],
    name: 'lockdown',
    outputs: [],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [
      { name: '', internalType: 'address', type: 'address' },
      { name: '', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'nonceBitmap',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [
      { name: 'owner', internalType: 'address', type: 'address' },
      {
        name: 'permitBatch',
        internalType: 'struct IAllowanceTransfer.PermitBatch',
        type: 'tuple',
        components: [
          {
            name: 'details',
            internalType: 'struct IAllowanceTransfer.PermitDetails[]',
            type: 'tuple[]',
            components: [
              { name: 'token', internalType: 'address', type: 'address' },
              { name: 'amount', internalType: 'uint160', type: 'uint160' },
              { name: 'expiration', internalType: 'uint48', type: 'uint48' },
              { name: 'nonce', internalType: 'uint48', type: 'uint48' },
            ],
          },
          { name: 'spender', internalType: 'address', type: 'address' },
          { name: 'sigDeadline', internalType: 'uint256', type: 'uint256' },
        ],
      },
      { name: 'signature', internalType: 'bytes', type: 'bytes' },
    ],
    name: 'permit',
    outputs: [],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [
      { name: 'owner', internalType: 'address', type: 'address' },
      {
        name: 'permitSingle',
        internalType: 'struct IAllowanceTransfer.PermitSingle',
        type: 'tuple',
        components: [
          {
            name: 'details',
            internalType: 'struct IAllowanceTransfer.PermitDetails',
            type: 'tuple',
            components: [
              { name: 'token', internalType: 'address', type: 'address' },
              { name: 'amount', internalType: 'uint160', type: 'uint160' },
              { name: 'expiration', internalType: 'uint48', type: 'uint48' },
              { name: 'nonce', internalType: 'uint48', type: 'uint48' },
            ],
          },
          { name: 'spender', internalType: 'address', type: 'address' },
          { name: 'sigDeadline', internalType: 'uint256', type: 'uint256' },
        ],
      },
      { name: 'signature', internalType: 'bytes', type: 'bytes' },
    ],
    name: 'permit',
    outputs: [],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [
      {
        name: 'permit',
        internalType: 'struct ISignatureTransfer.PermitTransferFrom',
        type: 'tuple',
        components: [
          {
            name: 'permitted',
            internalType: 'struct ISignatureTransfer.TokenPermissions',
            type: 'tuple',
            components: [
              { name: 'token', internalType: 'address', type: 'address' },
              { name: 'amount', internalType: 'uint256', type: 'uint256' },
            ],
          },
          { name: 'nonce', internalType: 'uint256', type: 'uint256' },
          { name: 'deadline', internalType: 'uint256', type: 'uint256' },
        ],
      },
      {
        name: 'transferDetails',
        internalType: 'struct ISignatureTransfer.SignatureTransferDetails',
        type: 'tuple',
        components: [
          { name: 'to', internalType: 'address', type: 'address' },
          { name: 'requestedAmount', internalType: 'uint256', type: 'uint256' },
        ],
      },
      { name: 'owner', internalType: 'address', type: 'address' },
      { name: 'signature', internalType: 'bytes', type: 'bytes' },
    ],
    name: 'permitTransferFrom',
    outputs: [],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [
      {
        name: 'permit',
        internalType: 'struct ISignatureTransfer.PermitBatchTransferFrom',
        type: 'tuple',
        components: [
          {
            name: 'permitted',
            internalType: 'struct ISignatureTransfer.TokenPermissions[]',
            type: 'tuple[]',
            components: [
              { name: 'token', internalType: 'address', type: 'address' },
              { name: 'amount', internalType: 'uint256', type: 'uint256' },
            ],
          },
          { name: 'nonce', internalType: 'uint256', type: 'uint256' },
          { name: 'deadline', internalType: 'uint256', type: 'uint256' },
        ],
      },
      {
        name: 'transferDetails',
        internalType: 'struct ISignatureTransfer.SignatureTransferDetails[]',
        type: 'tuple[]',
        components: [
          { name: 'to', internalType: 'address', type: 'address' },
          { name: 'requestedAmount', internalType: 'uint256', type: 'uint256' },
        ],
      },
      { name: 'owner', internalType: 'address', type: 'address' },
      { name: 'signature', internalType: 'bytes', type: 'bytes' },
    ],
    name: 'permitTransferFrom',
    outputs: [],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [
      {
        name: 'permit',
        internalType: 'struct ISignatureTransfer.PermitTransferFrom',
        type: 'tuple',
        components: [
          {
            name: 'permitted',
            internalType: 'struct ISignatureTransfer.TokenPermissions',
            type: 'tuple',
            components: [
              { name: 'token', internalType: 'address', type: 'address' },
              { name: 'amount', internalType: 'uint256', type: 'uint256' },
            ],
          },
          { name: 'nonce', internalType: 'uint256', type: 'uint256' },
          { name: 'deadline', internalType: 'uint256', type: 'uint256' },
        ],
      },
      {
        name: 'transferDetails',
        internalType: 'struct ISignatureTransfer.SignatureTransferDetails',
        type: 'tuple',
        components: [
          { name: 'to', internalType: 'address', type: 'address' },
          { name: 'requestedAmount', internalType: 'uint256', type: 'uint256' },
        ],
      },
      { name: 'owner', internalType: 'address', type: 'address' },
      { name: 'witness', internalType: 'bytes32', type: 'bytes32' },
      { name: 'witnessTypeString', internalType: 'string', type: 'string' },
      { name: 'signature', internalType: 'bytes', type: 'bytes' },
    ],
    name: 'permitWitnessTransferFrom',
    outputs: [],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [
      {
        name: 'permit',
        internalType: 'struct ISignatureTransfer.PermitBatchTransferFrom',
        type: 'tuple',
        components: [
          {
            name: 'permitted',
            internalType: 'struct ISignatureTransfer.TokenPermissions[]',
            type: 'tuple[]',
            components: [
              { name: 'token', internalType: 'address', type: 'address' },
              { name: 'amount', internalType: 'uint256', type: 'uint256' },
            ],
          },
          { name: 'nonce', internalType: 'uint256', type: 'uint256' },
          { name: 'deadline', internalType: 'uint256', type: 'uint256' },
        ],
      },
      {
        name: 'transferDetails',
        internalType: 'struct ISignatureTransfer.SignatureTransferDetails[]',
        type: 'tuple[]',
        components: [
          { name: 'to', internalType: 'address', type: 'address' },
          { name: 'requestedAmount', internalType: 'uint256', type: 'uint256' },
        ],
      },
      { name: 'owner', internalType: 'address', type: 'address' },
      { name: 'witness', internalType: 'bytes32', type: 'bytes32' },
      { name: 'witnessTypeString', internalType: 'string', type: 'string' },
      { name: 'signature', internalType: 'bytes', type: 'bytes' },
    ],
    name: 'permitWitnessTransferFrom',
    outputs: [],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [
      {
        name: 'transferDetails',
        internalType: 'struct IAllowanceTransfer.AllowanceTransferDetails[]',
        type: 'tuple[]',
        components: [
          { name: 'from', internalType: 'address', type: 'address' },
          { name: 'to', internalType: 'address', type: 'address' },
          { name: 'amount', internalType: 'uint160', type: 'uint160' },
          { name: 'token', internalType: 'address', type: 'address' },
        ],
      },
    ],
    name: 'transferFrom',
    outputs: [],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [
      { name: 'from', internalType: 'address', type: 'address' },
      { name: 'to', internalType: 'address', type: 'address' },
      { name: 'amount', internalType: 'uint160', type: 'uint160' },
      { name: 'token', internalType: 'address', type: 'address' },
    ],
    name: 'transferFrom',
    outputs: [],
  },
] as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// uniswapNftManager
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const uniswapNftManagerABI = [
  {
    stateMutability: 'nonpayable',
    type: 'constructor',
    inputs: [
      { name: '_factory', internalType: 'address', type: 'address' },
      { name: '_WETH9', internalType: 'address', type: 'address' },
      { name: '_tokenDescriptor_', internalType: 'address', type: 'address' },
    ],
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'owner', internalType: 'address', type: 'address', indexed: true },
      { name: 'approved', internalType: 'address', type: 'address', indexed: true },
      { name: 'tokenId', internalType: 'uint256', type: 'uint256', indexed: true },
    ],
    name: 'Approval',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'owner', internalType: 'address', type: 'address', indexed: true },
      { name: 'operator', internalType: 'address', type: 'address', indexed: true },
      { name: 'approved', internalType: 'bool', type: 'bool', indexed: false },
    ],
    name: 'ApprovalForAll',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'tokenId', internalType: 'uint256', type: 'uint256', indexed: true },
      { name: 'recipient', internalType: 'address', type: 'address', indexed: false },
      { name: 'amount0', internalType: 'uint256', type: 'uint256', indexed: false },
      { name: 'amount1', internalType: 'uint256', type: 'uint256', indexed: false },
    ],
    name: 'Collect',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'tokenId', internalType: 'uint256', type: 'uint256', indexed: true },
      { name: 'liquidity', internalType: 'uint128', type: 'uint128', indexed: false },
      { name: 'amount0', internalType: 'uint256', type: 'uint256', indexed: false },
      { name: 'amount1', internalType: 'uint256', type: 'uint256', indexed: false },
    ],
    name: 'DecreaseLiquidity',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'tokenId', internalType: 'uint256', type: 'uint256', indexed: true },
      { name: 'liquidity', internalType: 'uint128', type: 'uint128', indexed: false },
      { name: 'amount0', internalType: 'uint256', type: 'uint256', indexed: false },
      { name: 'amount1', internalType: 'uint256', type: 'uint256', indexed: false },
    ],
    name: 'IncreaseLiquidity',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'from', internalType: 'address', type: 'address', indexed: true },
      { name: 'to', internalType: 'address', type: 'address', indexed: true },
      { name: 'tokenId', internalType: 'uint256', type: 'uint256', indexed: true },
    ],
    name: 'Transfer',
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [],
    name: 'DOMAIN_SEPARATOR',
    outputs: [{ name: '', internalType: 'bytes32', type: 'bytes32' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [],
    name: 'PERMIT_TYPEHASH',
    outputs: [{ name: '', internalType: 'bytes32', type: 'bytes32' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [],
    name: 'WETH9',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [
      { name: 'to', internalType: 'address', type: 'address' },
      { name: 'tokenId', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'approve',
    outputs: [],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [{ name: 'owner', internalType: 'address', type: 'address' }],
    name: 'balanceOf',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
  },
  {
    stateMutability: 'pure',
    type: 'function',
    inputs: [],
    name: 'baseURI',
    outputs: [{ name: '', internalType: 'string', type: 'string' }],
  },
  {
    stateMutability: 'payable',
    type: 'function',
    inputs: [{ name: 'tokenId', internalType: 'uint256', type: 'uint256' }],
    name: 'burn',
    outputs: [],
  },
  {
    stateMutability: 'payable',
    type: 'function',
    inputs: [
      {
        name: 'params',
        internalType: 'struct INonfungiblePositionManager.CollectParams',
        type: 'tuple',
        components: [
          { name: 'tokenId', internalType: 'uint256', type: 'uint256' },
          { name: 'recipient', internalType: 'address', type: 'address' },
          { name: 'amount0Max', internalType: 'uint128', type: 'uint128' },
          { name: 'amount1Max', internalType: 'uint128', type: 'uint128' },
        ],
      },
    ],
    name: 'collect',
    outputs: [
      { name: 'amount0', internalType: 'uint256', type: 'uint256' },
      { name: 'amount1', internalType: 'uint256', type: 'uint256' },
    ],
  },
  {
    stateMutability: 'payable',
    type: 'function',
    inputs: [
      { name: 'token0', internalType: 'address', type: 'address' },
      { name: 'token1', internalType: 'address', type: 'address' },
      { name: 'fee', internalType: 'uint24', type: 'uint24' },
      { name: 'sqrtPriceX96', internalType: 'uint160', type: 'uint160' },
    ],
    name: 'createAndInitializePoolIfNecessary',
    outputs: [{ name: 'pool', internalType: 'address', type: 'address' }],
  },
  {
    stateMutability: 'payable',
    type: 'function',
    inputs: [
      {
        name: 'params',
        internalType: 'struct INonfungiblePositionManager.DecreaseLiquidityParams',
        type: 'tuple',
        components: [
          { name: 'tokenId', internalType: 'uint256', type: 'uint256' },
          { name: 'liquidity', internalType: 'uint128', type: 'uint128' },
          { name: 'amount0Min', internalType: 'uint256', type: 'uint256' },
          { name: 'amount1Min', internalType: 'uint256', type: 'uint256' },
          { name: 'deadline', internalType: 'uint256', type: 'uint256' },
        ],
      },
    ],
    name: 'decreaseLiquidity',
    outputs: [
      { name: 'amount0', internalType: 'uint256', type: 'uint256' },
      { name: 'amount1', internalType: 'uint256', type: 'uint256' },
    ],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [],
    name: 'factory',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [{ name: 'tokenId', internalType: 'uint256', type: 'uint256' }],
    name: 'getApproved',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
  },
  {
    stateMutability: 'payable',
    type: 'function',
    inputs: [
      {
        name: 'params',
        internalType: 'struct INonfungiblePositionManager.IncreaseLiquidityParams',
        type: 'tuple',
        components: [
          { name: 'tokenId', internalType: 'uint256', type: 'uint256' },
          { name: 'amount0Desired', internalType: 'uint256', type: 'uint256' },
          { name: 'amount1Desired', internalType: 'uint256', type: 'uint256' },
          { name: 'amount0Min', internalType: 'uint256', type: 'uint256' },
          { name: 'amount1Min', internalType: 'uint256', type: 'uint256' },
          { name: 'deadline', internalType: 'uint256', type: 'uint256' },
        ],
      },
    ],
    name: 'increaseLiquidity',
    outputs: [
      { name: 'liquidity', internalType: 'uint128', type: 'uint128' },
      { name: 'amount0', internalType: 'uint256', type: 'uint256' },
      { name: 'amount1', internalType: 'uint256', type: 'uint256' },
    ],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [
      { name: 'owner', internalType: 'address', type: 'address' },
      { name: 'operator', internalType: 'address', type: 'address' },
    ],
    name: 'isApprovedForAll',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
  },
  {
    stateMutability: 'payable',
    type: 'function',
    inputs: [
      {
        name: 'params',
        internalType: 'struct INonfungiblePositionManager.MintParams',
        type: 'tuple',
        components: [
          { name: 'token0', internalType: 'address', type: 'address' },
          { name: 'token1', internalType: 'address', type: 'address' },
          { name: 'fee', internalType: 'uint24', type: 'uint24' },
          { name: 'tickLower', internalType: 'int24', type: 'int24' },
          { name: 'tickUpper', internalType: 'int24', type: 'int24' },
          { name: 'amount0Desired', internalType: 'uint256', type: 'uint256' },
          { name: 'amount1Desired', internalType: 'uint256', type: 'uint256' },
          { name: 'amount0Min', internalType: 'uint256', type: 'uint256' },
          { name: 'amount1Min', internalType: 'uint256', type: 'uint256' },
          { name: 'recipient', internalType: 'address', type: 'address' },
          { name: 'deadline', internalType: 'uint256', type: 'uint256' },
        ],
      },
    ],
    name: 'mint',
    outputs: [
      { name: 'tokenId', internalType: 'uint256', type: 'uint256' },
      { name: 'liquidity', internalType: 'uint128', type: 'uint128' },
      { name: 'amount0', internalType: 'uint256', type: 'uint256' },
      { name: 'amount1', internalType: 'uint256', type: 'uint256' },
    ],
  },
  {
    stateMutability: 'payable',
    type: 'function',
    inputs: [{ name: 'data', internalType: 'bytes[]', type: 'bytes[]' }],
    name: 'multicall',
    outputs: [{ name: 'results', internalType: 'bytes[]', type: 'bytes[]' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [],
    name: 'name',
    outputs: [{ name: '', internalType: 'string', type: 'string' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [{ name: 'tokenId', internalType: 'uint256', type: 'uint256' }],
    name: 'ownerOf',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
  },
  {
    stateMutability: 'payable',
    type: 'function',
    inputs: [
      { name: 'spender', internalType: 'address', type: 'address' },
      { name: 'tokenId', internalType: 'uint256', type: 'uint256' },
      { name: 'deadline', internalType: 'uint256', type: 'uint256' },
      { name: 'v', internalType: 'uint8', type: 'uint8' },
      { name: 'r', internalType: 'bytes32', type: 'bytes32' },
      { name: 's', internalType: 'bytes32', type: 'bytes32' },
    ],
    name: 'permit',
    outputs: [],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [{ name: 'tokenId', internalType: 'uint256', type: 'uint256' }],
    name: 'positions',
    outputs: [
      { name: 'nonce', internalType: 'uint96', type: 'uint96' },
      { name: 'operator', internalType: 'address', type: 'address' },
      { name: 'token0', internalType: 'address', type: 'address' },
      { name: 'token1', internalType: 'address', type: 'address' },
      { name: 'fee', internalType: 'uint24', type: 'uint24' },
      { name: 'tickLower', internalType: 'int24', type: 'int24' },
      { name: 'tickUpper', internalType: 'int24', type: 'int24' },
      { name: 'liquidity', internalType: 'uint128', type: 'uint128' },
      { name: 'feeGrowthInside0LastX128', internalType: 'uint256', type: 'uint256' },
      { name: 'feeGrowthInside1LastX128', internalType: 'uint256', type: 'uint256' },
      { name: 'tokensOwed0', internalType: 'uint128', type: 'uint128' },
      { name: 'tokensOwed1', internalType: 'uint128', type: 'uint128' },
    ],
  },
  { stateMutability: 'payable', type: 'function', inputs: [], name: 'refundETH', outputs: [] },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [
      { name: 'from', internalType: 'address', type: 'address' },
      { name: 'to', internalType: 'address', type: 'address' },
      { name: 'tokenId', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'safeTransferFrom',
    outputs: [],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [
      { name: 'from', internalType: 'address', type: 'address' },
      { name: 'to', internalType: 'address', type: 'address' },
      { name: 'tokenId', internalType: 'uint256', type: 'uint256' },
      { name: '_data', internalType: 'bytes', type: 'bytes' },
    ],
    name: 'safeTransferFrom',
    outputs: [],
  },
  {
    stateMutability: 'payable',
    type: 'function',
    inputs: [
      { name: 'token', internalType: 'address', type: 'address' },
      { name: 'value', internalType: 'uint256', type: 'uint256' },
      { name: 'deadline', internalType: 'uint256', type: 'uint256' },
      { name: 'v', internalType: 'uint8', type: 'uint8' },
      { name: 'r', internalType: 'bytes32', type: 'bytes32' },
      { name: 's', internalType: 'bytes32', type: 'bytes32' },
    ],
    name: 'selfPermit',
    outputs: [],
  },
  {
    stateMutability: 'payable',
    type: 'function',
    inputs: [
      { name: 'token', internalType: 'address', type: 'address' },
      { name: 'nonce', internalType: 'uint256', type: 'uint256' },
      { name: 'expiry', internalType: 'uint256', type: 'uint256' },
      { name: 'v', internalType: 'uint8', type: 'uint8' },
      { name: 'r', internalType: 'bytes32', type: 'bytes32' },
      { name: 's', internalType: 'bytes32', type: 'bytes32' },
    ],
    name: 'selfPermitAllowed',
    outputs: [],
  },
  {
    stateMutability: 'payable',
    type: 'function',
    inputs: [
      { name: 'token', internalType: 'address', type: 'address' },
      { name: 'nonce', internalType: 'uint256', type: 'uint256' },
      { name: 'expiry', internalType: 'uint256', type: 'uint256' },
      { name: 'v', internalType: 'uint8', type: 'uint8' },
      { name: 'r', internalType: 'bytes32', type: 'bytes32' },
      { name: 's', internalType: 'bytes32', type: 'bytes32' },
    ],
    name: 'selfPermitAllowedIfNecessary',
    outputs: [],
  },
  {
    stateMutability: 'payable',
    type: 'function',
    inputs: [
      { name: 'token', internalType: 'address', type: 'address' },
      { name: 'value', internalType: 'uint256', type: 'uint256' },
      { name: 'deadline', internalType: 'uint256', type: 'uint256' },
      { name: 'v', internalType: 'uint8', type: 'uint8' },
      { name: 'r', internalType: 'bytes32', type: 'bytes32' },
      { name: 's', internalType: 'bytes32', type: 'bytes32' },
    ],
    name: 'selfPermitIfNecessary',
    outputs: [],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [
      { name: 'operator', internalType: 'address', type: 'address' },
      { name: 'approved', internalType: 'bool', type: 'bool' },
    ],
    name: 'setApprovalForAll',
    outputs: [],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [{ name: 'interfaceId', internalType: 'bytes4', type: 'bytes4' }],
    name: 'supportsInterface',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
  },
  {
    stateMutability: 'payable',
    type: 'function',
    inputs: [
      { name: 'token', internalType: 'address', type: 'address' },
      { name: 'amountMinimum', internalType: 'uint256', type: 'uint256' },
      { name: 'recipient', internalType: 'address', type: 'address' },
    ],
    name: 'sweepToken',
    outputs: [],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [],
    name: 'symbol',
    outputs: [{ name: '', internalType: 'string', type: 'string' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [{ name: 'index', internalType: 'uint256', type: 'uint256' }],
    name: 'tokenByIndex',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [
      { name: 'owner', internalType: 'address', type: 'address' },
      { name: 'index', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'tokenOfOwnerByIndex',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [{ name: 'tokenId', internalType: 'uint256', type: 'uint256' }],
    name: 'tokenURI',
    outputs: [{ name: '', internalType: 'string', type: 'string' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [],
    name: 'totalSupply',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [
      { name: 'from', internalType: 'address', type: 'address' },
      { name: 'to', internalType: 'address', type: 'address' },
      { name: 'tokenId', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'transferFrom',
    outputs: [],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [
      { name: 'amount0Owed', internalType: 'uint256', type: 'uint256' },
      { name: 'amount1Owed', internalType: 'uint256', type: 'uint256' },
      { name: 'data', internalType: 'bytes', type: 'bytes' },
    ],
    name: 'uniswapV3MintCallback',
    outputs: [],
  },
  {
    stateMutability: 'payable',
    type: 'function',
    inputs: [
      { name: 'amountMinimum', internalType: 'uint256', type: 'uint256' },
      { name: 'recipient', internalType: 'address', type: 'address' },
    ],
    name: 'unwrapWETH9',
    outputs: [],
  },
  { stateMutability: 'payable', type: 'receive' },
] as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// uniswapV3Pool
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const uniswapV3PoolABI = [
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'owner', internalType: 'address', type: 'address', indexed: true },
      { name: 'tickLower', internalType: 'int24', type: 'int24', indexed: true },
      { name: 'tickUpper', internalType: 'int24', type: 'int24', indexed: true },
      { name: 'amount', internalType: 'uint128', type: 'uint128', indexed: false },
      { name: 'amount0', internalType: 'uint256', type: 'uint256', indexed: false },
      { name: 'amount1', internalType: 'uint256', type: 'uint256', indexed: false },
    ],
    name: 'Burn',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'owner', internalType: 'address', type: 'address', indexed: true },
      { name: 'recipient', internalType: 'address', type: 'address', indexed: false },
      { name: 'tickLower', internalType: 'int24', type: 'int24', indexed: true },
      { name: 'tickUpper', internalType: 'int24', type: 'int24', indexed: true },
      { name: 'amount0', internalType: 'uint128', type: 'uint128', indexed: false },
      { name: 'amount1', internalType: 'uint128', type: 'uint128', indexed: false },
    ],
    name: 'Collect',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'sender', internalType: 'address', type: 'address', indexed: true },
      { name: 'recipient', internalType: 'address', type: 'address', indexed: true },
      { name: 'amount0', internalType: 'uint128', type: 'uint128', indexed: false },
      { name: 'amount1', internalType: 'uint128', type: 'uint128', indexed: false },
    ],
    name: 'CollectProtocol',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'sender', internalType: 'address', type: 'address', indexed: true },
      { name: 'recipient', internalType: 'address', type: 'address', indexed: true },
      { name: 'amount0', internalType: 'uint256', type: 'uint256', indexed: false },
      { name: 'amount1', internalType: 'uint256', type: 'uint256', indexed: false },
      { name: 'paid0', internalType: 'uint256', type: 'uint256', indexed: false },
      { name: 'paid1', internalType: 'uint256', type: 'uint256', indexed: false },
    ],
    name: 'Flash',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'observationCardinalityNextOld', internalType: 'uint16', type: 'uint16', indexed: false },
      { name: 'observationCardinalityNextNew', internalType: 'uint16', type: 'uint16', indexed: false },
    ],
    name: 'IncreaseObservationCardinalityNext',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'sqrtPriceX96', internalType: 'uint160', type: 'uint160', indexed: false },
      { name: 'tick', internalType: 'int24', type: 'int24', indexed: false },
    ],
    name: 'Initialize',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'sender', internalType: 'address', type: 'address', indexed: false },
      { name: 'owner', internalType: 'address', type: 'address', indexed: true },
      { name: 'tickLower', internalType: 'int24', type: 'int24', indexed: true },
      { name: 'tickUpper', internalType: 'int24', type: 'int24', indexed: true },
      { name: 'amount', internalType: 'uint128', type: 'uint128', indexed: false },
      { name: 'amount0', internalType: 'uint256', type: 'uint256', indexed: false },
      { name: 'amount1', internalType: 'uint256', type: 'uint256', indexed: false },
    ],
    name: 'Mint',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'feeProtocol0Old', internalType: 'uint8', type: 'uint8', indexed: false },
      { name: 'feeProtocol1Old', internalType: 'uint8', type: 'uint8', indexed: false },
      { name: 'feeProtocol0New', internalType: 'uint8', type: 'uint8', indexed: false },
      { name: 'feeProtocol1New', internalType: 'uint8', type: 'uint8', indexed: false },
    ],
    name: 'SetFeeProtocol',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'sender', internalType: 'address', type: 'address', indexed: true },
      { name: 'recipient', internalType: 'address', type: 'address', indexed: true },
      { name: 'amount0', internalType: 'int256', type: 'int256', indexed: false },
      { name: 'amount1', internalType: 'int256', type: 'int256', indexed: false },
      { name: 'sqrtPriceX96', internalType: 'uint160', type: 'uint160', indexed: false },
      { name: 'liquidity', internalType: 'uint128', type: 'uint128', indexed: false },
      { name: 'tick', internalType: 'int24', type: 'int24', indexed: false },
    ],
    name: 'Swap',
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [
      { name: 'tickLower', internalType: 'int24', type: 'int24' },
      { name: 'tickUpper', internalType: 'int24', type: 'int24' },
      { name: 'amount', internalType: 'uint128', type: 'uint128' },
    ],
    name: 'burn',
    outputs: [
      { name: 'amount0', internalType: 'uint256', type: 'uint256' },
      { name: 'amount1', internalType: 'uint256', type: 'uint256' },
    ],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [
      { name: 'recipient', internalType: 'address', type: 'address' },
      { name: 'tickLower', internalType: 'int24', type: 'int24' },
      { name: 'tickUpper', internalType: 'int24', type: 'int24' },
      { name: 'amount0Requested', internalType: 'uint128', type: 'uint128' },
      { name: 'amount1Requested', internalType: 'uint128', type: 'uint128' },
    ],
    name: 'collect',
    outputs: [
      { name: 'amount0', internalType: 'uint128', type: 'uint128' },
      { name: 'amount1', internalType: 'uint128', type: 'uint128' },
    ],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [
      { name: 'recipient', internalType: 'address', type: 'address' },
      { name: 'amount0Requested', internalType: 'uint128', type: 'uint128' },
      { name: 'amount1Requested', internalType: 'uint128', type: 'uint128' },
    ],
    name: 'collectProtocol',
    outputs: [
      { name: 'amount0', internalType: 'uint128', type: 'uint128' },
      { name: 'amount1', internalType: 'uint128', type: 'uint128' },
    ],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [],
    name: 'factory',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [],
    name: 'fee',
    outputs: [{ name: '', internalType: 'uint24', type: 'uint24' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [],
    name: 'feeGrowthGlobal0X128',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [],
    name: 'feeGrowthGlobal1X128',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [
      { name: 'recipient', internalType: 'address', type: 'address' },
      { name: 'amount0', internalType: 'uint256', type: 'uint256' },
      { name: 'amount1', internalType: 'uint256', type: 'uint256' },
      { name: 'data', internalType: 'bytes', type: 'bytes' },
    ],
    name: 'flash',
    outputs: [],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [{ name: 'observationCardinalityNext', internalType: 'uint16', type: 'uint16' }],
    name: 'increaseObservationCardinalityNext',
    outputs: [],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [{ name: 'sqrtPriceX96', internalType: 'uint160', type: 'uint160' }],
    name: 'initialize',
    outputs: [],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [],
    name: 'liquidity',
    outputs: [{ name: '', internalType: 'uint128', type: 'uint128' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [],
    name: 'maxLiquidityPerTick',
    outputs: [{ name: '', internalType: 'uint128', type: 'uint128' }],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [
      { name: 'recipient', internalType: 'address', type: 'address' },
      { name: 'tickLower', internalType: 'int24', type: 'int24' },
      { name: 'tickUpper', internalType: 'int24', type: 'int24' },
      { name: 'amount', internalType: 'uint128', type: 'uint128' },
      { name: 'data', internalType: 'bytes', type: 'bytes' },
    ],
    name: 'mint',
    outputs: [
      { name: 'amount0', internalType: 'uint256', type: 'uint256' },
      { name: 'amount1', internalType: 'uint256', type: 'uint256' },
    ],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [{ name: 'index', internalType: 'uint256', type: 'uint256' }],
    name: 'observations',
    outputs: [
      { name: 'blockTimestamp', internalType: 'uint32', type: 'uint32' },
      { name: 'tickCumulative', internalType: 'int56', type: 'int56' },
      { name: 'secondsPerLiquidityCumulativeX128', internalType: 'uint160', type: 'uint160' },
      { name: 'initialized', internalType: 'bool', type: 'bool' },
    ],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [{ name: 'secondsAgos', internalType: 'uint32[]', type: 'uint32[]' }],
    name: 'observe',
    outputs: [
      { name: 'tickCumulatives', internalType: 'int56[]', type: 'int56[]' },
      { name: 'secondsPerLiquidityCumulativeX128s', internalType: 'uint160[]', type: 'uint160[]' },
    ],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [{ name: 'key', internalType: 'bytes32', type: 'bytes32' }],
    name: 'positions',
    outputs: [
      { name: '_liquidity', internalType: 'uint128', type: 'uint128' },
      { name: 'feeGrowthInside0LastX128', internalType: 'uint256', type: 'uint256' },
      { name: 'feeGrowthInside1LastX128', internalType: 'uint256', type: 'uint256' },
      { name: 'tokensOwed0', internalType: 'uint128', type: 'uint128' },
      { name: 'tokensOwed1', internalType: 'uint128', type: 'uint128' },
    ],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [],
    name: 'protocolFees',
    outputs: [
      { name: 'token0', internalType: 'uint128', type: 'uint128' },
      { name: 'token1', internalType: 'uint128', type: 'uint128' },
    ],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [
      { name: 'feeProtocol0', internalType: 'uint8', type: 'uint8' },
      { name: 'feeProtocol1', internalType: 'uint8', type: 'uint8' },
    ],
    name: 'setFeeProtocol',
    outputs: [],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [],
    name: 'slot0',
    outputs: [
      { name: 'sqrtPriceX96', internalType: 'uint160', type: 'uint160' },
      { name: 'tick', internalType: 'int24', type: 'int24' },
      { name: 'observationIndex', internalType: 'uint16', type: 'uint16' },
      { name: 'observationCardinality', internalType: 'uint16', type: 'uint16' },
      { name: 'observationCardinalityNext', internalType: 'uint16', type: 'uint16' },
      { name: 'feeProtocol', internalType: 'uint8', type: 'uint8' },
      { name: 'unlocked', internalType: 'bool', type: 'bool' },
    ],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [
      { name: 'tickLower', internalType: 'int24', type: 'int24' },
      { name: 'tickUpper', internalType: 'int24', type: 'int24' },
    ],
    name: 'snapshotCumulativesInside',
    outputs: [
      { name: 'tickCumulativeInside', internalType: 'int56', type: 'int56' },
      { name: 'secondsPerLiquidityInsideX128', internalType: 'uint160', type: 'uint160' },
      { name: 'secondsInside', internalType: 'uint32', type: 'uint32' },
    ],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [
      { name: 'recipient', internalType: 'address', type: 'address' },
      { name: 'zeroForOne', internalType: 'bool', type: 'bool' },
      { name: 'amountSpecified', internalType: 'int256', type: 'int256' },
      { name: 'sqrtPriceLimitX96', internalType: 'uint160', type: 'uint160' },
      { name: 'data', internalType: 'bytes', type: 'bytes' },
    ],
    name: 'swap',
    outputs: [
      { name: 'amount0', internalType: 'int256', type: 'int256' },
      { name: 'amount1', internalType: 'int256', type: 'int256' },
    ],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [{ name: 'wordPosition', internalType: 'int16', type: 'int16' }],
    name: 'tickBitmap',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [],
    name: 'tickSpacing',
    outputs: [{ name: '', internalType: 'int24', type: 'int24' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [{ name: 'tick', internalType: 'int24', type: 'int24' }],
    name: 'ticks',
    outputs: [
      { name: 'liquidityGross', internalType: 'uint128', type: 'uint128' },
      { name: 'liquidityNet', internalType: 'int128', type: 'int128' },
      { name: 'feeGrowthOutside0X128', internalType: 'uint256', type: 'uint256' },
      { name: 'feeGrowthOutside1X128', internalType: 'uint256', type: 'uint256' },
      { name: 'tickCumulativeOutside', internalType: 'int56', type: 'int56' },
      { name: 'secondsPerLiquidityOutsideX128', internalType: 'uint160', type: 'uint160' },
      { name: 'secondsOutside', internalType: 'uint32', type: 'uint32' },
      { name: 'initialized', internalType: 'bool', type: 'bool' },
    ],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [],
    name: 'token0',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [],
    name: 'token1',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
  },
] as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Core
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * Wraps __{@link getContract}__ with `abi` set to __{@link erc20ABI}__.
 */
export function getErc20(config: Omit<GetContractArgs, 'abi'>) {
  return getContract({ abi: erc20ABI, ...config })
}

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link erc20ABI}__.
 */
export function readErc20<TAbi extends readonly unknown[] = typeof erc20ABI, TFunctionName extends string = string>(
  config: Omit<ReadContractConfig<TAbi, TFunctionName>, 'abi'>
) {
  return readContract({ abi: erc20ABI, ...config } as unknown as ReadContractConfig<TAbi, TFunctionName>)
}

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link erc20ABI}__.
 */
export function writeErc20<TFunctionName extends string>(
  config:
    | Omit<WriteContractPreparedArgs<typeof erc20ABI, TFunctionName>, 'abi'>
    | Omit<WriteContractUnpreparedArgs<typeof erc20ABI, TFunctionName>, 'abi'>
) {
  return writeContract({ abi: erc20ABI, ...config } as unknown as WriteContractArgs<typeof erc20ABI, TFunctionName>)
}

/**
 * Wraps __{@link prepareWriteContract}__ with `abi` set to __{@link erc20ABI}__.
 */
export function prepareWriteErc20<
  TAbi extends readonly unknown[] = typeof erc20ABI,
  TFunctionName extends string = string
>(config: Omit<PrepareWriteContractConfig<TAbi, TFunctionName>, 'abi'>) {
  return prepareWriteContract({ abi: erc20ABI, ...config } as unknown as PrepareWriteContractConfig<
    TAbi,
    TFunctionName
  >)
}

/**
 * Wraps __{@link getContract}__ with `abi` set to __{@link erc721ABI}__.
 */
export function getErc721(config: Omit<GetContractArgs, 'abi'>) {
  return getContract({ abi: erc721ABI, ...config })
}

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link erc721ABI}__.
 */
export function readErc721<TAbi extends readonly unknown[] = typeof erc721ABI, TFunctionName extends string = string>(
  config: Omit<ReadContractConfig<TAbi, TFunctionName>, 'abi'>
) {
  return readContract({ abi: erc721ABI, ...config } as unknown as ReadContractConfig<TAbi, TFunctionName>)
}

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link erc721ABI}__.
 */
export function writeErc721<TFunctionName extends string>(
  config:
    | Omit<WriteContractPreparedArgs<typeof erc721ABI, TFunctionName>, 'abi'>
    | Omit<WriteContractUnpreparedArgs<typeof erc721ABI, TFunctionName>, 'abi'>
) {
  return writeContract({ abi: erc721ABI, ...config } as unknown as WriteContractArgs<typeof erc721ABI, TFunctionName>)
}

/**
 * Wraps __{@link prepareWriteContract}__ with `abi` set to __{@link erc721ABI}__.
 */
export function prepareWriteErc721<
  TAbi extends readonly unknown[] = typeof erc721ABI,
  TFunctionName extends string = string
>(config: Omit<PrepareWriteContractConfig<TAbi, TFunctionName>, 'abi'>) {
  return prepareWriteContract({ abi: erc721ABI, ...config } as unknown as PrepareWriteContractConfig<
    TAbi,
    TFunctionName
  >)
}

/**
 * Wraps __{@link getContract}__ with `abi` set to __{@link chainlinkLimitOrderABI}__.
 */
export function getChainlinkLimitOrder(config: Omit<GetContractArgs, 'abi'>) {
  return getContract({ abi: chainlinkLimitOrderABI, ...config })
}

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link chainlinkLimitOrderABI}__.
 */
export function readChainlinkLimitOrder<
  TAbi extends readonly unknown[] = typeof chainlinkLimitOrderABI,
  TFunctionName extends string = string
>(config: Omit<ReadContractConfig<TAbi, TFunctionName>, 'abi'>) {
  return readContract({ abi: chainlinkLimitOrderABI, ...config } as unknown as ReadContractConfig<TAbi, TFunctionName>)
}

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link chainlinkLimitOrderABI}__.
 */
export function writeChainlinkLimitOrder<TFunctionName extends string>(
  config:
    | Omit<WriteContractPreparedArgs<typeof chainlinkLimitOrderABI, TFunctionName>, 'abi'>
    | Omit<WriteContractUnpreparedArgs<typeof chainlinkLimitOrderABI, TFunctionName>, 'abi'>
) {
  return writeContract({ abi: chainlinkLimitOrderABI, ...config } as unknown as WriteContractArgs<
    typeof chainlinkLimitOrderABI,
    TFunctionName
  >)
}

/**
 * Wraps __{@link prepareWriteContract}__ with `abi` set to __{@link chainlinkLimitOrderABI}__.
 */
export function prepareWriteChainlinkLimitOrder<
  TAbi extends readonly unknown[] = typeof chainlinkLimitOrderABI,
  TFunctionName extends string = string
>(config: Omit<PrepareWriteContractConfig<TAbi, TFunctionName>, 'abi'>) {
  return prepareWriteContract({ abi: chainlinkLimitOrderABI, ...config } as unknown as PrepareWriteContractConfig<
    TAbi,
    TFunctionName
  >)
}

/**
 * Wraps __{@link getContract}__ with `abi` set to __{@link permit2ABI}__.
 */
export function getPermit2(config: Omit<GetContractArgs, 'abi'>) {
  return getContract({ abi: permit2ABI, ...config })
}

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link permit2ABI}__.
 */
export function readPermit2<TAbi extends readonly unknown[] = typeof permit2ABI, TFunctionName extends string = string>(
  config: Omit<ReadContractConfig<TAbi, TFunctionName>, 'abi'>
) {
  return readContract({ abi: permit2ABI, ...config } as unknown as ReadContractConfig<TAbi, TFunctionName>)
}

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link permit2ABI}__.
 */
export function writePermit2<TFunctionName extends string>(
  config:
    | Omit<WriteContractPreparedArgs<typeof permit2ABI, TFunctionName>, 'abi'>
    | Omit<WriteContractUnpreparedArgs<typeof permit2ABI, TFunctionName>, 'abi'>
) {
  return writeContract({ abi: permit2ABI, ...config } as unknown as WriteContractArgs<typeof permit2ABI, TFunctionName>)
}

/**
 * Wraps __{@link prepareWriteContract}__ with `abi` set to __{@link permit2ABI}__.
 */
export function prepareWritePermit2<
  TAbi extends readonly unknown[] = typeof permit2ABI,
  TFunctionName extends string = string
>(config: Omit<PrepareWriteContractConfig<TAbi, TFunctionName>, 'abi'>) {
  return prepareWriteContract({ abi: permit2ABI, ...config } as unknown as PrepareWriteContractConfig<
    TAbi,
    TFunctionName
  >)
}

/**
 * Wraps __{@link getContract}__ with `abi` set to __{@link uniswapNftManagerABI}__.
 */
export function getUniswapNftManager(config: Omit<GetContractArgs, 'abi'>) {
  return getContract({ abi: uniswapNftManagerABI, ...config })
}

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link uniswapNftManagerABI}__.
 */
export function readUniswapNftManager<
  TAbi extends readonly unknown[] = typeof uniswapNftManagerABI,
  TFunctionName extends string = string
>(config: Omit<ReadContractConfig<TAbi, TFunctionName>, 'abi'>) {
  return readContract({ abi: uniswapNftManagerABI, ...config } as unknown as ReadContractConfig<TAbi, TFunctionName>)
}

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link uniswapNftManagerABI}__.
 */
export function writeUniswapNftManager<TFunctionName extends string>(
  config:
    | Omit<WriteContractPreparedArgs<typeof uniswapNftManagerABI, TFunctionName>, 'abi'>
    | Omit<WriteContractUnpreparedArgs<typeof uniswapNftManagerABI, TFunctionName>, 'abi'>
) {
  return writeContract({ abi: uniswapNftManagerABI, ...config } as unknown as WriteContractArgs<
    typeof uniswapNftManagerABI,
    TFunctionName
  >)
}

/**
 * Wraps __{@link prepareWriteContract}__ with `abi` set to __{@link uniswapNftManagerABI}__.
 */
export function prepareWriteUniswapNftManager<
  TAbi extends readonly unknown[] = typeof uniswapNftManagerABI,
  TFunctionName extends string = string
>(config: Omit<PrepareWriteContractConfig<TAbi, TFunctionName>, 'abi'>) {
  return prepareWriteContract({ abi: uniswapNftManagerABI, ...config } as unknown as PrepareWriteContractConfig<
    TAbi,
    TFunctionName
  >)
}

/**
 * Wraps __{@link getContract}__ with `abi` set to __{@link uniswapV3PoolABI}__.
 */
export function getUniswapV3Pool(config: Omit<GetContractArgs, 'abi'>) {
  return getContract({ abi: uniswapV3PoolABI, ...config })
}

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link uniswapV3PoolABI}__.
 */
export function readUniswapV3Pool<
  TAbi extends readonly unknown[] = typeof uniswapV3PoolABI,
  TFunctionName extends string = string
>(config: Omit<ReadContractConfig<TAbi, TFunctionName>, 'abi'>) {
  return readContract({ abi: uniswapV3PoolABI, ...config } as unknown as ReadContractConfig<TAbi, TFunctionName>)
}

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link uniswapV3PoolABI}__.
 */
export function writeUniswapV3Pool<TFunctionName extends string>(
  config:
    | Omit<WriteContractPreparedArgs<typeof uniswapV3PoolABI, TFunctionName>, 'abi'>
    | Omit<WriteContractUnpreparedArgs<typeof uniswapV3PoolABI, TFunctionName>, 'abi'>
) {
  return writeContract({ abi: uniswapV3PoolABI, ...config } as unknown as WriteContractArgs<
    typeof uniswapV3PoolABI,
    TFunctionName
  >)
}

/**
 * Wraps __{@link prepareWriteContract}__ with `abi` set to __{@link uniswapV3PoolABI}__.
 */
export function prepareWriteUniswapV3Pool<
  TAbi extends readonly unknown[] = typeof uniswapV3PoolABI,
  TFunctionName extends string = string
>(config: Omit<PrepareWriteContractConfig<TAbi, TFunctionName>, 'abi'>) {
  return prepareWriteContract({ abi: uniswapV3PoolABI, ...config } as unknown as PrepareWriteContractConfig<
    TAbi,
    TFunctionName
  >)
}

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// React
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link erc20ABI}__.
 */
export function useErc20Read<
  TFunctionName extends string,
  TSelectData = ReadContractResult<typeof erc20ABI, TFunctionName>
>(config: Omit<UseContractReadConfig<typeof erc20ABI, TFunctionName, TSelectData>, 'abi'> = {} as any) {
  return useContractRead({ abi: erc20ABI, ...config } as UseContractReadConfig<
    typeof erc20ABI,
    TFunctionName,
    TSelectData
  >)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link erc20ABI}__ and `functionName` set to `"allowance"`.
 */
export function useErc20Allowance<
  TFunctionName extends 'allowance',
  TSelectData = ReadContractResult<typeof erc20ABI, TFunctionName>
>(
  config: Omit<UseContractReadConfig<typeof erc20ABI, TFunctionName, TSelectData>, 'abi' | 'functionName'> = {} as any
) {
  return useContractRead({ abi: erc20ABI, functionName: 'allowance', ...config } as UseContractReadConfig<
    typeof erc20ABI,
    TFunctionName,
    TSelectData
  >)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link erc20ABI}__ and `functionName` set to `"balanceOf"`.
 */
export function useErc20BalanceOf<
  TFunctionName extends 'balanceOf',
  TSelectData = ReadContractResult<typeof erc20ABI, TFunctionName>
>(
  config: Omit<UseContractReadConfig<typeof erc20ABI, TFunctionName, TSelectData>, 'abi' | 'functionName'> = {} as any
) {
  return useContractRead({ abi: erc20ABI, functionName: 'balanceOf', ...config } as UseContractReadConfig<
    typeof erc20ABI,
    TFunctionName,
    TSelectData
  >)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link erc20ABI}__ and `functionName` set to `"decimals"`.
 */
export function useErc20Decimals<
  TFunctionName extends 'decimals',
  TSelectData = ReadContractResult<typeof erc20ABI, TFunctionName>
>(
  config: Omit<UseContractReadConfig<typeof erc20ABI, TFunctionName, TSelectData>, 'abi' | 'functionName'> = {} as any
) {
  return useContractRead({ abi: erc20ABI, functionName: 'decimals', ...config } as UseContractReadConfig<
    typeof erc20ABI,
    TFunctionName,
    TSelectData
  >)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link erc20ABI}__ and `functionName` set to `"name"`.
 */
export function useErc20Name<
  TFunctionName extends 'name',
  TSelectData = ReadContractResult<typeof erc20ABI, TFunctionName>
>(
  config: Omit<UseContractReadConfig<typeof erc20ABI, TFunctionName, TSelectData>, 'abi' | 'functionName'> = {} as any
) {
  return useContractRead({ abi: erc20ABI, functionName: 'name', ...config } as UseContractReadConfig<
    typeof erc20ABI,
    TFunctionName,
    TSelectData
  >)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link erc20ABI}__ and `functionName` set to `"symbol"`.
 */
export function useErc20Symbol<
  TFunctionName extends 'symbol',
  TSelectData = ReadContractResult<typeof erc20ABI, TFunctionName>
>(
  config: Omit<UseContractReadConfig<typeof erc20ABI, TFunctionName, TSelectData>, 'abi' | 'functionName'> = {} as any
) {
  return useContractRead({ abi: erc20ABI, functionName: 'symbol', ...config } as UseContractReadConfig<
    typeof erc20ABI,
    TFunctionName,
    TSelectData
  >)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link erc20ABI}__ and `functionName` set to `"totalSupply"`.
 */
export function useErc20TotalSupply<
  TFunctionName extends 'totalSupply',
  TSelectData = ReadContractResult<typeof erc20ABI, TFunctionName>
>(
  config: Omit<UseContractReadConfig<typeof erc20ABI, TFunctionName, TSelectData>, 'abi' | 'functionName'> = {} as any
) {
  return useContractRead({ abi: erc20ABI, functionName: 'totalSupply', ...config } as UseContractReadConfig<
    typeof erc20ABI,
    TFunctionName,
    TSelectData
  >)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link erc20ABI}__.
 */
export function useErc20Write<TFunctionName extends string, TMode extends WriteContractMode = undefined>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<typeof erc20ABI, string>['request']['abi'],
        TFunctionName,
        TMode
      >
    : UseContractWriteConfig<typeof erc20ABI, TFunctionName, TMode> & {
        abi?: never
      } = {} as any
) {
  return useContractWrite<typeof erc20ABI, TFunctionName, TMode>({ abi: erc20ABI, ...config } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link erc20ABI}__ and `functionName` set to `"approve"`.
 */
export function useErc20Approve<TMode extends WriteContractMode = undefined>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<typeof erc20ABI, 'approve'>['request']['abi'],
        'approve',
        TMode
      > & { functionName?: 'approve' }
    : UseContractWriteConfig<typeof erc20ABI, 'approve', TMode> & {
        abi?: never
        functionName?: 'approve'
      } = {} as any
) {
  return useContractWrite<typeof erc20ABI, 'approve', TMode>({
    abi: erc20ABI,
    functionName: 'approve',
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link erc20ABI}__ and `functionName` set to `"transfer"`.
 */
export function useErc20Transfer<TMode extends WriteContractMode = undefined>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<typeof erc20ABI, 'transfer'>['request']['abi'],
        'transfer',
        TMode
      > & { functionName?: 'transfer' }
    : UseContractWriteConfig<typeof erc20ABI, 'transfer', TMode> & {
        abi?: never
        functionName?: 'transfer'
      } = {} as any
) {
  return useContractWrite<typeof erc20ABI, 'transfer', TMode>({
    abi: erc20ABI,
    functionName: 'transfer',
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link erc20ABI}__ and `functionName` set to `"transferFrom"`.
 */
export function useErc20TransferFrom<TMode extends WriteContractMode = undefined>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<typeof erc20ABI, 'transferFrom'>['request']['abi'],
        'transferFrom',
        TMode
      > & { functionName?: 'transferFrom' }
    : UseContractWriteConfig<typeof erc20ABI, 'transferFrom', TMode> & {
        abi?: never
        functionName?: 'transferFrom'
      } = {} as any
) {
  return useContractWrite<typeof erc20ABI, 'transferFrom', TMode>({
    abi: erc20ABI,
    functionName: 'transferFrom',
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link erc20ABI}__ and `functionName` set to `"increaseAllowance"`.
 */
export function useErc20IncreaseAllowance<TMode extends WriteContractMode = undefined>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<typeof erc20ABI, 'increaseAllowance'>['request']['abi'],
        'increaseAllowance',
        TMode
      > & { functionName?: 'increaseAllowance' }
    : UseContractWriteConfig<typeof erc20ABI, 'increaseAllowance', TMode> & {
        abi?: never
        functionName?: 'increaseAllowance'
      } = {} as any
) {
  return useContractWrite<typeof erc20ABI, 'increaseAllowance', TMode>({
    abi: erc20ABI,
    functionName: 'increaseAllowance',
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link erc20ABI}__ and `functionName` set to `"decreaseAllowance"`.
 */
export function useErc20DecreaseAllowance<TMode extends WriteContractMode = undefined>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<typeof erc20ABI, 'decreaseAllowance'>['request']['abi'],
        'decreaseAllowance',
        TMode
      > & { functionName?: 'decreaseAllowance' }
    : UseContractWriteConfig<typeof erc20ABI, 'decreaseAllowance', TMode> & {
        abi?: never
        functionName?: 'decreaseAllowance'
      } = {} as any
) {
  return useContractWrite<typeof erc20ABI, 'decreaseAllowance', TMode>({
    abi: erc20ABI,
    functionName: 'decreaseAllowance',
    ...config,
  } as any)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link erc20ABI}__.
 */
export function usePrepareErc20Write<TFunctionName extends string>(
  config: Omit<UsePrepareContractWriteConfig<typeof erc20ABI, TFunctionName>, 'abi'> = {} as any
) {
  return usePrepareContractWrite({ abi: erc20ABI, ...config } as UsePrepareContractWriteConfig<
    typeof erc20ABI,
    TFunctionName
  >)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link erc20ABI}__ and `functionName` set to `"approve"`.
 */
export function usePrepareErc20Approve(
  config: Omit<UsePrepareContractWriteConfig<typeof erc20ABI, 'approve'>, 'abi' | 'functionName'> = {} as any
) {
  return usePrepareContractWrite({ abi: erc20ABI, functionName: 'approve', ...config } as UsePrepareContractWriteConfig<
    typeof erc20ABI,
    'approve'
  >)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link erc20ABI}__ and `functionName` set to `"transfer"`.
 */
export function usePrepareErc20Transfer(
  config: Omit<UsePrepareContractWriteConfig<typeof erc20ABI, 'transfer'>, 'abi' | 'functionName'> = {} as any
) {
  return usePrepareContractWrite({
    abi: erc20ABI,
    functionName: 'transfer',
    ...config,
  } as UsePrepareContractWriteConfig<typeof erc20ABI, 'transfer'>)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link erc20ABI}__ and `functionName` set to `"transferFrom"`.
 */
export function usePrepareErc20TransferFrom(
  config: Omit<UsePrepareContractWriteConfig<typeof erc20ABI, 'transferFrom'>, 'abi' | 'functionName'> = {} as any
) {
  return usePrepareContractWrite({
    abi: erc20ABI,
    functionName: 'transferFrom',
    ...config,
  } as UsePrepareContractWriteConfig<typeof erc20ABI, 'transferFrom'>)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link erc20ABI}__ and `functionName` set to `"increaseAllowance"`.
 */
export function usePrepareErc20IncreaseAllowance(
  config: Omit<UsePrepareContractWriteConfig<typeof erc20ABI, 'increaseAllowance'>, 'abi' | 'functionName'> = {} as any
) {
  return usePrepareContractWrite({
    abi: erc20ABI,
    functionName: 'increaseAllowance',
    ...config,
  } as UsePrepareContractWriteConfig<typeof erc20ABI, 'increaseAllowance'>)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link erc20ABI}__ and `functionName` set to `"decreaseAllowance"`.
 */
export function usePrepareErc20DecreaseAllowance(
  config: Omit<UsePrepareContractWriteConfig<typeof erc20ABI, 'decreaseAllowance'>, 'abi' | 'functionName'> = {} as any
) {
  return usePrepareContractWrite({
    abi: erc20ABI,
    functionName: 'decreaseAllowance',
    ...config,
  } as UsePrepareContractWriteConfig<typeof erc20ABI, 'decreaseAllowance'>)
}

/**
 * Wraps __{@link useContractEvent}__ with `abi` set to __{@link erc20ABI}__.
 */
export function useErc20Event<TEventName extends string>(
  config: Omit<UseContractEventConfig<typeof erc20ABI, TEventName>, 'abi'> = {} as any
) {
  return useContractEvent({ abi: erc20ABI, ...config } as UseContractEventConfig<typeof erc20ABI, TEventName>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link erc721ABI}__.
 */
export function useErc721Read<
  TFunctionName extends string,
  TSelectData = ReadContractResult<typeof erc721ABI, TFunctionName>
>(config: Omit<UseContractReadConfig<typeof erc721ABI, TFunctionName, TSelectData>, 'abi'> = {} as any) {
  return useContractRead({ abi: erc721ABI, ...config } as UseContractReadConfig<
    typeof erc721ABI,
    TFunctionName,
    TSelectData
  >)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link erc721ABI}__ and `functionName` set to `"balanceOf"`.
 */
export function useErc721BalanceOf<
  TFunctionName extends 'balanceOf',
  TSelectData = ReadContractResult<typeof erc721ABI, TFunctionName>
>(
  config: Omit<UseContractReadConfig<typeof erc721ABI, TFunctionName, TSelectData>, 'abi' | 'functionName'> = {} as any
) {
  return useContractRead({ abi: erc721ABI, functionName: 'balanceOf', ...config } as UseContractReadConfig<
    typeof erc721ABI,
    TFunctionName,
    TSelectData
  >)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link erc721ABI}__ and `functionName` set to `"getApproved"`.
 */
export function useErc721GetApproved<
  TFunctionName extends 'getApproved',
  TSelectData = ReadContractResult<typeof erc721ABI, TFunctionName>
>(
  config: Omit<UseContractReadConfig<typeof erc721ABI, TFunctionName, TSelectData>, 'abi' | 'functionName'> = {} as any
) {
  return useContractRead({ abi: erc721ABI, functionName: 'getApproved', ...config } as UseContractReadConfig<
    typeof erc721ABI,
    TFunctionName,
    TSelectData
  >)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link erc721ABI}__ and `functionName` set to `"isApprovedForAll"`.
 */
export function useErc721IsApprovedForAll<
  TFunctionName extends 'isApprovedForAll',
  TSelectData = ReadContractResult<typeof erc721ABI, TFunctionName>
>(
  config: Omit<UseContractReadConfig<typeof erc721ABI, TFunctionName, TSelectData>, 'abi' | 'functionName'> = {} as any
) {
  return useContractRead({ abi: erc721ABI, functionName: 'isApprovedForAll', ...config } as UseContractReadConfig<
    typeof erc721ABI,
    TFunctionName,
    TSelectData
  >)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link erc721ABI}__ and `functionName` set to `"name"`.
 */
export function useErc721Name<
  TFunctionName extends 'name',
  TSelectData = ReadContractResult<typeof erc721ABI, TFunctionName>
>(
  config: Omit<UseContractReadConfig<typeof erc721ABI, TFunctionName, TSelectData>, 'abi' | 'functionName'> = {} as any
) {
  return useContractRead({ abi: erc721ABI, functionName: 'name', ...config } as UseContractReadConfig<
    typeof erc721ABI,
    TFunctionName,
    TSelectData
  >)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link erc721ABI}__ and `functionName` set to `"ownerOf"`.
 */
export function useErc721OwnerOf<
  TFunctionName extends 'ownerOf',
  TSelectData = ReadContractResult<typeof erc721ABI, TFunctionName>
>(
  config: Omit<UseContractReadConfig<typeof erc721ABI, TFunctionName, TSelectData>, 'abi' | 'functionName'> = {} as any
) {
  return useContractRead({ abi: erc721ABI, functionName: 'ownerOf', ...config } as UseContractReadConfig<
    typeof erc721ABI,
    TFunctionName,
    TSelectData
  >)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link erc721ABI}__ and `functionName` set to `"symbol"`.
 */
export function useErc721Symbol<
  TFunctionName extends 'symbol',
  TSelectData = ReadContractResult<typeof erc721ABI, TFunctionName>
>(
  config: Omit<UseContractReadConfig<typeof erc721ABI, TFunctionName, TSelectData>, 'abi' | 'functionName'> = {} as any
) {
  return useContractRead({ abi: erc721ABI, functionName: 'symbol', ...config } as UseContractReadConfig<
    typeof erc721ABI,
    TFunctionName,
    TSelectData
  >)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link erc721ABI}__ and `functionName` set to `"tokenByIndex"`.
 */
export function useErc721TokenByIndex<
  TFunctionName extends 'tokenByIndex',
  TSelectData = ReadContractResult<typeof erc721ABI, TFunctionName>
>(
  config: Omit<UseContractReadConfig<typeof erc721ABI, TFunctionName, TSelectData>, 'abi' | 'functionName'> = {} as any
) {
  return useContractRead({ abi: erc721ABI, functionName: 'tokenByIndex', ...config } as UseContractReadConfig<
    typeof erc721ABI,
    TFunctionName,
    TSelectData
  >)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link erc721ABI}__ and `functionName` set to `"tokenURI"`.
 */
export function useErc721TokenUri<
  TFunctionName extends 'tokenURI',
  TSelectData = ReadContractResult<typeof erc721ABI, TFunctionName>
>(
  config: Omit<UseContractReadConfig<typeof erc721ABI, TFunctionName, TSelectData>, 'abi' | 'functionName'> = {} as any
) {
  return useContractRead({ abi: erc721ABI, functionName: 'tokenURI', ...config } as UseContractReadConfig<
    typeof erc721ABI,
    TFunctionName,
    TSelectData
  >)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link erc721ABI}__ and `functionName` set to `"totalSupply"`.
 */
export function useErc721TotalSupply<
  TFunctionName extends 'totalSupply',
  TSelectData = ReadContractResult<typeof erc721ABI, TFunctionName>
>(
  config: Omit<UseContractReadConfig<typeof erc721ABI, TFunctionName, TSelectData>, 'abi' | 'functionName'> = {} as any
) {
  return useContractRead({ abi: erc721ABI, functionName: 'totalSupply', ...config } as UseContractReadConfig<
    typeof erc721ABI,
    TFunctionName,
    TSelectData
  >)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link erc721ABI}__.
 */
export function useErc721Write<TFunctionName extends string, TMode extends WriteContractMode = undefined>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<typeof erc721ABI, string>['request']['abi'],
        TFunctionName,
        TMode
      >
    : UseContractWriteConfig<typeof erc721ABI, TFunctionName, TMode> & {
        abi?: never
      } = {} as any
) {
  return useContractWrite<typeof erc721ABI, TFunctionName, TMode>({ abi: erc721ABI, ...config } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link erc721ABI}__ and `functionName` set to `"approve"`.
 */
export function useErc721Approve<TMode extends WriteContractMode = undefined>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<typeof erc721ABI, 'approve'>['request']['abi'],
        'approve',
        TMode
      > & { functionName?: 'approve' }
    : UseContractWriteConfig<typeof erc721ABI, 'approve', TMode> & {
        abi?: never
        functionName?: 'approve'
      } = {} as any
) {
  return useContractWrite<typeof erc721ABI, 'approve', TMode>({
    abi: erc721ABI,
    functionName: 'approve',
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link erc721ABI}__ and `functionName` set to `"safeTransferFrom"`.
 */
export function useErc721SafeTransferFrom<TMode extends WriteContractMode = undefined>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<typeof erc721ABI, 'safeTransferFrom'>['request']['abi'],
        'safeTransferFrom',
        TMode
      > & { functionName?: 'safeTransferFrom' }
    : UseContractWriteConfig<typeof erc721ABI, 'safeTransferFrom', TMode> & {
        abi?: never
        functionName?: 'safeTransferFrom'
      } = {} as any
) {
  return useContractWrite<typeof erc721ABI, 'safeTransferFrom', TMode>({
    abi: erc721ABI,
    functionName: 'safeTransferFrom',
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link erc721ABI}__ and `functionName` set to `"setApprovalForAll"`.
 */
export function useErc721SetApprovalForAll<TMode extends WriteContractMode = undefined>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<typeof erc721ABI, 'setApprovalForAll'>['request']['abi'],
        'setApprovalForAll',
        TMode
      > & { functionName?: 'setApprovalForAll' }
    : UseContractWriteConfig<typeof erc721ABI, 'setApprovalForAll', TMode> & {
        abi?: never
        functionName?: 'setApprovalForAll'
      } = {} as any
) {
  return useContractWrite<typeof erc721ABI, 'setApprovalForAll', TMode>({
    abi: erc721ABI,
    functionName: 'setApprovalForAll',
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link erc721ABI}__ and `functionName` set to `"transferFrom"`.
 */
export function useErc721TransferFrom<TMode extends WriteContractMode = undefined>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<typeof erc721ABI, 'transferFrom'>['request']['abi'],
        'transferFrom',
        TMode
      > & { functionName?: 'transferFrom' }
    : UseContractWriteConfig<typeof erc721ABI, 'transferFrom', TMode> & {
        abi?: never
        functionName?: 'transferFrom'
      } = {} as any
) {
  return useContractWrite<typeof erc721ABI, 'transferFrom', TMode>({
    abi: erc721ABI,
    functionName: 'transferFrom',
    ...config,
  } as any)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link erc721ABI}__.
 */
export function usePrepareErc721Write<TFunctionName extends string>(
  config: Omit<UsePrepareContractWriteConfig<typeof erc721ABI, TFunctionName>, 'abi'> = {} as any
) {
  return usePrepareContractWrite({ abi: erc721ABI, ...config } as UsePrepareContractWriteConfig<
    typeof erc721ABI,
    TFunctionName
  >)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link erc721ABI}__ and `functionName` set to `"approve"`.
 */
export function usePrepareErc721Approve(
  config: Omit<UsePrepareContractWriteConfig<typeof erc721ABI, 'approve'>, 'abi' | 'functionName'> = {} as any
) {
  return usePrepareContractWrite({
    abi: erc721ABI,
    functionName: 'approve',
    ...config,
  } as UsePrepareContractWriteConfig<typeof erc721ABI, 'approve'>)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link erc721ABI}__ and `functionName` set to `"safeTransferFrom"`.
 */
export function usePrepareErc721SafeTransferFrom(
  config: Omit<UsePrepareContractWriteConfig<typeof erc721ABI, 'safeTransferFrom'>, 'abi' | 'functionName'> = {} as any
) {
  return usePrepareContractWrite({
    abi: erc721ABI,
    functionName: 'safeTransferFrom',
    ...config,
  } as UsePrepareContractWriteConfig<typeof erc721ABI, 'safeTransferFrom'>)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link erc721ABI}__ and `functionName` set to `"setApprovalForAll"`.
 */
export function usePrepareErc721SetApprovalForAll(
  config: Omit<UsePrepareContractWriteConfig<typeof erc721ABI, 'setApprovalForAll'>, 'abi' | 'functionName'> = {} as any
) {
  return usePrepareContractWrite({
    abi: erc721ABI,
    functionName: 'setApprovalForAll',
    ...config,
  } as UsePrepareContractWriteConfig<typeof erc721ABI, 'setApprovalForAll'>)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link erc721ABI}__ and `functionName` set to `"transferFrom"`.
 */
export function usePrepareErc721TransferFrom(
  config: Omit<UsePrepareContractWriteConfig<typeof erc721ABI, 'transferFrom'>, 'abi' | 'functionName'> = {} as any
) {
  return usePrepareContractWrite({
    abi: erc721ABI,
    functionName: 'transferFrom',
    ...config,
  } as UsePrepareContractWriteConfig<typeof erc721ABI, 'transferFrom'>)
}

/**
 * Wraps __{@link useContractEvent}__ with `abi` set to __{@link erc721ABI}__.
 */
export function useErc721Event<TEventName extends string>(
  config: Omit<UseContractEventConfig<typeof erc721ABI, TEventName>, 'abi'> = {} as any
) {
  return useContractEvent({ abi: erc721ABI, ...config } as UseContractEventConfig<typeof erc721ABI, TEventName>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link chainlinkLimitOrderABI}__.
 */
export function useChainlinkLimitOrderRead<
  TFunctionName extends string,
  TSelectData = ReadContractResult<typeof chainlinkLimitOrderABI, TFunctionName>
>(config: Omit<UseContractReadConfig<typeof chainlinkLimitOrderABI, TFunctionName, TSelectData>, 'abi'> = {} as any) {
  return useContractRead({ abi: chainlinkLimitOrderABI, ...config } as UseContractReadConfig<
    typeof chainlinkLimitOrderABI,
    TFunctionName,
    TSelectData
  >)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link chainlinkLimitOrderABI}__ and `functionName` set to `"FAST_GAS_HEARTBEAT"`.
 */
export function useChainlinkLimitOrderFastGasHeartbeat<
  TFunctionName extends 'FAST_GAS_HEARTBEAT',
  TSelectData = ReadContractResult<typeof chainlinkLimitOrderABI, TFunctionName>
>(
  config: Omit<
    UseContractReadConfig<typeof chainlinkLimitOrderABI, TFunctionName, TSelectData>,
    'abi' | 'functionName'
  > = {} as any
) {
  return useContractRead({
    abi: chainlinkLimitOrderABI,
    functionName: 'FAST_GAS_HEARTBEAT',
    ...config,
  } as UseContractReadConfig<typeof chainlinkLimitOrderABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link chainlinkLimitOrderABI}__ and `functionName` set to `"LINK"`.
 */
export function useChainlinkLimitOrderLink<
  TFunctionName extends 'LINK',
  TSelectData = ReadContractResult<typeof chainlinkLimitOrderABI, TFunctionName>
>(
  config: Omit<
    UseContractReadConfig<typeof chainlinkLimitOrderABI, TFunctionName, TSelectData>,
    'abi' | 'functionName'
  > = {} as any
) {
  return useContractRead({ abi: chainlinkLimitOrderABI, functionName: 'LINK', ...config } as UseContractReadConfig<
    typeof chainlinkLimitOrderABI,
    TFunctionName,
    TSelectData
  >)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link chainlinkLimitOrderABI}__ and `functionName` set to `"MAX_FILLS_PER_UPKEEP"`.
 */
export function useChainlinkLimitOrderMaxFillsPerUpkeep<
  TFunctionName extends 'MAX_FILLS_PER_UPKEEP',
  TSelectData = ReadContractResult<typeof chainlinkLimitOrderABI, TFunctionName>
>(
  config: Omit<
    UseContractReadConfig<typeof chainlinkLimitOrderABI, TFunctionName, TSelectData>,
    'abi' | 'functionName'
  > = {} as any
) {
  return useContractRead({
    abi: chainlinkLimitOrderABI,
    functionName: 'MAX_FILLS_PER_UPKEEP',
    ...config,
  } as UseContractReadConfig<typeof chainlinkLimitOrderABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link chainlinkLimitOrderABI}__ and `functionName` set to `"MAX_GAS_LIMIT"`.
 */
export function useChainlinkLimitOrderMaxGasLimit<
  TFunctionName extends 'MAX_GAS_LIMIT',
  TSelectData = ReadContractResult<typeof chainlinkLimitOrderABI, TFunctionName>
>(
  config: Omit<
    UseContractReadConfig<typeof chainlinkLimitOrderABI, TFunctionName, TSelectData>,
    'abi' | 'functionName'
  > = {} as any
) {
  return useContractRead({
    abi: chainlinkLimitOrderABI,
    functionName: 'MAX_GAS_LIMIT',
    ...config,
  } as UseContractReadConfig<typeof chainlinkLimitOrderABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link chainlinkLimitOrderABI}__ and `functionName` set to `"MAX_GAS_PRICE"`.
 */
export function useChainlinkLimitOrderMaxGasPrice<
  TFunctionName extends 'MAX_GAS_PRICE',
  TSelectData = ReadContractResult<typeof chainlinkLimitOrderABI, TFunctionName>
>(
  config: Omit<
    UseContractReadConfig<typeof chainlinkLimitOrderABI, TFunctionName, TSelectData>,
    'abi' | 'functionName'
  > = {} as any
) {
  return useContractRead({
    abi: chainlinkLimitOrderABI,
    functionName: 'MAX_GAS_PRICE',
    ...config,
  } as UseContractReadConfig<typeof chainlinkLimitOrderABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link chainlinkLimitOrderABI}__ and `functionName` set to `"POSITION_MANAGER"`.
 */
export function useChainlinkLimitOrderPositionManager<
  TFunctionName extends 'POSITION_MANAGER',
  TSelectData = ReadContractResult<typeof chainlinkLimitOrderABI, TFunctionName>
>(
  config: Omit<
    UseContractReadConfig<typeof chainlinkLimitOrderABI, TFunctionName, TSelectData>,
    'abi' | 'functionName'
  > = {} as any
) {
  return useContractRead({
    abi: chainlinkLimitOrderABI,
    functionName: 'POSITION_MANAGER',
    ...config,
  } as UseContractReadConfig<typeof chainlinkLimitOrderABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link chainlinkLimitOrderABI}__ and `functionName` set to `"WRAPPED_NATIVE"`.
 */
export function useChainlinkLimitOrderWrappedNative<
  TFunctionName extends 'WRAPPED_NATIVE',
  TSelectData = ReadContractResult<typeof chainlinkLimitOrderABI, TFunctionName>
>(
  config: Omit<
    UseContractReadConfig<typeof chainlinkLimitOrderABI, TFunctionName, TSelectData>,
    'abi' | 'functionName'
  > = {} as any
) {
  return useContractRead({
    abi: chainlinkLimitOrderABI,
    functionName: 'WRAPPED_NATIVE',
    ...config,
  } as UseContractReadConfig<typeof chainlinkLimitOrderABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link chainlinkLimitOrderABI}__ and `functionName` set to `"batchCount"`.
 */
export function useChainlinkLimitOrderBatchCount<
  TFunctionName extends 'batchCount',
  TSelectData = ReadContractResult<typeof chainlinkLimitOrderABI, TFunctionName>
>(
  config: Omit<
    UseContractReadConfig<typeof chainlinkLimitOrderABI, TFunctionName, TSelectData>,
    'abi' | 'functionName'
  > = {} as any
) {
  return useContractRead({
    abi: chainlinkLimitOrderABI,
    functionName: 'batchCount',
    ...config,
  } as UseContractReadConfig<typeof chainlinkLimitOrderABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link chainlinkLimitOrderABI}__ and `functionName` set to `"batchIdToUserDepositAmount"`.
 */
export function useChainlinkLimitOrderBatchIdToUserDepositAmount<
  TFunctionName extends 'batchIdToUserDepositAmount',
  TSelectData = ReadContractResult<typeof chainlinkLimitOrderABI, TFunctionName>
>(
  config: Omit<
    UseContractReadConfig<typeof chainlinkLimitOrderABI, TFunctionName, TSelectData>,
    'abi' | 'functionName'
  > = {} as any
) {
  return useContractRead({
    abi: chainlinkLimitOrderABI,
    functionName: 'batchIdToUserDepositAmount',
    ...config,
  } as UseContractReadConfig<typeof chainlinkLimitOrderABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link chainlinkLimitOrderABI}__ and `functionName` set to `"checkUpkeep"`.
 */
export function useChainlinkLimitOrderCheckUpkeep<
  TFunctionName extends 'checkUpkeep',
  TSelectData = ReadContractResult<typeof chainlinkLimitOrderABI, TFunctionName>
>(
  config: Omit<
    UseContractReadConfig<typeof chainlinkLimitOrderABI, TFunctionName, TSelectData>,
    'abi' | 'functionName'
  > = {} as any
) {
  return useContractRead({
    abi: chainlinkLimitOrderABI,
    functionName: 'checkUpkeep',
    ...config,
  } as UseContractReadConfig<typeof chainlinkLimitOrderABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link chainlinkLimitOrderABI}__ and `functionName` set to `"claim"`.
 */
export function useChainlinkLimitOrderClaim<
  TFunctionName extends 'claim',
  TSelectData = ReadContractResult<typeof chainlinkLimitOrderABI, TFunctionName>
>(
  config: Omit<
    UseContractReadConfig<typeof chainlinkLimitOrderABI, TFunctionName, TSelectData>,
    'abi' | 'functionName'
  > = {} as any
) {
  return useContractRead({ abi: chainlinkLimitOrderABI, functionName: 'claim', ...config } as UseContractReadConfig<
    typeof chainlinkLimitOrderABI,
    TFunctionName,
    TSelectData
  >)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link chainlinkLimitOrderABI}__ and `functionName` set to `"fastGasFeed"`.
 */
export function useChainlinkLimitOrderFastGasFeed<
  TFunctionName extends 'fastGasFeed',
  TSelectData = ReadContractResult<typeof chainlinkLimitOrderABI, TFunctionName>
>(
  config: Omit<
    UseContractReadConfig<typeof chainlinkLimitOrderABI, TFunctionName, TSelectData>,
    'abi' | 'functionName'
  > = {} as any
) {
  return useContractRead({
    abi: chainlinkLimitOrderABI,
    functionName: 'fastGasFeed',
    ...config,
  } as UseContractReadConfig<typeof chainlinkLimitOrderABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link chainlinkLimitOrderABI}__ and `functionName` set to `"findSpot"`.
 */
export function useChainlinkLimitOrderFindSpot<
  TFunctionName extends 'findSpot',
  TSelectData = ReadContractResult<typeof chainlinkLimitOrderABI, TFunctionName>
>(
  config: Omit<
    UseContractReadConfig<typeof chainlinkLimitOrderABI, TFunctionName, TSelectData>,
    'abi' | 'functionName'
  > = {} as any
) {
  return useContractRead({ abi: chainlinkLimitOrderABI, functionName: 'findSpot', ...config } as UseContractReadConfig<
    typeof chainlinkLimitOrderABI,
    TFunctionName,
    TSelectData
  >)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link chainlinkLimitOrderABI}__ and `functionName` set to `"getClaim"`.
 */
export function useChainlinkLimitOrderGetClaim<
  TFunctionName extends 'getClaim',
  TSelectData = ReadContractResult<typeof chainlinkLimitOrderABI, TFunctionName>
>(
  config: Omit<
    UseContractReadConfig<typeof chainlinkLimitOrderABI, TFunctionName, TSelectData>,
    'abi' | 'functionName'
  > = {} as any
) {
  return useContractRead({ abi: chainlinkLimitOrderABI, functionName: 'getClaim', ...config } as UseContractReadConfig<
    typeof chainlinkLimitOrderABI,
    TFunctionName,
    TSelectData
  >)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link chainlinkLimitOrderABI}__ and `functionName` set to `"getFeePerUser"`.
 */
export function useChainlinkLimitOrderGetFeePerUser<
  TFunctionName extends 'getFeePerUser',
  TSelectData = ReadContractResult<typeof chainlinkLimitOrderABI, TFunctionName>
>(
  config: Omit<
    UseContractReadConfig<typeof chainlinkLimitOrderABI, TFunctionName, TSelectData>,
    'abi' | 'functionName'
  > = {} as any
) {
  return useContractRead({
    abi: chainlinkLimitOrderABI,
    functionName: 'getFeePerUser',
    ...config,
  } as UseContractReadConfig<typeof chainlinkLimitOrderABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link chainlinkLimitOrderABI}__ and `functionName` set to `"getGasPrice"`.
 */
export function useChainlinkLimitOrderGetGasPrice<
  TFunctionName extends 'getGasPrice',
  TSelectData = ReadContractResult<typeof chainlinkLimitOrderABI, TFunctionName>
>(
  config: Omit<
    UseContractReadConfig<typeof chainlinkLimitOrderABI, TFunctionName, TSelectData>,
    'abi' | 'functionName'
  > = {} as any
) {
  return useContractRead({
    abi: chainlinkLimitOrderABI,
    functionName: 'getGasPrice',
    ...config,
  } as UseContractReadConfig<typeof chainlinkLimitOrderABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link chainlinkLimitOrderABI}__ and `functionName` set to `"getOrderBook"`.
 */
export function useChainlinkLimitOrderGetOrderBook<
  TFunctionName extends 'getOrderBook',
  TSelectData = ReadContractResult<typeof chainlinkLimitOrderABI, TFunctionName>
>(
  config: Omit<
    UseContractReadConfig<typeof chainlinkLimitOrderABI, TFunctionName, TSelectData>,
    'abi' | 'functionName'
  > = {} as any
) {
  return useContractRead({
    abi: chainlinkLimitOrderABI,
    functionName: 'getOrderBook',
    ...config,
  } as UseContractReadConfig<typeof chainlinkLimitOrderABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link chainlinkLimitOrderABI}__ and `functionName` set to `"getPositionFromTicks"`.
 */
export function useChainlinkLimitOrderGetPositionFromTicks<
  TFunctionName extends 'getPositionFromTicks',
  TSelectData = ReadContractResult<typeof chainlinkLimitOrderABI, TFunctionName>
>(
  config: Omit<
    UseContractReadConfig<typeof chainlinkLimitOrderABI, TFunctionName, TSelectData>,
    'abi' | 'functionName'
  > = {} as any
) {
  return useContractRead({
    abi: chainlinkLimitOrderABI,
    functionName: 'getPositionFromTicks',
    ...config,
  } as UseContractReadConfig<typeof chainlinkLimitOrderABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link chainlinkLimitOrderABI}__ and `functionName` set to `"isOrderReadyForClaim"`.
 */
export function useChainlinkLimitOrderIsOrderReadyForClaim<
  TFunctionName extends 'isOrderReadyForClaim',
  TSelectData = ReadContractResult<typeof chainlinkLimitOrderABI, TFunctionName>
>(
  config: Omit<
    UseContractReadConfig<typeof chainlinkLimitOrderABI, TFunctionName, TSelectData>,
    'abi' | 'functionName'
  > = {} as any
) {
  return useContractRead({
    abi: chainlinkLimitOrderABI,
    functionName: 'isOrderReadyForClaim',
    ...config,
  } as UseContractReadConfig<typeof chainlinkLimitOrderABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link chainlinkLimitOrderABI}__ and `functionName` set to `"isShutdown"`.
 */
export function useChainlinkLimitOrderIsShutdown<
  TFunctionName extends 'isShutdown',
  TSelectData = ReadContractResult<typeof chainlinkLimitOrderABI, TFunctionName>
>(
  config: Omit<
    UseContractReadConfig<typeof chainlinkLimitOrderABI, TFunctionName, TSelectData>,
    'abi' | 'functionName'
  > = {} as any
) {
  return useContractRead({
    abi: chainlinkLimitOrderABI,
    functionName: 'isShutdown',
    ...config,
  } as UseContractReadConfig<typeof chainlinkLimitOrderABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link chainlinkLimitOrderABI}__ and `functionName` set to `"minimumAssets"`.
 */
export function useChainlinkLimitOrderMinimumAssets<
  TFunctionName extends 'minimumAssets',
  TSelectData = ReadContractResult<typeof chainlinkLimitOrderABI, TFunctionName>
>(
  config: Omit<
    UseContractReadConfig<typeof chainlinkLimitOrderABI, TFunctionName, TSelectData>,
    'abi' | 'functionName'
  > = {} as any
) {
  return useContractRead({
    abi: chainlinkLimitOrderABI,
    functionName: 'minimumAssets',
    ...config,
  } as UseContractReadConfig<typeof chainlinkLimitOrderABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link chainlinkLimitOrderABI}__ and `functionName` set to `"orderBook"`.
 */
export function useChainlinkLimitOrderOrderBook<
  TFunctionName extends 'orderBook',
  TSelectData = ReadContractResult<typeof chainlinkLimitOrderABI, TFunctionName>
>(
  config: Omit<
    UseContractReadConfig<typeof chainlinkLimitOrderABI, TFunctionName, TSelectData>,
    'abi' | 'functionName'
  > = {} as any
) {
  return useContractRead({ abi: chainlinkLimitOrderABI, functionName: 'orderBook', ...config } as UseContractReadConfig<
    typeof chainlinkLimitOrderABI,
    TFunctionName,
    TSelectData
  >)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link chainlinkLimitOrderABI}__ and `functionName` set to `"owner"`.
 */
export function useChainlinkLimitOrderOwner<
  TFunctionName extends 'owner',
  TSelectData = ReadContractResult<typeof chainlinkLimitOrderABI, TFunctionName>
>(
  config: Omit<
    UseContractReadConfig<typeof chainlinkLimitOrderABI, TFunctionName, TSelectData>,
    'abi' | 'functionName'
  > = {} as any
) {
  return useContractRead({ abi: chainlinkLimitOrderABI, functionName: 'owner', ...config } as UseContractReadConfig<
    typeof chainlinkLimitOrderABI,
    TFunctionName,
    TSelectData
  >)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link chainlinkLimitOrderABI}__ and `functionName` set to `"poolToData"`.
 */
export function useChainlinkLimitOrderPoolToData<
  TFunctionName extends 'poolToData',
  TSelectData = ReadContractResult<typeof chainlinkLimitOrderABI, TFunctionName>
>(
  config: Omit<
    UseContractReadConfig<typeof chainlinkLimitOrderABI, TFunctionName, TSelectData>,
    'abi' | 'functionName'
  > = {} as any
) {
  return useContractRead({
    abi: chainlinkLimitOrderABI,
    functionName: 'poolToData',
    ...config,
  } as UseContractReadConfig<typeof chainlinkLimitOrderABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link chainlinkLimitOrderABI}__ and `functionName` set to `"registrar"`.
 */
export function useChainlinkLimitOrderRegistrar<
  TFunctionName extends 'registrar',
  TSelectData = ReadContractResult<typeof chainlinkLimitOrderABI, TFunctionName>
>(
  config: Omit<
    UseContractReadConfig<typeof chainlinkLimitOrderABI, TFunctionName, TSelectData>,
    'abi' | 'functionName'
  > = {} as any
) {
  return useContractRead({ abi: chainlinkLimitOrderABI, functionName: 'registrar', ...config } as UseContractReadConfig<
    typeof chainlinkLimitOrderABI,
    TFunctionName,
    TSelectData
  >)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link chainlinkLimitOrderABI}__ and `functionName` set to `"tokenToSwapFees"`.
 */
export function useChainlinkLimitOrderTokenToSwapFees<
  TFunctionName extends 'tokenToSwapFees',
  TSelectData = ReadContractResult<typeof chainlinkLimitOrderABI, TFunctionName>
>(
  config: Omit<
    UseContractReadConfig<typeof chainlinkLimitOrderABI, TFunctionName, TSelectData>,
    'abi' | 'functionName'
  > = {} as any
) {
  return useContractRead({
    abi: chainlinkLimitOrderABI,
    functionName: 'tokenToSwapFees',
    ...config,
  } as UseContractReadConfig<typeof chainlinkLimitOrderABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link chainlinkLimitOrderABI}__ and `functionName` set to `"upkeepGasLimit"`.
 */
export function useChainlinkLimitOrderUpkeepGasLimit<
  TFunctionName extends 'upkeepGasLimit',
  TSelectData = ReadContractResult<typeof chainlinkLimitOrderABI, TFunctionName>
>(
  config: Omit<
    UseContractReadConfig<typeof chainlinkLimitOrderABI, TFunctionName, TSelectData>,
    'abi' | 'functionName'
  > = {} as any
) {
  return useContractRead({
    abi: chainlinkLimitOrderABI,
    functionName: 'upkeepGasLimit',
    ...config,
  } as UseContractReadConfig<typeof chainlinkLimitOrderABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link chainlinkLimitOrderABI}__ and `functionName` set to `"upkeepGasPrice"`.
 */
export function useChainlinkLimitOrderUpkeepGasPrice<
  TFunctionName extends 'upkeepGasPrice',
  TSelectData = ReadContractResult<typeof chainlinkLimitOrderABI, TFunctionName>
>(
  config: Omit<
    UseContractReadConfig<typeof chainlinkLimitOrderABI, TFunctionName, TSelectData>,
    'abi' | 'functionName'
  > = {} as any
) {
  return useContractRead({
    abi: chainlinkLimitOrderABI,
    functionName: 'upkeepGasPrice',
    ...config,
  } as UseContractReadConfig<typeof chainlinkLimitOrderABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link chainlinkLimitOrderABI}__.
 */
export function useChainlinkLimitOrderWrite<TFunctionName extends string, TMode extends WriteContractMode = undefined>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<typeof chainlinkLimitOrderABI, string>['request']['abi'],
        TFunctionName,
        TMode
      >
    : UseContractWriteConfig<typeof chainlinkLimitOrderABI, TFunctionName, TMode> & {
        abi?: never
      } = {} as any
) {
  return useContractWrite<typeof chainlinkLimitOrderABI, TFunctionName, TMode>({
    abi: chainlinkLimitOrderABI,
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link chainlinkLimitOrderABI}__ and `functionName` set to `"cancelOrder"`.
 */
export function useChainlinkLimitOrderCancelOrder<TMode extends WriteContractMode = undefined>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<typeof chainlinkLimitOrderABI, 'cancelOrder'>['request']['abi'],
        'cancelOrder',
        TMode
      > & { functionName?: 'cancelOrder' }
    : UseContractWriteConfig<typeof chainlinkLimitOrderABI, 'cancelOrder', TMode> & {
        abi?: never
        functionName?: 'cancelOrder'
      } = {} as any
) {
  return useContractWrite<typeof chainlinkLimitOrderABI, 'cancelOrder', TMode>({
    abi: chainlinkLimitOrderABI,
    functionName: 'cancelOrder',
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link chainlinkLimitOrderABI}__ and `functionName` set to `"claimOrder"`.
 */
export function useChainlinkLimitOrderClaimOrder<TMode extends WriteContractMode = undefined>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<typeof chainlinkLimitOrderABI, 'claimOrder'>['request']['abi'],
        'claimOrder',
        TMode
      > & { functionName?: 'claimOrder' }
    : UseContractWriteConfig<typeof chainlinkLimitOrderABI, 'claimOrder', TMode> & {
        abi?: never
        functionName?: 'claimOrder'
      } = {} as any
) {
  return useContractWrite<typeof chainlinkLimitOrderABI, 'claimOrder', TMode>({
    abi: chainlinkLimitOrderABI,
    functionName: 'claimOrder',
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link chainlinkLimitOrderABI}__ and `functionName` set to `"initiateShutdown"`.
 */
export function useChainlinkLimitOrderInitiateShutdown<TMode extends WriteContractMode = undefined>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<typeof chainlinkLimitOrderABI, 'initiateShutdown'>['request']['abi'],
        'initiateShutdown',
        TMode
      > & { functionName?: 'initiateShutdown' }
    : UseContractWriteConfig<typeof chainlinkLimitOrderABI, 'initiateShutdown', TMode> & {
        abi?: never
        functionName?: 'initiateShutdown'
      } = {} as any
) {
  return useContractWrite<typeof chainlinkLimitOrderABI, 'initiateShutdown', TMode>({
    abi: chainlinkLimitOrderABI,
    functionName: 'initiateShutdown',
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link chainlinkLimitOrderABI}__ and `functionName` set to `"liftShutdown"`.
 */
export function useChainlinkLimitOrderLiftShutdown<TMode extends WriteContractMode = undefined>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<typeof chainlinkLimitOrderABI, 'liftShutdown'>['request']['abi'],
        'liftShutdown',
        TMode
      > & { functionName?: 'liftShutdown' }
    : UseContractWriteConfig<typeof chainlinkLimitOrderABI, 'liftShutdown', TMode> & {
        abi?: never
        functionName?: 'liftShutdown'
      } = {} as any
) {
  return useContractWrite<typeof chainlinkLimitOrderABI, 'liftShutdown', TMode>({
    abi: chainlinkLimitOrderABI,
    functionName: 'liftShutdown',
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link chainlinkLimitOrderABI}__ and `functionName` set to `"newOrder"`.
 */
export function useChainlinkLimitOrderNewOrder<TMode extends WriteContractMode = undefined>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<typeof chainlinkLimitOrderABI, 'newOrder'>['request']['abi'],
        'newOrder',
        TMode
      > & { functionName?: 'newOrder' }
    : UseContractWriteConfig<typeof chainlinkLimitOrderABI, 'newOrder', TMode> & {
        abi?: never
        functionName?: 'newOrder'
      } = {} as any
) {
  return useContractWrite<typeof chainlinkLimitOrderABI, 'newOrder', TMode>({
    abi: chainlinkLimitOrderABI,
    functionName: 'newOrder',
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link chainlinkLimitOrderABI}__ and `functionName` set to `"onERC721Received"`.
 */
export function useChainlinkLimitOrderOnErc721Received<TMode extends WriteContractMode = undefined>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<typeof chainlinkLimitOrderABI, 'onERC721Received'>['request']['abi'],
        'onERC721Received',
        TMode
      > & { functionName?: 'onERC721Received' }
    : UseContractWriteConfig<typeof chainlinkLimitOrderABI, 'onERC721Received', TMode> & {
        abi?: never
        functionName?: 'onERC721Received'
      } = {} as any
) {
  return useContractWrite<typeof chainlinkLimitOrderABI, 'onERC721Received', TMode>({
    abi: chainlinkLimitOrderABI,
    functionName: 'onERC721Received',
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link chainlinkLimitOrderABI}__ and `functionName` set to `"performUpkeep"`.
 */
export function useChainlinkLimitOrderPerformUpkeep<TMode extends WriteContractMode = undefined>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<typeof chainlinkLimitOrderABI, 'performUpkeep'>['request']['abi'],
        'performUpkeep',
        TMode
      > & { functionName?: 'performUpkeep' }
    : UseContractWriteConfig<typeof chainlinkLimitOrderABI, 'performUpkeep', TMode> & {
        abi?: never
        functionName?: 'performUpkeep'
      } = {} as any
) {
  return useContractWrite<typeof chainlinkLimitOrderABI, 'performUpkeep', TMode>({
    abi: chainlinkLimitOrderABI,
    functionName: 'performUpkeep',
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link chainlinkLimitOrderABI}__ and `functionName` set to `"setFastGasFeed"`.
 */
export function useChainlinkLimitOrderSetFastGasFeed<TMode extends WriteContractMode = undefined>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<typeof chainlinkLimitOrderABI, 'setFastGasFeed'>['request']['abi'],
        'setFastGasFeed',
        TMode
      > & { functionName?: 'setFastGasFeed' }
    : UseContractWriteConfig<typeof chainlinkLimitOrderABI, 'setFastGasFeed', TMode> & {
        abi?: never
        functionName?: 'setFastGasFeed'
      } = {} as any
) {
  return useContractWrite<typeof chainlinkLimitOrderABI, 'setFastGasFeed', TMode>({
    abi: chainlinkLimitOrderABI,
    functionName: 'setFastGasFeed',
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link chainlinkLimitOrderABI}__ and `functionName` set to `"setMaxFillsPerUpkeep"`.
 */
export function useChainlinkLimitOrderSetMaxFillsPerUpkeep<TMode extends WriteContractMode = undefined>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<typeof chainlinkLimitOrderABI, 'setMaxFillsPerUpkeep'>['request']['abi'],
        'setMaxFillsPerUpkeep',
        TMode
      > & { functionName?: 'setMaxFillsPerUpkeep' }
    : UseContractWriteConfig<typeof chainlinkLimitOrderABI, 'setMaxFillsPerUpkeep', TMode> & {
        abi?: never
        functionName?: 'setMaxFillsPerUpkeep'
      } = {} as any
) {
  return useContractWrite<typeof chainlinkLimitOrderABI, 'setMaxFillsPerUpkeep', TMode>({
    abi: chainlinkLimitOrderABI,
    functionName: 'setMaxFillsPerUpkeep',
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link chainlinkLimitOrderABI}__ and `functionName` set to `"setMinimumAssets"`.
 */
export function useChainlinkLimitOrderSetMinimumAssets<TMode extends WriteContractMode = undefined>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<typeof chainlinkLimitOrderABI, 'setMinimumAssets'>['request']['abi'],
        'setMinimumAssets',
        TMode
      > & { functionName?: 'setMinimumAssets' }
    : UseContractWriteConfig<typeof chainlinkLimitOrderABI, 'setMinimumAssets', TMode> & {
        abi?: never
        functionName?: 'setMinimumAssets'
      } = {} as any
) {
  return useContractWrite<typeof chainlinkLimitOrderABI, 'setMinimumAssets', TMode>({
    abi: chainlinkLimitOrderABI,
    functionName: 'setMinimumAssets',
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link chainlinkLimitOrderABI}__ and `functionName` set to `"setRegistrar"`.
 */
export function useChainlinkLimitOrderSetRegistrar<TMode extends WriteContractMode = undefined>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<typeof chainlinkLimitOrderABI, 'setRegistrar'>['request']['abi'],
        'setRegistrar',
        TMode
      > & { functionName?: 'setRegistrar' }
    : UseContractWriteConfig<typeof chainlinkLimitOrderABI, 'setRegistrar', TMode> & {
        abi?: never
        functionName?: 'setRegistrar'
      } = {} as any
) {
  return useContractWrite<typeof chainlinkLimitOrderABI, 'setRegistrar', TMode>({
    abi: chainlinkLimitOrderABI,
    functionName: 'setRegistrar',
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link chainlinkLimitOrderABI}__ and `functionName` set to `"setUpkeepGasLimit"`.
 */
export function useChainlinkLimitOrderSetUpkeepGasLimit<TMode extends WriteContractMode = undefined>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<typeof chainlinkLimitOrderABI, 'setUpkeepGasLimit'>['request']['abi'],
        'setUpkeepGasLimit',
        TMode
      > & { functionName?: 'setUpkeepGasLimit' }
    : UseContractWriteConfig<typeof chainlinkLimitOrderABI, 'setUpkeepGasLimit', TMode> & {
        abi?: never
        functionName?: 'setUpkeepGasLimit'
      } = {} as any
) {
  return useContractWrite<typeof chainlinkLimitOrderABI, 'setUpkeepGasLimit', TMode>({
    abi: chainlinkLimitOrderABI,
    functionName: 'setUpkeepGasLimit',
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link chainlinkLimitOrderABI}__ and `functionName` set to `"setUpkeepGasPrice"`.
 */
export function useChainlinkLimitOrderSetUpkeepGasPrice<TMode extends WriteContractMode = undefined>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<typeof chainlinkLimitOrderABI, 'setUpkeepGasPrice'>['request']['abi'],
        'setUpkeepGasPrice',
        TMode
      > & { functionName?: 'setUpkeepGasPrice' }
    : UseContractWriteConfig<typeof chainlinkLimitOrderABI, 'setUpkeepGasPrice', TMode> & {
        abi?: never
        functionName?: 'setUpkeepGasPrice'
      } = {} as any
) {
  return useContractWrite<typeof chainlinkLimitOrderABI, 'setUpkeepGasPrice', TMode>({
    abi: chainlinkLimitOrderABI,
    functionName: 'setUpkeepGasPrice',
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link chainlinkLimitOrderABI}__ and `functionName` set to `"setupLimitOrder"`.
 */
export function useChainlinkLimitOrderSetupLimitOrder<TMode extends WriteContractMode = undefined>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<typeof chainlinkLimitOrderABI, 'setupLimitOrder'>['request']['abi'],
        'setupLimitOrder',
        TMode
      > & { functionName?: 'setupLimitOrder' }
    : UseContractWriteConfig<typeof chainlinkLimitOrderABI, 'setupLimitOrder', TMode> & {
        abi?: never
        functionName?: 'setupLimitOrder'
      } = {} as any
) {
  return useContractWrite<typeof chainlinkLimitOrderABI, 'setupLimitOrder', TMode>({
    abi: chainlinkLimitOrderABI,
    functionName: 'setupLimitOrder',
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link chainlinkLimitOrderABI}__ and `functionName` set to `"transferOwnership"`.
 */
export function useChainlinkLimitOrderTransferOwnership<TMode extends WriteContractMode = undefined>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<typeof chainlinkLimitOrderABI, 'transferOwnership'>['request']['abi'],
        'transferOwnership',
        TMode
      > & { functionName?: 'transferOwnership' }
    : UseContractWriteConfig<typeof chainlinkLimitOrderABI, 'transferOwnership', TMode> & {
        abi?: never
        functionName?: 'transferOwnership'
      } = {} as any
) {
  return useContractWrite<typeof chainlinkLimitOrderABI, 'transferOwnership', TMode>({
    abi: chainlinkLimitOrderABI,
    functionName: 'transferOwnership',
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link chainlinkLimitOrderABI}__ and `functionName` set to `"withdrawNative"`.
 */
export function useChainlinkLimitOrderWithdrawNative<TMode extends WriteContractMode = undefined>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<typeof chainlinkLimitOrderABI, 'withdrawNative'>['request']['abi'],
        'withdrawNative',
        TMode
      > & { functionName?: 'withdrawNative' }
    : UseContractWriteConfig<typeof chainlinkLimitOrderABI, 'withdrawNative', TMode> & {
        abi?: never
        functionName?: 'withdrawNative'
      } = {} as any
) {
  return useContractWrite<typeof chainlinkLimitOrderABI, 'withdrawNative', TMode>({
    abi: chainlinkLimitOrderABI,
    functionName: 'withdrawNative',
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link chainlinkLimitOrderABI}__ and `functionName` set to `"withdrawSwapFees"`.
 */
export function useChainlinkLimitOrderWithdrawSwapFees<TMode extends WriteContractMode = undefined>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<typeof chainlinkLimitOrderABI, 'withdrawSwapFees'>['request']['abi'],
        'withdrawSwapFees',
        TMode
      > & { functionName?: 'withdrawSwapFees' }
    : UseContractWriteConfig<typeof chainlinkLimitOrderABI, 'withdrawSwapFees', TMode> & {
        abi?: never
        functionName?: 'withdrawSwapFees'
      } = {} as any
) {
  return useContractWrite<typeof chainlinkLimitOrderABI, 'withdrawSwapFees', TMode>({
    abi: chainlinkLimitOrderABI,
    functionName: 'withdrawSwapFees',
    ...config,
  } as any)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link chainlinkLimitOrderABI}__.
 */
export function usePrepareChainlinkLimitOrderWrite<TFunctionName extends string>(
  config: Omit<UsePrepareContractWriteConfig<typeof chainlinkLimitOrderABI, TFunctionName>, 'abi'> = {} as any
) {
  return usePrepareContractWrite({ abi: chainlinkLimitOrderABI, ...config } as UsePrepareContractWriteConfig<
    typeof chainlinkLimitOrderABI,
    TFunctionName
  >)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link chainlinkLimitOrderABI}__ and `functionName` set to `"cancelOrder"`.
 */
export function usePrepareChainlinkLimitOrderCancelOrder(
  config: Omit<
    UsePrepareContractWriteConfig<typeof chainlinkLimitOrderABI, 'cancelOrder'>,
    'abi' | 'functionName'
  > = {} as any
) {
  return usePrepareContractWrite({
    abi: chainlinkLimitOrderABI,
    functionName: 'cancelOrder',
    ...config,
  } as UsePrepareContractWriteConfig<typeof chainlinkLimitOrderABI, 'cancelOrder'>)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link chainlinkLimitOrderABI}__ and `functionName` set to `"claimOrder"`.
 */
export function usePrepareChainlinkLimitOrderClaimOrder(
  config: Omit<
    UsePrepareContractWriteConfig<typeof chainlinkLimitOrderABI, 'claimOrder'>,
    'abi' | 'functionName'
  > = {} as any
) {
  return usePrepareContractWrite({
    abi: chainlinkLimitOrderABI,
    functionName: 'claimOrder',
    ...config,
  } as UsePrepareContractWriteConfig<typeof chainlinkLimitOrderABI, 'claimOrder'>)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link chainlinkLimitOrderABI}__ and `functionName` set to `"initiateShutdown"`.
 */
export function usePrepareChainlinkLimitOrderInitiateShutdown(
  config: Omit<
    UsePrepareContractWriteConfig<typeof chainlinkLimitOrderABI, 'initiateShutdown'>,
    'abi' | 'functionName'
  > = {} as any
) {
  return usePrepareContractWrite({
    abi: chainlinkLimitOrderABI,
    functionName: 'initiateShutdown',
    ...config,
  } as UsePrepareContractWriteConfig<typeof chainlinkLimitOrderABI, 'initiateShutdown'>)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link chainlinkLimitOrderABI}__ and `functionName` set to `"liftShutdown"`.
 */
export function usePrepareChainlinkLimitOrderLiftShutdown(
  config: Omit<
    UsePrepareContractWriteConfig<typeof chainlinkLimitOrderABI, 'liftShutdown'>,
    'abi' | 'functionName'
  > = {} as any
) {
  return usePrepareContractWrite({
    abi: chainlinkLimitOrderABI,
    functionName: 'liftShutdown',
    ...config,
  } as UsePrepareContractWriteConfig<typeof chainlinkLimitOrderABI, 'liftShutdown'>)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link chainlinkLimitOrderABI}__ and `functionName` set to `"newOrder"`.
 */
export function usePrepareChainlinkLimitOrderNewOrder(
  config: Omit<
    UsePrepareContractWriteConfig<typeof chainlinkLimitOrderABI, 'newOrder'>,
    'abi' | 'functionName'
  > = {} as any
) {
  return usePrepareContractWrite({
    abi: chainlinkLimitOrderABI,
    functionName: 'newOrder',
    ...config,
  } as UsePrepareContractWriteConfig<typeof chainlinkLimitOrderABI, 'newOrder'>)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link chainlinkLimitOrderABI}__ and `functionName` set to `"onERC721Received"`.
 */
export function usePrepareChainlinkLimitOrderOnErc721Received(
  config: Omit<
    UsePrepareContractWriteConfig<typeof chainlinkLimitOrderABI, 'onERC721Received'>,
    'abi' | 'functionName'
  > = {} as any
) {
  return usePrepareContractWrite({
    abi: chainlinkLimitOrderABI,
    functionName: 'onERC721Received',
    ...config,
  } as UsePrepareContractWriteConfig<typeof chainlinkLimitOrderABI, 'onERC721Received'>)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link chainlinkLimitOrderABI}__ and `functionName` set to `"performUpkeep"`.
 */
export function usePrepareChainlinkLimitOrderPerformUpkeep(
  config: Omit<
    UsePrepareContractWriteConfig<typeof chainlinkLimitOrderABI, 'performUpkeep'>,
    'abi' | 'functionName'
  > = {} as any
) {
  return usePrepareContractWrite({
    abi: chainlinkLimitOrderABI,
    functionName: 'performUpkeep',
    ...config,
  } as UsePrepareContractWriteConfig<typeof chainlinkLimitOrderABI, 'performUpkeep'>)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link chainlinkLimitOrderABI}__ and `functionName` set to `"setFastGasFeed"`.
 */
export function usePrepareChainlinkLimitOrderSetFastGasFeed(
  config: Omit<
    UsePrepareContractWriteConfig<typeof chainlinkLimitOrderABI, 'setFastGasFeed'>,
    'abi' | 'functionName'
  > = {} as any
) {
  return usePrepareContractWrite({
    abi: chainlinkLimitOrderABI,
    functionName: 'setFastGasFeed',
    ...config,
  } as UsePrepareContractWriteConfig<typeof chainlinkLimitOrderABI, 'setFastGasFeed'>)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link chainlinkLimitOrderABI}__ and `functionName` set to `"setMaxFillsPerUpkeep"`.
 */
export function usePrepareChainlinkLimitOrderSetMaxFillsPerUpkeep(
  config: Omit<
    UsePrepareContractWriteConfig<typeof chainlinkLimitOrderABI, 'setMaxFillsPerUpkeep'>,
    'abi' | 'functionName'
  > = {} as any
) {
  return usePrepareContractWrite({
    abi: chainlinkLimitOrderABI,
    functionName: 'setMaxFillsPerUpkeep',
    ...config,
  } as UsePrepareContractWriteConfig<typeof chainlinkLimitOrderABI, 'setMaxFillsPerUpkeep'>)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link chainlinkLimitOrderABI}__ and `functionName` set to `"setMinimumAssets"`.
 */
export function usePrepareChainlinkLimitOrderSetMinimumAssets(
  config: Omit<
    UsePrepareContractWriteConfig<typeof chainlinkLimitOrderABI, 'setMinimumAssets'>,
    'abi' | 'functionName'
  > = {} as any
) {
  return usePrepareContractWrite({
    abi: chainlinkLimitOrderABI,
    functionName: 'setMinimumAssets',
    ...config,
  } as UsePrepareContractWriteConfig<typeof chainlinkLimitOrderABI, 'setMinimumAssets'>)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link chainlinkLimitOrderABI}__ and `functionName` set to `"setRegistrar"`.
 */
export function usePrepareChainlinkLimitOrderSetRegistrar(
  config: Omit<
    UsePrepareContractWriteConfig<typeof chainlinkLimitOrderABI, 'setRegistrar'>,
    'abi' | 'functionName'
  > = {} as any
) {
  return usePrepareContractWrite({
    abi: chainlinkLimitOrderABI,
    functionName: 'setRegistrar',
    ...config,
  } as UsePrepareContractWriteConfig<typeof chainlinkLimitOrderABI, 'setRegistrar'>)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link chainlinkLimitOrderABI}__ and `functionName` set to `"setUpkeepGasLimit"`.
 */
export function usePrepareChainlinkLimitOrderSetUpkeepGasLimit(
  config: Omit<
    UsePrepareContractWriteConfig<typeof chainlinkLimitOrderABI, 'setUpkeepGasLimit'>,
    'abi' | 'functionName'
  > = {} as any
) {
  return usePrepareContractWrite({
    abi: chainlinkLimitOrderABI,
    functionName: 'setUpkeepGasLimit',
    ...config,
  } as UsePrepareContractWriteConfig<typeof chainlinkLimitOrderABI, 'setUpkeepGasLimit'>)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link chainlinkLimitOrderABI}__ and `functionName` set to `"setUpkeepGasPrice"`.
 */
export function usePrepareChainlinkLimitOrderSetUpkeepGasPrice(
  config: Omit<
    UsePrepareContractWriteConfig<typeof chainlinkLimitOrderABI, 'setUpkeepGasPrice'>,
    'abi' | 'functionName'
  > = {} as any
) {
  return usePrepareContractWrite({
    abi: chainlinkLimitOrderABI,
    functionName: 'setUpkeepGasPrice',
    ...config,
  } as UsePrepareContractWriteConfig<typeof chainlinkLimitOrderABI, 'setUpkeepGasPrice'>)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link chainlinkLimitOrderABI}__ and `functionName` set to `"setupLimitOrder"`.
 */
export function usePrepareChainlinkLimitOrderSetupLimitOrder(
  config: Omit<
    UsePrepareContractWriteConfig<typeof chainlinkLimitOrderABI, 'setupLimitOrder'>,
    'abi' | 'functionName'
  > = {} as any
) {
  return usePrepareContractWrite({
    abi: chainlinkLimitOrderABI,
    functionName: 'setupLimitOrder',
    ...config,
  } as UsePrepareContractWriteConfig<typeof chainlinkLimitOrderABI, 'setupLimitOrder'>)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link chainlinkLimitOrderABI}__ and `functionName` set to `"transferOwnership"`.
 */
export function usePrepareChainlinkLimitOrderTransferOwnership(
  config: Omit<
    UsePrepareContractWriteConfig<typeof chainlinkLimitOrderABI, 'transferOwnership'>,
    'abi' | 'functionName'
  > = {} as any
) {
  return usePrepareContractWrite({
    abi: chainlinkLimitOrderABI,
    functionName: 'transferOwnership',
    ...config,
  } as UsePrepareContractWriteConfig<typeof chainlinkLimitOrderABI, 'transferOwnership'>)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link chainlinkLimitOrderABI}__ and `functionName` set to `"withdrawNative"`.
 */
export function usePrepareChainlinkLimitOrderWithdrawNative(
  config: Omit<
    UsePrepareContractWriteConfig<typeof chainlinkLimitOrderABI, 'withdrawNative'>,
    'abi' | 'functionName'
  > = {} as any
) {
  return usePrepareContractWrite({
    abi: chainlinkLimitOrderABI,
    functionName: 'withdrawNative',
    ...config,
  } as UsePrepareContractWriteConfig<typeof chainlinkLimitOrderABI, 'withdrawNative'>)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link chainlinkLimitOrderABI}__ and `functionName` set to `"withdrawSwapFees"`.
 */
export function usePrepareChainlinkLimitOrderWithdrawSwapFees(
  config: Omit<
    UsePrepareContractWriteConfig<typeof chainlinkLimitOrderABI, 'withdrawSwapFees'>,
    'abi' | 'functionName'
  > = {} as any
) {
  return usePrepareContractWrite({
    abi: chainlinkLimitOrderABI,
    functionName: 'withdrawSwapFees',
    ...config,
  } as UsePrepareContractWriteConfig<typeof chainlinkLimitOrderABI, 'withdrawSwapFees'>)
}

/**
 * Wraps __{@link useContractEvent}__ with `abi` set to __{@link chainlinkLimitOrderABI}__.
 */
export function useChainlinkLimitOrderEvent<TEventName extends string>(
  config: Omit<UseContractEventConfig<typeof chainlinkLimitOrderABI, TEventName>, 'abi'> = {} as any
) {
  return useContractEvent({ abi: chainlinkLimitOrderABI, ...config } as UseContractEventConfig<
    typeof chainlinkLimitOrderABI,
    TEventName
  >)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link permit2ABI}__.
 */
export function usePermit2Read<
  TFunctionName extends string,
  TSelectData = ReadContractResult<typeof permit2ABI, TFunctionName>
>(config: Omit<UseContractReadConfig<typeof permit2ABI, TFunctionName, TSelectData>, 'abi'> = {} as any) {
  return useContractRead({ abi: permit2ABI, ...config } as UseContractReadConfig<
    typeof permit2ABI,
    TFunctionName,
    TSelectData
  >)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link permit2ABI}__ and `functionName` set to `"DOMAIN_SEPARATOR"`.
 */
export function usePermit2DomainSeparator<
  TFunctionName extends 'DOMAIN_SEPARATOR',
  TSelectData = ReadContractResult<typeof permit2ABI, TFunctionName>
>(
  config: Omit<UseContractReadConfig<typeof permit2ABI, TFunctionName, TSelectData>, 'abi' | 'functionName'> = {} as any
) {
  return useContractRead({ abi: permit2ABI, functionName: 'DOMAIN_SEPARATOR', ...config } as UseContractReadConfig<
    typeof permit2ABI,
    TFunctionName,
    TSelectData
  >)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link permit2ABI}__ and `functionName` set to `"allowance"`.
 */
export function usePermit2Allowance<
  TFunctionName extends 'allowance',
  TSelectData = ReadContractResult<typeof permit2ABI, TFunctionName>
>(
  config: Omit<UseContractReadConfig<typeof permit2ABI, TFunctionName, TSelectData>, 'abi' | 'functionName'> = {} as any
) {
  return useContractRead({ abi: permit2ABI, functionName: 'allowance', ...config } as UseContractReadConfig<
    typeof permit2ABI,
    TFunctionName,
    TSelectData
  >)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link permit2ABI}__ and `functionName` set to `"nonceBitmap"`.
 */
export function usePermit2NonceBitmap<
  TFunctionName extends 'nonceBitmap',
  TSelectData = ReadContractResult<typeof permit2ABI, TFunctionName>
>(
  config: Omit<UseContractReadConfig<typeof permit2ABI, TFunctionName, TSelectData>, 'abi' | 'functionName'> = {} as any
) {
  return useContractRead({ abi: permit2ABI, functionName: 'nonceBitmap', ...config } as UseContractReadConfig<
    typeof permit2ABI,
    TFunctionName,
    TSelectData
  >)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link permit2ABI}__.
 */
export function usePermit2Write<TFunctionName extends string, TMode extends WriteContractMode = undefined>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<typeof permit2ABI, string>['request']['abi'],
        TFunctionName,
        TMode
      >
    : UseContractWriteConfig<typeof permit2ABI, TFunctionName, TMode> & {
        abi?: never
      } = {} as any
) {
  return useContractWrite<typeof permit2ABI, TFunctionName, TMode>({ abi: permit2ABI, ...config } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link permit2ABI}__ and `functionName` set to `"approve"`.
 */
export function usePermit2Approve<TMode extends WriteContractMode = undefined>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<typeof permit2ABI, 'approve'>['request']['abi'],
        'approve',
        TMode
      > & { functionName?: 'approve' }
    : UseContractWriteConfig<typeof permit2ABI, 'approve', TMode> & {
        abi?: never
        functionName?: 'approve'
      } = {} as any
) {
  return useContractWrite<typeof permit2ABI, 'approve', TMode>({
    abi: permit2ABI,
    functionName: 'approve',
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link permit2ABI}__ and `functionName` set to `"invalidateNonces"`.
 */
export function usePermit2InvalidateNonces<TMode extends WriteContractMode = undefined>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<typeof permit2ABI, 'invalidateNonces'>['request']['abi'],
        'invalidateNonces',
        TMode
      > & { functionName?: 'invalidateNonces' }
    : UseContractWriteConfig<typeof permit2ABI, 'invalidateNonces', TMode> & {
        abi?: never
        functionName?: 'invalidateNonces'
      } = {} as any
) {
  return useContractWrite<typeof permit2ABI, 'invalidateNonces', TMode>({
    abi: permit2ABI,
    functionName: 'invalidateNonces',
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link permit2ABI}__ and `functionName` set to `"invalidateUnorderedNonces"`.
 */
export function usePermit2InvalidateUnorderedNonces<TMode extends WriteContractMode = undefined>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<typeof permit2ABI, 'invalidateUnorderedNonces'>['request']['abi'],
        'invalidateUnorderedNonces',
        TMode
      > & { functionName?: 'invalidateUnorderedNonces' }
    : UseContractWriteConfig<typeof permit2ABI, 'invalidateUnorderedNonces', TMode> & {
        abi?: never
        functionName?: 'invalidateUnorderedNonces'
      } = {} as any
) {
  return useContractWrite<typeof permit2ABI, 'invalidateUnorderedNonces', TMode>({
    abi: permit2ABI,
    functionName: 'invalidateUnorderedNonces',
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link permit2ABI}__ and `functionName` set to `"lockdown"`.
 */
export function usePermit2Lockdown<TMode extends WriteContractMode = undefined>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<typeof permit2ABI, 'lockdown'>['request']['abi'],
        'lockdown',
        TMode
      > & { functionName?: 'lockdown' }
    : UseContractWriteConfig<typeof permit2ABI, 'lockdown', TMode> & {
        abi?: never
        functionName?: 'lockdown'
      } = {} as any
) {
  return useContractWrite<typeof permit2ABI, 'lockdown', TMode>({
    abi: permit2ABI,
    functionName: 'lockdown',
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link permit2ABI}__ and `functionName` set to `"permit"`.
 */
export function usePermit2Permit<TMode extends WriteContractMode = undefined>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<typeof permit2ABI, 'permit'>['request']['abi'],
        'permit',
        TMode
      > & { functionName?: 'permit' }
    : UseContractWriteConfig<typeof permit2ABI, 'permit', TMode> & {
        abi?: never
        functionName?: 'permit'
      } = {} as any
) {
  return useContractWrite<typeof permit2ABI, 'permit', TMode>({
    abi: permit2ABI,
    functionName: 'permit',
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link permit2ABI}__ and `functionName` set to `"permitTransferFrom"`.
 */
export function usePermit2PermitTransferFrom<TMode extends WriteContractMode = undefined>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<typeof permit2ABI, 'permitTransferFrom'>['request']['abi'],
        'permitTransferFrom',
        TMode
      > & { functionName?: 'permitTransferFrom' }
    : UseContractWriteConfig<typeof permit2ABI, 'permitTransferFrom', TMode> & {
        abi?: never
        functionName?: 'permitTransferFrom'
      } = {} as any
) {
  return useContractWrite<typeof permit2ABI, 'permitTransferFrom', TMode>({
    abi: permit2ABI,
    functionName: 'permitTransferFrom',
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link permit2ABI}__ and `functionName` set to `"permitWitnessTransferFrom"`.
 */
export function usePermit2PermitWitnessTransferFrom<TMode extends WriteContractMode = undefined>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<typeof permit2ABI, 'permitWitnessTransferFrom'>['request']['abi'],
        'permitWitnessTransferFrom',
        TMode
      > & { functionName?: 'permitWitnessTransferFrom' }
    : UseContractWriteConfig<typeof permit2ABI, 'permitWitnessTransferFrom', TMode> & {
        abi?: never
        functionName?: 'permitWitnessTransferFrom'
      } = {} as any
) {
  return useContractWrite<typeof permit2ABI, 'permitWitnessTransferFrom', TMode>({
    abi: permit2ABI,
    functionName: 'permitWitnessTransferFrom',
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link permit2ABI}__ and `functionName` set to `"transferFrom"`.
 */
export function usePermit2TransferFrom<TMode extends WriteContractMode = undefined>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<typeof permit2ABI, 'transferFrom'>['request']['abi'],
        'transferFrom',
        TMode
      > & { functionName?: 'transferFrom' }
    : UseContractWriteConfig<typeof permit2ABI, 'transferFrom', TMode> & {
        abi?: never
        functionName?: 'transferFrom'
      } = {} as any
) {
  return useContractWrite<typeof permit2ABI, 'transferFrom', TMode>({
    abi: permit2ABI,
    functionName: 'transferFrom',
    ...config,
  } as any)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link permit2ABI}__.
 */
export function usePreparePermit2Write<TFunctionName extends string>(
  config: Omit<UsePrepareContractWriteConfig<typeof permit2ABI, TFunctionName>, 'abi'> = {} as any
) {
  return usePrepareContractWrite({ abi: permit2ABI, ...config } as UsePrepareContractWriteConfig<
    typeof permit2ABI,
    TFunctionName
  >)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link permit2ABI}__ and `functionName` set to `"approve"`.
 */
export function usePreparePermit2Approve(
  config: Omit<UsePrepareContractWriteConfig<typeof permit2ABI, 'approve'>, 'abi' | 'functionName'> = {} as any
) {
  return usePrepareContractWrite({
    abi: permit2ABI,
    functionName: 'approve',
    ...config,
  } as UsePrepareContractWriteConfig<typeof permit2ABI, 'approve'>)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link permit2ABI}__ and `functionName` set to `"invalidateNonces"`.
 */
export function usePreparePermit2InvalidateNonces(
  config: Omit<UsePrepareContractWriteConfig<typeof permit2ABI, 'invalidateNonces'>, 'abi' | 'functionName'> = {} as any
) {
  return usePrepareContractWrite({
    abi: permit2ABI,
    functionName: 'invalidateNonces',
    ...config,
  } as UsePrepareContractWriteConfig<typeof permit2ABI, 'invalidateNonces'>)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link permit2ABI}__ and `functionName` set to `"invalidateUnorderedNonces"`.
 */
export function usePreparePermit2InvalidateUnorderedNonces(
  config: Omit<
    UsePrepareContractWriteConfig<typeof permit2ABI, 'invalidateUnorderedNonces'>,
    'abi' | 'functionName'
  > = {} as any
) {
  return usePrepareContractWrite({
    abi: permit2ABI,
    functionName: 'invalidateUnorderedNonces',
    ...config,
  } as UsePrepareContractWriteConfig<typeof permit2ABI, 'invalidateUnorderedNonces'>)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link permit2ABI}__ and `functionName` set to `"lockdown"`.
 */
export function usePreparePermit2Lockdown(
  config: Omit<UsePrepareContractWriteConfig<typeof permit2ABI, 'lockdown'>, 'abi' | 'functionName'> = {} as any
) {
  return usePrepareContractWrite({
    abi: permit2ABI,
    functionName: 'lockdown',
    ...config,
  } as UsePrepareContractWriteConfig<typeof permit2ABI, 'lockdown'>)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link permit2ABI}__ and `functionName` set to `"permit"`.
 */
export function usePreparePermit2Permit(
  config: Omit<UsePrepareContractWriteConfig<typeof permit2ABI, 'permit'>, 'abi' | 'functionName'> = {} as any
) {
  return usePrepareContractWrite({
    abi: permit2ABI,
    functionName: 'permit',
    ...config,
  } as UsePrepareContractWriteConfig<typeof permit2ABI, 'permit'>)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link permit2ABI}__ and `functionName` set to `"permitTransferFrom"`.
 */
export function usePreparePermit2PermitTransferFrom(
  config: Omit<
    UsePrepareContractWriteConfig<typeof permit2ABI, 'permitTransferFrom'>,
    'abi' | 'functionName'
  > = {} as any
) {
  return usePrepareContractWrite({
    abi: permit2ABI,
    functionName: 'permitTransferFrom',
    ...config,
  } as UsePrepareContractWriteConfig<typeof permit2ABI, 'permitTransferFrom'>)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link permit2ABI}__ and `functionName` set to `"permitWitnessTransferFrom"`.
 */
export function usePreparePermit2PermitWitnessTransferFrom(
  config: Omit<
    UsePrepareContractWriteConfig<typeof permit2ABI, 'permitWitnessTransferFrom'>,
    'abi' | 'functionName'
  > = {} as any
) {
  return usePrepareContractWrite({
    abi: permit2ABI,
    functionName: 'permitWitnessTransferFrom',
    ...config,
  } as UsePrepareContractWriteConfig<typeof permit2ABI, 'permitWitnessTransferFrom'>)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link permit2ABI}__ and `functionName` set to `"transferFrom"`.
 */
export function usePreparePermit2TransferFrom(
  config: Omit<UsePrepareContractWriteConfig<typeof permit2ABI, 'transferFrom'>, 'abi' | 'functionName'> = {} as any
) {
  return usePrepareContractWrite({
    abi: permit2ABI,
    functionName: 'transferFrom',
    ...config,
  } as UsePrepareContractWriteConfig<typeof permit2ABI, 'transferFrom'>)
}

/**
 * Wraps __{@link useContractEvent}__ with `abi` set to __{@link permit2ABI}__.
 */
export function usePermit2Event<TEventName extends string>(
  config: Omit<UseContractEventConfig<typeof permit2ABI, TEventName>, 'abi'> = {} as any
) {
  return useContractEvent({ abi: permit2ABI, ...config } as UseContractEventConfig<typeof permit2ABI, TEventName>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link uniswapNftManagerABI}__.
 */
export function useUniswapNftManagerRead<
  TFunctionName extends string,
  TSelectData = ReadContractResult<typeof uniswapNftManagerABI, TFunctionName>
>(config: Omit<UseContractReadConfig<typeof uniswapNftManagerABI, TFunctionName, TSelectData>, 'abi'> = {} as any) {
  return useContractRead({ abi: uniswapNftManagerABI, ...config } as UseContractReadConfig<
    typeof uniswapNftManagerABI,
    TFunctionName,
    TSelectData
  >)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link uniswapNftManagerABI}__ and `functionName` set to `"DOMAIN_SEPARATOR"`.
 */
export function useUniswapNftManagerDomainSeparator<
  TFunctionName extends 'DOMAIN_SEPARATOR',
  TSelectData = ReadContractResult<typeof uniswapNftManagerABI, TFunctionName>
>(
  config: Omit<
    UseContractReadConfig<typeof uniswapNftManagerABI, TFunctionName, TSelectData>,
    'abi' | 'functionName'
  > = {} as any
) {
  return useContractRead({
    abi: uniswapNftManagerABI,
    functionName: 'DOMAIN_SEPARATOR',
    ...config,
  } as UseContractReadConfig<typeof uniswapNftManagerABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link uniswapNftManagerABI}__ and `functionName` set to `"PERMIT_TYPEHASH"`.
 */
export function useUniswapNftManagerPermitTypehash<
  TFunctionName extends 'PERMIT_TYPEHASH',
  TSelectData = ReadContractResult<typeof uniswapNftManagerABI, TFunctionName>
>(
  config: Omit<
    UseContractReadConfig<typeof uniswapNftManagerABI, TFunctionName, TSelectData>,
    'abi' | 'functionName'
  > = {} as any
) {
  return useContractRead({
    abi: uniswapNftManagerABI,
    functionName: 'PERMIT_TYPEHASH',
    ...config,
  } as UseContractReadConfig<typeof uniswapNftManagerABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link uniswapNftManagerABI}__ and `functionName` set to `"WETH9"`.
 */
export function useUniswapNftManagerWeth9<
  TFunctionName extends 'WETH9',
  TSelectData = ReadContractResult<typeof uniswapNftManagerABI, TFunctionName>
>(
  config: Omit<
    UseContractReadConfig<typeof uniswapNftManagerABI, TFunctionName, TSelectData>,
    'abi' | 'functionName'
  > = {} as any
) {
  return useContractRead({ abi: uniswapNftManagerABI, functionName: 'WETH9', ...config } as UseContractReadConfig<
    typeof uniswapNftManagerABI,
    TFunctionName,
    TSelectData
  >)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link uniswapNftManagerABI}__ and `functionName` set to `"balanceOf"`.
 */
export function useUniswapNftManagerBalanceOf<
  TFunctionName extends 'balanceOf',
  TSelectData = ReadContractResult<typeof uniswapNftManagerABI, TFunctionName>
>(
  config: Omit<
    UseContractReadConfig<typeof uniswapNftManagerABI, TFunctionName, TSelectData>,
    'abi' | 'functionName'
  > = {} as any
) {
  return useContractRead({ abi: uniswapNftManagerABI, functionName: 'balanceOf', ...config } as UseContractReadConfig<
    typeof uniswapNftManagerABI,
    TFunctionName,
    TSelectData
  >)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link uniswapNftManagerABI}__ and `functionName` set to `"baseURI"`.
 */
export function useUniswapNftManagerBaseUri<
  TFunctionName extends 'baseURI',
  TSelectData = ReadContractResult<typeof uniswapNftManagerABI, TFunctionName>
>(
  config: Omit<
    UseContractReadConfig<typeof uniswapNftManagerABI, TFunctionName, TSelectData>,
    'abi' | 'functionName'
  > = {} as any
) {
  return useContractRead({ abi: uniswapNftManagerABI, functionName: 'baseURI', ...config } as UseContractReadConfig<
    typeof uniswapNftManagerABI,
    TFunctionName,
    TSelectData
  >)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link uniswapNftManagerABI}__ and `functionName` set to `"factory"`.
 */
export function useUniswapNftManagerFactory<
  TFunctionName extends 'factory',
  TSelectData = ReadContractResult<typeof uniswapNftManagerABI, TFunctionName>
>(
  config: Omit<
    UseContractReadConfig<typeof uniswapNftManagerABI, TFunctionName, TSelectData>,
    'abi' | 'functionName'
  > = {} as any
) {
  return useContractRead({ abi: uniswapNftManagerABI, functionName: 'factory', ...config } as UseContractReadConfig<
    typeof uniswapNftManagerABI,
    TFunctionName,
    TSelectData
  >)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link uniswapNftManagerABI}__ and `functionName` set to `"getApproved"`.
 */
export function useUniswapNftManagerGetApproved<
  TFunctionName extends 'getApproved',
  TSelectData = ReadContractResult<typeof uniswapNftManagerABI, TFunctionName>
>(
  config: Omit<
    UseContractReadConfig<typeof uniswapNftManagerABI, TFunctionName, TSelectData>,
    'abi' | 'functionName'
  > = {} as any
) {
  return useContractRead({ abi: uniswapNftManagerABI, functionName: 'getApproved', ...config } as UseContractReadConfig<
    typeof uniswapNftManagerABI,
    TFunctionName,
    TSelectData
  >)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link uniswapNftManagerABI}__ and `functionName` set to `"isApprovedForAll"`.
 */
export function useUniswapNftManagerIsApprovedForAll<
  TFunctionName extends 'isApprovedForAll',
  TSelectData = ReadContractResult<typeof uniswapNftManagerABI, TFunctionName>
>(
  config: Omit<
    UseContractReadConfig<typeof uniswapNftManagerABI, TFunctionName, TSelectData>,
    'abi' | 'functionName'
  > = {} as any
) {
  return useContractRead({
    abi: uniswapNftManagerABI,
    functionName: 'isApprovedForAll',
    ...config,
  } as UseContractReadConfig<typeof uniswapNftManagerABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link uniswapNftManagerABI}__ and `functionName` set to `"name"`.
 */
export function useUniswapNftManagerName<
  TFunctionName extends 'name',
  TSelectData = ReadContractResult<typeof uniswapNftManagerABI, TFunctionName>
>(
  config: Omit<
    UseContractReadConfig<typeof uniswapNftManagerABI, TFunctionName, TSelectData>,
    'abi' | 'functionName'
  > = {} as any
) {
  return useContractRead({ abi: uniswapNftManagerABI, functionName: 'name', ...config } as UseContractReadConfig<
    typeof uniswapNftManagerABI,
    TFunctionName,
    TSelectData
  >)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link uniswapNftManagerABI}__ and `functionName` set to `"ownerOf"`.
 */
export function useUniswapNftManagerOwnerOf<
  TFunctionName extends 'ownerOf',
  TSelectData = ReadContractResult<typeof uniswapNftManagerABI, TFunctionName>
>(
  config: Omit<
    UseContractReadConfig<typeof uniswapNftManagerABI, TFunctionName, TSelectData>,
    'abi' | 'functionName'
  > = {} as any
) {
  return useContractRead({ abi: uniswapNftManagerABI, functionName: 'ownerOf', ...config } as UseContractReadConfig<
    typeof uniswapNftManagerABI,
    TFunctionName,
    TSelectData
  >)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link uniswapNftManagerABI}__ and `functionName` set to `"positions"`.
 */
export function useUniswapNftManagerPositions<
  TFunctionName extends 'positions',
  TSelectData = ReadContractResult<typeof uniswapNftManagerABI, TFunctionName>
>(
  config: Omit<
    UseContractReadConfig<typeof uniswapNftManagerABI, TFunctionName, TSelectData>,
    'abi' | 'functionName'
  > = {} as any
) {
  return useContractRead({ abi: uniswapNftManagerABI, functionName: 'positions', ...config } as UseContractReadConfig<
    typeof uniswapNftManagerABI,
    TFunctionName,
    TSelectData
  >)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link uniswapNftManagerABI}__ and `functionName` set to `"supportsInterface"`.
 */
export function useUniswapNftManagerSupportsInterface<
  TFunctionName extends 'supportsInterface',
  TSelectData = ReadContractResult<typeof uniswapNftManagerABI, TFunctionName>
>(
  config: Omit<
    UseContractReadConfig<typeof uniswapNftManagerABI, TFunctionName, TSelectData>,
    'abi' | 'functionName'
  > = {} as any
) {
  return useContractRead({
    abi: uniswapNftManagerABI,
    functionName: 'supportsInterface',
    ...config,
  } as UseContractReadConfig<typeof uniswapNftManagerABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link uniswapNftManagerABI}__ and `functionName` set to `"symbol"`.
 */
export function useUniswapNftManagerSymbol<
  TFunctionName extends 'symbol',
  TSelectData = ReadContractResult<typeof uniswapNftManagerABI, TFunctionName>
>(
  config: Omit<
    UseContractReadConfig<typeof uniswapNftManagerABI, TFunctionName, TSelectData>,
    'abi' | 'functionName'
  > = {} as any
) {
  return useContractRead({ abi: uniswapNftManagerABI, functionName: 'symbol', ...config } as UseContractReadConfig<
    typeof uniswapNftManagerABI,
    TFunctionName,
    TSelectData
  >)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link uniswapNftManagerABI}__ and `functionName` set to `"tokenByIndex"`.
 */
export function useUniswapNftManagerTokenByIndex<
  TFunctionName extends 'tokenByIndex',
  TSelectData = ReadContractResult<typeof uniswapNftManagerABI, TFunctionName>
>(
  config: Omit<
    UseContractReadConfig<typeof uniswapNftManagerABI, TFunctionName, TSelectData>,
    'abi' | 'functionName'
  > = {} as any
) {
  return useContractRead({
    abi: uniswapNftManagerABI,
    functionName: 'tokenByIndex',
    ...config,
  } as UseContractReadConfig<typeof uniswapNftManagerABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link uniswapNftManagerABI}__ and `functionName` set to `"tokenOfOwnerByIndex"`.
 */
export function useUniswapNftManagerTokenOfOwnerByIndex<
  TFunctionName extends 'tokenOfOwnerByIndex',
  TSelectData = ReadContractResult<typeof uniswapNftManagerABI, TFunctionName>
>(
  config: Omit<
    UseContractReadConfig<typeof uniswapNftManagerABI, TFunctionName, TSelectData>,
    'abi' | 'functionName'
  > = {} as any
) {
  return useContractRead({
    abi: uniswapNftManagerABI,
    functionName: 'tokenOfOwnerByIndex',
    ...config,
  } as UseContractReadConfig<typeof uniswapNftManagerABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link uniswapNftManagerABI}__ and `functionName` set to `"tokenURI"`.
 */
export function useUniswapNftManagerTokenUri<
  TFunctionName extends 'tokenURI',
  TSelectData = ReadContractResult<typeof uniswapNftManagerABI, TFunctionName>
>(
  config: Omit<
    UseContractReadConfig<typeof uniswapNftManagerABI, TFunctionName, TSelectData>,
    'abi' | 'functionName'
  > = {} as any
) {
  return useContractRead({ abi: uniswapNftManagerABI, functionName: 'tokenURI', ...config } as UseContractReadConfig<
    typeof uniswapNftManagerABI,
    TFunctionName,
    TSelectData
  >)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link uniswapNftManagerABI}__ and `functionName` set to `"totalSupply"`.
 */
export function useUniswapNftManagerTotalSupply<
  TFunctionName extends 'totalSupply',
  TSelectData = ReadContractResult<typeof uniswapNftManagerABI, TFunctionName>
>(
  config: Omit<
    UseContractReadConfig<typeof uniswapNftManagerABI, TFunctionName, TSelectData>,
    'abi' | 'functionName'
  > = {} as any
) {
  return useContractRead({ abi: uniswapNftManagerABI, functionName: 'totalSupply', ...config } as UseContractReadConfig<
    typeof uniswapNftManagerABI,
    TFunctionName,
    TSelectData
  >)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link uniswapNftManagerABI}__.
 */
export function useUniswapNftManagerWrite<TFunctionName extends string, TMode extends WriteContractMode = undefined>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<typeof uniswapNftManagerABI, string>['request']['abi'],
        TFunctionName,
        TMode
      >
    : UseContractWriteConfig<typeof uniswapNftManagerABI, TFunctionName, TMode> & {
        abi?: never
      } = {} as any
) {
  return useContractWrite<typeof uniswapNftManagerABI, TFunctionName, TMode>({
    abi: uniswapNftManagerABI,
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link uniswapNftManagerABI}__ and `functionName` set to `"approve"`.
 */
export function useUniswapNftManagerApprove<TMode extends WriteContractMode = undefined>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<typeof uniswapNftManagerABI, 'approve'>['request']['abi'],
        'approve',
        TMode
      > & { functionName?: 'approve' }
    : UseContractWriteConfig<typeof uniswapNftManagerABI, 'approve', TMode> & {
        abi?: never
        functionName?: 'approve'
      } = {} as any
) {
  return useContractWrite<typeof uniswapNftManagerABI, 'approve', TMode>({
    abi: uniswapNftManagerABI,
    functionName: 'approve',
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link uniswapNftManagerABI}__ and `functionName` set to `"burn"`.
 */
export function useUniswapNftManagerBurn<TMode extends WriteContractMode = undefined>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<typeof uniswapNftManagerABI, 'burn'>['request']['abi'],
        'burn',
        TMode
      > & { functionName?: 'burn' }
    : UseContractWriteConfig<typeof uniswapNftManagerABI, 'burn', TMode> & {
        abi?: never
        functionName?: 'burn'
      } = {} as any
) {
  return useContractWrite<typeof uniswapNftManagerABI, 'burn', TMode>({
    abi: uniswapNftManagerABI,
    functionName: 'burn',
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link uniswapNftManagerABI}__ and `functionName` set to `"collect"`.
 */
export function useUniswapNftManagerCollect<TMode extends WriteContractMode = undefined>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<typeof uniswapNftManagerABI, 'collect'>['request']['abi'],
        'collect',
        TMode
      > & { functionName?: 'collect' }
    : UseContractWriteConfig<typeof uniswapNftManagerABI, 'collect', TMode> & {
        abi?: never
        functionName?: 'collect'
      } = {} as any
) {
  return useContractWrite<typeof uniswapNftManagerABI, 'collect', TMode>({
    abi: uniswapNftManagerABI,
    functionName: 'collect',
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link uniswapNftManagerABI}__ and `functionName` set to `"createAndInitializePoolIfNecessary"`.
 */
export function useUniswapNftManagerCreateAndInitializePoolIfNecessary<TMode extends WriteContractMode = undefined>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<typeof uniswapNftManagerABI, 'createAndInitializePoolIfNecessary'>['request']['abi'],
        'createAndInitializePoolIfNecessary',
        TMode
      > & { functionName?: 'createAndInitializePoolIfNecessary' }
    : UseContractWriteConfig<typeof uniswapNftManagerABI, 'createAndInitializePoolIfNecessary', TMode> & {
        abi?: never
        functionName?: 'createAndInitializePoolIfNecessary'
      } = {} as any
) {
  return useContractWrite<typeof uniswapNftManagerABI, 'createAndInitializePoolIfNecessary', TMode>({
    abi: uniswapNftManagerABI,
    functionName: 'createAndInitializePoolIfNecessary',
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link uniswapNftManagerABI}__ and `functionName` set to `"decreaseLiquidity"`.
 */
export function useUniswapNftManagerDecreaseLiquidity<TMode extends WriteContractMode = undefined>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<typeof uniswapNftManagerABI, 'decreaseLiquidity'>['request']['abi'],
        'decreaseLiquidity',
        TMode
      > & { functionName?: 'decreaseLiquidity' }
    : UseContractWriteConfig<typeof uniswapNftManagerABI, 'decreaseLiquidity', TMode> & {
        abi?: never
        functionName?: 'decreaseLiquidity'
      } = {} as any
) {
  return useContractWrite<typeof uniswapNftManagerABI, 'decreaseLiquidity', TMode>({
    abi: uniswapNftManagerABI,
    functionName: 'decreaseLiquidity',
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link uniswapNftManagerABI}__ and `functionName` set to `"increaseLiquidity"`.
 */
export function useUniswapNftManagerIncreaseLiquidity<TMode extends WriteContractMode = undefined>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<typeof uniswapNftManagerABI, 'increaseLiquidity'>['request']['abi'],
        'increaseLiquidity',
        TMode
      > & { functionName?: 'increaseLiquidity' }
    : UseContractWriteConfig<typeof uniswapNftManagerABI, 'increaseLiquidity', TMode> & {
        abi?: never
        functionName?: 'increaseLiquidity'
      } = {} as any
) {
  return useContractWrite<typeof uniswapNftManagerABI, 'increaseLiquidity', TMode>({
    abi: uniswapNftManagerABI,
    functionName: 'increaseLiquidity',
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link uniswapNftManagerABI}__ and `functionName` set to `"mint"`.
 */
export function useUniswapNftManagerMint<TMode extends WriteContractMode = undefined>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<typeof uniswapNftManagerABI, 'mint'>['request']['abi'],
        'mint',
        TMode
      > & { functionName?: 'mint' }
    : UseContractWriteConfig<typeof uniswapNftManagerABI, 'mint', TMode> & {
        abi?: never
        functionName?: 'mint'
      } = {} as any
) {
  return useContractWrite<typeof uniswapNftManagerABI, 'mint', TMode>({
    abi: uniswapNftManagerABI,
    functionName: 'mint',
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link uniswapNftManagerABI}__ and `functionName` set to `"multicall"`.
 */
export function useUniswapNftManagerMulticall<TMode extends WriteContractMode = undefined>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<typeof uniswapNftManagerABI, 'multicall'>['request']['abi'],
        'multicall',
        TMode
      > & { functionName?: 'multicall' }
    : UseContractWriteConfig<typeof uniswapNftManagerABI, 'multicall', TMode> & {
        abi?: never
        functionName?: 'multicall'
      } = {} as any
) {
  return useContractWrite<typeof uniswapNftManagerABI, 'multicall', TMode>({
    abi: uniswapNftManagerABI,
    functionName: 'multicall',
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link uniswapNftManagerABI}__ and `functionName` set to `"permit"`.
 */
export function useUniswapNftManagerPermit<TMode extends WriteContractMode = undefined>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<typeof uniswapNftManagerABI, 'permit'>['request']['abi'],
        'permit',
        TMode
      > & { functionName?: 'permit' }
    : UseContractWriteConfig<typeof uniswapNftManagerABI, 'permit', TMode> & {
        abi?: never
        functionName?: 'permit'
      } = {} as any
) {
  return useContractWrite<typeof uniswapNftManagerABI, 'permit', TMode>({
    abi: uniswapNftManagerABI,
    functionName: 'permit',
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link uniswapNftManagerABI}__ and `functionName` set to `"refundETH"`.
 */
export function useUniswapNftManagerRefundEth<TMode extends WriteContractMode = undefined>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<typeof uniswapNftManagerABI, 'refundETH'>['request']['abi'],
        'refundETH',
        TMode
      > & { functionName?: 'refundETH' }
    : UseContractWriteConfig<typeof uniswapNftManagerABI, 'refundETH', TMode> & {
        abi?: never
        functionName?: 'refundETH'
      } = {} as any
) {
  return useContractWrite<typeof uniswapNftManagerABI, 'refundETH', TMode>({
    abi: uniswapNftManagerABI,
    functionName: 'refundETH',
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link uniswapNftManagerABI}__ and `functionName` set to `"safeTransferFrom"`.
 */
export function useUniswapNftManagerSafeTransferFrom<TMode extends WriteContractMode = undefined>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<typeof uniswapNftManagerABI, 'safeTransferFrom'>['request']['abi'],
        'safeTransferFrom',
        TMode
      > & { functionName?: 'safeTransferFrom' }
    : UseContractWriteConfig<typeof uniswapNftManagerABI, 'safeTransferFrom', TMode> & {
        abi?: never
        functionName?: 'safeTransferFrom'
      } = {} as any
) {
  return useContractWrite<typeof uniswapNftManagerABI, 'safeTransferFrom', TMode>({
    abi: uniswapNftManagerABI,
    functionName: 'safeTransferFrom',
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link uniswapNftManagerABI}__ and `functionName` set to `"selfPermit"`.
 */
export function useUniswapNftManagerSelfPermit<TMode extends WriteContractMode = undefined>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<typeof uniswapNftManagerABI, 'selfPermit'>['request']['abi'],
        'selfPermit',
        TMode
      > & { functionName?: 'selfPermit' }
    : UseContractWriteConfig<typeof uniswapNftManagerABI, 'selfPermit', TMode> & {
        abi?: never
        functionName?: 'selfPermit'
      } = {} as any
) {
  return useContractWrite<typeof uniswapNftManagerABI, 'selfPermit', TMode>({
    abi: uniswapNftManagerABI,
    functionName: 'selfPermit',
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link uniswapNftManagerABI}__ and `functionName` set to `"selfPermitAllowed"`.
 */
export function useUniswapNftManagerSelfPermitAllowed<TMode extends WriteContractMode = undefined>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<typeof uniswapNftManagerABI, 'selfPermitAllowed'>['request']['abi'],
        'selfPermitAllowed',
        TMode
      > & { functionName?: 'selfPermitAllowed' }
    : UseContractWriteConfig<typeof uniswapNftManagerABI, 'selfPermitAllowed', TMode> & {
        abi?: never
        functionName?: 'selfPermitAllowed'
      } = {} as any
) {
  return useContractWrite<typeof uniswapNftManagerABI, 'selfPermitAllowed', TMode>({
    abi: uniswapNftManagerABI,
    functionName: 'selfPermitAllowed',
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link uniswapNftManagerABI}__ and `functionName` set to `"selfPermitAllowedIfNecessary"`.
 */
export function useUniswapNftManagerSelfPermitAllowedIfNecessary<TMode extends WriteContractMode = undefined>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<typeof uniswapNftManagerABI, 'selfPermitAllowedIfNecessary'>['request']['abi'],
        'selfPermitAllowedIfNecessary',
        TMode
      > & { functionName?: 'selfPermitAllowedIfNecessary' }
    : UseContractWriteConfig<typeof uniswapNftManagerABI, 'selfPermitAllowedIfNecessary', TMode> & {
        abi?: never
        functionName?: 'selfPermitAllowedIfNecessary'
      } = {} as any
) {
  return useContractWrite<typeof uniswapNftManagerABI, 'selfPermitAllowedIfNecessary', TMode>({
    abi: uniswapNftManagerABI,
    functionName: 'selfPermitAllowedIfNecessary',
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link uniswapNftManagerABI}__ and `functionName` set to `"selfPermitIfNecessary"`.
 */
export function useUniswapNftManagerSelfPermitIfNecessary<TMode extends WriteContractMode = undefined>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<typeof uniswapNftManagerABI, 'selfPermitIfNecessary'>['request']['abi'],
        'selfPermitIfNecessary',
        TMode
      > & { functionName?: 'selfPermitIfNecessary' }
    : UseContractWriteConfig<typeof uniswapNftManagerABI, 'selfPermitIfNecessary', TMode> & {
        abi?: never
        functionName?: 'selfPermitIfNecessary'
      } = {} as any
) {
  return useContractWrite<typeof uniswapNftManagerABI, 'selfPermitIfNecessary', TMode>({
    abi: uniswapNftManagerABI,
    functionName: 'selfPermitIfNecessary',
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link uniswapNftManagerABI}__ and `functionName` set to `"setApprovalForAll"`.
 */
export function useUniswapNftManagerSetApprovalForAll<TMode extends WriteContractMode = undefined>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<typeof uniswapNftManagerABI, 'setApprovalForAll'>['request']['abi'],
        'setApprovalForAll',
        TMode
      > & { functionName?: 'setApprovalForAll' }
    : UseContractWriteConfig<typeof uniswapNftManagerABI, 'setApprovalForAll', TMode> & {
        abi?: never
        functionName?: 'setApprovalForAll'
      } = {} as any
) {
  return useContractWrite<typeof uniswapNftManagerABI, 'setApprovalForAll', TMode>({
    abi: uniswapNftManagerABI,
    functionName: 'setApprovalForAll',
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link uniswapNftManagerABI}__ and `functionName` set to `"sweepToken"`.
 */
export function useUniswapNftManagerSweepToken<TMode extends WriteContractMode = undefined>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<typeof uniswapNftManagerABI, 'sweepToken'>['request']['abi'],
        'sweepToken',
        TMode
      > & { functionName?: 'sweepToken' }
    : UseContractWriteConfig<typeof uniswapNftManagerABI, 'sweepToken', TMode> & {
        abi?: never
        functionName?: 'sweepToken'
      } = {} as any
) {
  return useContractWrite<typeof uniswapNftManagerABI, 'sweepToken', TMode>({
    abi: uniswapNftManagerABI,
    functionName: 'sweepToken',
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link uniswapNftManagerABI}__ and `functionName` set to `"transferFrom"`.
 */
export function useUniswapNftManagerTransferFrom<TMode extends WriteContractMode = undefined>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<typeof uniswapNftManagerABI, 'transferFrom'>['request']['abi'],
        'transferFrom',
        TMode
      > & { functionName?: 'transferFrom' }
    : UseContractWriteConfig<typeof uniswapNftManagerABI, 'transferFrom', TMode> & {
        abi?: never
        functionName?: 'transferFrom'
      } = {} as any
) {
  return useContractWrite<typeof uniswapNftManagerABI, 'transferFrom', TMode>({
    abi: uniswapNftManagerABI,
    functionName: 'transferFrom',
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link uniswapNftManagerABI}__ and `functionName` set to `"uniswapV3MintCallback"`.
 */
export function useUniswapNftManagerUniswapV3MintCallback<TMode extends WriteContractMode = undefined>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<typeof uniswapNftManagerABI, 'uniswapV3MintCallback'>['request']['abi'],
        'uniswapV3MintCallback',
        TMode
      > & { functionName?: 'uniswapV3MintCallback' }
    : UseContractWriteConfig<typeof uniswapNftManagerABI, 'uniswapV3MintCallback', TMode> & {
        abi?: never
        functionName?: 'uniswapV3MintCallback'
      } = {} as any
) {
  return useContractWrite<typeof uniswapNftManagerABI, 'uniswapV3MintCallback', TMode>({
    abi: uniswapNftManagerABI,
    functionName: 'uniswapV3MintCallback',
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link uniswapNftManagerABI}__ and `functionName` set to `"unwrapWETH9"`.
 */
export function useUniswapNftManagerUnwrapWeth9<TMode extends WriteContractMode = undefined>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<typeof uniswapNftManagerABI, 'unwrapWETH9'>['request']['abi'],
        'unwrapWETH9',
        TMode
      > & { functionName?: 'unwrapWETH9' }
    : UseContractWriteConfig<typeof uniswapNftManagerABI, 'unwrapWETH9', TMode> & {
        abi?: never
        functionName?: 'unwrapWETH9'
      } = {} as any
) {
  return useContractWrite<typeof uniswapNftManagerABI, 'unwrapWETH9', TMode>({
    abi: uniswapNftManagerABI,
    functionName: 'unwrapWETH9',
    ...config,
  } as any)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link uniswapNftManagerABI}__.
 */
export function usePrepareUniswapNftManagerWrite<TFunctionName extends string>(
  config: Omit<UsePrepareContractWriteConfig<typeof uniswapNftManagerABI, TFunctionName>, 'abi'> = {} as any
) {
  return usePrepareContractWrite({ abi: uniswapNftManagerABI, ...config } as UsePrepareContractWriteConfig<
    typeof uniswapNftManagerABI,
    TFunctionName
  >)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link uniswapNftManagerABI}__ and `functionName` set to `"approve"`.
 */
export function usePrepareUniswapNftManagerApprove(
  config: Omit<
    UsePrepareContractWriteConfig<typeof uniswapNftManagerABI, 'approve'>,
    'abi' | 'functionName'
  > = {} as any
) {
  return usePrepareContractWrite({
    abi: uniswapNftManagerABI,
    functionName: 'approve',
    ...config,
  } as UsePrepareContractWriteConfig<typeof uniswapNftManagerABI, 'approve'>)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link uniswapNftManagerABI}__ and `functionName` set to `"burn"`.
 */
export function usePrepareUniswapNftManagerBurn(
  config: Omit<UsePrepareContractWriteConfig<typeof uniswapNftManagerABI, 'burn'>, 'abi' | 'functionName'> = {} as any
) {
  return usePrepareContractWrite({
    abi: uniswapNftManagerABI,
    functionName: 'burn',
    ...config,
  } as UsePrepareContractWriteConfig<typeof uniswapNftManagerABI, 'burn'>)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link uniswapNftManagerABI}__ and `functionName` set to `"collect"`.
 */
export function usePrepareUniswapNftManagerCollect(
  config: Omit<
    UsePrepareContractWriteConfig<typeof uniswapNftManagerABI, 'collect'>,
    'abi' | 'functionName'
  > = {} as any
) {
  return usePrepareContractWrite({
    abi: uniswapNftManagerABI,
    functionName: 'collect',
    ...config,
  } as UsePrepareContractWriteConfig<typeof uniswapNftManagerABI, 'collect'>)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link uniswapNftManagerABI}__ and `functionName` set to `"createAndInitializePoolIfNecessary"`.
 */
export function usePrepareUniswapNftManagerCreateAndInitializePoolIfNecessary(
  config: Omit<
    UsePrepareContractWriteConfig<typeof uniswapNftManagerABI, 'createAndInitializePoolIfNecessary'>,
    'abi' | 'functionName'
  > = {} as any
) {
  return usePrepareContractWrite({
    abi: uniswapNftManagerABI,
    functionName: 'createAndInitializePoolIfNecessary',
    ...config,
  } as UsePrepareContractWriteConfig<typeof uniswapNftManagerABI, 'createAndInitializePoolIfNecessary'>)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link uniswapNftManagerABI}__ and `functionName` set to `"decreaseLiquidity"`.
 */
export function usePrepareUniswapNftManagerDecreaseLiquidity(
  config: Omit<
    UsePrepareContractWriteConfig<typeof uniswapNftManagerABI, 'decreaseLiquidity'>,
    'abi' | 'functionName'
  > = {} as any
) {
  return usePrepareContractWrite({
    abi: uniswapNftManagerABI,
    functionName: 'decreaseLiquidity',
    ...config,
  } as UsePrepareContractWriteConfig<typeof uniswapNftManagerABI, 'decreaseLiquidity'>)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link uniswapNftManagerABI}__ and `functionName` set to `"increaseLiquidity"`.
 */
export function usePrepareUniswapNftManagerIncreaseLiquidity(
  config: Omit<
    UsePrepareContractWriteConfig<typeof uniswapNftManagerABI, 'increaseLiquidity'>,
    'abi' | 'functionName'
  > = {} as any
) {
  return usePrepareContractWrite({
    abi: uniswapNftManagerABI,
    functionName: 'increaseLiquidity',
    ...config,
  } as UsePrepareContractWriteConfig<typeof uniswapNftManagerABI, 'increaseLiquidity'>)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link uniswapNftManagerABI}__ and `functionName` set to `"mint"`.
 */
export function usePrepareUniswapNftManagerMint(
  config: Omit<UsePrepareContractWriteConfig<typeof uniswapNftManagerABI, 'mint'>, 'abi' | 'functionName'> = {} as any
) {
  return usePrepareContractWrite({
    abi: uniswapNftManagerABI,
    functionName: 'mint',
    ...config,
  } as UsePrepareContractWriteConfig<typeof uniswapNftManagerABI, 'mint'>)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link uniswapNftManagerABI}__ and `functionName` set to `"multicall"`.
 */
export function usePrepareUniswapNftManagerMulticall(
  config: Omit<
    UsePrepareContractWriteConfig<typeof uniswapNftManagerABI, 'multicall'>,
    'abi' | 'functionName'
  > = {} as any
) {
  return usePrepareContractWrite({
    abi: uniswapNftManagerABI,
    functionName: 'multicall',
    ...config,
  } as UsePrepareContractWriteConfig<typeof uniswapNftManagerABI, 'multicall'>)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link uniswapNftManagerABI}__ and `functionName` set to `"permit"`.
 */
export function usePrepareUniswapNftManagerPermit(
  config: Omit<UsePrepareContractWriteConfig<typeof uniswapNftManagerABI, 'permit'>, 'abi' | 'functionName'> = {} as any
) {
  return usePrepareContractWrite({
    abi: uniswapNftManagerABI,
    functionName: 'permit',
    ...config,
  } as UsePrepareContractWriteConfig<typeof uniswapNftManagerABI, 'permit'>)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link uniswapNftManagerABI}__ and `functionName` set to `"refundETH"`.
 */
export function usePrepareUniswapNftManagerRefundEth(
  config: Omit<
    UsePrepareContractWriteConfig<typeof uniswapNftManagerABI, 'refundETH'>,
    'abi' | 'functionName'
  > = {} as any
) {
  return usePrepareContractWrite({
    abi: uniswapNftManagerABI,
    functionName: 'refundETH',
    ...config,
  } as UsePrepareContractWriteConfig<typeof uniswapNftManagerABI, 'refundETH'>)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link uniswapNftManagerABI}__ and `functionName` set to `"safeTransferFrom"`.
 */
export function usePrepareUniswapNftManagerSafeTransferFrom(
  config: Omit<
    UsePrepareContractWriteConfig<typeof uniswapNftManagerABI, 'safeTransferFrom'>,
    'abi' | 'functionName'
  > = {} as any
) {
  return usePrepareContractWrite({
    abi: uniswapNftManagerABI,
    functionName: 'safeTransferFrom',
    ...config,
  } as UsePrepareContractWriteConfig<typeof uniswapNftManagerABI, 'safeTransferFrom'>)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link uniswapNftManagerABI}__ and `functionName` set to `"selfPermit"`.
 */
export function usePrepareUniswapNftManagerSelfPermit(
  config: Omit<
    UsePrepareContractWriteConfig<typeof uniswapNftManagerABI, 'selfPermit'>,
    'abi' | 'functionName'
  > = {} as any
) {
  return usePrepareContractWrite({
    abi: uniswapNftManagerABI,
    functionName: 'selfPermit',
    ...config,
  } as UsePrepareContractWriteConfig<typeof uniswapNftManagerABI, 'selfPermit'>)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link uniswapNftManagerABI}__ and `functionName` set to `"selfPermitAllowed"`.
 */
export function usePrepareUniswapNftManagerSelfPermitAllowed(
  config: Omit<
    UsePrepareContractWriteConfig<typeof uniswapNftManagerABI, 'selfPermitAllowed'>,
    'abi' | 'functionName'
  > = {} as any
) {
  return usePrepareContractWrite({
    abi: uniswapNftManagerABI,
    functionName: 'selfPermitAllowed',
    ...config,
  } as UsePrepareContractWriteConfig<typeof uniswapNftManagerABI, 'selfPermitAllowed'>)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link uniswapNftManagerABI}__ and `functionName` set to `"selfPermitAllowedIfNecessary"`.
 */
export function usePrepareUniswapNftManagerSelfPermitAllowedIfNecessary(
  config: Omit<
    UsePrepareContractWriteConfig<typeof uniswapNftManagerABI, 'selfPermitAllowedIfNecessary'>,
    'abi' | 'functionName'
  > = {} as any
) {
  return usePrepareContractWrite({
    abi: uniswapNftManagerABI,
    functionName: 'selfPermitAllowedIfNecessary',
    ...config,
  } as UsePrepareContractWriteConfig<typeof uniswapNftManagerABI, 'selfPermitAllowedIfNecessary'>)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link uniswapNftManagerABI}__ and `functionName` set to `"selfPermitIfNecessary"`.
 */
export function usePrepareUniswapNftManagerSelfPermitIfNecessary(
  config: Omit<
    UsePrepareContractWriteConfig<typeof uniswapNftManagerABI, 'selfPermitIfNecessary'>,
    'abi' | 'functionName'
  > = {} as any
) {
  return usePrepareContractWrite({
    abi: uniswapNftManagerABI,
    functionName: 'selfPermitIfNecessary',
    ...config,
  } as UsePrepareContractWriteConfig<typeof uniswapNftManagerABI, 'selfPermitIfNecessary'>)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link uniswapNftManagerABI}__ and `functionName` set to `"setApprovalForAll"`.
 */
export function usePrepareUniswapNftManagerSetApprovalForAll(
  config: Omit<
    UsePrepareContractWriteConfig<typeof uniswapNftManagerABI, 'setApprovalForAll'>,
    'abi' | 'functionName'
  > = {} as any
) {
  return usePrepareContractWrite({
    abi: uniswapNftManagerABI,
    functionName: 'setApprovalForAll',
    ...config,
  } as UsePrepareContractWriteConfig<typeof uniswapNftManagerABI, 'setApprovalForAll'>)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link uniswapNftManagerABI}__ and `functionName` set to `"sweepToken"`.
 */
export function usePrepareUniswapNftManagerSweepToken(
  config: Omit<
    UsePrepareContractWriteConfig<typeof uniswapNftManagerABI, 'sweepToken'>,
    'abi' | 'functionName'
  > = {} as any
) {
  return usePrepareContractWrite({
    abi: uniswapNftManagerABI,
    functionName: 'sweepToken',
    ...config,
  } as UsePrepareContractWriteConfig<typeof uniswapNftManagerABI, 'sweepToken'>)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link uniswapNftManagerABI}__ and `functionName` set to `"transferFrom"`.
 */
export function usePrepareUniswapNftManagerTransferFrom(
  config: Omit<
    UsePrepareContractWriteConfig<typeof uniswapNftManagerABI, 'transferFrom'>,
    'abi' | 'functionName'
  > = {} as any
) {
  return usePrepareContractWrite({
    abi: uniswapNftManagerABI,
    functionName: 'transferFrom',
    ...config,
  } as UsePrepareContractWriteConfig<typeof uniswapNftManagerABI, 'transferFrom'>)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link uniswapNftManagerABI}__ and `functionName` set to `"uniswapV3MintCallback"`.
 */
export function usePrepareUniswapNftManagerUniswapV3MintCallback(
  config: Omit<
    UsePrepareContractWriteConfig<typeof uniswapNftManagerABI, 'uniswapV3MintCallback'>,
    'abi' | 'functionName'
  > = {} as any
) {
  return usePrepareContractWrite({
    abi: uniswapNftManagerABI,
    functionName: 'uniswapV3MintCallback',
    ...config,
  } as UsePrepareContractWriteConfig<typeof uniswapNftManagerABI, 'uniswapV3MintCallback'>)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link uniswapNftManagerABI}__ and `functionName` set to `"unwrapWETH9"`.
 */
export function usePrepareUniswapNftManagerUnwrapWeth9(
  config: Omit<
    UsePrepareContractWriteConfig<typeof uniswapNftManagerABI, 'unwrapWETH9'>,
    'abi' | 'functionName'
  > = {} as any
) {
  return usePrepareContractWrite({
    abi: uniswapNftManagerABI,
    functionName: 'unwrapWETH9',
    ...config,
  } as UsePrepareContractWriteConfig<typeof uniswapNftManagerABI, 'unwrapWETH9'>)
}

/**
 * Wraps __{@link useContractEvent}__ with `abi` set to __{@link uniswapNftManagerABI}__.
 */
export function useUniswapNftManagerEvent<TEventName extends string>(
  config: Omit<UseContractEventConfig<typeof uniswapNftManagerABI, TEventName>, 'abi'> = {} as any
) {
  return useContractEvent({ abi: uniswapNftManagerABI, ...config } as UseContractEventConfig<
    typeof uniswapNftManagerABI,
    TEventName
  >)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link uniswapV3PoolABI}__.
 */
export function useUniswapV3PoolRead<
  TFunctionName extends string,
  TSelectData = ReadContractResult<typeof uniswapV3PoolABI, TFunctionName>
>(config: Omit<UseContractReadConfig<typeof uniswapV3PoolABI, TFunctionName, TSelectData>, 'abi'> = {} as any) {
  return useContractRead({ abi: uniswapV3PoolABI, ...config } as UseContractReadConfig<
    typeof uniswapV3PoolABI,
    TFunctionName,
    TSelectData
  >)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link uniswapV3PoolABI}__ and `functionName` set to `"factory"`.
 */
export function useUniswapV3PoolFactory<
  TFunctionName extends 'factory',
  TSelectData = ReadContractResult<typeof uniswapV3PoolABI, TFunctionName>
>(
  config: Omit<
    UseContractReadConfig<typeof uniswapV3PoolABI, TFunctionName, TSelectData>,
    'abi' | 'functionName'
  > = {} as any
) {
  return useContractRead({ abi: uniswapV3PoolABI, functionName: 'factory', ...config } as UseContractReadConfig<
    typeof uniswapV3PoolABI,
    TFunctionName,
    TSelectData
  >)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link uniswapV3PoolABI}__ and `functionName` set to `"fee"`.
 */
export function useUniswapV3PoolFee<
  TFunctionName extends 'fee',
  TSelectData = ReadContractResult<typeof uniswapV3PoolABI, TFunctionName>
>(
  config: Omit<
    UseContractReadConfig<typeof uniswapV3PoolABI, TFunctionName, TSelectData>,
    'abi' | 'functionName'
  > = {} as any
) {
  return useContractRead({ abi: uniswapV3PoolABI, functionName: 'fee', ...config } as UseContractReadConfig<
    typeof uniswapV3PoolABI,
    TFunctionName,
    TSelectData
  >)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link uniswapV3PoolABI}__ and `functionName` set to `"feeGrowthGlobal0X128"`.
 */
export function useUniswapV3PoolFeeGrowthGlobal0X128<
  TFunctionName extends 'feeGrowthGlobal0X128',
  TSelectData = ReadContractResult<typeof uniswapV3PoolABI, TFunctionName>
>(
  config: Omit<
    UseContractReadConfig<typeof uniswapV3PoolABI, TFunctionName, TSelectData>,
    'abi' | 'functionName'
  > = {} as any
) {
  return useContractRead({
    abi: uniswapV3PoolABI,
    functionName: 'feeGrowthGlobal0X128',
    ...config,
  } as UseContractReadConfig<typeof uniswapV3PoolABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link uniswapV3PoolABI}__ and `functionName` set to `"feeGrowthGlobal1X128"`.
 */
export function useUniswapV3PoolFeeGrowthGlobal1X128<
  TFunctionName extends 'feeGrowthGlobal1X128',
  TSelectData = ReadContractResult<typeof uniswapV3PoolABI, TFunctionName>
>(
  config: Omit<
    UseContractReadConfig<typeof uniswapV3PoolABI, TFunctionName, TSelectData>,
    'abi' | 'functionName'
  > = {} as any
) {
  return useContractRead({
    abi: uniswapV3PoolABI,
    functionName: 'feeGrowthGlobal1X128',
    ...config,
  } as UseContractReadConfig<typeof uniswapV3PoolABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link uniswapV3PoolABI}__ and `functionName` set to `"liquidity"`.
 */
export function useUniswapV3PoolLiquidity<
  TFunctionName extends 'liquidity',
  TSelectData = ReadContractResult<typeof uniswapV3PoolABI, TFunctionName>
>(
  config: Omit<
    UseContractReadConfig<typeof uniswapV3PoolABI, TFunctionName, TSelectData>,
    'abi' | 'functionName'
  > = {} as any
) {
  return useContractRead({ abi: uniswapV3PoolABI, functionName: 'liquidity', ...config } as UseContractReadConfig<
    typeof uniswapV3PoolABI,
    TFunctionName,
    TSelectData
  >)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link uniswapV3PoolABI}__ and `functionName` set to `"maxLiquidityPerTick"`.
 */
export function useUniswapV3PoolMaxLiquidityPerTick<
  TFunctionName extends 'maxLiquidityPerTick',
  TSelectData = ReadContractResult<typeof uniswapV3PoolABI, TFunctionName>
>(
  config: Omit<
    UseContractReadConfig<typeof uniswapV3PoolABI, TFunctionName, TSelectData>,
    'abi' | 'functionName'
  > = {} as any
) {
  return useContractRead({
    abi: uniswapV3PoolABI,
    functionName: 'maxLiquidityPerTick',
    ...config,
  } as UseContractReadConfig<typeof uniswapV3PoolABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link uniswapV3PoolABI}__ and `functionName` set to `"observations"`.
 */
export function useUniswapV3PoolObservations<
  TFunctionName extends 'observations',
  TSelectData = ReadContractResult<typeof uniswapV3PoolABI, TFunctionName>
>(
  config: Omit<
    UseContractReadConfig<typeof uniswapV3PoolABI, TFunctionName, TSelectData>,
    'abi' | 'functionName'
  > = {} as any
) {
  return useContractRead({ abi: uniswapV3PoolABI, functionName: 'observations', ...config } as UseContractReadConfig<
    typeof uniswapV3PoolABI,
    TFunctionName,
    TSelectData
  >)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link uniswapV3PoolABI}__ and `functionName` set to `"observe"`.
 */
export function useUniswapV3PoolObserve<
  TFunctionName extends 'observe',
  TSelectData = ReadContractResult<typeof uniswapV3PoolABI, TFunctionName>
>(
  config: Omit<
    UseContractReadConfig<typeof uniswapV3PoolABI, TFunctionName, TSelectData>,
    'abi' | 'functionName'
  > = {} as any
) {
  return useContractRead({ abi: uniswapV3PoolABI, functionName: 'observe', ...config } as UseContractReadConfig<
    typeof uniswapV3PoolABI,
    TFunctionName,
    TSelectData
  >)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link uniswapV3PoolABI}__ and `functionName` set to `"positions"`.
 */
export function useUniswapV3PoolPositions<
  TFunctionName extends 'positions',
  TSelectData = ReadContractResult<typeof uniswapV3PoolABI, TFunctionName>
>(
  config: Omit<
    UseContractReadConfig<typeof uniswapV3PoolABI, TFunctionName, TSelectData>,
    'abi' | 'functionName'
  > = {} as any
) {
  return useContractRead({ abi: uniswapV3PoolABI, functionName: 'positions', ...config } as UseContractReadConfig<
    typeof uniswapV3PoolABI,
    TFunctionName,
    TSelectData
  >)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link uniswapV3PoolABI}__ and `functionName` set to `"protocolFees"`.
 */
export function useUniswapV3PoolProtocolFees<
  TFunctionName extends 'protocolFees',
  TSelectData = ReadContractResult<typeof uniswapV3PoolABI, TFunctionName>
>(
  config: Omit<
    UseContractReadConfig<typeof uniswapV3PoolABI, TFunctionName, TSelectData>,
    'abi' | 'functionName'
  > = {} as any
) {
  return useContractRead({ abi: uniswapV3PoolABI, functionName: 'protocolFees', ...config } as UseContractReadConfig<
    typeof uniswapV3PoolABI,
    TFunctionName,
    TSelectData
  >)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link uniswapV3PoolABI}__ and `functionName` set to `"slot0"`.
 */
export function useUniswapV3PoolSlot0<
  TFunctionName extends 'slot0',
  TSelectData = ReadContractResult<typeof uniswapV3PoolABI, TFunctionName>
>(
  config: Omit<
    UseContractReadConfig<typeof uniswapV3PoolABI, TFunctionName, TSelectData>,
    'abi' | 'functionName'
  > = {} as any
) {
  return useContractRead({ abi: uniswapV3PoolABI, functionName: 'slot0', ...config } as UseContractReadConfig<
    typeof uniswapV3PoolABI,
    TFunctionName,
    TSelectData
  >)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link uniswapV3PoolABI}__ and `functionName` set to `"snapshotCumulativesInside"`.
 */
export function useUniswapV3PoolSnapshotCumulativesInside<
  TFunctionName extends 'snapshotCumulativesInside',
  TSelectData = ReadContractResult<typeof uniswapV3PoolABI, TFunctionName>
>(
  config: Omit<
    UseContractReadConfig<typeof uniswapV3PoolABI, TFunctionName, TSelectData>,
    'abi' | 'functionName'
  > = {} as any
) {
  return useContractRead({
    abi: uniswapV3PoolABI,
    functionName: 'snapshotCumulativesInside',
    ...config,
  } as UseContractReadConfig<typeof uniswapV3PoolABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link uniswapV3PoolABI}__ and `functionName` set to `"tickBitmap"`.
 */
export function useUniswapV3PoolTickBitmap<
  TFunctionName extends 'tickBitmap',
  TSelectData = ReadContractResult<typeof uniswapV3PoolABI, TFunctionName>
>(
  config: Omit<
    UseContractReadConfig<typeof uniswapV3PoolABI, TFunctionName, TSelectData>,
    'abi' | 'functionName'
  > = {} as any
) {
  return useContractRead({ abi: uniswapV3PoolABI, functionName: 'tickBitmap', ...config } as UseContractReadConfig<
    typeof uniswapV3PoolABI,
    TFunctionName,
    TSelectData
  >)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link uniswapV3PoolABI}__ and `functionName` set to `"tickSpacing"`.
 */
export function useUniswapV3PoolTickSpacing<
  TFunctionName extends 'tickSpacing',
  TSelectData = ReadContractResult<typeof uniswapV3PoolABI, TFunctionName>
>(
  config: Omit<
    UseContractReadConfig<typeof uniswapV3PoolABI, TFunctionName, TSelectData>,
    'abi' | 'functionName'
  > = {} as any
) {
  return useContractRead({ abi: uniswapV3PoolABI, functionName: 'tickSpacing', ...config } as UseContractReadConfig<
    typeof uniswapV3PoolABI,
    TFunctionName,
    TSelectData
  >)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link uniswapV3PoolABI}__ and `functionName` set to `"ticks"`.
 */
export function useUniswapV3PoolTicks<
  TFunctionName extends 'ticks',
  TSelectData = ReadContractResult<typeof uniswapV3PoolABI, TFunctionName>
>(
  config: Omit<
    UseContractReadConfig<typeof uniswapV3PoolABI, TFunctionName, TSelectData>,
    'abi' | 'functionName'
  > = {} as any
) {
  return useContractRead({ abi: uniswapV3PoolABI, functionName: 'ticks', ...config } as UseContractReadConfig<
    typeof uniswapV3PoolABI,
    TFunctionName,
    TSelectData
  >)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link uniswapV3PoolABI}__ and `functionName` set to `"token0"`.
 */
export function useUniswapV3PoolToken0<
  TFunctionName extends 'token0',
  TSelectData = ReadContractResult<typeof uniswapV3PoolABI, TFunctionName>
>(
  config: Omit<
    UseContractReadConfig<typeof uniswapV3PoolABI, TFunctionName, TSelectData>,
    'abi' | 'functionName'
  > = {} as any
) {
  return useContractRead({ abi: uniswapV3PoolABI, functionName: 'token0', ...config } as UseContractReadConfig<
    typeof uniswapV3PoolABI,
    TFunctionName,
    TSelectData
  >)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link uniswapV3PoolABI}__ and `functionName` set to `"token1"`.
 */
export function useUniswapV3PoolToken1<
  TFunctionName extends 'token1',
  TSelectData = ReadContractResult<typeof uniswapV3PoolABI, TFunctionName>
>(
  config: Omit<
    UseContractReadConfig<typeof uniswapV3PoolABI, TFunctionName, TSelectData>,
    'abi' | 'functionName'
  > = {} as any
) {
  return useContractRead({ abi: uniswapV3PoolABI, functionName: 'token1', ...config } as UseContractReadConfig<
    typeof uniswapV3PoolABI,
    TFunctionName,
    TSelectData
  >)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link uniswapV3PoolABI}__.
 */
export function useUniswapV3PoolWrite<TFunctionName extends string, TMode extends WriteContractMode = undefined>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<typeof uniswapV3PoolABI, string>['request']['abi'],
        TFunctionName,
        TMode
      >
    : UseContractWriteConfig<typeof uniswapV3PoolABI, TFunctionName, TMode> & {
        abi?: never
      } = {} as any
) {
  return useContractWrite<typeof uniswapV3PoolABI, TFunctionName, TMode>({ abi: uniswapV3PoolABI, ...config } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link uniswapV3PoolABI}__ and `functionName` set to `"burn"`.
 */
export function useUniswapV3PoolBurn<TMode extends WriteContractMode = undefined>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<typeof uniswapV3PoolABI, 'burn'>['request']['abi'],
        'burn',
        TMode
      > & { functionName?: 'burn' }
    : UseContractWriteConfig<typeof uniswapV3PoolABI, 'burn', TMode> & {
        abi?: never
        functionName?: 'burn'
      } = {} as any
) {
  return useContractWrite<typeof uniswapV3PoolABI, 'burn', TMode>({
    abi: uniswapV3PoolABI,
    functionName: 'burn',
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link uniswapV3PoolABI}__ and `functionName` set to `"collect"`.
 */
export function useUniswapV3PoolCollect<TMode extends WriteContractMode = undefined>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<typeof uniswapV3PoolABI, 'collect'>['request']['abi'],
        'collect',
        TMode
      > & { functionName?: 'collect' }
    : UseContractWriteConfig<typeof uniswapV3PoolABI, 'collect', TMode> & {
        abi?: never
        functionName?: 'collect'
      } = {} as any
) {
  return useContractWrite<typeof uniswapV3PoolABI, 'collect', TMode>({
    abi: uniswapV3PoolABI,
    functionName: 'collect',
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link uniswapV3PoolABI}__ and `functionName` set to `"collectProtocol"`.
 */
export function useUniswapV3PoolCollectProtocol<TMode extends WriteContractMode = undefined>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<typeof uniswapV3PoolABI, 'collectProtocol'>['request']['abi'],
        'collectProtocol',
        TMode
      > & { functionName?: 'collectProtocol' }
    : UseContractWriteConfig<typeof uniswapV3PoolABI, 'collectProtocol', TMode> & {
        abi?: never
        functionName?: 'collectProtocol'
      } = {} as any
) {
  return useContractWrite<typeof uniswapV3PoolABI, 'collectProtocol', TMode>({
    abi: uniswapV3PoolABI,
    functionName: 'collectProtocol',
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link uniswapV3PoolABI}__ and `functionName` set to `"flash"`.
 */
export function useUniswapV3PoolFlash<TMode extends WriteContractMode = undefined>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<typeof uniswapV3PoolABI, 'flash'>['request']['abi'],
        'flash',
        TMode
      > & { functionName?: 'flash' }
    : UseContractWriteConfig<typeof uniswapV3PoolABI, 'flash', TMode> & {
        abi?: never
        functionName?: 'flash'
      } = {} as any
) {
  return useContractWrite<typeof uniswapV3PoolABI, 'flash', TMode>({
    abi: uniswapV3PoolABI,
    functionName: 'flash',
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link uniswapV3PoolABI}__ and `functionName` set to `"increaseObservationCardinalityNext"`.
 */
export function useUniswapV3PoolIncreaseObservationCardinalityNext<TMode extends WriteContractMode = undefined>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<typeof uniswapV3PoolABI, 'increaseObservationCardinalityNext'>['request']['abi'],
        'increaseObservationCardinalityNext',
        TMode
      > & { functionName?: 'increaseObservationCardinalityNext' }
    : UseContractWriteConfig<typeof uniswapV3PoolABI, 'increaseObservationCardinalityNext', TMode> & {
        abi?: never
        functionName?: 'increaseObservationCardinalityNext'
      } = {} as any
) {
  return useContractWrite<typeof uniswapV3PoolABI, 'increaseObservationCardinalityNext', TMode>({
    abi: uniswapV3PoolABI,
    functionName: 'increaseObservationCardinalityNext',
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link uniswapV3PoolABI}__ and `functionName` set to `"initialize"`.
 */
export function useUniswapV3PoolInitialize<TMode extends WriteContractMode = undefined>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<typeof uniswapV3PoolABI, 'initialize'>['request']['abi'],
        'initialize',
        TMode
      > & { functionName?: 'initialize' }
    : UseContractWriteConfig<typeof uniswapV3PoolABI, 'initialize', TMode> & {
        abi?: never
        functionName?: 'initialize'
      } = {} as any
) {
  return useContractWrite<typeof uniswapV3PoolABI, 'initialize', TMode>({
    abi: uniswapV3PoolABI,
    functionName: 'initialize',
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link uniswapV3PoolABI}__ and `functionName` set to `"mint"`.
 */
export function useUniswapV3PoolMint<TMode extends WriteContractMode = undefined>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<typeof uniswapV3PoolABI, 'mint'>['request']['abi'],
        'mint',
        TMode
      > & { functionName?: 'mint' }
    : UseContractWriteConfig<typeof uniswapV3PoolABI, 'mint', TMode> & {
        abi?: never
        functionName?: 'mint'
      } = {} as any
) {
  return useContractWrite<typeof uniswapV3PoolABI, 'mint', TMode>({
    abi: uniswapV3PoolABI,
    functionName: 'mint',
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link uniswapV3PoolABI}__ and `functionName` set to `"setFeeProtocol"`.
 */
export function useUniswapV3PoolSetFeeProtocol<TMode extends WriteContractMode = undefined>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<typeof uniswapV3PoolABI, 'setFeeProtocol'>['request']['abi'],
        'setFeeProtocol',
        TMode
      > & { functionName?: 'setFeeProtocol' }
    : UseContractWriteConfig<typeof uniswapV3PoolABI, 'setFeeProtocol', TMode> & {
        abi?: never
        functionName?: 'setFeeProtocol'
      } = {} as any
) {
  return useContractWrite<typeof uniswapV3PoolABI, 'setFeeProtocol', TMode>({
    abi: uniswapV3PoolABI,
    functionName: 'setFeeProtocol',
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link uniswapV3PoolABI}__ and `functionName` set to `"swap"`.
 */
export function useUniswapV3PoolSwap<TMode extends WriteContractMode = undefined>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<typeof uniswapV3PoolABI, 'swap'>['request']['abi'],
        'swap',
        TMode
      > & { functionName?: 'swap' }
    : UseContractWriteConfig<typeof uniswapV3PoolABI, 'swap', TMode> & {
        abi?: never
        functionName?: 'swap'
      } = {} as any
) {
  return useContractWrite<typeof uniswapV3PoolABI, 'swap', TMode>({
    abi: uniswapV3PoolABI,
    functionName: 'swap',
    ...config,
  } as any)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link uniswapV3PoolABI}__.
 */
export function usePrepareUniswapV3PoolWrite<TFunctionName extends string>(
  config: Omit<UsePrepareContractWriteConfig<typeof uniswapV3PoolABI, TFunctionName>, 'abi'> = {} as any
) {
  return usePrepareContractWrite({ abi: uniswapV3PoolABI, ...config } as UsePrepareContractWriteConfig<
    typeof uniswapV3PoolABI,
    TFunctionName
  >)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link uniswapV3PoolABI}__ and `functionName` set to `"burn"`.
 */
export function usePrepareUniswapV3PoolBurn(
  config: Omit<UsePrepareContractWriteConfig<typeof uniswapV3PoolABI, 'burn'>, 'abi' | 'functionName'> = {} as any
) {
  return usePrepareContractWrite({
    abi: uniswapV3PoolABI,
    functionName: 'burn',
    ...config,
  } as UsePrepareContractWriteConfig<typeof uniswapV3PoolABI, 'burn'>)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link uniswapV3PoolABI}__ and `functionName` set to `"collect"`.
 */
export function usePrepareUniswapV3PoolCollect(
  config: Omit<UsePrepareContractWriteConfig<typeof uniswapV3PoolABI, 'collect'>, 'abi' | 'functionName'> = {} as any
) {
  return usePrepareContractWrite({
    abi: uniswapV3PoolABI,
    functionName: 'collect',
    ...config,
  } as UsePrepareContractWriteConfig<typeof uniswapV3PoolABI, 'collect'>)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link uniswapV3PoolABI}__ and `functionName` set to `"collectProtocol"`.
 */
export function usePrepareUniswapV3PoolCollectProtocol(
  config: Omit<
    UsePrepareContractWriteConfig<typeof uniswapV3PoolABI, 'collectProtocol'>,
    'abi' | 'functionName'
  > = {} as any
) {
  return usePrepareContractWrite({
    abi: uniswapV3PoolABI,
    functionName: 'collectProtocol',
    ...config,
  } as UsePrepareContractWriteConfig<typeof uniswapV3PoolABI, 'collectProtocol'>)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link uniswapV3PoolABI}__ and `functionName` set to `"flash"`.
 */
export function usePrepareUniswapV3PoolFlash(
  config: Omit<UsePrepareContractWriteConfig<typeof uniswapV3PoolABI, 'flash'>, 'abi' | 'functionName'> = {} as any
) {
  return usePrepareContractWrite({
    abi: uniswapV3PoolABI,
    functionName: 'flash',
    ...config,
  } as UsePrepareContractWriteConfig<typeof uniswapV3PoolABI, 'flash'>)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link uniswapV3PoolABI}__ and `functionName` set to `"increaseObservationCardinalityNext"`.
 */
export function usePrepareUniswapV3PoolIncreaseObservationCardinalityNext(
  config: Omit<
    UsePrepareContractWriteConfig<typeof uniswapV3PoolABI, 'increaseObservationCardinalityNext'>,
    'abi' | 'functionName'
  > = {} as any
) {
  return usePrepareContractWrite({
    abi: uniswapV3PoolABI,
    functionName: 'increaseObservationCardinalityNext',
    ...config,
  } as UsePrepareContractWriteConfig<typeof uniswapV3PoolABI, 'increaseObservationCardinalityNext'>)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link uniswapV3PoolABI}__ and `functionName` set to `"initialize"`.
 */
export function usePrepareUniswapV3PoolInitialize(
  config: Omit<UsePrepareContractWriteConfig<typeof uniswapV3PoolABI, 'initialize'>, 'abi' | 'functionName'> = {} as any
) {
  return usePrepareContractWrite({
    abi: uniswapV3PoolABI,
    functionName: 'initialize',
    ...config,
  } as UsePrepareContractWriteConfig<typeof uniswapV3PoolABI, 'initialize'>)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link uniswapV3PoolABI}__ and `functionName` set to `"mint"`.
 */
export function usePrepareUniswapV3PoolMint(
  config: Omit<UsePrepareContractWriteConfig<typeof uniswapV3PoolABI, 'mint'>, 'abi' | 'functionName'> = {} as any
) {
  return usePrepareContractWrite({
    abi: uniswapV3PoolABI,
    functionName: 'mint',
    ...config,
  } as UsePrepareContractWriteConfig<typeof uniswapV3PoolABI, 'mint'>)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link uniswapV3PoolABI}__ and `functionName` set to `"setFeeProtocol"`.
 */
export function usePrepareUniswapV3PoolSetFeeProtocol(
  config: Omit<
    UsePrepareContractWriteConfig<typeof uniswapV3PoolABI, 'setFeeProtocol'>,
    'abi' | 'functionName'
  > = {} as any
) {
  return usePrepareContractWrite({
    abi: uniswapV3PoolABI,
    functionName: 'setFeeProtocol',
    ...config,
  } as UsePrepareContractWriteConfig<typeof uniswapV3PoolABI, 'setFeeProtocol'>)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link uniswapV3PoolABI}__ and `functionName` set to `"swap"`.
 */
export function usePrepareUniswapV3PoolSwap(
  config: Omit<UsePrepareContractWriteConfig<typeof uniswapV3PoolABI, 'swap'>, 'abi' | 'functionName'> = {} as any
) {
  return usePrepareContractWrite({
    abi: uniswapV3PoolABI,
    functionName: 'swap',
    ...config,
  } as UsePrepareContractWriteConfig<typeof uniswapV3PoolABI, 'swap'>)
}

/**
 * Wraps __{@link useContractEvent}__ with `abi` set to __{@link uniswapV3PoolABI}__.
 */
export function useUniswapV3PoolEvent<TEventName extends string>(
  config: Omit<UseContractEventConfig<typeof uniswapV3PoolABI, TEventName>, 'abi'> = {} as any
) {
  return useContractEvent({ abi: uniswapV3PoolABI, ...config } as UseContractEventConfig<
    typeof uniswapV3PoolABI,
    TEventName
  >)
}
