import NextAuth from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import FacebookProvider from "next-auth/providers/facebook";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions = {
  // Configure one or more authentication providers
  providers: [
    CredentialsProvider({
      credentials: {
        email: {
          label: "Correo electrónico",
          type: "text",
          placeholder: "Correo electrónico",
        },
        password: { label: "Contraseña", type: "password" },
      },
      async authorize(credentials, req) {
        // Aquí puedes manejar la lógica de autenticación por correo electrónico
        // Verifica las credenciales y devuelve el usuario si la autenticación es exitosa
        const user =  {email:credentials.email}
        if (user) {
          console.log(user);
          return user;
        } else {
          return null;
        }
      },
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    FacebookProvider({
      clientId: process.env.FACEBOOK_CLIENT_ID,
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET
    }),
  ],
  session: {
    // Configuración de la sesión
    jwt: true, // Habilita la autenticación JWT
    maxAge: 60 * 60 * 24 * 365, // Tiempo de expiración en segundos (1 año)
  }
}

export default NextAuth(authOptions)
