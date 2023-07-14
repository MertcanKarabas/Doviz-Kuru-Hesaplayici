const inputValue = document.querySelector("#inputValue");
const cevirilecekDoviz = document.querySelector("#cevirilecekDoviz");
const changePlacesBtn = document.querySelector("#changePlacesBtn");
const sonucDovizi = document.querySelector("#sonucDovizi");
const cevirBtn = document.querySelector("#cevirBtn");
const resultOfChange = document.querySelector("#resultOfChange");
let options = document.querySelectorAll(".option");

let allData = new Map();

function eventRunner() {
    inputValue.addEventListener("keyup", getInputValue);
    changePlacesBtn.addEventListener("click", yonDegis);
    cevirBtn.addEventListener("click", dovizCevir);
    cevirilecekDoviz.addEventListener("change", dovizCevir);
    sonucDovizi.addEventListener("change", updateData);

}

async function getData(baseCurrency, resultCurrency) {
    await fetch(`https://api.freecurrencyapi.com/v1/latest?apikey=fca_live_VCcdWIxQqb9ckBFxZ8U5Elr3rjftgxNdIJGEpaQ3&base_currency=${baseCurrency}`)
        .then((response) => response.json())
        .then((data) => {
            console.log(data.data);
            let changes = data.data;
            storeValues(changes);
            removeSelectOptions();
            addSelectOptions(sonucDovizi);
            addSelectOptions(cevirilecekDoviz);
            setSelectedItem(sonucDovizi, baseCurrency);
            setSelectedItem(cevirilecekDoviz, resultCurrency);
            dovizCevir();
        })
        .catch((err) => console.log(err));
}

async function updateData() {
    await getData(getSelectedItem(sonucDovizi).value, getSelectedItem(cevirilecekDoviz).value);
    dovizCevir();
}

function getInputValue() {
    let value = inputValue.value.trim();
    calculate(Number(value));
    return value;
}

function yonDegis() {
    let cevirilecekDovizIndex = cevirilecekDoviz.selectedIndex;
    cevirilecekDoviz.selectedIndex = sonucDovizi.selectedIndex;
    sonucDovizi.selectedIndex = cevirilecekDovizIndex;
    updateData();
}

function dovizCevir() {
    let inputValue = getInputValue();
    let result;
    if(inputValue === null || inputValue === undefined || inputValue === "")
        alert("Lütfen bir değer giriniz...");
    else 
        calculate(Number(inputValue)); 
    
}

function storeValues(changes) {
    for (let key in changes) {
        allData.set(key, changes[key]);
    }
}

function getSelectedItem(comboboxQuery) {
    return comboboxQuery[comboboxQuery.selectedIndex];
}

function setSelectedItem(comboboxQuery, value) {
    Array.from(comboboxQuery.children).forEach((option, index) => {
        if(comboboxQuery[index].value === value) {
            comboboxQuery[index].selected = true;
            return;
        }
    })
}

function removeSelectOptions() {
    Array.from(cevirilecekDoviz.children).forEach((option) => {
        option.remove();
    })
    Array.from(sonucDovizi.children).forEach((option) => {
        option.remove();
    })

}

function addSelectOptions(addingQuery) {
    let option;
    Array.from(allData).forEach((value, index) => {
        option = document.createElement("option");
        option.value = value[0];
        option.className = "option";
        option.text = value[0];
        addingQuery.appendChild(option);
    });
}

function calculate(inputValue) {
    let cevirilecekBirim = getSelectedItem(cevirilecekDoviz).value;
    let formattedInputValue = inputValue.toFixed(2);
    let result;
    Array.from(allData).forEach((value) => {
        if(value[0] === cevirilecekBirim) {
            result = (formattedInputValue * value[1].toFixed(2)).toFixed(2);
            resultOfChange.value = result;
        }
    });
}

getData("USD", "TRY");

eventRunner();


