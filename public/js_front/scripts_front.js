
/*
структура для графика
*/
var data_for_schedule = {
    // A labels array that can contain any sort of values
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
    // Our series array that contains series objects or in this case series data arrays
    series: [
        [5, 2, 4, 2, 10]
    ]
};

/*
метод для первой отрисовки графика
*/
var myChart; //публичная переменная для хранения ссылки на график
function PaintStartSchedule() {
    myChart = new Chartist.Line('.ct-chart', data_for_schedule);
}
PaintStartSchedule();





//контейнер для кнопок меню
var currencyContainer = document.getElementById("currency-container");
//контейнер для дополнительных областей
var infoBlocksContainer = document.getElementById("info-blocks-container");
//список последних 50-ти дат получения данных
let dateLabels = [];
//список имён валют, которые открыты для просмотра в данный момент
let nowSeeCurrenciesNames = [];

/*
обновление списка последних 50-ти дат
*/
function UpdateDateLabels(currency){
    if(dateLabels.length < 50){
        dateLabels.push(currency.date);
    } else {
        dateLabels.shift();
        dateLabels.push(currency.date);
    }
}

/*
функция добавления новой валюты в список валют
*/
function AddNewCurrency(currencyName) {
    currencyContainer.innerHTML += "<li><a id=\""
        + currencyName + "-button"
        + "\" href=\"javascript:TouchCurrency('"
        + currencyName + "');\">" + currencyName +"</a></li>";
}

/*
обновление информации по валюте в блок доп информации
*/
function UpdateDataInCurrencyBlock(currencyName) {
    var blockId = currencyName + "-currency-container";
    var infoBlock = document.getElementById(blockId);

    var currencyPrice = "";
    var currencyDate = "";
    var currencyCode = "";

    for(var i = 0; i < currencies_data.length; i++){
        if(currencies_data[i].name === currencyName){
            currencyPrice = currencies_data[i].price;
            currencyDate = currencies_data[i].date;
            currencyCode = currencies_data[i].code;
        }
    }

    infoBlock.innerHTML = "<div class=\"name\">" + currencyName + "</div>\n" +
        "<div class=\"exchange-rate\">" + currencyPrice + "</div>\n" +
        "<div class=\"label-date\">Дата:</div>\n" +
        "<div class=\"date\">" + currencyDate + "</div>\n" +
        "<div class=\"label-number-code\">Цифровой код:</div>\n" +
        "<div class=\"number-code\">" + currencyCode + "</div>\n" +
        "<div class=\"label-letter-code\">Буквенный код:</div>\n" +
        "<div class=\"letter-code\"></div>";
}

/*
добавление нового блока с дополнительной информацией
*/
function AddNewCurrencyBlock(currencyName) {
    var blockId = currencyName + "-currency-container";
    infoBlocksContainer.innerHTML += "<div id=\""
        + blockId
        + "\" style=\"display: none\" class=\"info-block\">\n</div>";

    UpdateDataInCurrencyBlock(currencyName);
}

/*
Предстартовое насыщение страницы списком валют
и областями для предпросмотра.
Все области изначально хранят display:none.
*/
function ParseDataBeforeStart() {
    currencyContainer.innerHTML = "";
    infoBlocksContainer.innerHTML = "";
    currencies_data.forEach(function (item) {
        AddNewCurrency(item.name);
        AddNewCurrencyBlock(item.name);
    });
}





/*
получение новых данных и их обновление
*/
var currencies_data = [];
const websocket = new WebsocketSession('ws://localhost:81');
document.flag = false;
websocket.on('message', data => {
    console.log(data);
    currencies_data = data;

    if(!document.flag) {
        ParseDataBeforeStart()
        document.flag = true;
    }
    for(let cur of data){
        UpdateDataInCurrencyBlock(cur.name);
        UpdateDateLabels(cur);
    }
});







/*
открытие блока дополнительных данных
*/
function OpenInfoBlock(currencyName){
    var infoBlock = document.getElementById(currencyName + "-currency-container");

    if (infoBlock.style.display === "none") {
        infoBlock.style.display = "grid";
        UpdateDataInCurrencyBlock(currencyName);
        return "on";
    } else {
        infoBlock.style.display = "none";
        return "off";
    }
}

/*
функция для кнопки меню
*/
function TouchCurrency(currencyName) {
    var currencyButton = document.getElementById(currencyName + "-button");
    if(OpenInfoBlock(currencyName) === "on"){
        currencyButton.classList.add("selected-currency");
    } else {
        currencyButton.classList.remove("selected-currency");
    }
}