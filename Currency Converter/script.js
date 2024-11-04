const dropList = document.querySelectorAll(".drop-list select"),
fromCurrency = document.querySelector(".from select"),
toCurrency = document.querySelector(".to select"),
getButton = document.querySelector("form button"),
exchangeIcon = document.querySelector(".drop-list .icon")


for (let i = 0; i < dropList.length; i++) {
    for(currency_code in country_list){
        let selected;
        if(i == 0){
            selected = currency_code == "USD" ? "selected" : "";
        }else if(i == 1){
            selected = currency_code == "NPR" ? "selected" : "";
        }
        let optionTag=`<option value = "${currency_code}" ${selected}>${currency_code}</option>` ;
        dropList[i].insertAdjacentHTML("beforeend", optionTag);
    }
    dropList[i].addEventListener("change", e=>{
        loadFlag(e.target)
    })
}

function loadFlag(e){
    for(code in country_list){
        if(code == e.value){
            let imgTag = e.parentElement.querySelector("img");
            imgTag.src = `https://www.flagsapi.com/${country_list[code]}/flat/64.png`
        }
    }
}

window.addEventListener("load",()=>{
    getExchangeRate();
})
getButton.addEventListener("click",e =>{
    e.preventDefault();
    getExchangeRate();
})

exchangeIcon.addEventListener("click", () =>{
    let tempCode = fromCurrency.value;
    fromCurrency.value = toCurrency.value;
    toCurrency.value=tempCode;
    loadFlag(fromCurrency);
    loadFlag(toCurrency);
    getExchangeRate();
})

function getExchangeRate(){
    const amount = document.querySelector(".amount input"),
    exchangeRateTxt = document.querySelector(".exchange-rate")
    let amountVal = amount.value;
    if(amountVal == "" || amountVal == "0"){
        amount.value = "1";
        amountVal = 1;
    }
    exchangeRateTxt.innerText = "Getting exchange rate..."
    let url = `https://v6.exchangerate-api.com/v6/1a6db9a8ce3fb3bb6aeb3938/latest/${fromCurrency.value}`;
    fetch(url).then(response => response.json()).then(result =>{
        let exchangeRate = result.conversion_rates[toCurrency.value];
        let totalExchangeRate = (amountVal * exchangeRate).toFixed(2);
        const exchangeRateTxt = document.querySelector(".exchange-rate");
        exchangeRateTxt.innerText = `${amountVal} ${fromCurrency.value} = ${totalExchangeRate} ${toCurrency.value}`;
    })

}