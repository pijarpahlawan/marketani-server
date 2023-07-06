const axios = require('axios')
const { rajaongkirAPIKEY } = require('../../config/thirdParty')

/**
 * Get cost data from RajaOngkir API
 * @param {*} req
 * @param {*} res
 * @returns
 */
const cost = (req, res) => {
  return axios
    .post('https://api.rajaongkir.com/starter/cost', req.body, {
      headers: {
        key: rajaongkirAPIKEY
      }
    })
    .then((response) => {
      const parsedData = response.data
      const body = {}

      if (parsedData.rajaongkir.status.code !== 200) {
        body.code = parsedData.rajaongkir.status.code
        body.status =
          parsedData.rajaongkir.status.code < 500
            ? 'Client Error'
            : 'Server Error'
        body.message = parsedData.rajaongkir.status.description

        console.error(body)
        return res.status(body.code).json(body)
      }

      body.code = 200
      body.status = 'OK'
      body.message = 'Success'
      body.data = parsedData.rajaongkir.results

      return res.status(200).json(body)
    })
}

module.exports = cost
