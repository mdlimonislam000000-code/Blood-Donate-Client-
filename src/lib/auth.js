import { betterAuth } from "better-auth";
import { MongoClient } from "mongodb";
import { mongodbAdapter } from "better-auth/adapters/mongodb";

const client = new MongoClient(process.env.MONGO_URI);
const db = client.db('MMJ-Blood-bank');

export const auth = betterAuth({
  // ১. ব্যাকএন্ড ও ফ্রন্টএন্ডের বেজ ইউআরএল ও ট্রাস্টেড অরিজিন যোগ করুন
  baseURL: "http://localhost:5000",
  trustedOrigins: ["http://localhost:3000"],

  database: mongodbAdapter(db, {
    disableTransaction: true, // ট্রানজ্যাকশন এরর এড়াতে এটি ব্যবহার করা হলো
  }),
  emailAndPassword: { 
    enabled: true, 
  }, 
  socialProviders:{
    google: {
      clientId: process.env.CLIENT_ID,
      clientSecret: process.env.CLIENT_SECRET,
    },
  },
  // রোল (Role) ডাটাবেজে সেভ করার জন্য এটি যোগ করা হলো
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
});