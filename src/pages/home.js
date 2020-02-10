import React from 'react'
import withLateralMenu from '../services/lateral-menu'

const style = {
  title: 'text-2xl text-center',
  description: 'text-center'
}

function HomePage () {
  return (
    <main>
      <h1 className={style.title}>
        Bem vindo(a) ao sistema adminsitrador do BixoQuest!
      </h1>
      <p className={style.description}>
        Selecione uma opção na NavBar
      </p>
    </main>
  )
}

export default withLateralMenu(HomePage)
