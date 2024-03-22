import NextAuth from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import CredentialsProvider from "next-auth/providers/credentials";
import FacebookProvider from "next-auth/providers/facebook";
import axios from "axios";
export const authOptions = {
  // Configure one or more authentication providers
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    FacebookProvider({
      clientId: process.env.FACEBOOK_CLIENT_ID,
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET
    }),
    CredentialsProvider({
      name: "User",
      credentials: {
        username: { label: "Email", type: "email", className: "input" },
        password: { label: "Password", type: "password", className: "input" }
      },
      async authorize(credentials, req) {
        // Add logic here to look up the user from the credentials supplied
        console.log(credentials)
        if (credentials.password && credentials.username) {
          const {data} = await axios.post(`${process.env.API_URL}/loginWithCredentials`, {
            password:credentials.password,
            email: credentials.username,
          });
          if(data.email) return {email:credentials.username,password:credentials.password};
          return null
        } else {
          return null
        }
      }
    })
  ],
  session: {
    // Configuración de la sesión
    jwt: true, // Habilita la autenticación JWT
    maxAge: 60 * 60 * 24 * 365, // Tiempo de expiración en segundos (1 año)
  }
}

export default NextAuth(authOptions)
