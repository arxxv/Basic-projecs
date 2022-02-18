const KeyManager = require("../lib/keyManager");
const CryptoAPI = require("../lib/CryptoAPI");

const check = {
  async price(x) {
    try {
      const key = new KeyManager().getKey();
      const api = new CryptoAPI(key);
      const pricedata = await api.getPriceData(x.coin, x.cur);
      console.log(pricedata);
    } catch (error) {
      console.error(error.message.red);
    }
  },
};

module.exports = check;
