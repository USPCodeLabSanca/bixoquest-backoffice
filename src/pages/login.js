import React from 'react';

import {toast} from 'react-toastify';
import {Link} from 'react-router-dom';
import TextField from '@material-ui/core/TextField';

import Button from '../components/button';
import {login} from '../global-states/auth';

const style = {
  input: {margin: '1rem 0'},
};

/**
 * LoginPage
 *
 * @return {object}
 */
function LoginPage() {
  const [isDoingLogin, setIsDoingLogin] = React.useState(false);
  const emailRef = React.useRef();
  const passwordRef = React.useRef();

  /**
   * submit
   *
   * @param {object} event
   *
   * @return {object}
   */
  async function submit(event) {
    if (event) event.preventDefault();
    if (isDoingLogin) return;
    const email = emailRef.current.value;
    const password = passwordRef.current.value;
    if (!password) return toast.error('Você deve fornecer uma senha');

    try {
      setIsDoingLogin(true);
      await login(email, password);
    } catch (e) {
      console.error(e);
    } finally {
      setIsDoingLogin(false);
    }
  }

  return (
    <main className='w-full h-full p-4 flex justify-center items-center'>
      <div className='bg-white rounded-lg w-full max-w-md shadow-xl p-4'>
        <h1 className='text-2xl font-bold text-center'>Entrar</h1>
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
            style={style.input}
            type='submit'
            isLoading={isDoingLogin}
          >
            Enviar
          </Button>
          <Link to="/signup">
            <Button
              color="primary"
              fullWidth
              style={style.input}
            >
              Não tem conta? Cadastre-se aqui
            </Button>
          </Link>
        </form>
      </div>
    </main>
  );
}

export default LoginPage;
