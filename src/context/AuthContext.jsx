'use client';

import { createContext,useContext,useState,useEffect } from "react";
import {useRouter} from "next/navigation";
import { authApi } from "@/lib/api/auth";

const AuthContext = createContext(undefined);

export function AuthProvider({children}){
     const [user,setUser] = useState(null);
     const [isLoading,setisLoading] = useState(true);
     const router = useRouter();

     useEffect(()=>{
          const token = localStorage.getItem('token')
          const savedUser = localStorage.getItem('user')

          if(token && savedUser){
               setUser(JSON.parse(savedUser));
          }

          setisLoading(false)
     },[]);

     const login = async (email,password) => {
          const data = await authApi.login(email,password);
          localStorage.setItem('token',data.accessToken);
          localStorage.setItem('user',JSON.stringify(data.user));
          setUser(data.user);
          router.push('/');
          return data;
     }

     const register = async(name,email,password) =>{
          const data = await authApi.register(name,email,password);
          localStorage.setItem('token',data.accessToken);
          localStorage.setItem('user',JSON.stringify(data.user));
          setUser(data.user);
          router.push('/')
          ;
          return data;
     };

     const logout = () => {
          authApi.logout();
          setUser(null);
          router.push('/login');
     };

     return(
          <AuthContext.Provider value={{user,login,register,logout,isLoading}}>
               {children}
          </AuthContext.Provider>
     )

}

export const useAuth = () =>{
     const context = useContext(AuthContext);
     if(!context){
          throw new Error('useAuth must be used within AuthProvider');
     }
     return context;
}