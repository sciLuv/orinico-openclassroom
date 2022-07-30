//section ou l'ensemble des information lié a page panier sont affiché.
const cartHTML = document.getElementById("cart-list");
cartHTML.classList.add("d-flex","flex-column", "justify-content-end"); 
//balise qui s'affiche tant que le panier est vide.
const emptyCart = document.getElementById("empty-cart"); 

let products = [], contact = {}; //variables néccessaire a l'appel et la réponse de l'API de commande. 

//affichage du texte "prix" au dessus des articles lorsqu'il sont présent
const cartPrice = document.getElementById("cart-price"); 
cartPrice.style.display = "none";

//affichage du bouton pour passer la commande
const command = document.createElement("input");
command.setAttribute('type',"button");
command.setAttribute('value', 'Passez votre commande')
command.classList.add("btn", "btn-secondary", "mt-3", "fs-4", "pb-2");

//balise qui affichera le prix total de la commande.
const finalPrice = document.createElement("div"); 
finalPrice.classList.add("text-end", "fs-4", "pb-2");

//total = prix de l'ensemble du panier.
let total = 0; 

const quantityContainer = document.getElementsByClassName("quantity");
const productPrice = document.getElementsByClassName("product-price");
const select = document.getElementsByTagName("select");
const supProduct = document.getElementsByClassName("trash");

const cartCounter = document.getElementById("counter");
const cartCounterContent = document.getElementById("counter-content");
if(localStorage.getItem("cartCounter") != null){
    cartCounterStore = Number(localStorage.getItem("cartCounter"));
    cartCounterContent.innerHTML = cartCounterStore;
    cartCounter.style.visibility = "visible";
}

//création de deux objet (un panier et une representation du panier pour le html)
let cart = JSON.parse(localStorage.getItem("cart"));

if (cart != null){
    for (i = 0; i <= cart.length-1; i++){
        if (cart[i] == ""){
            cart.splice(i, 1);
        }
    }
}
localStorage.setItem("cart", JSON.stringify(cart));
const intialCartSave = JSON.parse(localStorage.getItem("cart"));

//contient une partie des fonctions suivante pour mettre en place le HTML de base
//définie également les event pour les boutons de suppression et de changement de quantité 
function initialyse(){
    if (cart != null){
        for (i = 0; i <= cart.length-1; i++){
            genCartProductsHTML(i);
            genQuantitySelection();
            addPrice();
    
            let actualProduct = i;
            //Event lié aux boutons de supression
            supProduct[actualProduct].addEventListener("click", function(){

                let cartCounterStore;

                if(localStorage.getItem("cartCounter") != null){
                    cartCounterStore = Number(localStorage.getItem("cartCounter"));
                    cartCounterStore -= cart[actualProduct].num;
                    cartCounterContent.innerHTML = cartCounterStore;
                    localStorage.setItem("cartCounter", cartCounterStore);
                    if(cartCounterStore == 0){
                        cartCounter.style.visibility = "hidden";
                        localStorage.removeItem("cartCounter");
                    }
                }

                const actualProductValue = cart[actualProduct];
    
                total = total - (cart[actualProduct].price/100)*cart[actualProduct].num;
                finalPrice.innerHTML = "Sous-total : <strong>" + total + " € </strong>";
    
                cart[actualProduct] = "";
    
                localStorage.setItem("cart", JSON.stringify(cart));
    
                cartHTML.children[actualProduct].style.display = "none";

                if (total == 0){
                    localStorage.removeItem("cart");
                    emptyCart.style.display = "block";
                    cartPrice.style.display = "none";
                    command.style.display = "none";
                    finalPrice.style.display = "none";
                }
                
            });
            //Event lié a la selection de la quantité
            select[actualProduct].addEventListener("input", function(e){

                let cartCounterStore;

                if(localStorage.getItem("cartCounter") != null){
                    cartCounterStore = Number(localStorage.getItem("cartCounter"));
                    cartCounterStore -= intialCartSave[actualProduct].num;
                }
    
                total = total - (intialCartSave[actualProduct].price/100)*intialCartSave[actualProduct].num;
                
                intialCartSave[actualProduct].num = Number(e.target.value);
    
                if(localStorage.getItem("cartCounter") != null){
                    cartCounterStore += intialCartSave[actualProduct].num;
                    cartCounterContent.innerHTML = cartCounterStore;
                    localStorage.setItem("cartCounter", cartCounterStore);
                }
    

                productPrice[actualProduct].innerHTML = (intialCartSave[actualProduct].price/100)*intialCartSave[actualProduct].num + " €";
                total = total + (intialCartSave[actualProduct].price/100)*intialCartSave[actualProduct].num;
    
                finalPrice.innerHTML = "Sous-total : <strong>" + total + " € </strong>";
    
                for(i = 0; i <= cart.length-1; i++){
                    if((cart[i].lense == intialCartSave[actualProduct].lense)&&(cart[i].name == intialCartSave[actualProduct].name)){
                        cart[i].num = intialCartSave[actualProduct].num;
                        break;   
                    }
                }
                localStorage.setItem("cart", JSON.stringify(cart));
    
            })
    
        }
        displayEmptyCartHTML();
    }   
}

