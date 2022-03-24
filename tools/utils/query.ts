import fetch from "node-fetch";
import { DateTime } from 'luxon';

class ScanApi {
  baseUrl: String;
  apiKey: String;

  constructor(baseUrl: String, apiKey: String) {
    this.baseUrl = baseUrl;
    this.apiKey = apiKey;
  }

  async transfers(address: String): Promise<any> {
    let url = this.baseUrl +
      "?module=account" +
      "&action=tokentx" +
      "&address=" + address +
      "&page=1" +
      "&offset=1000" +
      "&startblock=0" +
      "&endblock=99999999" +
      "&sort=asc" +
      "&apikey=" + this.apiKey;

    return fetch(url)
      .then((res) => res.json())
  }

  async contractEvents(address: String): Promise<any> {
    let url = this.baseUrl +
      "?module=account" +
      "&action=txlist" +
      "&address=" + address +
      "&startblock=" + 12951552 +
      "&endblock=99999999" +
      "&page=1" +
      "&offset=1000" +
      "&sort=asc" +
      "&apikey=" + this.apiKey;

    return fetch(url)
      .then((res) => res.json())
  }
}

class CoinGeckoApi {
  async getPrice(id: String, date: DateTime): Promise<number> {
    const formattedDate = date.toFormat("dd-LL-yyyy");
    return fetch(`https://api.coingecko.com/api/v3/coins/${id}/history?date=${formattedDate}`)
      .then((res) => res.json())
      .then((json: any) => json.market_data.current_price.usd)
  }
}

export { ScanApi }