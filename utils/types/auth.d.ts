declare module '#auth-utils' {
  interface User {
    id: number
    pseudo: string
    isVerified: boolean
    isAdmin: boolean
    isBanned: boolean
  }

  interface UserSession {
    user: User
  }
}
