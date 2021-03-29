import React from 'react'
import API from '../api'

const authContext = React.createContext()

const initialState = {
  user: null,
  token: null
}

let auth, setAuth

export default function AuthProvider (props) {
  const state = React.useState(() => ({
    ...initialState,
    user: JSON.parse(localStorage.getItem('user')),
    token: JSON.parse(localStorage.getItem('token'))
  }))

  auth = state[0]
  setAuth = state[1]

  localStorage.setItem('user', JSON.stringify(auth.user))
  localStorage.setItem('token', JSON.stringify(auth.token))

  return (
    <authContext.Provider {...props} value={auth} />
  )
}

export function getToken () { return auth.token }

export function useAuth () {
  return React.useContext(authContext)
}

export function setToken (token) {
  localStorage.setItem('token', token)
  setAuth({ ...auth, token })
}

export async function login (email, password) {
   const { data: user, headers: { authorization: token } } = await API.login(email, password)
   setAuth({ token, user })
}

export function logout () {
  setAuth({ ...initialState })
}
