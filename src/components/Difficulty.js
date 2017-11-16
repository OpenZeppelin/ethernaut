import React from 'react'

const Difficulty = ({level}) => {

  const divStyle = {textAlign: 'right'}
  const imageStyle = difficulty => Object.assign({}, {width: '25px', height: '25px', marginRight: 5}, {opacity: level >= difficulty ? 1 : 0.2})

  return (
    <div>
      <div style={divStyle}>
        <img style={imageStyle(0)} src='../../imgs/jerry.png' alt=''/>
        <img style={imageStyle(1)} src='../../imgs/squanchy.jpg' alt=''/>
        <img style={imageStyle(2)} src='../../imgs/beth.png' alt=''/>
        <img style={imageStyle(3)} src='../../imgs/morty.png' alt=''/>
        <img style={imageStyle(4)} src='../../imgs/bigface.png' alt=''/>
        <img style={imageStyle(5)} src='../../imgs/rick1.png' alt=''/>
        <img style={imageStyle(6)} src='../../imgs/pickle.png' alt=''/>
      </div>
      <p className="no-margin text-right">
        <small className="text-muted right">difficulty {level}/6</small>
      </p>
    </div>
  )
}

export default Difficulty