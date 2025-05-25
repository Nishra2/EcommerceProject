import NextAuth from "next-auth"; // import next-auth library to handle the user authentication
import CredentialsProvider from "next-auth/providers/credentials"; // import login provider from next-auth
import { PrismaClient } from "@prisma/client"; // import prisma to connect database
import bcrypt from "bcryptjs"; //import bcrypt to hash passwords

const prisma = new PrismaClient(); // create a new instance connection to the database

// nextAuth provider options for setting up authentication
export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "credentials", // name of the login method
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      // this function is called when a user tries to sign in
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        const user = await prisma.user.findUnique({
          where: {
            email: credentials.email,
          },
        });

        if (!user) {
          return null;
        }

        const isPasswordValid = await bcrypt.compare(
          credentials.password,
          user.password
        );

        if (!isPasswordValid) {
          return null;
        }
// if everything is checked and valid, return the user object
        return {
          id: user.id.toString(),
          email: user.email,
          name: user.name || "",
          //@ts-ignore
          role: user.role,
        };
      },
    }),
  ],
  session: {
    strategy: "jwt" as const,
  },
  // secret variable is used here to encrypt the JWT token
  secret: process.env.NEXTAUTH_SECRET,
  // these callbacks will handle different events in the authentication process
  callbacks: {
    // this function is running when the token info is created to the user
    async jwt({ token, user }: { token: any; user: any }) {
      return { ...token, ...user };
    },
    // create a session for the user 
    async session({ session, token }: { session: any; token: any }) {
      session.user = token as any; // put the token info into the session
      return session;
    },
  },
};

// create the hanlder function that takes all these authOptions above

const handler = NextAuth(authOptions);
// export the handler to be used in the api routes
export { handler as GET, handler as POST };
