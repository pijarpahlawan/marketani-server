const axios = require('axios')
const { rajaongkirAPIKEY } = require('../../config/thirdParty')

/**
 * Get province data from RajaOngkir API
 * @param {*} req
 * @param {*} res
 * @returns
 */
const province = async (req, res) => {
  return axios
    .get('https://api.rajaongkir.com/starter/province', {
      params: { id: req.params.provinceId },
      headers: { key: rajaongkirAPIKEY }
    })
    .then((res) => {
      const parsedData = res.data
      const response = {}

      if (parsedData.rajaongkir.status.code !== 200) {
        response.code = parsedData.rajaongkir.status.code
        response.status =
          parsedData.rajaongkir.status.code < 500
            ? 'Client Error'
            : 'Server Error'
        response.message = parsedData.rajaongkir.status.description

        console.error(response)
        return res.status(response.code).json(response)
      }

      response.code = 200
      response.status = 'Ok'
      response.data = parsedData.rajaongkir.results

      return res.status(200).json(response)
    })
}

module.exports = province
