function loadHeaderTemplate() { //Charger le Header
    fetch('../pages/header.html')
    .then(res => res.blob())
    .then(data => data.text())
    .then(html => {
      addElement(html,'header');
    })
}

function loadFooterTemplate() { //Charger le footer
    fetch('../pages/footer.html')
    .then(res => res.blob())
    .then(data => data.text())
    .then(html => {
        var template = html;
        //console.log(template);
        addElement(template,'footer');
        
    })
}

function addElement(html, type) { //Ajouter un élément à la page
    var container = document.getElementsByTagName(String(type))[0];
    //console.log('before', container);
    container.innerHTML = html.replace(/{{page}}/g, container.innerHTML);
    //console.log('after', container);
    console.log(`Template: ${type} added`);
}



//template = undefined;
loadFooterTemplate();
loadHeaderTemplate();