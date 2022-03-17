import fetch from "node-fetch";

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

export { ScanApi }