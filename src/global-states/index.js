import React from 'react';
import AuthProvider from './auth';

/**
 * Provider
 *
 * @param {object} param0
 *
 * @return {object}
 */
export default function Provider({children}) {
  return (
    <AuthProvider>
      {children}
    </AuthProvider>
  );
}
