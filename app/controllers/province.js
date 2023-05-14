const axios = require('axios')
const { rajaongkirAPIKEY } = require('../../config/thirdParty')

const province = (req, res) => {
  axios
    .get('https://api.rajaongkir.com/starter/province', {
      params: { id: req.params.provinceId },
      headers: { key: rajaongkirAPIKEY }
    })
    .then((response) => {
      const parsedData = response.data
      res.status(200).json({ body: parsedData.rajaongkir.results })
    })
    .catch((error) => {
      res.status(400).json({ body: error.message })
    })
}

module.exports = province
