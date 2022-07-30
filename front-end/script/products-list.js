//Représente la Partie du HTML ou l'on ajoutes nos différents produits
const productsList = document.getElementById("product-list");
//Notre URL d'appel a l'API
const urlAPI = "http://localhost:3000/api/cameras"


//Va chercher les infos sur nos produits depuis l'API.
async function getProductsInfo(url){
    try{
        let res = await fetch(url);
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

const genHTMLProducts = getProductsInfo(urlAPI)
.then(data => {
    for(i = 0; i <= data.length-1; i++){
        //Création de l'élément html représentant le produit et les différents élément le constituant.
        const newproduct = document.createElement("article");
        //Ajouts des class botstraps premettant mise en page du produit
        newproduct.classList.add("on-list-product", "card", "border", "m-3", "bg-light");  
        //Génération du HTML
        newproduct.innerHTML = 
            "<img class='card-img-top' src='" + data[i].imageUrl + "' alt='appareil photo " + data[i].name + "'>" +
            "<div class='card-body'>" +
            "<a class='link-warning text-decoration-none stretched-link' href='./page/product.html?id=" + data[i]._id + "'>" +
            "<h3 class='card-title' >" + data[i].name + "</h3></a>" +
            "<div class='product-descriptions'><p>" + data[i].description +  "</p>" + 
            "<strong>" + (data[i].price/100) + "€</strong></div>";
        //Ajout du produit au reste de la page HTML
        productsList.appendChild(newproduct);
    }
})
.catch(err =>{
    console.log(err);
    console.log("la liste des produits ne peux pas s'afficher");
})   

const cartCounter = document.getElementById("counter");
const cartCounterContent = document.getElementById("counter-content");
if(localStorage.getItem("cartCounter") != null){
    cartCounterStore = Number(localStorage.getItem("cartCounter"));
    cartCounterContent.innerHTML = cartCounterStore;
    cartCounter.style.visibility = "visible";
}