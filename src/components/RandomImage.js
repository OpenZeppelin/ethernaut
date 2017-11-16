import React from 'react'

const images = [
  'big.jpg',
  'boom.jpg',
  'eter2.jpg',
  'hands.jpg',
  'spores.jpg',
  'face.jpeg',
  'comic.jpg',
  'comic1.jpg',
  'comic2.jpeg',
  'comic4.jpeg',
  'soldier.jpg',
  'comic5.jpeg',
  'comic3.jpg',
  'pinch.jpg',
  'dude.jpg',
  'bio.jpg',
  'comic6.jpg',
  'dead.jpg',
  'fava.jpg',
  'snow.jpg',
  'put.gif',
  'plug.png',
  'glasses.jpg',
  'close.jpeg',
  'table.jpg',
];

const RandomImage = () => {
  const img = images[Math.floor(images.length * Math.random())]
  // console.log('img:', img)
  return (
    <div style={{margin: '40px 0 40px 0'}}>
      <img style={{maxWidth: '350px', display: 'block', marginLeft: 'auto', marginRight: 'auto'}} src={`../../imgs/${img}`} alt=''/>
    </div>
  )
}

export default RandomImage