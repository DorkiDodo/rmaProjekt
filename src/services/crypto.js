export async function getBtcToEurRate() {
  // Get BTC price in USD
  const btcResponse = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd');
  
  if (!btcResponse.ok) {
    throw new Error('Failed to fetch BTC price');
  }
  
  const btcData = await btcResponse.json();
  
  if (!btcData.bitcoin || !btcData.bitcoin.usd) {
    throw new Error('Invalid BTC price data');
  }
  
  const btcPriceUsd = btcData.bitcoin.usd;

  // Get USD to EUR rate using exchangerate-api.com (more reliable)
  const eurResponse = await fetch('https://api.exchangerate-api.com/v4/latest/USD');
  
  if (!eurResponse.ok) {
    throw new Error('Failed to fetch EUR rate');
  }
  
  const eurData = await eurResponse.json();
  
  if (!eurData.rates || !eurData.rates.EUR) {
    throw new Error('Invalid EUR rate data');
  }
  
  const usdToEur = eurData.rates.EUR;

  // Calculate: 1 BTC = (BTC price in USD) * (EUR per USD) EUR
  return btcPriceUsd * usdToEur;
}
