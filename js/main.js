var obj = {};
var arrayRand = [18];
var timeoutId;
var checkFlip = true;
var openCardOne; 
var openCardTwo;
var numOpenedCards = 0;
var openOrClose;
var scores = 0;

/**Собираем элементы */
document.addEventListener("DOMContentLoaded",function(){
    obj.StartPage = document.getElementById("StartPage");
    obj.GamePage = document.getElementById("GamePage");
    obj.EndPage = document.getElementById("EndPage");
    obj.startGamebtn = document.getElementById("startbutton");
    obj.startGamebtn.addEventListener("click", Game);
    obj.anew_btn = document.getElementById("anew_btn");
    obj.anew_btn.addEventListener("click",Game);
    obj.again_btn = document.getElementById("again_btn");
    obj.again_btn.addEventListener("click",Game);
    obj.card = [];
    for (var i = 0; i<18;i++){
        obj.card.push(document.getElementById("card" + i));
    }
    obj.numScore = document.getElementById("Nscore");
    obj.end_text = document.getElementById("endText");
});

/** * Логика игры */

function Game(){
    hidePage();
    clearForRetry();
    generateRandArr();
    generateCards();
    clickCards();
}
//Скрываем элементы предыдущей страницы
function hidePage(){
    StartPage.classList.add("hide");
    EndPage.classList.add("hide");
    GamePage.classList.remove("hide"); 
}
//Очистка полей при перезапуске игры
function clearForRetry(){
    clearTimeout(timeoutId);
    obj.numScore.innerHTML = "0";
    numOpenedCards = 0;
    scores = 0;
}
//Генерируем уникальный рандомный массив
function generateRandArr(){
    var arrayRand1 = [];
    while(arrayRand1.length < 9){
        var numRand = Math.floor(Math.random() * (53 - 1)) + 1;
        if(arrayRand1.indexOf(numRand) === -1){
            arrayRand1.push(numRand)
        } 
    }
    var k = 0;
    for(var i = 0; i<9; i++){
        arrayRand[k++] = arrayRand1[i];
        arrayRand[k++] = arrayRand1[i];
    }
    arrayRand.sort(()=>{
        return Math.random() -0.5;
    });
}
//Раскладываем карты
function generateCards(){
    for (var i = 0; i<obj.card.length; i++){
        obj.card[i].innerHTML = '';
        var card_face = document.createElement("img");
        card_face.src = "assets/cards/"+arrayRand[i]+".png";
        card_face.classList.add("card");

        var card_back = document.createElement("img");
        card_back.src = "assets/cards/card_back.png";
        card_back.classList.add("card");
        card_back.classList.add("hide");

        obj.card[i].appendChild(card_face);
        obj.card[i].appendChild(card_back);
        
        //Предыдущие карты у нас скрывались,поэтому нужно настроить видимость
        if(obj.card[i].style.opacity === "0"){
             obj.card[i].style.opacity = "100";
        } 
    }

    //Через 5сек переворот карт
    timeoutId =  setTimeout(() => {
        for (i=0; i<obj.card.length; i++){
            flipToBack(obj.card[i]);
         }
    }, 5000);
}

//Назначаем событие onclick на карты
function clickCards(){
    for (var i=0; i<obj.card.length; i++){
        obj.card[i].onclick = (el)=>{
            var card = el.target.parentElement;
            flipClickCards(card);
        }
    }
}

//Переворот карты по клику и запуск функции поиска одинаковых карт
function flipClickCards(card){
    if(card.firstChild.classList.contains("hide") == true){
        if (checkFlip === true){
            flipToFace(card);
            findOpenCards(card);
        }
    }
}

//Рубашкой вниз
function flipToFace(card){
    card.firstChild.classList.remove("hide");
    card.lastChild.classList.add("hide");
    card.setAttribute( "data-tid","Card");
}

//Рубашкой вверх
function flipToBack(card){
    card.firstChild.classList.add("hide");
    $(card.lastChild).slideDown(500);
    card.lastChild.classList.remove("hide");
    $(card.lastChild).removeAttr( 'style' );
    card.setAttribute( "data-tid","Card-flipped");
}

//Ищем открытые карты
function findOpenCards(card){
    if (openCardOne == null){
        openCardOne = card;
    } 
    else{
        openCardTwo = card;
    }
    if(openCardOne!=null && openCardTwo!=null){
        compareCards(openCardOne,openCardTwo);
        checkFlip = false;
        openCardOne = null;
        openCardTwo = null;
    }
}

//Сравниваем карты
function compareCards (openCardOne,openCardTwo){
    if(openCardOne.firstChild.src === openCardTwo.firstChild.src){
        setTimeout(() => {
            $(openCardOne).fadeTo("slow", 0);
            $(openCardTwo).fadeTo("slow", 0);
            checkFlip = true;
        }, 1000);
        numOpenedCards ++;
        openOrClose = true;
        score(numOpenedCards,openOrClose);
    }
    else{
        setTimeout(() => {
            flipToBack(openCardOne);
            flipToBack(openCardTwo);
            checkFlip = true;
        }, 1000);
        openOrClose = false;
        score(numOpenedCards,openOrClose);
    }
}

//Подсчитываем количество очков
function score(numOpenedCards,openOrClose){
    if (openOrClose === true){
        scores = scores + ((9-numOpenedCards) * 42 );
    }
    else{
        scores = scores - (numOpenedCards * 42);
        if(scores < 0) {
            scores = 0;
        }
    }
    obj.numScore.innerHTML = scores;
    if (numOpenedCards === 9){
        setTimeout(end,1000);
    }
}

//Итоговая страница
function end(){
    obj.end_text.innerHTML = "Поздравляем! <br> Ваш итоговый счет: " + scores;
    GamePage.classList.add("hide");
    EndPage.classList.remove("hide");
}

