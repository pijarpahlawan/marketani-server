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

module.exports = province
