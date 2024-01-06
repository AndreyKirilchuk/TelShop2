function toggleMenu(){
    document.getElementById('menu').classList.toggle('active');
}

function calculateDiscountedPrice(fullprice, discount){
    return (fullprice - (fullprice * discount / 100)).toFixed(0);
}

let tovars = [
    {   
        id:1,
        img: 'img/1.jpg',
        name: 'Смартфон DEXP A440 8 ГБ розовый',
        fullprice: 3040,
        discount: 0,
        price: calculateDiscountedPrice(3040, 0), 
        RAM: 1 ,
        memory: 8,
        company: 'DEXP',
    },
    {
        id:2,
        img:'img/2.jpg',
        name: 'Samsung Galaxy M52',
        fullprice: 40999,
        discount: 5,
        price: calculateDiscountedPrice(40999, 5), 
        RAM: 6,
        memory: 256,
        company: 'Samsung',
    },
    {
        id:3,
        img:'img/3.jpg',
        name: 'Смартфон POCO F3 Черный',
        fullprice: 32999,
        discount: 0,
        price: calculateDiscountedPrice(32999, 0), 
        RAM: 6,
        memory: 128,
        company: 'POCO',
    },
    {
        id:4,
        img:'img/4.jpg',
        name: 'Смартфон POCO F3 Белый',
        fullprice: 34999,
        discount: 6,
        price: calculateDiscountedPrice(34999, 6),
        RAM: 6,
        memory: 128,
        company: 'POCO',
    },
];


//Расчет
function RenderValue(){
    document.getElementById("minPrice").value = Math.min(...tovars.map(tovar => tovar.price));
    document.getElementById("maxPrice").value = Math.max(...tovars.map(tovar => tovar.price));
    document.getElementById("minRAM").value = Math.min(...tovars.map(tovar => tovar.RAM));
    document.getElementById("maxRAM").value = Math.max(...tovars.map(tovar => tovar.RAM));
    document.getElementById("minMemory").value = Math.min(...tovars.map(tovar => tovar.memory));
    document.getElementById("maxMemory").value = Math.max(...tovars.map(tovar => tovar.memory));
    document.getElementById("search").value = "";
}

RenderValue();
//Вывод товаров
function RenderTovars(tovars){

    let card_list = document.getElementById('card_list');
    card_list.innerHTML = "";
    card = "";
    tovars.forEach(item => {
        const priceSection = item.discount !== 0 
            ? `<s class="fullprice">${item.fullprice}₽</s>
               <span>${item.price}₽</span>`
            : `<span class="fullprice">${item.fullprice}₽<span>`;

        card += `
        <div class="card">
            <div class="card_inner">
                <img src="${item.img}" width="170px"">
                <div class="card_text">${item.name}</div>
                <div class="card_text">${priceSection}</div>
                <div class="button_container">
                    <button class="ButtonTovar" onclick="AddTovar(${item.id})">Добавить в корзину</button>
                </div>
            </div>
        </div>                                
        `;
    });

    card_list.innerHTML += card;
}

RenderTovars(tovars);

//Сортировка

const accept = document.getElementById('accept');
const reset = document.getElementById('reset');

const sortFunctions = {
    "0": (a,b) => a.price - b.price,
    "1": (a,b) => b.price - a.price,
    "2": (a,b) => a.id - b.id,
    "3": (a,b) => b.id - a.id
}

document.getElementById('selectedSort').addEventListener('change', function(){
    const selectedSort = this.value;
    let filteredTovars = JSON.parse(localStorage.getItem('filteredTovars'));
    if(filteredTovars !==null){
        let arr = filteredTovars.sort(sortFunctions[selectedSort]);
        RenderTovars(arr);
        localStorage.setItem('selectedSort', selectedSort);
    }else{
        let arr = tovars.sort(sortFunctions[selectedSort]);
        RenderTovars(arr);
        localStorage.setItem('selectedSort', selectedSort);
    }
    reset.addEventListener('click', function(){
        let arr = tovars.sort(sortFunctions[selectedSort]);
        RenderTovars(arr);
        localStorage.setItem('selectedSort', selectedSort);
    })
})

//Накат фильтров
document.getElementById("accept").addEventListener("click", function() {
    let search = document.getElementById("search").value.toLowerCase();
    let minPrice = document.getElementById("minPrice").value;
    let maxPrice = document.getElementById("maxPrice").value;
    let minRAM = document.getElementById("minRAM").value;
    let maxRAM = document.getElementById("maxRAM").value;
    let minMemory = document.getElementById("minMemory").value;
    let maxMemory = document.getElementById("maxMemory").value;
    let DEXP = document.getElementById("DEXP").checked;
    let POCO = document.getElementById("POCO").checked;
    let Samsung = document.getElementById("Samsung").checked;
    let discount = document.getElementById("discount").checked;

    let filteredTovars = tovars.filter(function(tovar) {
        if (search && tovar.name.toLowerCase().indexOf(search) === -1) return false;
        if (minPrice && tovar.price < minPrice) return false;
        if (maxPrice && tovar.price > maxPrice) return false;
        if (minRAM && tovar.RAM < minRAM) return false;
        if (maxRAM && tovar.RAM > maxRAM) return false;
        if (minMemory && tovar.memory < minMemory) return false;
        if (maxMemory && tovar.memory > maxMemory) return false;
        if (!((DEXP && tovar.company === "DEXP") || (POCO && tovar.company === "POCO") || (Samsung && tovar.company === "Samsung"))) return false;
        if (discount && tovar.discount === 0) return false;
        return true;
    });

    let filters = {
        search: search,
        minPrice: minPrice,
        maxPrice: maxPrice,
        minRAM: minRAM,
        maxRAM: maxRAM,
        minMemory: minMemory,
        maxMemory: maxMemory,
        DEXP: DEXP,
        POCO: POCO,
        Samsung: Samsung,
        discount: discount
    };

    localStorage.setItem('filters', JSON.stringify(filters));
    localStorage.setItem('filteredTovars', JSON.stringify(filteredTovars));
    RenderTovars(filteredTovars);

    const selectedSort = localStorage.getItem('selectedSort');
    if(selectedSort !== null){
        let arr = filteredTovars.sort(sortFunctions[selectedSort]);
        RenderTovars(arr)
    }
});

