import authConfig from '@/config/auth-config'
import prisma from '@/config/prisma'
import { SessionUser } from '@/framework/types/sessionUser'
import userService from '@/lib/admin/services/UserService'
import { PrismaAdapter } from '@auth/prisma-adapter'
import NextAuth from 'next-auth'

const Give_Credit = 5

export const { handlers, signIn, signOut, auth } = NextAuth({
  debug:process.env.NODE_ENV !== "production",
  adapter: PrismaAdapter(prisma),
  session: {
    strategy: 'jwt'
  },
  callbacks: {
    async signIn({ account, profile }) {
      console.log(`##用户:${profile?.email}登录系统`,profile)
      if (account?.provider === 'google' && profile?.email) {
        return true
      }
      return `This authorization method is not supported`
    },
    async session({ session, user }) {
      const dbUser = (await userService.getByEmail(session.user.email))!
      // 第一次登录赠送点数
      if (dbUser && !dbUser.giveCredit) {
        dbUser.credit = Give_Credit
        dbUser.totalCredit = Give_Credit
        dbUser.giveCredit = true
        console.log(`##用户:${dbUser?.email} 首次登录系统，赠送 ${dbUser.giveCredit} Credit `)
        await  userService.updateByEmail(dbUser,dbUser.email)
      }
      session.user = {
        id: dbUser.id,
        name: dbUser.name,
        email: dbUser.email,
        image:dbUser.image,
        emailVerified: new Date(),
        credit: dbUser.credit ?? 0
      } as SessionUser
      console.log("###获取当前登录用户信息User",session.user)
      return session
    }
  },
  ...authConfig
})
// 获取当前已绑定google的登录用户信息
export const getAuthUser = async () => {
  const session = await auth()
  console.log("session",session)
  return session?.user! as SessionUser
}

