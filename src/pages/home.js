import React from 'react';
import withLateralMenu from '../services/lateral-menu';

const style = {
  title: 'text-2xl text-center',
  description: 'text-center',
};

/**
 * HomePage
 *
 * @return {object}
 */
function HomePage() {
  return (
    <main>
      <h1 className={style.title}>
        Bem vinde ao sistema adminsitrador do BixoQuest!
      </h1>
      <p className={style.description}>
        Selecione uma opção na barra lateral
      </p>
    </main>
  );
}

export default withLateralMenu(HomePage);
