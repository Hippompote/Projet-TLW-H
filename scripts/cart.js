function getCartItems() { //Obtention du panier
    cart_list = JSON.parse(localStorage.getItem('cart_list'));
    return cart_list
}


function setCartItems(cart_list) { //implémenter le panier
    localStorage.setItem('cart_list', JSON.stringify(cart_list));
}


function over10Items(item_price, number) { //Gestion du prix pour une commande de plus de 10 Articles
    let multiplier = (number >= 10) ? 0.90 : 1;
    let price = item_price * number * multiplier;

    price = roundNumber(price,2);

    let decimal_part = roundNumber(price - Math.round(price), 2);
    if (decimal_part != 0) {
        let decimal_digits = String(Math.abs(decimal_part)).length - 2;
        if (decimal_digits < 2) {
            price = price + '0'.repeat(2 - decimal_digits);
        }
    }
    else {
        price += '.00';
    }
    return price
}

function roundNumber(number, digits) { //Arrondir le prix
    var multiple = Math.pow(10, digits);
    var rndedNum = Math.round(number * multiple) / multiple;
    return rndedNum;
}


function loadProducts() { //On récupère le fichier json du pull
    fetch('../scripts/pulls.json')
    .then((res) => {return res.json()})
    .then((data) => {
        Pulls = data;
        addItems()
        //console.log(data);
    });
}

function addItems() { //Ajout des items au panier (visuellement)
    let template = document.getElementById('cart_item_template').innerHTML;
    let container = document.getElementById('cart-content');
    let items_price = document.getElementById('items_price');
    let total_price = document.getElementById('total_price');

    container.innerHTML = "";
    cart_list = getCartItems();
    //console.log(cart_list)
    if (Object.keys(cart_list).length === 0) {
        container.innerHTML = " Vous n'avez rien dans votre panier ";
        items_price.innerHTML = "Commande: 0 €"
        total_price.innerHTML = "Prix total: 0 €"
        return
    }
    
    prixtot = 0;
    let item;
    let new_item;
    for (product in cart_list) {

        item = JSON.parse(product);
        //console.log(item)
        new_item = template
        .replace(/{{item-id}}/g, cart_list[product].id)
        //.replace(/{{image_src}}/g, '../resources/products/' + item.image_src)
        .replace(/{{name}}/g, item.name)
        .replace(/{{quantity}}/g, cart_list[product].number)
        .replace(/{{price}}/g, over10Items(item.price, cart_list[product].number))
        .replace(/{{options}}/g, formalizeOptions(item));

        prixtot = prixtot + Number(over10Items(item.price, cart_list[product].number));
        
        container.innerHTML = container.innerHTML + new_item;
    }
    items_price.innerHTML = "Commande: " + Number(prixtot) + "€";
    total_price.innerHTML = "Prix total: " + Number(prixtot) + "€"; 

}

function formalizeOptions(item) { //Ajout des Options
    let outstr = "<h4><u> Options: </u></h4>";
    outstr += strWithTags('Texte au dos: '+ ((item.backtextcheck) ? 'Oui': 'Non') + (item.backtextcheck), '<h4>');
    outstr += strWithTags('Texte sur la manche: ' + ((item.armtextcheck) ? 'Oui': 'Non'), '<h4>');
    //console.log(outstr);
    return outstr
}

function strWithTags(str, tag) { 
    return tag + str + '</' + tag.slice(2)
}


function addOne(id) { //Ajout d'un produit depuis le panier
    const item_number = document.querySelectorAll(`#item-${id}, #item-number`);
    cart_list[getItemFromID(id)].number += 1;
    item_number.innerHTML = cart_list[getItemFromID(id)].number;
    setCartItems(cart_list);
    addItems();
}

function removeOne(id) { //Suppression d'un produit depuis le panier
    const item_number_display = document.querySelectorAll(`#item-${id}, #item-number`);
    let item_number = cart_list[getItemFromID(id)].number;
    if (item_number > 1) {
        cart_list[getItemFromID(id)].number = item_number - 1;
        item_number_display.innerHTML = cart_list[getItemFromID(id)].number;
    }
    else if (item_number === 1){
        removeItem(id);
    }
    setCartItems(cart_list);
    addItems();
}

