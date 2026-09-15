import { createAuthClient } from "better-auth/react"

export const authClient = createAuthClient({
    baseURL: "http://localhost:5000", // অতি জরুরি: এটি আপনার ব্যাকএন্ড সার্ভারের পোর্ট হতে হবে
    fetchOptions: {
        credentials: "include",
    },
})

export const { signIn, signUp, useSession } = authClient;