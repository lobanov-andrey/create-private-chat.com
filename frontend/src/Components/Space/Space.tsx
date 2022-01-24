import React from 'react'

type spaceProps = {
  height: number
}

const Space = ({ height }: spaceProps) => {
  return <div style={{ height: `${height}px`, width: '100%' }}></div>
}

export default Space
