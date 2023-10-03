import ScreenContainer from '../components/containers/ScreenContainer'
import { CreatePoolModal } from '../components/modals/CreatePool'
import MenuModal from '../components/modals/MenuModal'
import TransactionModal from '../components/modals/swap/TransactionModal'
import { CHAIN_INFO, getChainIdFromName } from '../constants/chainInfo'
import AppContext from '../context/Context'
import { OmniCush, useRpcContext } from '../context/naked/RpcContext'
import { LiquidityPage, PoolPage, OrdersPage } from '../pages'
import { AuthPage } from '../pages/AuthPage'
import { NotFound404 } from '../pages/NotFound404'
import SwapPage from '../pages/SwapPage'
import { TelemetrySender } from './TelemetrySender'
import {
  createBrowserRouter,
  matchPath,
  Outlet,
  redirect,
  RouteObject,
  RouterProvider,
  useLocation,
  useParams,
  useRouteLoaderData,
} from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import * as Sentry from '@sentry/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

export const useChainLoader = (): Awaited<ReturnType<typeof chainDataLoader>> => {
  return useRouteLoaderData('chain') as any
}

const defaultDesc =
  'Trade DeFi with Oku, a professional-grade Uniswap v3 front-end platform. Enjoy live trading, track orders, and implement limit and market orders with precision. Ideal for pro traders seeking advanced DEX features.'
const defaultLongDesc =
  'Trade DeFi with Oku, a professional-grade Uniswap v3 front-end platform. Enjoy live trading, track orders, and implement limit and market orders with precision. Ideal for pro traders seeking advanced DEX features.'

const chainDataLoader = async (omniCush: OmniCush, { params }: any) => {
  const chain = params.chain
  const chainID = getChainIdFromName(params.chain)
  const currentChainInfo = CHAIN_INFO[chainID] ? CHAIN_INFO[chainID] : CHAIN_INFO[1]
  const cushRpc = omniCush.network(currentChainInfo.internalName)
  return {
    currentChain: chainID,
    chain,
    cushRpc,
    currentChainInfo,
    chainID,
    omniCush,
  }
}

const isAddress = (x?: string) => {
  if (!x) {
    return false
  }
  return x.startsWith('0x') && x.length === 42
}

export const TitleFunc = (args: { pageTitle?: string }) => {
  let { pageTitle } = args
  pageTitle = pageTitle ? pageTitle.toString() : 'oku.trade'
  return (
    <Helmet>
      <title>{pageTitle}</title>
      <meta property="og:title" content={pageTitle} />
      <meta property="twitter:title" content={pageTitle} />
    </Helmet>
  )
}

export const DescriptionFunc = (args: { pageDescription?: string; longPageDescription?: string }) => {
  let { pageDescription, longPageDescription } = args
  pageDescription = pageDescription ? pageDescription : defaultDesc
  longPageDescription = longPageDescription ? longPageDescription : defaultLongDesc
  return (
    <Helmet>
      <meta name="description" content={pageDescription} />
      <meta property="og:description" content={longPageDescription} />
      <meta property="twitter:description" content={longPageDescription} />
    </Helmet>
  )
}

