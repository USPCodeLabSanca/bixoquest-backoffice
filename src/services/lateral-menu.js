import React from 'react';

import {Routes} from './route';
import {useHistory} from 'react-router-dom';

const style = {
  root: {display: 'grid', gridTemplateColumns: '1fr 6fr', height: '100%', width: '100%'},
  lateralRoot: 'h-full w-full',
  lateralRootStyle: {boxShadow: '1px 0 10px 1px rgba(0, 0, 0, 0.1)'},
  lateralButton: 'w-full p-4 bg-gray-200 text-sm',
};

/**
 * withLateralMenu
 *
 * @param {object} Component
 *
 * @return {object}
 */
export default function withLateralMenu(Component) {
  return (props) => {
    const history = useHistory();

    const LateralButton = ({label, to}) => {
      const click = () => history.push(to);
      return <button onClick={click} className={style.lateralButton}>{label.toUpperCase()}</button>;
    };

    return (
      <div style={style.root}>
        <div className={style.lateralRoot} style={style.lateralRootStyle}>
          <LateralButton label='Usuários' to={Routes.users} />
          <LateralButton label='Missões' to={Routes.missions} />
        </div>
        <div style={{width: '85.71vw'}}>
          <Component {...props} />
        </div>
      </div>
    );
  };
}
