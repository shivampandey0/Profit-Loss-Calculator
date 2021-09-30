const purchaseDate = document.querySelector(".date-of-purchase");
const quantity = document.querySelector(".quantity");
const result = document.querySelector(".result");
const currentPriceLabel = document.querySelector(".current-price");
const buyPriceLabel = document.querySelector(".price-on-date");
const submit = document.querySelector(".check");
const process = document.querySelector(".timeout")


submit.addEventListener("click", clickHandler);

var currentPriceURL = "https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd";
var historicalPriceURL = "https://api.coingecko.com/api/v3/coins/bitcoin/history?date=";




function clickHandler() {

    if (purchaseDate.value && quantity.value) {
        showProcess();

       
        fetchPrices();   
    }else{
        updateResult("Invalid Date or Quantity", "grey");
    
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
    .then(data => boughtAt = Math.round(data["market_data"]["current_price"]["usd"]));
    
    setTimeout(() => {
        hideProcess();
    }, 1000);

    buyPriceLabel.innerText = `Bought At: $${boughtAt}`;
    currentPriceLabel.innerText = `Current Price: $${currentPrice}`;

    calculateReturns(boughtAt, currentPrice, quantity.value)
}

function calculateReturns(buy, current, quantity) {
    if (buy > current) {
        var loss = (buy - current) * quantity;
        var lossPercentage = Math.round((loss / buy) * 100);

        updateResult(`Oops! You're down by ${lossPercentage}% with total loss of $${loss}`,"red");
    } else{
        var profit = (current - buy) * quantity;
        var profitPercentage = Math.round((profit / buy) * 100);

        updateResult(`Kudos! You're in profit by ${profitPercentage}% with total profit of $${profit}`, "green")
        
    }
}

function formatDate() {  
    return purchaseDate.value.split("-").reverse().join("-"); 
}

function updateResult(message,message_color) {
    result.innerText = message;
    result.style.color = message_color;
}

function showProcess() {
    process.style.display = "block";
    result.style.display = "none";

}

function hideProcess() {
    process.style.display = "none";
    result.style.display = "block";
    
}