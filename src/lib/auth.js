import { betterAuth } from "better-auth";
import { MongoClient } from "mongodb";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { jwt } from "better-auth/plugins";

const client = new MongoClient(process.env.MONGO_URI);
const db = client.db('MMJ-Blood-bank');

export const auth = betterAuth({
  // ১. এখানে সরাসরি আপনার ব্যাকএন্ডের লিংক বা সঠিক এনভায়রনমেন্ট ভেরিয়েবল দিন
  baseURL: process.env.BETTER_AUTH_URL || "https://mmj-server-kohl.vercel.app",
  
  // ২. এখানে আপনার ফ্রন্টএন্ডের Vercel লিংক দিন (যাতে ক্লায়েন্ট রিকোয়েস্ট করতে পারে)
  trustedOrigins: ["https://mmj-blood-bank.vercel.app"],

  // ৩. সিক্রেট কি আবশ্যিক
  secret: process.env.BETTER_AUTH_SECRET,

  database: mongodbAdapter(db, {
    disableTransaction: true, 
  }),
  emailAndPassword: { 
    enabled: true, 
  }, 
  socialProviders:{
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    },
  },
  user: {
    additionalFields: {
      role: {
        type: "string",
        required: false,
        defaultValue: "user",
        input: true,
      },
    },
  },
  session:{
    cookieCache:{
      enabled: true,
      strategy: "jwt",
      maxAge: 7 * 24 * 60 * 60
    }
  },
  plugins:[
    jwt()
  ]
});