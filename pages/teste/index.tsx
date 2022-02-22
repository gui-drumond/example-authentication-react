import { FormEvent, useContext, useState } from 'react';
import { AuthContext } from '../../contexts/AuthContext'
import styles from '../../styles/Home.module.css';


export function Login(){

    const { signIn, isAuthenticated } = useContext(AuthContext);

    const [email, setEmail ] =  useState('dev.drumond@gmail.com');
    const [password, setPassword ] =  useState('123456');

    async function handleSubmit(event: FormEvent){
        event?.preventDefault()
        const data = {
            email,
            password
        }
        await signIn(data)
    } 

    return ( 
        <form onSubmit={handleSubmit} className={styles.container}>
            <input type="email" value={email} onChange={(e)=> { setEmail(e.target.value);}}/>
            <input type="password" value={password} onChange={(e)=> { setPassword(e.target.value);}}/>
            <button type="submit">Entrar</button>
        </form>
    )
}