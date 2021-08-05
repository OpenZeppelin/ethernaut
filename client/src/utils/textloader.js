export default function load(data) {
  return new Promise((resolve, reject) => {
    // console.log(`loading file:`, data, __dirname)
    try {
      fetch(data)
        .then(response => response.text())
        .then(text => {
          // console.log(`file loaded`)
          resolve(text)
        })
    }
    catch(error) {
      console.log(`ERROR LOADING FILE:`, error)
      reject(error)
    }
  })
}