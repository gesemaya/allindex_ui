/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ExecutionInformation } from '../models/ExecutionInformation'
import type { ExecutionRequest } from '../models/ExecutionRequest'
import type { MarketReport } from '../models/MarketReport'
import type { PriceQuote } from '../models/PriceQuote'
import type { QuoteParameters } from '../models/QuoteParameters'
import type { StatusReport } from '../models/StatusReport'

import type { CancelablePromise } from '../core/CancelablePromise'
import type { BaseHttpRequest } from '../core/BaseHttpRequest'

export class DefaultService {
  constructor(public readonly httpRequest: BaseHttpRequest) {}

  /**
   * @returns string Ok
   * @throws ApiError
   */
  public getHealth(): CancelablePromise<string> {
    return this.httpRequest.request({
      method: 'GET',
      url: '/health',
    })
  }

  /**
   * @returns StatusReport Ok
   * @throws ApiError
   */
  public getMarketsOverview(): CancelablePromise<Array<StatusReport>> {
    return this.httpRequest.request({
      method: 'GET',
      url: '/market/overview',
    })
  }

  /**
   * Status of Market
   * @param marketId
   * @returns any Ok
   * @throws ApiError
   */
  public getMarketStatus(marketId: string): CancelablePromise<
    | {
        report: MarketReport
        active: boolean
        name: string
      }
    | {
        active: boolean
        name: string
      }
  > {
    return this.httpRequest.request({
      method: 'GET',
      url: '/market/{marketId}/status',
      path: {
        marketId: marketId,
      },
    })
  }

  /**
   * Quote Market Price
   * @param marketId
   * @param requestBody
   * @returns PriceQuote Ok
   * @throws ApiError
   */
  public postMarketPriceQuote(marketId: string, requestBody: QuoteParameters): CancelablePromise<PriceQuote> {
    return this.httpRequest.request({
      method: 'POST',
      url: '/market/{marketId}/price_quote',
      path: {
        marketId: marketId,
      },
      body: requestBody,
      mediaType: 'application/json',
    })
  }

  /**
   * Quote Market Price
   * @param marketId
   * @param requestBody
   * @returns PriceQuote Ok
   * @throws ApiError
   */
  public postMarketSwapQuote(marketId: string, requestBody: QuoteParameters): CancelablePromise<PriceQuote> {
    return this.httpRequest.request({
      method: 'POST',
      url: '/market/{marketId}/swap_quote',
      path: {
        marketId: marketId,
      },
      body: requestBody,
      mediaType: 'application/json',
    })
  }

  /**
   * Obtain Execution Information
   * @param marketId
   * @param requestBody
   * @returns ExecutionInformation Ok
   * @throws ApiError
   */
  public postExecutionInformation(
    marketId: string,
    requestBody: ExecutionRequest
  ): CancelablePromise<ExecutionInformation> {
    return this.httpRequest.request({
      method: 'POST',
      url: '/market/{marketId}/execution_information',
      path: {
        marketId: marketId,
      },
      body: requestBody,
      mediaType: 'application/json',
    })
  }
}
