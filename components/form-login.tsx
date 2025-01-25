'use client'
import React, { useState, useTransition } from 'react'
import { z } from "zod"
import { loginSchema } from '@/lib/zod'
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"

import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { loginAction } from '@/actions/auth-action'
import { useRouter } from 'next/navigation'


const FormLogin = ({
    isVerified,
}: {
    isVerified: boolean;
}) => {

    const [error, setError] = useState<string|null>(null);
    // Es ideal para promesas el useTransition
    const [isPending, startTransition] = useTransition()
    const router = useRouter()
    
    // 1. Define your form.
    const form = useForm<z.infer<typeof loginSchema>>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
          email: "",
          password: "",
        },
      })
    // 2. Define a submit handler.
    async function onSubmit(values: z.infer<typeof loginSchema>) {
        setError(null); // reseteamos el error al presionar el onSubmit
        startTransition(async() =>{
            const response = await loginAction(values);
            if(response.error){
                setError(response.error);
            } else {
                router.push("/dashboard")
            }
        })
      }

  return (
    <div className='max-w-52'>
        <h1>Login</h1>
        {
            isVerified && (
                <p className='text-center text-green-500 mb-5 text-sm'>Email verified, you can now login</p>
            )
        }
        <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input type='email' placeholder="Email" {...field} />
              </FormControl>
              <FormDescription>
                This is your public display name.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

    <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input  type='password' placeholder="Password" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {
            error && <FormMessage>{error}</FormMessage>
        }

        {/* MIENTRAS SEA PENDIENTE LA PROMESA EL BOTON ESTARA DESHABILITADO CON "useTransition" */}
        <Button type="submit" disabled={isPending}>Submit</Button>
      </form>
    </Form>
    </div>
  )
}

export default FormLogin