//Сброс фильтров
reset.addEventListener('click', function(){
    localStorage.removeItem('filteredTovars');
    localStorage.removeItem('filters');
    RenderTovars(tovars);
    RenderValue();
    document.getElementById("DEXP").checked = true;
    document.getElementById("POCO").checked = true;
    document.getElementById("Samsung").checked = true;
    document.getElementById("discount").checked = false;
})

//Вывод корзины
function RenderSelectedTovars(){
    let cart_list = document.getElementById('selectedtovars');
    cart_list.innerHTML = "";

    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    cart.forEach(item => {
        cart_list.innerHTML += `
        <div class="tovar">
            <div class="tovarinfo">
                <div class="tovarinfo">
                    <img src="${item.img}">
                </div>
                <div>
                    <div class="tovarname">
                        <h3>${item.name}</h3>
                            <div class="tovar_counter">
                                <button class="tovar-btn" onclick="minusTovar(${item.id})">-</button>
                                <div class="tovar_num">${item.count}</div>
                                <button class="tovar-btn" onclick="plusTovar(${item.id})">+</button>
                            </div>
                        <span>${item.price}₽ / за шт.</span>
                    </div>
                </div>
            </div>
            <div class="tovardelete">
                <h4>Общая стоимость: ${item.price * item.count}</h4>
                <button class="ButtonTovar" onclick="DeleteTovar(${item.id})">Удалить</button>
            </div>
        </div>                             
        `;
    });
}

//Плюс товар по id
function plusTovar(id){
    let cart = JSON.parse(localStorage.getItem('cart')) || [] ;

    const element = cart.find(item => item.id === id);
    element.count++;

    localStorage.setItem('cart', JSON.stringify(cart));
    RenderCart();
}

//Минус товар по id
function minusTovar(id){
    let cart = JSON.parse(localStorage.getItem('cart')) || [] ;
    const element = cart.find(item => item.id === id);

    if(element.count > 1){
        element.count--;
    }else{
        cart = cart.filter(item=> item.id !== id);
    }

    localStorage.setItem('cart', JSON.stringify(cart));
    RenderCart();
}

function RenderSumm(){
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    let kolvo = document.getElementById('kol-vo');
    let summ = document.getElementById('summ');
    let kolvo_main = document.getElementById('kolvo_main');

    kolvo.innerHTML = cart.reduce((total, item) => total + item.count, 0);
    summ.innerHTML = cart.reduce((total, item) => total + (item.price * item.count), 0);
    kolvo_main.innerHTML = cart.reduce((total, item) => total + item.count, 0);
}

//Добавление товара в корзину
function AddTovar(id){
    let cart = JSON.parse(localStorage.getItem('cart')) || [] ;
    
    let tovar = tovars.find(item => item.id === id);
    const element = cart.find(element => tovar.id === element.id);

    if(element){
        element.count++;
    }else{
        tovar.count = 1;
        cart.push(tovar);
    }
    
    localStorage.setItem('cart', JSON.stringify(cart));
    RenderCart();
}

// Удаление товара
function DeleteTovar(id){
    let cart = JSON.parse(localStorage.getItem('cart')) || [] ;

    cart = cart.filter(item=> item.id !== id);

    localStorage.setItem('cart', JSON.stringify(cart));
    RenderCart();
}

// Очистка корзины
function deleteTovars(){
    localStorage.removeItem('cart');
    RenderCart();
}

function RenderCart(){
    RenderSelectedTovars();
    RenderSumm();
}

//Загрузка после обновления страницы
document.addEventListener('DOMContentLoaded', function(){
    if(localStorage.getItem('cart')){
        RenderCart();
    }
    const selectedSort = localStorage.getItem('selectedSort');
    const filteredTovars = JSON.parse(localStorage.getItem('filteredTovars'));
    if(selectedSort !== null && filteredTovars !== null){
        let arr = filteredTovars.sort(sortFunctions[selectedSort]);
        RenderTovars(arr)
    }
    if(selectedSort !==null && filteredTovars == null){
        let arr = tovars.sort(sortFunctions[selectedSort]);
        RenderTovars(arr)
    }
    if(selectedSort == null && filteredTovars !== null){
        let arr = filteredTovars.sort(sortFunctions[selectedSort]);
        RenderTovars(arr)
    }
    const filters = JSON.parse(localStorage.getItem('filters'));
    if(filters !== null){
        document.getElementById("search").value = filters.search || "";
        document.getElementById("minPrice").value = filters.minPrice || "";
        document.getElementById("maxPrice").value = filters.maxPrice || "";
        document.getElementById("minRAM").value = filters.minRAM || "";
        document.getElementById("maxRAM").value = filters.maxRAM || "";
        document.getElementById("minMemory").value = filters.minMemory || "";
        document.getElementById("maxMemory").value = filters.maxMemory || "";
        document.getElementById("DEXP").checked = filters.DEXP || false;
        document.getElementById("POCO").checked = filters.POCO || false;
        document.getElementById("Samsung").checked = filters.Samsung || false;
        document.getElementById("discount").checked = filters.discount || false;
    }
});

RenderSumm();