//prend comme valeur l'ID du produit passé dans l'URL
const productID = window.location.search.substr(1).slice(3);
//Notre URL d'appel a l'API
const urlAPI = "http://localhost:3000/api/cameras/"

//Représente la Partie du HTML ou l'on ajoute notre produit
const product = document.getElementById("product");

//Représente le message qui prévient de l'achat
let pushOnCartMessage;

//Représente la Partie du HTML de la selection de la spécification
const labelSpecification = document.createElement("label");
const specification = document.createElement("select")
labelSpecification.appendChild(specification);

//Représente la Partie du HTML du bouton d'achat
const buyButton = document.createElement("input");
buyButton.setAttribute('type',"button");
buyButton.setAttribute('value', 'Ajouter au panier')
buyButton.classList.add("btn", "btn-secondary", "mt-3", "buy-button");

//Va chercher les infos sur le produit depuis l'API.
async function getProductInfo(url, id){
    try{
        let res = await fetch(url + id);
        if(res.ok){
            let data = await res.json();
            return data;
        }
        else{
            console.error("erreur " + res.status)
        }
    }
    catch(err){
        console.log(err);
    }   
}

const genHTMLProduct = getProductInfo(urlAPI, productID)
.then(data => {
    //ajout des informations du produit de la page dans le local storage
    localStorage.setItem("productInfo", JSON.stringify(data));
    //Ajouts des class botstraps premettant mise en page du produit
    product.classList.add("d-lg-flex", "flex-column", "flex-sm-row","m-3"); 
    //Génération du HTML
    product.innerHTML = 
        "<div class='col-lg-5 m-4'><img class='img-fluid' src='" + data.imageUrl + "' alt='appareil photo " + data.name + "'></div>" +
        "<div class='m-5'><h1>" + data.name + "</h1>" +
        "<div class='product-description' ><p>" + data.description + "</p>" +
        "<div class='label-container'>Lentilles disponible: </div>"+
        "<strong class='fs-5'>" + (data.price/100) + "€</strong><br>"+
        "<div id='put-on-cart' class='text-success'>L'article est ajouté au panier !</div>";

    pushOnCartMessage = document.getElementById("put-on-cart");

    //ajout de la balise de selection de la spécification au HTML du produit
    const labelPlacement = document.getElementsByClassName("label-container");
    labelPlacement[0].classList.add("mb-3");
    labelPlacement[0].appendChild(labelSpecification);

    //ajout du bouton d'achat au HTML du produit
    const productDescription = document.getElementsByClassName("product-description");
    productDescription[0].appendChild(buyButton);

    //ajout des différents type de personnalisation dans l'élément option de la page
    for (i=0; i<=data.lenses.length-1; i++) {
        const newspe = document.createElement("option"); 
        newspe.textContent = data.lenses[i];
        specification.appendChild(newspe);
    }
})

let animIntervalLimiter = true;

//Événement du bouton d'achat, ajoute le produit séléctionné par l'utilisateur
buyButton.addEventListener("click", addProductInCart);
function addProductInCart(){
    
    //83-103 gere l'animation de confirmation d'ajout au panier.
    if(animIntervalLimiter == true){
        animIntervalLimiter = false;
        let stopAnim = setTimeout( function(){
            pushOnCartMessage.classList.remove("put-on-cart");
            const start = Date.now()
            let end = start + 800;
            while(end - start <= 0){
                end = Date.now()
            }
            animIntervalLimiter = true;
        }, 800);
    }
    pushOnCartMessage.classList.add("put-on-cart");

    //mise sous forme d'objet des informations du produit
    const product = JSON.parse(localStorage.getItem("productInfo"));
    // création du panier si inexistant
    if ((localStorage.getItem("cart") == null)||(localStorage.getItem("cart") == "null")){
         cart = [];
        pushOnCart(cart, product)
        localStorage.setItem("cart", JSON.stringify(cart));
    }
    //création d'un nouvel article dans le panier, ou ajout d'un item si l'article est déjà présent
    else{
        let newCartProduct = false;
        const cart = JSON.parse(localStorage.getItem("cart"));
        for(i = 0; i <= cart.length-1; i++){
            if((cart[i].lense == specification.value)&&(cart[i].name == product.name)){
                newCartProduct = false;
                cart[i].num ++ 
                break;   
            }
            else{
                newCartProduct = true
            }
        }
        if(newCartProduct == true){
            pushOnCart(cart, product)
        }
        localStorage.setItem("cart", JSON.stringify(cart));
    }
    addObject();
}

//fonction de création d'article dans le panier
function pushOnCart(cart, product){
    cart.push(
        {
            name : product.name,
            id : product._id,
            img : product.imageUrl,
            price : product.price,
            lense : specification.value,
            num : 1
        }
    )
}


/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/

const cartCounter = document.getElementById("counter");
const cartCounterContent = document.getElementById("counter-content");
if(localStorage.getItem("cartCounter") != null){
    cartCounterStore = Number(localStorage.getItem("cartCounter"));
    cartCounterContent.innerHTML = cartCounterStore;
    cartCounter.style.visibility = "visible";
}

function addObject(){
    if(localStorage.getItem("cartCounter") == null){
        localStorage.setItem('cartCounter', "1");
        cartCounter.style.visibility = "visible";
        cartCounterContent.innerHTML = localStorage.getItem('cartCounter');
    }
    else{
        let cartCounterStore = Number(localStorage.getItem("cartCounter"));
        cartCounterStore++;
        cartCounterContent.innerHTML = cartCounterStore;
        localStorage.setItem("cartCounter", cartCounterStore);
    }
}




