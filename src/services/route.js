import React from 'react'
import { Switch, Route, Redirect } from 'react-router-dom'

import { withAuth, withNoAuth } from './auth-verification'

import LoginPage from '../pages/login'
import HomePage from '../pages/home'
import UsersPage from '../pages/users'
import MissionsPage from '../pages/missions'

export const Routes = {
  login: '/login',
  home: '/home',
  users: '/users',
  missions: '/missions'
}

export default function AppRoute () {
  return (
    <Switch>
      <Route path={Routes.login} component={withNoAuth(LoginPage)} />
      <Route path={Routes.home} component={withAuth(HomePage)} />
      <Route path={Routes.users} component={withAuth(UsersPage)} />
      <Route path={Routes.missions} component={withAuth(MissionsPage)} />
      <Redirect to={Routes.home} />
    </Switch>
  )
}