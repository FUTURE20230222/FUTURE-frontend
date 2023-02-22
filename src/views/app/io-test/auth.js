import React, { useState, useRef } from 'react';
import { Form, Input } from 'reactstrap';

const AuthCheck = ({ setToken, setLoginState }) => {
    const [username, setUserName] = useState();
    const [password, setPassword] = useState();
    const [loginCount, setLoginCount] = useState(0);
    const usernameRef = useRef();
    const passwordRef = useRef();

    const login = e => {
        e.preventDefault();
        if (username === "admin" && password === "admin") {
            const token = "13579"
            setToken(token);
        }
        else {
            if (loginCount === 2) {
                setLoginState(true)
            }
            alert('Wrong username or password, please try again')
            setLoginCount(loginCount + 1)
        }
    }

    return (
        <>
            <Form style={{ width: "50%", marginTop: "10%", marginLeft: "50%", transform: 'translate(-50%, 0)' }}>
                <div style={{ display: "flex", flexDirection: "column", justifyContent: "center"}}>
                    <h1 style={{ textAlign: "center", marginBottom:"20px"  }}>User Login</h1>
                    <h2>Username</h2>
                    <Input ref={usernameRef} type="input" name="user" onMouseDown={e => e.stopPropagation()} onTouchStart={e => e.stopPropagation()} onChange={e => setUserName(e.target.value)} />
                    <h2>Password</h2>
                    <Input ref={passwordRef} type="password" name="password" onMouseDown={e => e.stopPropagation()} onTouchStart={e => e.stopPropagation()} onChange={e => setPassword(e.target.value)} />
                    <Input type="submit" name="submit" onClick={login}></Input>
                </div>
            </Form>
        </>
    )
}

export default AuthCheck;