//Génération HTML d'un produit
function genCartProductsHTML(i){
    const productHTMLElement = document.createElement("article");
    //ajout des element crée dans la balise de section du HTML
    cartHTML.appendChild(productHTMLElement);
    //création de l'affichage (HTML) des différents produits
    productHTMLElement.innerHTML = 
    "<div class='container border-bottom mb-3 pb-3'>" +
    "<div class='row'>" +
    "<a  class='product-image col' href='product.html?id=" + cart[i].id + "'>" +
    "<img class='img-fluid' src='" + cart[i].img + "' alt='appareil photo " + cart[i].name + "'>" +
    "</a>" +
    "<div class='product-description col fs-5'>" + 
    "<a class='link-warning text-decoration-none' href='product.html?id=" + cart[i].id + "'>" +
    "<h3 class='mb-4'>" + cart[i].name + "</h3>" +
    "</a>" +
    "<span class='lens'>Lentille : <strong>" + cart[i].lense + "</strong></span><br>"+ 
    "<div class='quantity mt-3'> Quantité : </div> " + 
    "</div>" +
    "<div class='container col row'>" + 
    "<div class='col fs-4 text-end'>" + 
    "<strong class='fs-4 product-price'>" + (cart[i].price/100)*cart[i].num + " €</strong><br>" +
    "<span class='fst-italic fs-5'>" + (cart[i].price/100) + " €/unité</span><br>" +
    "</div>" +
    "<div class='container d-flex justify-content-end align-items-end'>" + 
    "<div class='border trash py-2 px-2 fas fa-trash fa-2x' aria-label='suppression'></div>" +
    "</div>" +
    "</div>" +
    "</div>";

}
//Génération HTML de la selection de quantité
function genQuantitySelection(){
    quantitySelection = document.createElement("select");
    quantitySelection.setAttribute('name', 'Quantity');
    quantitySelection.setAttribute('id', 'Quantity');
    quantityContainer[i].appendChild(quantitySelection);
    if (cart[i].num > 9){
        for(j=1; j <= cart[i].num; j++){  genQuantityOption(); }
    }
    else{
        for(j=1; j<=9; j++){  genQuantityOption(); }
    }
    quantitySelection.selectedIndex = cart[i].num-1;
}
function genQuantityOption(){
    const quantitySelectionOption = document.createElement("option");
    const stringJ = JSON.stringify(j)
    quantitySelectionOption.setAttribute('value', stringJ);
    quantitySelectionOption.textContent = j;
    quantitySelection.appendChild(quantitySelectionOption);
}
//Génération du prix
function addPrice(){
    total = total + (cart[i].price/100)*cart[i].num 
}
//Génération de la page HTML sans produit
function displayEmptyCartHTML(){
    let cartIsReallyEmpty = false;
    for(k = 0; k <= cart.length-1; k++){
        if(cart[k] != ""){
            cartIsReallyEmpty = true;
            break;
        }
    }
    if(cart.length > 0){
        emptyCart.style.display = "none";
        cartPrice.style.display = "block";
        cartHTML.style.display = "block";
        finalPrice.innerHTML = "Sous-total : <strong>" + total + " €</strong> <br>";
        cartHTML.appendChild(finalPrice);
        cartHTML.appendChild(command);
    }
    else{
        emptyCart.style.display = "block";
        cartPrice.style.display = "none";
    }
}

initialyse();

command.addEventListener('click', CommandPass)
function CommandPass(){
    commandForm.style.display = "block";
    form.style.display = "block";
}
/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~FORMULAIRE DE COMMANDE~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
//titre adresse 
const commandForm = document.getElementById('command-form');
commandForm.style.display = "none";
//le formulaire de contact
const form = document.getElementById("form");

//les différents inputs du formulaire de contact
const lastName = document.getElementById("lastname");
const firstName = document.getElementById("firstname");
const address = document.getElementById("address");
const city = document.getElementById("city");
const zip = document.getElementById("zip");
const email = document.getElementById("email");


