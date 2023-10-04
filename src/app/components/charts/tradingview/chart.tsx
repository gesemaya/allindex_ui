//import './index.css';
import {
  ChartingLibraryWidgetOptions,
  IChartingLibraryWidget,
  LanguageCode,
  ResolutionString,
  widget,
} from '@/charting_library/charting_library.esm.js'
import { useChainLoader } from '../../../route/RouteWrapper'
import { useI18nContext } from '../../../context/naked/I18nContext'
import { TradingViewDatafeed } from '../../../data/TradingViewDatafeed'
import * as React from 'react'
import { useEffect, useRef } from 'react'
import { useParams } from 'react-router-dom'
import { useChartDataContext } from '../context/ChartDataContext'
import { ChartEnums } from '../../../types/Enums'
import { useDataContext } from '../../../context/DataContext'

export interface ChartContainerProps {
  symbol: ChartingLibraryWidgetOptions['symbol']
  interval: ChartingLibraryWidgetOptions['interval']

  libraryPath: ChartingLibraryWidgetOptions['library_path']
  chartsStorageUrl: ChartingLibraryWidgetOptions['charts_storage_url']
  chartsStorageApiVersion: ChartingLibraryWidgetOptions['charts_storage_api_version']
  clientId: ChartingLibraryWidgetOptions['client_id']
  userId: ChartingLibraryWidgetOptions['user_id']
  fullscreen: ChartingLibraryWidgetOptions['fullscreen']
  autosize: ChartingLibraryWidgetOptions['autosize']
  studiesOverrides: ChartingLibraryWidgetOptions['studies_overrides']
  container: ChartingLibraryWidgetOptions['container']
}

interface ITradingViewChart {
  width: number
  height: number
}

export const TradingViewChart = () => {
  const i18n = useI18nContext()

  const { setChartType } = useChartDataContext()

  const { cushRpc } = useChainLoader()
  const { poolAddress, token, setToken } = useDataContext()

  const symbolName = () => {
    return `${poolAddress}_${token.flipped ? '_flip' : '_noflip'}`
  }

  const chartContainerRef = useRef<HTMLDivElement>() as React.MutableRefObject<HTMLInputElement>

  const defaultProps: Omit<ChartContainerProps, 'container'> = {
    symbol: symbolName(),
    interval: '1H' as ResolutionString,
    libraryPath: '/app/charting_library/',
    chartsStorageUrl: 'https://saveload.tradingview.com',
    chartsStorageApiVersion: '1.1',
    clientId: 'localhost',
    userId: 'user',
    fullscreen: false,
    autosize: true,
    studiesOverrides: {},
  }
  const [tvWidget, setTvWidget] = React.useState<IChartingLibraryWidget | undefined>(undefined)

  const backgroundColor = '#0e0e0e'

  useEffect(() => {
    if (tvWidget) {
      try {
        tvWidget.setSymbol(symbolName(), '1H' as any, () => {})
      } catch (e) {
        // wahtever i guess
      }
    }
  }, [token, poolAddress, tvWidget])

  const [swapButton, setSwapButton] = React.useState<HTMLElement | undefined>(undefined)
  useEffect(() => {
    if (swapButton) {
      swapButton.onclick = () => {
        setToken(-1)
      }
    }
  }, [swapButton, token])

  useEffect(() => {
    if (!cushRpc) return
    const df = new TradingViewDatafeed(cushRpc)
    const widgetOptions: ChartingLibraryWidgetOptions = {
      symbol: symbolName(),
      // BEWARE: no trailing slash is expected in feed URL
      // tslint:disable-next-line:no-any
      //datafeed: new (window as any).Datafeeds.UDFCompatibleDatafeed(defaultProps.datafeedUrl),
      datafeed: df,
      interval: defaultProps.interval as ChartingLibraryWidgetOptions['interval'],
      container: chartContainerRef.current,
      library_path: defaultProps.libraryPath as string,
      theme: 'dark',
      locale: i18n.locale as LanguageCode,
      disabled_features: [
        'header_saveload',
        'header_compare',
        'header_symbol_search',
        'symbol_search_hot_key',
        'header_chart_type',
        'popup_hints',
        'use_localstorage_for_settings',
        'adaptive_logo',
      ],
      enabled_features: [
        'study_templates',
        'volume_force_overlay',
        'create_volume_indicator_by_default',
        'pinch_scale',
        'show_zoom_and_move_buttons_on_touch',
        'horz_touch_drag_scroll',
        'vert_touch_drag_scroll',
      ],
      charts_storage_url: defaultProps.chartsStorageUrl,
      charts_storage_api_version: defaultProps.chartsStorageApiVersion,
      client_id: defaultProps.clientId,
      user_id: defaultProps.userId,
      fullscreen: defaultProps.fullscreen,
      autosize: defaultProps.autosize,
      studies_overrides: defaultProps.studiesOverrides,
      custom_css_url: '/app/css/tradingview.css',
      overrides: {
        'paneProperties.background': backgroundColor,
        'paneProperties.backgroundType': 'solid',
      },
    }

    const Widget = widget
    const tv = new Widget(widgetOptions)
    tv.onChartReady(() => {
      // some custom theming
      tv.watermark().visibility().setValue(false, true)
      tv.headerReady().then(() => {
        {
          const button = tv.createButton({
            useTradingViewStyle: false,
            align: 'left',
          })
          setSwapButton(button)
          button.setAttribute('title', 'Flip Pair')
          button.classList.add('apply-common-tooltip')
          button.innerHTML = 'Flip Pair'
        }
        {
          const button = tv.createButton({
            useTradingViewStyle: false,
            align: 'right',
          })
          button.setAttribute('title', 'Open Depth Chart')
          button.classList.add('apply-common-tooltip')
          button.innerHTML = 'Depth Chart'
          button.onclick = () => {
            setChartType(ChartEnums.DEPTH)
          }
        }
        tv.setCSSCustomProperty('--tv-color-toolbar-toggle-button-background-active', '#1e1e1e')
        setTvWidget(tv)
      })
    })
    return () => {
      tv.remove()
      df.cleanup()
    }
  }, [chartContainerRef, cushRpc])

  return <ChartDiv chartContainerRef={chartContainerRef} />
}

const ChartDiv = React.memo(function ChartDiv({
  chartContainerRef,
}: {
  chartContainerRef: React.MutableRefObject<HTMLInputElement>
}) {
  return <div ref={chartContainerRef} className={'TVChartContainer w-full h-full px-1 py-1'} />
})
