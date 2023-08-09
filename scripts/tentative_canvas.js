/////////////js pour canvas/////////////
function colorSwap(){ //tentative de fonction pour permettre de changer la couleur (aurait été placé avec les "when checked" des .dot) 
    var drawingCanvas=document.getElementById('image-pull'); 
    if (crawingCanvas&&drawingCanvas.getContext){ //verification que c'est un canvas et sera donc affecté
        x=drawingCanvas.getContext('2d');//j'init la 2d
        width=x.canvas.width;
        height=x.canvas.height;
        x.fillstyle='#fff007f'; //couleur random pour le test
        x.fillRect(0,0,width,height); 
        var i,j;
        for (i=0; i<100;i++){
            for (j=0;j<100;j++){
                if ((i+j)%2==0){
                    x.fillRect(20*i,20*j,20,20) //on remplace pixel par pixel l'image par la couleur désirée (idée provenant d'un commentaire de stackoverflow)
                }
            }
        }
    }
}

function writeArm(){  //fonction pour ecrire sur le bras l'input de l'usager. probleme : pas en tant reel (on ne voit que quand l'usager "confirme" or il n'y a pas dans notre code de moyen ppour l'usager de confirmer)
    var canvas = document.getElementById("pullCanvas");
    var context = canvas.getContext("2d");
    var imageObj = new Image();
    imageObj.onload = function(){
        context.drawImage(imageObj, 10, 10);
        context.font = "40pt Calibri";
        context.fillText("l'input sur le bras via GetById", 20, 20);
    }
    imageObj.src = //src du pull//; 
}

//////////css pour canvas////////////
#container{ //idee numero 2 pour la couleur, avoir limage et le canvas distinct, les deux dans un container. Le canvas serait par dessus l'image avec une couleur selectionée avec une opacité réduite. problème : L'opacité de la couleur réduit mais ca ne la rend pas pour autant translucide, on ne vois pas l'image derrière même en réduisant l'opacité.
    display:inline-block;
    width:300px; 
    height:257px;
    margin: 0 auto; 
    background: rgb(230, 7, 7); 
    opacity: 50%;
    position:relative; 
    border:5px solid black; 
    border-radius: 10px; 
}
  
  #pullCanvas{ //mettre en position relative le texte pour qu'il suive l'image lorsque le flex qui la contient commence a wrap
    position:relative;
    z-index:0;
}