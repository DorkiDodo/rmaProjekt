import { ref } from 'vue'

const EXCHANGE_API_URL = 'https://api.exchangerate-api.com/v4/latest'

export function useValute () {
  const amount = ref(1)
  const from = ref('USD')
  const to = ref('EUR')
  const result = ref(null)
  const loading = ref(false)

  const currencyOpt = [
    'EUR',
    'USD',
    'GBP',
    'JPY',
    'BTC'
  ]

  async function getFiatRate (base) {
    const response = await fetch(`${EXCHANGE_API_URL}/${base}`)

    if (!response.ok) {
      throw new Error('Failed to fetch fiat rates')
    }

    const data = await response.json()

    if (!data.rates) {
      throw new Error('Invalid fiat rate data')
    }

    return data.rates
  }

  async function getBtcPriceUsd () {
    const response = await fetch(
      'https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd'
    )

    if (!response.ok) {
      throw new Error('Failed to fetch BTC price')
    }

    const data = await response.json()

    if (!data.bitcoin || !data.bitcoin.usd) {
      throw new Error('Invalid BTC data')
    }

    return data.bitcoin.usd
  }

  async function convertCurrency () {
    if (!amount.value || amount.value <= 0) return

    loading.value = true
    result.value = null

    try {
      let convertedValue

      // BTC → FIAT
      if (from.value === 'BTC' && to.value !== 'BTC') {
        const btcUsd = await getBtcPriceUsd()
        const fiatRates = await getFiatRate('USD')

        if (!fiatRates[to.value]) {
          throw new Error('Target currency not supported')
        }

        convertedValue = amount.value * btcUsd * fiatRates[to.value]
      }

      // FIAT → BTC
      else if (from.value !== 'BTC' && to.value === 'BTC') {
        const btcUsd = await getBtcPriceUsd()
        const fiatRates = await getFiatRate(from.value)

        if (!fiatRates.USD) {
          throw new Error('USD rate missing')
        }

        const valueInUsd = amount.value * fiatRates.USD
        convertedValue = valueInUsd / btcUsd
      }

      // FIAT → FIAT
      else if (from.value !== 'BTC' && to.value !== 'BTC') {
        const fiatRates = await getFiatRate(from.value)

        if (!fiatRates[to.value]) {
          throw new Error('Target currency not supported')
        }

        convertedValue = amount.value * fiatRates[to.value]
      }

      // BTC → BTC
      else {
        convertedValue = amount.value
      }

      result.value = convertedValue.toFixed(2)

    } catch (err) {
      console.error('Conversion error:', err)
      result.value = 'Greška'
    } finally {
      loading.value = false
    }
  }

  return {
    amount,
    from,
    to,
    result,
    loading,
    currencyOpt,
    convertCurrency
  }
}
