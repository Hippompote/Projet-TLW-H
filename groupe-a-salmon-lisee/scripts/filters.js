function loadProducts() { //Récupération du JSON contenant les pulls
    fetch('../scripts/pulls.json')
      .then((res) => res.json())
      .then((data) => {
        Pulls = data;
        console.log('filters initiated')
      })
  }
  
  function resetFilters() { //Réinitialisation des filtres
    document.getElementById('filtersform').reset();
    updateFilters();
  }
  
  
  function updateFilters() { //Affichage dynamique
  
    // Radio buttons check
    const radioFilters = getRadioFiltersValue();
    let priceMin = document.getElementById('pricemin').value;
    let priceMax = document.getElementById('pricemax').value;

  
    for (id in Pulls) {
      let shown = true;
      for (let filterId in radioFilters) {
        if (shown) {
          shown = (shown && (Pulls[id].filters[filterId] === radioFilters[filterId]));
          //console.log('check', Items[id].filters[filterId], filters[filterId])
        }
        else {
          break;
        }
      }
  
      shown &= (priceMin <= Pulls[id].price) && (Pulls[id].price <= priceMax)
      

      
  
      //Hide elements
      card = document.getElementById('item-' + id);
      card.hidden = (!shown);
    }
  }
  
  function getRadioFiltersValue() { //Récupération des valeurs des filtres
    const filterValues = {};
    var radios = document.getElementsByTagName('input');
    for (id in radios) {
      if (radios[id].type == 'radio' && radios[id].checked) {
        filterValues[radios[id].name] = radios[id].id;
      }
    }
    return filterValues
  }

  function showFilters(){ //Montrer les filtres ou masquer
    document.getElementById('dropbtn').classList.toggle("show");
  }
  
  
  //-------------------------------------------------------
  var Items;
  console.log('initiating filters')
  loadProducts();