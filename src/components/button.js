import React from 'react'

import Button from '@material-ui/core/Button'

import Spinner from './Spinner'

/** @argument {import('@material-ui/core').ButtonProps & { isLoading: boolean }} props */
export default function MyButton ({ isLoading, children, onClick = () => {}, ...props }) {
  function click () {
    if(isLoading) return
    onClick()
  }

  return <Button onClick={click} {...props}>
    {children}
    {isLoading && <Spinner style={{ marginLeft: '0.5rem', display: 'inline-block' }} />}
  </Button>
}
