// INFO DE edge cimpatibility guide -> https://authjs.dev/guides/edge-compatibility
// LUEGO DE ESTO IMPORTARLO EN auth.ts
import type { NextAuthConfig } from "next-auth"
import Credentials from "next-auth/providers/credentials"
import { loginSchema } from "./lib/zod";
import { db } from "./lib/db";
import bcrypt from "bcryptjs";
import { nanoid } from "nanoid";
import { sendEmailVerification } from "./lib/mail";

// Notice this is only an object, not a full Auth.js instance
export default {
  providers: [
    Credentials({
      
      authorize: async (credentials) => {
          // TENEMOS QUE VALIDAR QUE LOS DATOS QUE NOS ENVIARON DE "email" y "password" EXISTAN
          const {data, success} = loginSchema.safeParse(credentials);

          // Si esta el success quiere decir que todos los datos estan correctos
          // Si no esta el success, no estan los datos
          if(!success) {
            throw new Error('Invalid credentials');
          }
          // Verificar si existe el usuario en la base de datos
          const user = await db.user.findUnique({
            where: {
              email: data.email,
              //password: data.password,
            }
          });
          // Si no existe el usuario, o contraseña lanzar una excepcion
          if (!user || !user.password) {
            throw new Error('User not found');
          }
          // Verificar si la contraseña es correcta
          const isValid = await bcrypt.compare(data.password, user.password);

          if(!isValid){
            throw new Error("Incorrect password");
          }

          // VERIFICACION DE EMAIL
          // Si no existe el usuario con emailVerificado va a revisar en la BD
          if(!user.emailVerified){
            const verifyTokenExits = await db.verificationToken.findFirst({
              where:{
                identifier: user.email
              }
            })

            // Si existe un token lo eliminamos de acuerdo al email del usuario
            if(verifyTokenExits?.identifier){
              await db.verificationToken.delete({
                where:{
                  identifier: user.email
                },
              });
            }

            // Volvemos a generar el nuevo token con un id nuevo de verificacion y enviarselo a la BD
            const token = nanoid();

            await db.verificationToken.create({
              data:{
                identifier: user.email,
                token,
                expires: new Date(Date.now() + 1000 * 60 * 60 * 24)
              },
            });

            // Enviar el email de verificacion
            // Llevamos la lógica al lib/mail.ts
            await sendEmailVerification(user.email, token);

            throw new Error("Please check Email send verification")

          }

          return user;
      },
    }),
  ],
} satisfies NextAuthConfig