//les différentes REGEX permettant d'avoir des informations aux bon format dans le formulaire.
const regexText = /^[a-zÀ-ú]{2}[a-zÀ-ú\s\-]*$/i;
const regexPostalcode =  /^\d{5}$/;
const regexAddress = /^[a-z0-9\s,]{8,}$/i;
const regexMail = /^[a-z0-9\._-]+@[a-z0-9\._-]+\.[a-z]{2,6}$/i;

//les différents événements lié aux champs des inputs 
lastName.addEventListener( 'change', formChangementText);	
firstName.addEventListener( 'change', formChangementText);
city.addEventListener( 'change', formChangementText);
address.addEventListener( 'change', formChangementAddress);							
zip.addEventListener( 'change', formChangementPostalCode);
email.addEventListener( 'change', formChangementMail);

//fonction permettant feed-back a l'utilisateur sur sa completion des champs des différents inputs
function goodText(){  
    event.target.nextElementSibling.innerHTML = "<span style='font-size:20px;'>&#9989;</span>"}
function badText(){   event.target.nextElementSibling.innerHTML =  "<span style='font-size:20px;'>&#10060;</span>"}

//les différentes fonctions lié aux feed back de la correcte completion des inputs
function formChangementText(event){													
    const result = event.target.value;	
    if(regexText.test(result)) {goodText();}
    else {badText();};
}				
function formChangementAddress(event){													
    const result = event.target.value;	
    if(regexAddress.test(result)) {goodText();}
    else{badText();};
}		
function formChangementPostalCode(event){													
    const result = event.target.value;	
    if(regexPostalcode.test(result)) {goodText();}
    else {badText();};
}
function formChangementMail(event){													
    const result = event.target.value;	
    if(regexMail.test(result)) {goodText();}
    else {badText();};
}							

//événement lié au bouton commande du formulaire.
form.addEventListener("submit", sendCommand);
function sendCommand(event){
    //empeche l'envoi normal du formulaire au back-end
    event.preventDefault();
    //vérifie si les champs des inputs sont correctement remplie
    if(regexText.test(lastName.value) && regexText.test(firstName.value) && 
       regexAddress.test(address.value) && regexPostalcode.test(zip.value) && 
       regexText.test(city.value) && regexMail.test(email.value)){
            console.log("Le formulaire est validé");
            //les deux constantes suivante permettent de crée un tableau avec les différentes valeurs contenue dans les inputs du formulaires
            const formData = new FormData(form);
            const constructContact = Array.from(formData);
            //la boucle suivante permet d'ajouter à l'objet contact les informations contenue dans le formulaire  
            for (i = 0; i <= 5; i++ ){
                if (i != 4){
                    contact[constructContact[i][0]] = constructContact[i][1];
                }
                //ajoute le code postale au city dans l'objet contact
                else{
                    contact[constructContact[i-1][0]] += " " + constructContact[i][1];
                }
                console.log("contact :");
                console.log(contact);
            }
            //mise a jour de la liste des produit acheter
            for (i = 0; i <= cart.length-1; i++){
                if (cart[i] == ""){
                    cart.splice(i, 1);
                }
            }
            localStorage.setItem("cart", JSON.stringify(cart));
            cart = JSON.parse(localStorage.getItem("cart"));
            let allItems = localStorage.getItem("cartCounter");
            //ajout des ID des produits acheter au tableau products
            for (i = 0; i <= cart.length-1; i++){
                products.push(cart[i].id);
                console.log("products : ");
                console.log(products);
            }
            //constante contenant le header du fetch d'appel a l'API suivante
            const options = {
                method: "POST",
                body: JSON.stringify({contact, products}),
                headers: { "Content-Type": "application/json" },
              };
            //appel a l'API
            fetch("http://localhost:3000/api/cameras/order", options)
            .then((res) => res.json())
            .then((order) => {
                //vide le localStorage pour pouvoir réaliser une nouvelle commande.
                localStorage.clear();
                const finalOrder = JSON.stringify(order)
                localStorage.setItem("products", JSON.stringify(products));
                //Ajoute les infos à afficher sur la page de confirmation de commande.
                localStorage.setItem("orderId", order.orderId);
                localStorage.setItem("name", order.contact.firstName);
                localStorage.setItem("commandPrice", total);
                localStorage.setItem("order", finalOrder);
                localStorage.setItem("allProduct", allItems)
                //redirige l'utilisateur vers la page de finalisation de sa commande.
                window.location.replace("commande.html");
            })
            .catch((err) => {
                alert("Il y a eu une erreur : " + err);
            });
    }
}




