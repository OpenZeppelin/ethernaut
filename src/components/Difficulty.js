import React from 'react'

const Difficulty = ({level}) => {

  const divStyle = {textAlign: 'right'}
  const imageStyle = difficulty => Object.assign({}, {width: '25px', height: '25px', marginRight: 5}, {opacity: level >= difficulty ? 1 : 0.2})

  return (
    <div>
      <p className="no-margin text-right">
        <small className="text-muted right">difficulty {level}/10</small>
      </p>
    </div>
  )
}

export default Difficulty
