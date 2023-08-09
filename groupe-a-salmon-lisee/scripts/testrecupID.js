//récupération de l'id
function getItem(){
    const item = window.location.search;
    console.log(item);

    const sliceitem = item.slice(-1);

    const urlsearchParams = new URLSearchParams(item);
    console.log(urlsearchParams);

    const id = urlsearchParams.get("id");
    console.log(id);
    return id;
}


function readData() { //récupération des données du fichier json
    fetch('../scripts/pulls.json')
.then(function(response) {
    return response.json();
})
.then((data) => {
    Pulls = data;
    replaceAttributes();
})
}

function replaceAttributes(){ //affichage du nom du produit
    let idpull = getItem();
    document.getElementById("pulls-name").innerHTML = 'Pull Choisi: ' + Pulls[idpull].name;
    document.getElementById("image-pull").src = Pulls[idpull].image_src; 
    document.getElementById("image-pull").alt = Pulls[idpull].alt_image;
}

function getFormResults() {
    let fields = {};
    console.log(document.getElementsByTagName('input'))
    for (ele of document.getElementsByTagName('input')) {
        if (ele.id != 'reset_button' && ele.id != 'buy') {
            if (ele.type == 'radio') {
                if (ele.checked) {fields[ele.name] = ele;}
            }
            else {fields[ele.name] = ele;}
        }
    }
    //console.log(fields);
    return fields
}

function updatePrice(price) {
    document.getElementById("item-price").innerHTML = 'Prix : ' + price + "€";
}


function calculatePrice(unitary=false) {
    let item = getItem()
    let form = getFormResults();
    //console.log(form);
    let p=Items[item].price;

    switch (form['material'].id) {
        case 'ceramic':
            p=p+10;
            break;
        case 'plastic':
            p=p+5;
            break;
        case 'clay':
            p=p+15;
        }
    if (form["gift"].checked){
        p=p+3;
    }
    if (!unitary) {
        p=p * form["quantity"].value;

        if ((form["quantity"].value>10)){
            p=p-p/10;
        }
    }
    p = roundNumber(p,2);
    let decimal_part = roundNumber(p - Math.round(p), 2);
    if (decimal_part != 0) {
        let decimal_digits = String(Math.abs(decimal_part)).length - 2;
        if (decimal_digits < 2) {
            p = p + '0'.repeat(2 - decimal_digits);
        }
    }
    else {
        p += '.00';
    }
    //console.log(p, decimal_digits, String(roundNumber(p - Math.round(p), 2)))
    return p;
}

function roundNumber(number, digits) {
    var multiple = Math.pow(10, digits);
    var rndedNum = Math.round(number * multiple) / multiple;
    return rndedNum;
}

function addToCart() {
    let form = getFormResults();
    let price = calculatePrice(unitary=true)
    let item_id = getItem();
    let customization = {
        'name':Items[item_id].name,
        'price': price,
        'image_src': Items[item_id].image_src};
    let quantity = Number(form['quantity'].value);

    for (id in form) {
        let ele = form[id];
        //console.log(ele, id)

        if (ele.id == 'quantity') {continue}

        if (ele.type == 'radio') {
            customization[ele.name] = ele.id;
        }
        else if (ele.type == 'checkbox') {
            customization[ele.name] = ele.checked;
        }
        else {
            customization[ele.name] = ele.value;
        }
    }
    //console.log(customization);
    updateCart(customization, quantity);
    console.log(localStorage.getItem('cart_list'));

    window.location.replace("./cart.html");
}

function updateCart(new_item, quantity) {
    new_item = JSON.stringify(new_item);

    let old_cookie = localStorage.getItem('cart_list');
    if (old_cookie != undefined) {
        let cart_list = JSON.parse(old_cookie);
        //console.log(cart_list);
        
        if (cart_list[new_item] === undefined) {
            cart_list[new_item] = {number:Number(quantity), id:getNextID()};
        }
        else {
            cart_list[new_item].number = Number(cart_list[new_item].number) + quantity;
        }
        let cookie = JSON.stringify(cart_list);
        localStorage.setItem('cart_list', cookie);
    }
    else {
        const new_cart = {};
        new_cart[new_item] = {number:Number(quantity), id:getNextID()};
        let cookie = JSON.stringify(new_cart);
        localStorage.setItem('cart_list', cookie);
    }
    
}

function getNextID() {
    let cart_cookie = localStorage.getItem('cart_list');

    if (cart_cookie != undefined) {
        const cart_list = JSON.parse(cart_cookie);
        let id_max = 0;
        for (let product of Object.values(cart_list)) {
            if (Number(product.id) > id_max) {
                id_max = Number(product.id);
            }
        }
        return id_max + 1;
    }
    else {
        return 0;
    }
}

readData();