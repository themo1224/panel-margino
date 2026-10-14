import HomePage from '@/views/home'
import { useAuth } from '@/context/auth-context'
import Spinner from '@/views/spinner/Spinner'

/** Authenticated seller home. */
export default function RoleHome() {
  const { user, isLoading } = useAuth()

  if (isLoading || !user) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <Spinner />
      </div>
    )
  }

  return <HomePage />
}
