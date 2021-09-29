const purchaseDate = document.querySelector(".date-of-purchase");
const quantity = document.querySelector(".quantity");
const result = document.querySelector(".result");
const currentPriceLabel = document.querySelector(".current-price");
const buyPrice = document.querySelector(".price-on-date");
const submit = document.querySelector(".check");

submit.addEventListener("click", clickHandler);

var currentPriceURL = "https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd";
var historicalPriceURL = "https://api.coingecko.com/api/v3/coins/bitcoin/history?date=";




function clickHandler() {

    if (purchaseDate.value && quantity.value) {
        fetchPrices();   
    }else{
        updateResult("Invalid Date or Quantity");
    
    }    
}

async function fetchPrices()  {
    var boughtAt = 0;
    var currentPrice = 0;


    await fetch(currentPriceURL)
    .then(response => response.json())
    .then(data => currentPrice = data["bitcoin"]["usd"]);
    
    await fetch(historicalPriceURL + formatDate())
    .then(response => response.json())
    .then(data => boughtAt = Math.trunc(data["market_data"]["current_price"]["usd"]));
    
    calculateReturns(boughtAt, currentPrice, quantity.value)
}

function calculateReturns(buy, current, quantity) {
    if (buy > current) {
        var loss = (buy - current) * quantity;
        var lossPercentage = Math.trunc((loss / buy) * 100);

        updateResult(`Oops! You're down by ${lossPercentage}% with total loss of $${loss}`);
    } else{
        var profit = (current - buy) * quantity;
        var profitPercentage = Math.trunc((profit / buy) * 100);

        updateResult(`Kudos! You're in profit by ${profitPercentage}% with total profit of $${profit} `)
        
    }
}

function formatDate() {  
    return purchaseDate.value.split("-").reverse().join("-"); 
}

function updateResult(message) {
    result.innerText = message;
}