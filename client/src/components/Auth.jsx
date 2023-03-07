import React, { useState } from 'react'
import {useCookies} from 'react-cookie'

const Auth = () => {
  const [cookies, setCookie, removeCookie] = useCookies(null)
  const [isLogin, setIsLogin] = useState(false);
  const [email, setEmail] = useState(null)
  const [password, setPassword] = useState(null)
  const [confirmPassword, setConfirmPassword] = useState(null)
  const [error, setError] = useState(null);

  console.log(cookies);

  const viewLogin = (status) => {
    setError(null);
    setIsLogin(status);
  }

  const handleSubmit = async (e, endpoint) => {
    e.preventDefault()
    if (!isLogin && password !== confirmPassword) {
      setError('make sure password match!')
      return
    }

    const response = await fetch(`${import.meta.env.VITE_SERVER_URL}/${endpoint}`, {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({email, password})
    })
    const data = await response.json()
    console.log(data)

    if (data.detail) {
      setError(data.detail)
    } else {
      setCookie('Email', data.email)
      setCookie('AuthToken', data.token)

      window.location.reload()
    }
  }

  // console.log(email, password, confirmPassword);

  return (
    <div className='auth-container'>
      <div className='auth-container-box'>
        <form>
          <h2>{isLogin ? 'login' : 'sign up'}</h2>
          <input type="email" placeholder='email' onChange={(e) => setEmail(e.target.value)}/>
          <input type="password" placeholder='password' onChange={(e) => setPassword(e.target.value)} />

          {!isLogin && <input type="password" placeholder='confirm password' onChange={(e) => setConfirmPassword(e.target.value)} />}
          <input type="submit" className='create' onClick={(e) => handleSubmit(e, isLogin ? 'login' : 'signup')} />
          {error && <p>{error}</p>}
        </form>
        <div className='auth-options'>
          <button
            onClick={() => viewLogin(false)}
            style={{backgroundColor: !isLogin ? 'rgb(255, 255, 255)' : 'rgb(188, 188, 188)'}}
          >
            sign up
          </button>
          <button
            onClick={() => viewLogin(true)}
            style={{backgroundColor: isLogin ? 'rgb(255, 255, 255)' : 'rgb(188, 188, 188)'}}
          >
            login
          </button>
        </div>
      </div>
    </div>
  )
}

export default Auth