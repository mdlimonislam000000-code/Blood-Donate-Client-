
import { jwtClient } from "better-auth/client/plugins";
import { createAuthClient } from "better-auth/react"

export const authClient = createAuthClient({
    baseURL: `${process.env.NEXT_PUBLIC_SERVER_URL}`, 
    fetchOptions: {
        credentials: "include",
    },
    plugins: [
        jwtClient()
    ]
})

export const { signIn, signUp, useSession } = authClient;