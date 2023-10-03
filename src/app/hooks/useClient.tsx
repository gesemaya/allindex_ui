import { useChainLoader } from '../route/RouteWrapper'
import { CushApi } from '@gfxlabs/oku'
import type { QueryKey } from '@tanstack/query-core'
import { UseQueryOptions, UseQueryResult, useQuery } from '@tanstack/react-query'
import { useRpcContext } from '../context/naked/RpcContext'
import { useRpcBlockContext } from '../context/naked/RpcBlockContext'
import { useEffect, useState } from 'react'

export type ReturnTypeOfMethod<T> = T extends (...args: Array<any>) => any ? ReturnType<T> : any
export type ReturnTypeOfMethodIfExists<T, S> = S extends keyof T ? ReturnTypeOfMethod<T[S]> : any
export type MethodParams<T> = T extends (...args: infer P) => any ? P[0] : T
export type MethodParamsIfExists<T, S> = S extends keyof T ? MethodParams<T[S]> : S

export function useCurrentClient<
  K extends keyof CushApi,
  TData = ReturnTypeOfMethodIfExists<CushApi, K>,
  TMutated = TData,
  TError = unknown,
  TQueryKey extends QueryKey = QueryKey
>(
  method: K | [K, (data?: TData) => TMutated],
  args: MethodParamsIfExists<CushApi, K>,
  options: UseQueryOptions<TData, TError, TData, TQueryKey> = { keepPreviousData: true }
): UseQueryResult<TData, TError> & { mutatedData: TMutated } {
  const { omniCush } = useRpcContext()
  const { chain } = useChainLoader()
  const { blockNumber } = useRpcBlockContext()
  if (options) {
    if (options.keepPreviousData !== false) {
      options.keepPreviousData = true
    }
  }
  const copied: Omit<UseQueryOptions<TData, TError, TData, TQueryKey>, 'initialData'> = {
    ...options,
  }
  copied.queryFn = async () => {
    if (typeof method === 'string') {
      return omniCush.network(chain).call(method, args)
    } else {
      return omniCush.network(chain).call(method[0], args)
    }
  }
  copied.queryKey = [chain, method, blockNumber, options.queryKey, args] as any
  // 30 seconds cache
  if (!copied.cacheTime) {
    copied.cacheTime = 30 * 1000
  }
  const resp = useQuery(copied)
  useEffect(() => {
    resp.refetch()
  }, [omniCush, chain])

  const mutator =
    typeof method !== 'string'
      ? method[1]
      : (x: any) => {
          return x
        }
  const [mutatedData, setMutatedData] = useState<TMutated>(mutator(resp.data))
  useEffect(() => {
    setMutatedData(mutator(resp.data))
  }, [resp.data])
  let r: UseQueryResult<TData, TError> & { mutatedData: TMutated } = resp as any
  r.mutatedData = mutatedData
  return r
}
