import React from 'react';

const frames = {
  loading: [
    '[...........]',
    '[G..........]',
    '[NG.........]',
    '[ING........]',
    '[DING.......]',
    '[ADING......]',
    '[OADING.....]',
    '[LOADING....]',
    '[.LOADING...]',
    '[..LOADING..]',
    '[...LOADING.]',
    '[....LOADING]',
    '[.....LOADIN]',
    '[......LOADI]',
    '[.......LOAD]',
    '[........LOA]',
    '[.........LO]',
    '[..........L]',
  ],
  arrow: [
    '[....]',
    '[>...]',
    '[=>..]',
    '[==>.]',
    '[===>]',
    '[====]',
    '[.===]',
    '[..==]',
    '[...=]',
    '[....]',
    '[...<]',
    '[..<=]',
    '[.<==]',
    '[<===]',
    '[====]',
    '[===.]',
    '[==..]',
    '[=...]',
  ],
};

// type?: 'arrow' | 'loading'
// frameDuration?: number
/**
 * Spinner
 *
 * @param {object} param0
 *
 * @return {object}
 */
function Spinner({type='arrow', frameDuration = 100, ...props}) {
  const [frame, setFrame] = React.useState(0);

  /**
   * nextFrame
   */
  function nextFrame() {
    setFrame((frame + 1) % frames[type].length);
  }

  React.useEffect(() => {
    const handler = setInterval(nextFrame, frameDuration);
    return () => clearInterval(handler);
  });

  return (
    <div {...props} style={{fontFamily: 'monospace', ...props.style}}>
      {frames[type][frame]}
    </div>
  );
}

export default Spinner;
