import NextAuth from "next-auth"
import authConfig from "@/auth.config"
 
import { PrismaAdapter } from "@auth/prisma-adapter"
import { db } from "@/lib/db"
 

export const { handlers, signIn, signOut, auth } = NextAuth({
    adapter: PrismaAdapter(db),
    // cada vez q next auth logea un nuevo cliente y ese nuevo cliente sea correcto(osea tenga las credenciales correctas - Email - contraseña) le vamos a crear un token
    // APARTE DE ESE "token" con JWT se va a crear una sesion y esa sesion nosotros la vamos a poder utilizar para proteger ciertas rutas
    session: { strategy: "jwt" },
    ...authConfig,
    // jwt() se ejecuta cada vez que se crea o actualiza un token JWT.
    // Aquí es donde puedes agregar información adicional al token.
  callbacks: {
    jwt({ token, user }) {
      if (user) { // User is available during sign-in
        token.role = user.role;
      }
      return token
    },
    // session() se utiliza para agregar la información del token a la sesión del usuario,
    // lo qque hace que esté disponible en el cliente.
    session({ session, token }) {
      if (session.user){
        session.user.role = token.role;
      }
      return session;
    },
  },
});
