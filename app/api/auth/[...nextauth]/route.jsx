import NextAuth from "next-auth/next";
import CredentialsProvider from "next-auth/providers/credentials";
import prisma from "./prisma";

const login = async (username, password) => {
  const user = await prisma.user.findFirst({
    where: {
      email: username,
    },
  });

  if (user && (await compare(password, user.password))) {
    user.password = "";
    return user;
  } else {
    throw new Error("User Not Found!");
  }
};

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",

      credentials: {
        username: {
          label: "Username",
          type: "text",
          placeholder: "jsmith",
        },
        password: { label: "Password", type: "password" },
      },

      async authorize(credentials, req) {
        if (!credentials?.username || !credentials?.password) return null;
        try {
          const user = await login(credentials.username, credentials.password);
          return user;
        } catch (e) {
          console.error(e);
          return null;
        }
      },
    }),
  ],
  pages: {
    signIn: "/signIn",
  },
});

export { handler as GET, handler as POST };
