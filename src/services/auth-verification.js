import React from 'react';

import {useHistory} from 'react-router-dom';

import {Routes} from './route';
import {useAuth} from '../global-states/auth';

/**
 * withAuth
 *
 * @param {object} Component
 *
 * @return {object}
 */
export function withAuth(Component) {
  return (props) => {
    const history = useHistory();
    const {user, token} = useAuth();
    console.log(user, token);

    if (!user || !token) {
      history.replace(Routes.login);
      return null;
    }

    return <Component {...props} />;
  };
}

/**
 * withNoAuth
 *
 * @param {object} Component
 *
 * @return {object}
 */
export function withNoAuth(Component) {
  return (props) => {
    const history = useHistory();
    const {user, token} = useAuth();

    if (user && token) {
      history.replace(Routes.home);
      return null;
    }

    return <Component {...props} />;
  };
}
