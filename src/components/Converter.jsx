import React, { useState, useEffect } from 'react'
import axios from "axios";

const CurrencyConverter = () => {
  const [amount, setAmount] = useState(1);
  const [fromCurrency, setFromCurrency] = useState("USD");
  const [toCurrency, setToCurrency] = useState("PKR");
  const [exchangeRate, setExchangeRate] = useState(null);
  const [currencies, setCurrencies] = useState([]);

  useEffect(() => {
    axios
      .get("https://api.exchangerate-api.com/v4/latest/USD")
      .then((response) => {
        const currencyList = Object.keys(response.data.rates);
        setCurrencies(currencyList);
      })
      .catch((error) => console.error("Error fetching currency list:", error));
  }, []);

  useEffect(() => {
    if (fromCurrency !== toCurrency) {
      axios
        .get(`https://api.exchangerate-api.com/v4/latest/${fromCurrency}`)
        .then((response) => {
          const rate = response.data.rates[toCurrency];
          setExchangeRate(rate);
        })
        .catch((error) =>
          console.error("Error fetching exchange rate:", error)
        );
    }
  }, [fromCurrency, toCurrency]);

  const handleAmountChange = (e) => setAmount(e.target.value);
  const handleFromCurrencyChange = (e) => setFromCurrency(e.target.value);
  const handleToCurrencyChange = (e) => setToCurrency(e.target.value);

  const convertCurrency = () => {
    if (exchangeRate) {
      return (amount * exchangeRate).toFixed(2);
    }
    return "Calculating...";
  };
  return (
    <div className="currency-converter w-80 py-20 px-4 bg-white rounded-xl  shadow-xl border border-slate-300">
    <h1 className="text-2xl font-bold mb-4 text-center cursor-pointer  w-max m-auto after:content-normal after:duration-300 after:m-auto after:bg-red-600 after:mt-1 after:block after:w-0 after:h-1 after:rounded-xl hover:after:w-full">Currency Converter</h1>
    <div className="mb-4 flex justify-center items-center flex-col gap-3">
      <input type="number" value={amount} onChange={handleAmountChange} className="p-2 border rounded cursor-pointer focus:ring-2 focus:outline-none focus:ring-indigo-600 focus:ring-offset-2" />
      <select value={fromCurrency} onChange={handleFromCurrencyChange} className="p-2 border rounded mx-2 cursor-pointer">
        {currencies.map((currency) => (
          <option key={currency} value={currency}>
            {currency}
          </option>
        ))}
      </select>
      <span className="mx-2 text-xl font-semibold">TO</span>
      <select value={toCurrency} onChange={handleToCurrencyChange} className="p-2 border rounded cursor-pointer">
        {currencies.map((currency) => (
          <option key={currency} value={currency}>
            {currency}
          </option>
        ))}
      </select>
    </div>
    <h2 className="text-xl duration-300 text-center w-max m-auto after:duration-300 after:content-normal after:bg-red-600 after:mt-1 after:block after:w-full after:h-1 after:rounded-xl">
      {amount} {fromCurrency} = {convertCurrency()} {toCurrency}
    </h2>
  </div>
  )
}

export default CurrencyConverter