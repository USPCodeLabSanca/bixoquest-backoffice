import React from 'react';
import {Switch, Route, Redirect} from 'react-router-dom';

import {withAuth, withNoAuth} from './auth-verification';

import LoginPage from '../pages/login';
import SignupPage from '../pages/signup';
import HomePage from '../pages/home';
import UsersPage from '../pages/users';
import MissionsPage from '../pages/missions';

export const Routes = {
  login: {
    name: 'Entrar',
    path: '/login',
  },
  signup: {
    name: 'Cadastrar',
    path: '/signup',
  },
  home: {
    name: 'Home',
    path: '/home',
  },
  users: {
    name: 'Usuários',
    path: '/users',
  },
  missions: {
    name: 'Missões',
    path: '/missions',
  },
};

/**
 * AppRoute
 *
 * @return {object}
 */
export default function AppRoute() {
  return (
    <Switch>
      <Route path={Routes.login.path} component={withNoAuth(LoginPage)} />
      <Route path={Routes.signup.path} component={withNoAuth(SignupPage)} />
      <Route path={Routes.home.path} component={withAuth(HomePage)} />
      <Route path={Routes.users.path} component={withAuth(UsersPage)} />
      <Route path={Routes.missions.path} component={withAuth(MissionsPage)} />
      <Redirect to={Routes.home.path} />
    </Switch>
  );
}
