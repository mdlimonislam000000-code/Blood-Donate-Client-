
import { jwtClient } from "better-auth/client/plugins";
import { createAuthClient } from "better-auth/react"

export const authClient = createAuthClient({
    baseURL: "http://localhost:5000", 
    fetchOptions: {
        credentials: "include",
    },
    plugins: [
        jwtClient()
    ]
})

export const { signIn, signUp, useSession } = authClient;