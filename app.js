const purchaseDate = document.querySelector(".date-of-purchase");
const quantity = document.querySelector(".quantity");
const result = document.querySelector(".result");
const currentPriceLabel = document.querySelector(".current-price");
const buyPriceLabel = document.querySelector(".price-on-date");
const submit = document.querySelector(".check");
const process = document.querySelector(".timeout")

const currentPriceURL = "https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd";
const historicalPriceURL = "https://api.coingecko.com/api/v3/coins/bitcoin/history?date=";


const clickHandler = () => {
    if (purchaseDate.value && quantity.value) {
        showProcess();
        fetchPrices();
    } else {
        updateResult("Invalid Date or Quantity", "grey");
    }
}

async function fetchPrices() {
    let boughtAt = 0;
    let currentPrice = 0;

    await fetch(currentPriceURL)
        .then(response => response.json())
        .then(data => currentPrice = data["bitcoin"]["usd"]);

    await fetch(historicalPriceURL + formatDate(purchaseDate.value))
        .then(response => response.json())
        .then(data => boughtAt = Math.round(data["market_data"]["current_price"]["usd"]));

    setTimeout(() => {
        hideProcess();
    }, 1000);

    buyPriceLabel.innerText = `Bought At: $${boughtAt}`;
    currentPriceLabel.innerText = `Current Price: $${currentPrice}`;

    calculateReturns(boughtAt, currentPrice, quantity.value)
}

const calculateReturns = (buy, current, quantity) => {
    if (buy > current) {
        const loss = (buy - current) * quantity;
        const lossPercentage = Math.round((loss / buy) * 100);

        updateResult(`Oops! You're down by ${lossPercentage}% with total loss of $${loss}`, "red");
    } else {
        const profit = (current - buy) * quantity;
        const profitPercentage = Math.round((profit / buy) * 100);

        updateResult(`Kudos! You're in profit by ${profitPercentage}% with total profit of $${profit}`, "green")

    }
}

const formatDate = date => date.split("-").reverse().join("-");


const updateResult = (message, message_color) => {
    result.innerText = message;
    result.style.color = message_color;
}

const showProcess = () => {
    process.style.display = "block";
    result.style.display = "none";

}

const hideProcess = () => {
    process.style.display = "none";
    result.style.display = "block";
}


submit.addEventListener("click", clickHandler);
