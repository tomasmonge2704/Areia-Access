module.exports = {
  reactStrictMode: true,
  env: {
    FB_API_KEY: process.env.FB_API_KEY,
    FB_AUTH_DOMAIN: process.env.FB_AUTH_DOMAIN,
    FB_PROJECT_ID: process.env.FB_PROJECT_ID,
    FB_STORAGE_BUCKET: process.env.FB_STORAGE_BUCKET,
    FB_MESSAGIN_SENDER_ID: process.env.FB_MESSAGIN_SENDER_ID,
    FB_APP_ID: process.env.FB_APP_ID,
    API_URL: process.env.API_URL,
    GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
    FACEBOOK_CLIENT_ID: process.env.FACEBOOK_CLIENT_ID,
    FACEBOOK_CLIENT_SECRET: process.env.FACEBOOK_CLIENT_SECRET,
    NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
    NEXTAUTH_URL: process.env.NEXTAUTH_URL,
  },
  // Configuración adicional para NextAuth.js
  // Agrega esto dentro del mismo objeto de configuración
  // Para configurar las opciones de las cookies
  // Puedes ajustar las opciones según tus necesidades
  serverRuntimeConfig: {
    // Configuración de las cookies
    cookieSecret: process.env.NEXTAUTH_SECRET,
    cookieOptions: {
      domain:process.env.NEXTAUTH_URL,
      path: '/',
      secure: true,
      sameSite: 'Lax',
      maxAge: 604800000,
    },
  },
};
