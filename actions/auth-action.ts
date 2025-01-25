'use server'

import { signIn } from "@/auth"
import { db } from "@/lib/db"
import { loginSchema, registerSchema } from "@/lib/zod"
import { AuthError } from "next-auth"
import { z } from "zod"
import bcrypt from "bcryptjs"

export const loginAction = async (values: z.infer<typeof loginSchema>) => {
    try { // LOGICA PARA PODER VALIDAR AL USUARIO
        // Do something with the form values.
        // ✅ This will be type-safe and validated.
        //console.log(values)
        await signIn("credentials", {
            email: values.email,
            password: values.password,
            redirect: false,
        })
        return { success: true };
    } catch (error) {
        if( error instanceof AuthError){
            return { error: error.cause?.err?.message};
        }
        return { error: "error 500"};
    }
}


export const registerAction = async(values: z.infer<typeof registerSchema>) => {
    try {
        const {data , success} = registerSchema.safeParse(values);
        if(!success){
            return {
                error: "Invalid Data",
            }
        }

        // Verificar si el usuario ya existe
        const user = await db.user.findUnique({
            where: {
                email: data.email,
            },
        });

        if(user){
            return {
                error: "Email already exists",
            }
        }

        // hash de la Contraseña
        const passwordHash = await bcrypt.hash(data.password, 10);

        //crear al usuario
        await db.user.create({
            data: {
                email: data.email,
                name: data.name,
                password: passwordHash,
            },
        });

        await signIn("credentials", {
            email: values.email,
            password: values.password,
            redirect: false,
        })
        return { success: true };

    } catch (error) {
        if( error instanceof AuthError){
            return { error: error.cause?.err?.message};
        }
        return { error: "error 500"};
    }
}