function removeItem(id) { //Suppression de tout les produits similaires du panier
    let item = document.getElementById(`item-${id}`);
    item.parentNode.removeChild(item);
    delete cart_list[getItemFromID(id)];
    setCartItems(cart_list);
    addItems();
}

function getItemFromID(id) { //Récupérer le produit du panier par son id
    for (let product in cart_list) {
        if (id === Number(cart_list[product].id)) {
            return product
        }
    }
    return undefined
}

function geocod(prixtot) { //Gestion de Mapbox et calcul du prix selon la distance
    let ville = document.getElementById("adresse").value;
    console.log("geocode",ville,ville.trim().length)
    if (ville.trim().length == 0) {
        addDistance(-1, prixtot);
    }
    else {
        fetch(
            `https://api.mapbox.com/geocoding/v5/mapbox.places/${ville}.json?access_token=pk.eyJ1IjoicGllcnJlY3BlIiwiYSI6ImNsOTZ3NDYzZjAwYjc0MnBmcDl1NzZkMmsifQ.w1SKfeuf7GWZxZgGac9X9w`,
            { method: 'GET' })
            .then(data => data.json())
            .then( json => {
                const x = json.features[0].center[0];
                const y = json.features[0].center[1];
                //console.log(x,y)
                fetch(
                `https://api.mapbox.com/directions/v5/mapbox/driving/45.763131,4.837862;${y},${x}?steps=true&geometries=geojson&access_token=pk.eyJ1IjoicGllcnJlY3BlIiwiYSI6ImNsOTZ3NDYzZjAwYjc0MnBmcDl1NzZkMmsifQ.w1SKfeuf7GWZxZgGac9X9w`,
                { method: 'GET' })
                .then(data2 => data2.json())
                .then( json2 => {
                    console.log(json2)
                    let d=json2.routes[0].distance; //pour avoir la distance : json2.routes[0].distance
                    let distance = Math.round(d)/1000;
                    addDistance(distance, prixtot);})
                .catch( error => {console.log(error);addDistance(-1, prixtot)})
                .catch( error => {console.log(error);addDistance(-1, prixtot)})})
            .catch( error => {console.log(error);addDistance(-1, prixtot)})
            .catch( error => {console.log(error);addDistance(-1, prixtot)})
        
        
    }
}

function addDistance(distance, prixtot) { //Ajout de la distance et reporter cela dans le panier
    let new_tot_price = document.getElementById('total_price');
    let delivery_price = document.getElementById('delivery_price');
    console.log('Distance calculée', distance)
    //console.log(prixtot)

    if (distance == -1) {
        document.getElementById("adresse").style.border = "2px solid red";
        return
    }
    else {
        document.getElementById("adresse").style.border = "2px solid green";

        if (distance<20){
            new_tot_price.innerHTML = "Prix total : " + Math.round(Number(prixtot)*100)/100 + "€";
            delivery_price.innerHTML = "Livraison: Gratuit"
        }
        else{
            delivery_price.innerHTML = "Livraison: " + Math.round(Number(5+0.07*distance)*100)/100 + "€";
            new_tot_price.innerHTML = "Prix total : " + Math.round(Number(prixtot +5+0.07*distance)*100)/100 + "€";
        }

    }

    
}

function checkForm() { //Vérificartion du formulaire

    let unix_current_date = Math.round(new Date().getTime() / 1000);

    const email_check = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    const name_check = /^[a-zA-Z-' ]*$/
    const tel_check = /^[0-9]{10}/;

    const form = document.forms[0]

    let green = "2px green solid";
    let red = "2px red solid";

    let firstname_cond = name_check.test(form.firstname.value) && (form.firstname.value.trim() != 0);
    form.firstname.style.border = (firstname_cond) ? green : red;

    

    let email_cond = email_check.test(form.email.value) && (form.email.value.trim() != 0);
    form.email.style.border = (email_cond) ? green : red;

    let tel_cond = tel_check.test(form.phone.value);
    form.phone.style.border = (tel_cond) ? green : red;

    let date_cond = (unix_current_date < Date.parse(form.date.value)/1000);
    form.date.style.border = (date_cond) ? green : red;


    if (firstname_cond && email_cond && date_cond && tel_cond) {
        geocod(prixtot)
    }
}



//---------------------------------
console.log('Loading cart...')
loadProducts();