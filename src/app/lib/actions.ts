"use server"

import { OptionalUser } from "./types"
import { nanoid } from "nanoid"
import bcrypt from 'bcrypt'
import { addUser, getUserById, getUserByLogin, updatePassword } from "./api"
import { redirect } from "next/navigation"
import { createAuthSession, destroySession, getUser } from "./auth"

export const handleSignup = async (prev: unknown, data: FormData) => {

    if (!data.get('name') || !data.get('surname')) {
        return {
            message: "Please fill all the fields"
        }
    }

    const found = getUserByLogin(data.get('login') as string)
    if (found) {
        return {
            message: "Login is busy!"
        }
    }

    const user: OptionalUser = {
        id: nanoid(),
        name: data.get('name') as string,
        surname: data.get('surname') as string,
        login: data.get('login') as string,
    }

    user.password = await bcrypt.hash(data.get('password') as string, 10)
    console.log(addUser(user))
    redirect("/login")

}

export const handleLogin = async (prev: unknown, data: FormData) => {
    if (!data.get('login') || !data.get('password')) {
        return {
            message: "please fill all the fields"
        }
    }

    let login = data.get('login') as string
    let password = data.get('password') as string

    let user = getUserByLogin(login)
    if (!user) {
        return {
            message: "the login is incorrect!"
        }
    }
    let match = await bcrypt.compare(password, user.password)
    if (!match) {
        return {
            message: "password is wrong!!"
        }
    }

    await createAuthSession(user.id)
    redirect("/profile")
}

export const handleLogout = () => {
    destroySession()
    redirect("/login")
}
export const handleChange = async (prev: unknown, data: FormData) => {
    const user = await getUser()
    const userId = user.user?.id as string
    const password = data.get('currentPassword') as string
    const passwordFromDb = getUserById(user.user?.id as string).password as string
    if (password || data.get('newlogin')) {
        const match = await bcrypt.compare(password, passwordFromDb)
        if (!match) {
            return {
                message: "You entered the wrong password. Please try again"
            }
        }
        if (!getUserByLogin(data.get('newlogin') as string)) {
            return {
                message: "This login is already in use. Please try another"
            }
        }
    } else return {
        message: "You must fill in both inputs"
    }
    updatePassword(userId, data.get('newlogin') as string)
    destroySession()
    redirect("/login")
}