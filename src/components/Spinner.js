import React from 'react'

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
  ]
}

/** @argument {{
 * type?: 'arrow' | 'loading',
 * frameDuration?: number
 * }} props */
function Spinner ({ type='arrow', frameDuration = 100, ...props }) {
  const [frame, setFrame] = React.useState(0)

  function nextFrame () {
    setFrame((frame + 1) % frames[type].length)
  }

  React.useEffect(() => {
    const handler = setInterval(nextFrame, frameDuration)
    return () => clearInterval(handler)
  })

  return (
    <div {...props} style={{ fontFamily: 'monospace', ...props.style }}>
      {frames[type][frame]}
    </div>
  )
}

export default Spinner
