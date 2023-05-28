const axios = require('axios')
const { rajaongkirAPIKEY } = require('../../config/thirdParty')

const province = async (req, res) => {
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
      body.status = 'OK'
      body.message = 'Success'
      body.data = parsedData.rajaongkir.results

      return res.status(200).json(body)
    })
}

module.exports = province
