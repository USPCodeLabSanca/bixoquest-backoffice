import React from 'react';

import {toast} from 'react-toastify';
import {Link} from 'react-router-dom';
import TextField from '@material-ui/core/TextField';

import Button from '../components/button';
import {signup} from '../global-states/auth';

const style = {
  input: {margin: '1rem 0'},
};

/**
 * SignupPage
 *
 * @return {object}
 */
function SignupPage() {
  const [isDoingLogin, setIsDoingLogin] = React.useState(false);
  const nameRef = React.useRef();
  const emailRef = React.useRef();
  const courseRef = React.useRef();
  const passwordRef = React.useRef();
  const keyRef = React.useRef();

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

    const name = nameRef.current.value;
    const email = emailRef.current.value;
    const course = courseRef.current.value;
    const password = passwordRef.current.value;
    const key = keyRef.current.value;

    if (!password) return toast.error('Você deve fornecer uma senha');

    try {
      setIsDoingLogin(true);
      await signup(name, email, course, password, key);
    } catch (e) {
      console.error(e);
    } finally {
      setIsDoingLogin(false);
    }
  }

  return (
    <main className='w-full h-full p-4 flex justify-center items-center'>
      <div className='bg-white rounded-lg w-full max-w-md shadow-xl p-4'>
        <h1 className='text-2xl font-bold text-center'>Cadastrar</h1>
        <form style={style.form} onSubmit={submit}>
          <TextField
            label='Nome'
            fullWidth
            type='text'
            inputRef={nameRef}
            style={style.input}
          />
          <TextField
            label='E-mail'
            fullWidth
            type='email'
            inputRef={emailRef}
            style={style.input}
          />
          <TextField
            label='Curso'
            fullWidth
            type='text'
            inputRef={courseRef}
            style={style.input}
          />
          <TextField
            label='Senha'
            fullWidth
            type='password'
            inputRef={passwordRef}
            style={style.input}
          />
          <TextField
            label='Chave'
            fullWidth
            type='password'
            inputRef={keyRef}
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
          <Link to="/login">
            <Button
              color="primary"
              fullWidth
              style={style.input}
            >
              Já tem conta? Entre por aqui
            </Button>
          </Link>
        </form>
      </div>
    </main>
  );
}

export default SignupPage;
