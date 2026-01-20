import { signIn, signOut, signUp,signInSocial, getcurrentUser } from '@/lib/actions/auth-actions'
import { create } from 'zustand'
import type { User } from '@/lib/types'



type AuthStore = {
    authUser : User | null,
    isCheckingAuth : boolean,
    checkauth : () => void,
    signUp : (data : {email : string,password : string ,name : string}) => Promise < User | undefined>,
    signIn : (data : {email : string,password : string}) => Promise < User | undefined>,
    signOut : () => void,
    signInSocial : (provider : "google" | 'github') => Promise < User | void | undefined>,
}


export const useAuthStore = create<AuthStore>((set,get) => ({
    isCheckingAuth : false,
    authUser : null,

    checkauth : async () => {
        set({isCheckingAuth : true})
        try {
            const user = await getcurrentUser()
            set({authUser : user})
        } catch (error) {
            console.log("Error in signup store...")
        } finally {
            set({isCheckingAuth : false})
        }
    },

    signUp : async (data) => {
        set({isCheckingAuth : true})
        try {
            const {email,password,name} = data
            const result = await signUp(email,password,name);
            set({authUser : result.user})
            return result.user
        } catch (error) {
            console.log("Error in signup store...")
            set({authUser : null})
        } finally{
            set({isCheckingAuth : false});
        }
    },

    signIn : async (data) => {
        set({isCheckingAuth : true})
        try {
            const {email,password} = data
            const result = await signIn(email,password)
            set({authUser : result.user})
            return result.user
        } catch (error) {
            console.log("Error in signup store...")
            set({authUser : null})
        } finally{
            set({isCheckingAuth : false});
        }
    },

    signOut : async () => {
        set({isCheckingAuth : true})
        try {
            await signOut();
            set({authUser : null})
        } catch (error) {
            console.log("Error in signup store...")
        } finally{
            set({isCheckingAuth : false})
        }
    },

    signInSocial : async (provider) => {
        set({isCheckingAuth : true})
        try {
            await signInSocial(provider);
            const user = await getcurrentUser();
            return user;
        } catch (error) {
            console.log("Error in signup store...")
            set({authUser : null})
        } finally {
            set({isCheckingAuth : false})
        }
    }

}))