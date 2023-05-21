const axios = require('axios')
const { rajaongkirAPIKEY } = require('../../config/thirdParty')

const cost = (req, res) => {
  return axios
    .post('https://api.rajaongkir.com/starter/cost', req.body, {
      headers: {
        key: rajaongkirAPIKEY
      }
    })
    .then((response) => {
      const parsedData = response.data

      if (parsedData.rajaongkir.status.code !== 200) {
        const error = {
          statusCode: parsedData.rajaongkir.status.code,
          message: parsedData.rajaongkir.status.description
        }
        throw new Error(error)
      }

      res.status(200).json({ body: parsedData.rajaongkir.results })
    })
}

module.exports = cost
