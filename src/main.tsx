import { Suspense } from 'react'
import { createRoot } from 'react-dom/client'
import '../src/css/globals.css'
import App from './App.tsx'
import Spinner from './views/spinner/Spinner.tsx'

import { ThemeProvider } from './context/shadcntheme/ThemeContext.tsx'

async function deferRender() {
  if (import.meta.env.VITE_USE_MSW !== 'true') {
    return
  }

  const { worker } = await import('./api/mocks/browser.ts')
  return worker.start({
    onUnhandledRequest: 'bypass',
  })
}

deferRender().then(() => {
  createRoot(document.getElementById('root')!).render(
    <ThemeProvider defaultTheme="light" storageKey="pricing-ui-theme">
      <Suspense fallback={<Spinner />}>
        <App />
      </Suspense>
    </ThemeProvider>
  )
})
