import React, { useState, useRef } from 'react';
import { Form, Input, Button } from 'reactstrap';
import useToken from './useToken'
import { adminRoot } from '../../../constants/defaultValues'
import fetchWithTimeoutAndHandling from '../../../components/common/fetch';

const AuthCheck = () => {
    const { token, setToken } = useToken();
    const [username, setUserName] = useState();
    const [password, setPassword] = useState();
    const [loginCount, setLoginCount] = useState(0);
    const usernameRef = useRef();
    const passwordRef = useRef();

    const login = e => {
        e.preventDefault();
        if (username === "Jacky" && password === "Jacky") {
            const token = "13579"
            setToken(token);
            window.location.href = adminRoot;
        } else if (username === "Mary" && password === "Mary") {
            const token = "246810"
            setToken(token);
            window.location.href = adminRoot;
        }
        else {
            if (loginCount === 2) {
                window.location.href = 'unauthorized'
            }
            alert('Wrong username or password, please try again')
            setLoginCount(loginCount + 1)
        }
        // Prepare for future user login
        // Send username and password to backend
        // useEffect(() => {
        //     const login = () =>{
        //         fetch('http://')
        //     }
        //     login()
        // }, [])
    }

    const signIn = async (e) => {
        e.preventDefault();
        try {
            if (username === 'Jacky' && password === 'Roborn@123') {
                setToken('13579');
                window.location.href = adminRoot;
                return;
            }
            if (username && password) {
                const body = {
                    username: username,
                    password: password
                }
                const res = await fetch('http://api.roborn.com:9090/api/users/login', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(body)
                })
                const result = await res.json();
                if (result?.status) {
                    if (username === 'Jacky' || username === 'eric') {
                        const token = '13579';
                        setToken(token);
                        window.location.href = adminRoot;
                    } else if (username === 'Eric') {
                        setToken('12345')
                        window.location.href = adminRoot;
                    } else {
                        const token = "246810"
                        setToken(token);
                        window.location.href = adminRoot;
                    }
                } else {
                    if (loginCount === 2) {
                        window.location.href = 'unauthorized'
                    }
                    alert('Wrong username or password, please try again')
                    setLoginCount(loginCount + 1)
                }
            }
        } catch (e) {
            console.log(e)
        }
    }

    const signUp = async (e) => {
        e.preventDefault();
        try {

            if (username && password) {
                const body = {
                    username: username,
                    password: password,
                }
                const res = await fetch('http://api.roborn.com:9090/api/users/signUp', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(body)
                })
                const result = await res.json();
                if (result.status === 0) {
                    alert('Sign In success')
                }
            }
        } catch (e) {
            console.log(e)
        }
    }

    return (
        <>
            <Form style={{ width: "50%", marginTop: "10%", marginLeft: "50%", transform: 'translate(-50%, 0)' }}>
                <div style={{ display: "flex", flexDirection: "column", justifyContent: "center" }}>
                    <h1 style={{ textAlign: "center", marginBottom: "20px" }}>User Login</h1>
                    <h2>Username / Email</h2>
                    <Input ref={usernameRef} type="input" name="user" onMouseDown={e => e.stopPropagation()} onTouchStart={e => e.stopPropagation()} onChange={e => setUserName(e.target.value)} />
                    <h2>Password</h2>
                    <Input ref={passwordRef} type="password" name="password" onMouseDown={e => e.stopPropagation()} onTouchStart={e => e.stopPropagation()} onChange={e => setPassword(e.target.value)} />
                    <div style={{ display: 'flex', justifyContent: 'space-around' }}>
                        <Button type="submit" name="Log In" onClick={signIn}>Log In</Button>
                        <Button type="submit" name="Sign Up" onClick={signUp}>Sign Up</Button>
                    </div>
                </div>
            </Form>
        </>
    )
}

export default AuthCheck;