const axios = require('axios')
const { rajaongkirAPIKEY } = require('../../config/thirdParty')

/**
 * Get province data from RajaOngkir API
 * @param {*} req
 * @param {*} res
 * @returns
 */
const province = async (req, res) => {
  console.log(req.params)
  return axios
    .get('https://api.rajaongkir.com/starter/province', {
      params: { id: req.params.provinceId },
      headers: { key: rajaongkirAPIKEY }
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
      body.status = 'Ok'
      body.data = parsedData.rajaongkir.results

      return res.status(200).json(body)
    })
}

module.exports = province
