import React from 'react'
import ReactDOM from 'react-dom'

import { BrowserRouter } from 'react-router-dom'
import { toast, ToastContainer } from 'react-toastify'
import { MuiPickersUtilsProvider } from '@material-ui/pickers';
import dateUtils from '@date-io/dayjs'

import Provider from './global-states'
import { getToken, setToken, logout } from './global-states/auth'
import { initializeAPI } from './api/base-api'
import ApiURL from './constants/api-url'
import AppRoute from './services/route'

import './style.css'
import 'react-toastify/dist/ReactToastify.min.css'

initializeAPI({
  baseURL: ApiURL,
  tokenSelector: getToken,
  tokenDispatcher: setToken,
  onError: toast.error,
  timeout: 60000,
  onBadToken: () => {
    toast.error('Sua sessão expirou. Por favor, faça login novamente')
    logout()
  }
})

function App () {
  return (
    <MuiPickersUtilsProvider utils={dateUtils}>
      <BrowserRouter>
        <ToastContainer hideProgressBar />
        <Provider>
          <AppRoute />
        </Provider>
      </BrowserRouter>
    </MuiPickersUtilsProvider>
  )
}

ReactDOM.render(<App />, document.getElementById('root'))
