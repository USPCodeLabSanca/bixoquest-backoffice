import React from 'react';

import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import Backdrop from '@material-ui/core/Backdrop';

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
    <Backdrop style={{zIndex: 50}} open={isLoading}>
      <CircularProgress size={50} style={{color: 'white'}} />
    </Backdrop>
  </Button>;
}
