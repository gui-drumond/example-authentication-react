import { createContext, ReactNode, useEffect, useState } from 'react';
import { parseCookies, setCookie } from 'nookies';
import { api } from '../pages/services/api';
import Router from 'next/router';

type User = {
    email: string;
    permissions: string[];
    roles: string[];
};

type signInCredentias = {
    email: string;
    password: string;
}

type AuthContextData = {
    user?: User;
    signIn(credentials : signInCredentias): Promise<void>;
    isAuthenticated: boolean;
}

type AuthContextProps = {
    children: ReactNode;
}

export const AuthContext = createContext({} as AuthContextData)

export function AuthProvider({ children }: AuthContextProps) {
    const [user, setUser ] = useState<User>();
    const isAuthenticated = !!user;

    useEffect(() => {
        const { 'nextauth.token' : token } = parseCookies()
        console.log( 'teste', token);
        if(token){
             api.get('/me').then(response => { 
                console.log( 'teste', response);
            })
        }
    },[])


    async function signIn({email, password}: signInCredentias){
        try{ 
            const response = await api.post('sessions', { 
                email,
                password
            })
           
            const { token, refreshToken, permissions, roles } = response.data;

            //funcao para setar um cookie que era configurado 
            setCookie(undefined,'nextauth.token', token, {
                maxAge: 60 * 60 * 24 * 30, //30 days
                path:'/' //quais caminhos da aplicacao teram acesso a este cookie, '/' significa que o app todo tera acesso
            });
        
            setCookie(undefined,'nexauth.refreshToken', refreshToken, {
                maxAge: 60 * 60 * 24 * 30, //30 days
                path:'/' //quais caminhos da aplicacao teram acesso a este cookie, '/' significa que o app todo tera acesso
            });

            setUser({
                email,
                permissions, 
                roles,
            });
            
            Router.push('/dashboard');
        }catch(err){
            console.log(err);
        }
    }
    return( 
      <AuthContext.Provider value={{signIn,isAuthenticated, user}}>
        {children}
      </AuthContext.Provider>);
}