import Main from './app/main'
import './app/index.css'
import './app/style.css'
import 'isomorphic-ws'
import React from 'react'
import ReactDOM from 'react-dom/client'
import './app/Web3Provider/client_config'

import * as Sentry from '@sentry/react'
import { createRoutesFromChildren, matchRoutes, useLocation, useNavigationType } from 'react-router-dom'
import { HelmetProvider } from 'react-helmet-async'
import NakedContext from './app/context/naked/NakedContext'

Sentry.init({
  dsn: 'https://89d5a7c7a474bd0dc0052997525dec99@o4505921282572288.ingest.sentry.io/4505921285324800',
  integrations: [
    new Sentry.BrowserTracing({
      // Set 'tracePropagationTargets' to control for which URLs distributed tracing should be enabled
      tracePropagationTargets: ['localhost', '/^https://*.gfx.town/*', '/^https://*.apiary.software/*'],
      routingInstrumentation: Sentry.reactRouterV6Instrumentation(
        React.useEffect,
        useLocation,
        useNavigationType,
        createRoutesFromChildren,
        matchRoutes
      ),
    }),
    new Sentry.Replay(),
  ],
  // Performance Monitoring
  tracesSampleRate: 0.2, // Capture 100% of the transactions, reduce in production!
  // Session Replay
  replaysSessionSampleRate: 0.1, // This sets the sample rate at 10%. You may want to change it to 100% while in development and then sample at a lower rate in production.
  replaysOnErrorSampleRate: 1.0, // If you're not already sampling the entire session, change the sample rate to 100% when sampling sessions where errors occur.
})

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <HelmetProvider>
      <NakedContext>
        <Main />
      </NakedContext>
    </HelmetProvider>
  </React.StrictMode>
)
