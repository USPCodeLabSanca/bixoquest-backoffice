import React from 'react';

import Button from '@material-ui/core/Button';

import Spinner from './Spinner';

/**
 * MyButton
 *
 * @param {object} param0
 *
 * @return {object}
 */
export default function MyButton({isLoading, children, onClick = () => {}, ...props}) {
  /**
   * click
   *
   * @return {void}
   */
  function click() {
    if (isLoading) return;
    onClick();
  }

  return <Button onClick={click} {...props}>
    {children}
    {isLoading && <Spinner style={{marginLeft: '0.5rem', display: 'inline-block'}} />}
  </Button>;
}
