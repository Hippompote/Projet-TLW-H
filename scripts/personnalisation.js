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
    .then((res) => {return res.json()})

    .then((data) => {
        Pulls = data;
        replaceAttributes();
        updateItem();
    });
}

function replaceAttributes(){ //affichage du nom  et de l'image du produit
    let idpull = getItem();
    document.getElementById("pulls-name").innerHTML = 'Pull Choisi: ' + Pulls[idpull].name;
    document.getElementById("image-pull").src = Pulls[idpull].image_src; 
    document.getElementById("image-pull").alt = Pulls[idpull].alt_image;
}

function updateItem() { //Mettre à jour le prix
    
    if (Pulls != undefined) {
        updatePrice(calculatePrice());
   }
    else {
        readData();
    }
}




//Gestion de l'ajout au panier

function getFormResults() {
    let fields = {};
    //console.log(document.getElementsByTagName('input'))
    for (ele of document.getElementsByTagName('input')) {
        if (ele.id != 'reset_button' && ele.id != 'buy') {
            if (ele.type == 'radio') {
                if (ele.checked) {fields[ele.name] = ele;}
            }
            else {fields[ele.name] = ele;}
        }
    }
    console.log(fields);
    return fields
}

function updatePrice(price) { //Mise à jour du prix
    document.getElementById("pulls-price").innerHTML = 'Prix : ' + price + "€";
}


function calculatePrice(unitary=false) { //Calcul du prix
    let id = getItem()
    let form = getFormResults();
    //console.log(form);
    let p=Pulls[id].price;

    
    if (document.getElementById('backtextcheck').checked){
        p=p+10;
    }

    if (document.getElementById('armtextcheck').checked){
        p=p+5;
    }
    if (!unitary) {
        p=p * form["quantité"].value;

        if ((form["quantité"].value>10)){
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

function roundNumber(number, digits) { //Arrondir le prix
    var multiple = Math.pow(10, digits);
    var rndedNum = Math.round(number * multiple) / multiple;
    return rndedNum;
}

function addToCart() { //Ajout au panier
    let form = getFormResults();
    let price = calculatePrice(unitary=true)
    let item_id = getItem();
    let customization = {
        'name':Pulls[item_id].name,
        'price': price,
        'image_src': Pulls[item_id].image_src};
    let quantity = Number(form['quantité'].value);

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

    window.location.replace("./kart.html");
}

function updateCart(new_item, quantity) { //Mise à jour du panier
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

function getNextID() { //Récupérer l'id suivant 
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

let checkbox2 = document.getElementById('armtextcheck'); //Gestion des Checkbox et des radios
let popup2 = document.getElementById('arm-text-popup');

function Farmtext(){
    if (checkbox2.checked) {
        popup2.style.display = "block";
    } else {
        popup2.style.display = "none";
    }
}

let checkbox1 = document.getElementById('backtextcheck');
let popup1 = document.getElementById('back-text-popup');

function Fbacktext(){
    if (checkbox1.checked) {
        popup1.style.display = "block";
    } else {
        popup1.style.display = "none";
    }
}

function uncheckColors(obj){
    if (obj.checked==true)
    {
        document.getElementById("rcheck").checked=false;
        document.getElementById("bcheck").checked=false;
        document.getElementById("vcheck").checked=false;
        document.getElementById("gcheck").checked=false;
        document.getElementById(obj.id).checked=true;
    }
    if(obj.checked==false)
    {
        document.getElementById(obj.id).checked=true;
    }
}

//--------------------------

readData();