'use client'

import React from 'react'
import { Button } from './ui/button'
import { signOut } from 'next-auth/react';

const LogoutButton = () => {
  
    const handlerClick = async() => {
        await signOut({
            callbackUrl: '/login'
        });
    }

    return (
    <Button onClick={handlerClick}>LogOut</Button>
  )
}

export default LogoutButton