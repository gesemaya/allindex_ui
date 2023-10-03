import { TelemetryApi } from './telemetry_client'
import { RpcClient } from '@gfxlabs/jsrpc'

export const recordTelemetry = async (
  telemetry: RpcClient<TelemetryApi>,
  chain_id: number,
  current_page: string,
  feature: string,
  address: string,
  transaction: string,
  extra: any
) => {
  try {
    return telemetry.call('marq_recordOkuTelemetry', [chain_id, current_page, feature, address, transaction, extra])
  } catch (err) {
    const error = err as Error
    window.log.log(err)
    throw new Error(error.message)
  }
}
