function loadProducts() { //récupération des produits
    fetch('../scripts/pulls.json') 
  .then((res) => res.json())
  .then((data) => {
    generateCards(data);
  })
  .catch(showError())
  .catch(showError())
}



function showError() { //affichage des produits
  document.getElementById('product_list').innerHTML = "<p>Désolé, nous n'avons pas réussi à charger les produits</p>";
}

function generateCards(Items) { //Génération de la grille de produits
    var template = document.getElementById('card_templateZ')
    const container = document.getElementById('product_list')
    container.innerHTML = '';
    for (let id in Items) {
      console.log(id)
        let Item = Items[id];
        console.log(template)
        //console.log(Item.image_src, '../photos/' + Item.image_src);
        new_card = template.innerHTML
        .replace(/{{name}}/g, Item.name)
        .replace(/{{image_src}}/g, Item.image_src)
        .replace(/{{alt_image}}/g, Item.alt_image)
        .replace(/{{id}}/g, id)
        .replace(/{{price}}/g, Item.price + '€');

        container.innerHTML = container.innerHTML + new_card;
    }
    console.log('cards initiated and loaded')
    
}

//-------------------------------------------------------
console.log('initiating cards')
loadProducts();
//loadCardTemplate();