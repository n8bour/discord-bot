/**
 * Fetch token info on https://dexscreener.com/
 *
 * @param {text} input The token to search.
 * @return The token info.
 * @customfunction
 */
function importDexScreenTokenInfo(token) {
    var url = "https://io8.dexscreener.io/u/search/pairs?q=";
    //var token = [["FIRE"], ["WAVAX"], ["RING"], ["XRING"], ["STATIC"], ["CHARGE"]];
    //ar token = "FIRE";
    var data = [];
    console.log(token);
    if (Array.isArray(token)) {
        for (i in token) {
            if (isNaN(token[i]))
                //data[token[i]] = fetchData_(url, token[i]);
                insertData_(fetchData_(url, token[i]), data)
        }
    } else {
        insertData_(fetchData_(url, token), data)
    }
    return data;
}

function insertData_(info, data) {
    for (x in info) {
        data.push([x, info[x]]);
    }
}

/**
 * Fetch token price on https://dexscreener.com/
 *
 * @param {text} input The token to search.
 * @return The token price.
 * @customfunction
 */
 function importDexScreenTokenPrice(token) {
    var url = "https://io8.dexscreener.io/u/search/pairs?q=";
    var token = "FIRE";
    var jsonData = UrlFetchApp.fetch(url + token);
    var object = JSON.parse(jsonData.getContentText());
    var jsonTokenInfo = object["pairs"][0];

    var tokenInfo = TokenInfo.fromJson(jsonTokenInfo);

    //console.log(tokenInfo);
    var tokenInfoArray = [];
    for (key in tokenInfo) {
        console.log(key + ": " + tokenInfo[key]);
        if (key === 'baseToken') {
            /*tokenInfoArray.push(['address',tokenInfo[key]['address']]);
            tokenInfoArray.push(['symbol',tokenInfo[key]['symbol']]);*/
            tokenInfoArray['address'] = tokenInfo[key]['address'];
            tokenInfoArray['symbol'] = tokenInfo[key]['symbol'];
        } else {
            // tokenInfoArray.push([key,tokenInfo[key]]);
            tokenInfoArray[key] = tokenInfo[key];
        }
    }
    return tokenInfoArray["priceUsd"];
}


/**
 * Fetch token info on https://dexscreener.com/
 *
 * @param {url} input url.
 * @param {token} input The token to search.
 * @return The token info.
 * @customfunction
 */
function fetchData_(url, token) {
    if (isNaN(token)) {
        var jsonData = UrlFetchApp.fetch(url + token);
        var object = JSON.parse(jsonData.getContentText());
        var jsonTokenInfo = object["pairs"][0];

        var tokenInfo = TokenInfo.fromJson(jsonTokenInfo);

        var tokenInfoArray = [];
        for (key in tokenInfo) {
            //console.log(key + ": " + tokenInfo[key]);
            if (key == 'baseToken') {
                tokenInfoArray['address'] = tokenInfo[key]['address'];
                tokenInfoArray['symbol'] = tokenInfo[key]['symbol'];
            } else {
                tokenInfoArray[key] = tokenInfo[key];
            }
        }
        return tokenInfoArray;
    }
}

class TokenInfo {
    /*constructor(platformId, dexId, pairAddress, baseToken, quoteTokenSymbol, price, priceUsd, h24Txns, h24PriceChange, h24VolumeUsd, liquidity) {
      this.platformId = platformId;
      this.dexId = dexId;
      this.pairAddress = pairAddress;
      this.baseToken = BaseToken.parse(baseToken);
      this.quoteTokenSymbol = quoteTokenSymbol;
      this.price = price;
      this.priceUsd = priceUsd;
      this.h24Txns = h24Txns;
      this.h24PriceChange = h24PriceChange;
      this.h24VolumeUsd = h24VolumeUsd;
      this.liquidity = liquidity;
    }*/

    static fromJson(json) {

        this.platformId = json.platformId;
        this.dexId = json.dexId;
        this.pairAddress = json.pairAddress;
        this.baseToken = BaseToken.fromJson(json.baseToken);
        this.quoteTokenSymbol = json.quoteTokenSymbol;
        this.price = json.price;
        this.priceUsd = json.priceUsd;
        this.h24Txns = json.h24Txns;
        this.h24PriceChange = json.h24PriceChange;
        this.h24VolumeUsd = json.h24VolumeUsd;
        this.liquidity = json.liquidity;
        return this;
    }
}


class BaseToken {
    /* constructor(address, baseName, symbol) {
       this.address = address;
       this.baseName = baseName;
       this.symbol = symbol;
     }*/

    static fromJson(baseToken) {
        this.address = baseToken.address;
        this.baseName = baseToken.name;
        this.symbol = baseToken.symbol;
        return this;
    }
}