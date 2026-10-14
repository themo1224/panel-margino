import { RouterProvider } from 'react-router'
import router from './routes/Router'
import './css/globals.css'
import { AuthProvider } from '@/context/auth-context'

function App() {
  return (
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  )
}

export default App
