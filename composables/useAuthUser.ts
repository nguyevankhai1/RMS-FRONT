import type { UserWithoutPassword } from '~~/types/User'
 const useAuthUser = () => {
  return useState<UserWithoutPassword | null>('user', () => null)
}

export default useAuthUser