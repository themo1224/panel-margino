import Echo from 'laravel-echo'
import type {
  ChannelAuthorizationCallback,
  ChannelAuthorizerGenerator,
} from 'pusher-js'
import Pusher from 'pusher-js'
import { getStoredToken } from '@/api/client'

declare global {
  interface Window {
    Pusher: typeof Pusher
    Echo?: Echo<'reverb'>
  }
}

window.Pusher = Pusher

function apiOrigin(): string {
  const apiUrl = import.meta.env.VITE_API_URL ?? 'http://localhost:8000/api'
  return apiUrl.replace(/\/api\/?$/, '')
}

let echoInstance: Echo<'reverb'> | null = null

export function getEcho(): Echo<'reverb'> | null {
  const key = import.meta.env.VITE_REVERB_APP_KEY
  if (!key) {
    return null
  }

  if (echoInstance) {
    return echoInstance
  }

  const host = import.meta.env.VITE_REVERB_HOST ?? 'localhost'
  const port = Number(import.meta.env.VITE_REVERB_PORT ?? 8080)
  const scheme = import.meta.env.VITE_REVERB_SCHEME ?? 'http'
  const authEndpoint = `${apiOrigin()}/broadcasting/auth`

  const authorizer: ChannelAuthorizerGenerator = (channel) => ({
    authorize: (socketId: string, callback: ChannelAuthorizationCallback) => {
      const token = getStoredToken()
      fetch(authEndpoint, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          socket_id: socketId,
          channel_name: channel.name,
        }),
      })
        .then(async (response) => {
          if (!response.ok) {
            throw new Error('Broadcast auth failed')
          }
          return response.json()
        })
        .then((data) => callback(null, data))
        .catch((error: Error) => callback(error, null))
    },
  })

  echoInstance = new Echo({
    broadcaster: 'reverb',
    key,
    wsHost: host,
    wsPort: port,
    wssPort: port,
    forceTLS: scheme === 'https',
    enabledTransports: ['ws', 'wss'],
    authEndpoint,
    authorizer,
  })

  window.Echo = echoInstance
  return echoInstance
}

export function disconnectEcho(): void {
  if (echoInstance) {
    echoInstance.disconnect()
    echoInstance = null
    delete window.Echo
  }
}
