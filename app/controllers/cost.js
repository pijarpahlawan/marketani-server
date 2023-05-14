const axios = require('axios')
const { rajaongkirAPIKEY } = require('../../config/thirdParty')

const cost = (req, res) => {
  axios
    .post('https://api.rajaongkir.com/starter/cost', req.body, {
      headers: {
        key: rajaongkirAPIKEY
      }
    })
    .then((response) => {
      const parsedData = response.data
      res.status(200).json({ body: parsedData.rajaongkir.results })
    })
    .catch((error) => {
      res.status(400).json({ body: error.message })
    })
}

module.exports = cost
