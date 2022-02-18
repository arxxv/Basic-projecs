const axios = require("axios");
const colors = require("colors");

class CryptoAPI {
  constructor(apikey) {
    this.api = apikey;
    this.baseUrl = "https://api.nomics.com/v1/currencies/ticker";
  }

  async getPriceData(coin, currency) {
    try {
      const formatter = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: currency,
      });
      const res = await axios.get(
        `${this.baseUrl}?key=${this.api}&ids=${coin}&convert=${currency}`
      );

      let output = "";
      res.data.forEach((coin) => {
        output += `Coin: ${coin.symbol.yellow} (${coin.name}) | Price: ${
          formatter.format(coin.price).green
        } | Rank: ${coin.rank.blue}\n`;
      });
      return output;
    } catch (err) {
      handleAPIError(err);
    }
  }
}

function handleAPIError(err) {
  if (err.response.status === 401) {
    throw new Error("Your API key is invalid - Go to https://nomics.com");
  } else if (err.response.status === 404) {
    throw new Error("Your API is not responding");
  } else {
    throw new Error("Something is not working");
  }
}

module.exports = CryptoAPI;
