const {api} = require("../service/instance");

async function findAddress(cep) {
  try {
    const {data} = await api.get(`${cep}/json`);

    return data;
  } catch (error) {
    console.error(error);
  }
}

module.exports = {findAddress};
