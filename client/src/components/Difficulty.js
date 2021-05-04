import React from 'react'

const Difficulty = ({level}) => {
  return (
    <div>
      <p className="no-margin text-right">
        <small className="text-muted right">difficulty {level}/10</small>
      </p>
    </div>
  )
}

export default Difficulty