const createRouter = (omniCush: OmniCush) => {
  const defaultPage = `/ethereum/pool/${CHAIN_INFO[1].defaultPool}`
  const pages: RouteObject[] = [
    {
      path: 'order',
      id: 'order',
      handle: {
        base: 'order',
      },
      element: <OrdersPage />,
    },
    {
      path: 'pool',
      handle: {
        base: 'pool',
      },
      loader: async ({ params, request }) => {
        const { currentChainInfo } = await chainDataLoader(omniCush, { params, request })
        if (!params.poolAddress) {
          return redirect(`/${params.chain}/pool/${currentChainInfo.defaultPool}`)
        }
        if (!isAddress(params.poolAddress)) {
          return redirect(`/${params.chain}/404`)
        }
        return null
      },
      children: [
        {
          id: 'pool',
          path: ':poolAddress',
          element: <PoolPage />,
        },
      ],
    },
    {
      path: 'liquidity',
      handle: {
        base: 'liquidity',
      },
      loader: async ({ params, request }) => {
        const { currentChainInfo } = await chainDataLoader(omniCush, { params, request })
        if (!params.poolAddress) {
          return redirect(`/${params.chain}/liquidity/${currentChainInfo.defaultPool}`)
        }
        if (!isAddress(params.poolAddress)) {
          return redirect(`/${params.chain}/404`)
        }
        return null
      },
      children: [
        {
          id: 'liquidity',
          path: ':poolAddress',
          element: <LiquidityPage />,
        },
      ],
    },
    {
      path: 'swap',
      handle: {
        base: 'swap',
      },
      loader: async ({ params, request }) => {
        const { currentChainInfo } = await chainDataLoader(omniCush, { params, request })
        if (!params.token0 || !params.token1) {
          return redirect(`/${params.chain}/swap/${currentChainInfo.defaultToken0}/${currentChainInfo.defaultToken1}`)
        }
        if (!isAddress(params.token0) || !isAddress(params.token1)) {
          return redirect(`/${params.chain}/404`)
        }
        return null
      },
      children: [
        {
          id: 'swap',
          path: ':token0/:token1',
          element: <SwapPage />,
        },
      ],
    },
  ]

  const SharedHelmet = () => {
    const loc = useLocation()
    return (
      <>
        <Helmet>
          <meta charSet="utf-8" />
          <meta name="keywords" content="Crypto, Uniswap, Token, Pool, Trade, Analytics" />

          <meta property="og:type" content="website" />
          <meta property="og:url" content={`https://www.oku.trade/app${loc.pathname}`} />
          <meta property="og:image" content="https://cdn.gfx.xyz/okusplash.png" />
        </Helmet>
      </>
    )
  }
  function FallbackComponent() {
    return <div>An error has occurred</div>
  }

  const myFallback = <FallbackComponent />

  const sentryCreateBrowserRouter = Sentry.wrapCreateBrowserRouter(createBrowserRouter)

  const queryClient = new QueryClient({})
  const router = sentryCreateBrowserRouter(
    [
      {
        path: 'auth',
        element: <AuthPage />,
      },
      {
        path: '404',
        element: <NotFound404 />,
      },
      {
        errorElement: <Sentry.ErrorBoundary fallback={myFallback} showDialog />,
        id: 'app',
        element: (
          <>
            <SharedHelmet />
            <QueryClientProvider client={queryClient}>
              <Outlet />
            </QueryClientProvider>
          </>
        ),
        loader: async ({ params, request }: any) => {
          if (!params.chain) {
            return redirect(defaultPage)
          }
          const { currentChainInfo } = await chainDataLoader(omniCush, { params, request })
          const url = new URL(request.url)
          if (matchPath('/:chain', url.pathname)) {
            return redirect(`/${params.chain}/pool/${currentChainInfo.defaultPool}`)
          }
          return null
        },
        children: [
          {
            path: '*',
            element: <NotFound404 />,
            loader: async ({ request }: any) => {
              if (matchPath('/', new URL(request.url).pathname)) {
                return redirect(defaultPage)
              }
              return null
            },
          },
          {
            path: ':chain',
            id: 'chain',
            loader: async ({ params }: any) => {
              const loaderData = await chainDataLoader(omniCush, { params })
              return loaderData
            },

            element: (
              <AppContext>
                <ScreenContainer>
                  <>
                    {
                      //<ScrollToHashElement />
                    }
                    <TelemetrySender />
                    <MenuModal />
                    <TransactionModal />
                    <CreatePoolModal />
                    {<Outlet />}
                  </>
                </ScreenContainer>
              </AppContext>
            ),
            children: [
              // 404 handler
              {
                path: '*',
                element: <NotFound404 />,
              },
              {
                id: 'pages',
                children: pages,
              },
            ],
          },
        ],
      },
    ],
    {
      basename: '/app',
    }
  )
  return router
}

const RouteWrapper = () => {
  const { omniCush } = useRpcContext()
  const router = createRouter(omniCush)
  return <RouterProvider router={router} />
}

export default RouteWrapper
