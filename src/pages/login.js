import React from 'react'

import TextField from '@material-ui/core/TextField'

import Button from '../components/button'
import { login } from '../global-states/auth'
import { toast } from 'react-toastify'

const style = {
  root: 'w-full h-full p-4 flex justify-center items-center',
  card: 'bg-white rounded-lg w-full max-w-md shadow-xl p-4',
  title: 'text-2xl font-bold text-center',
  input: { margin: '1rem 0' }
}

function LoginPage () {
  const [isDoingLogin, setIsDoingLogin] = React.useState(false)
  const emailRef = React.useRef()
  const passwordRef = React.useRef()

  async function submit (event) {
    if (event) event.preventDefault()
    if (isDoingLogin) return
    const email = emailRef.current.value;
    const password = passwordRef.current.value;
    if (!password) return toast.error('Você deve fornecer uma senha')

    try {
      setIsDoingLogin(true)
      await login(email, password)
    } catch (e) {
      console.error(e)
    } finally {
      setIsDoingLogin(false)
    }
  }

  return (
    <main className={style.root}>
      <div className={style.card}>
        <h1 className={style.title}>Entrar</h1>
        <form style={style.form} onSubmit={submit}>
          <TextField
            label='E-mail'
            fullWidth
            type='email'
            inputRef={emailRef}
            style={style.input}
          />
          <TextField
            label='Senha'
            fullWidth
            type='password'
            inputRef={passwordRef}
            style={style.input}
          />
          <Button
            variant='contained'
            color='primary'
            fullWidth
            type='submit'
            isLoading={isDoingLogin}
            onClick={submit}
          >
            Entrar
          </Button>
        </form>
      </div>
    </main>
  )
}

export default LoginPage
