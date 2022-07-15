const userName = document.getElementById("name");
const command = document.getElementById("command");
const price = document.getElementById("price"); 
const acticles = document.getElementById("articles"); 
const allActicles = document.getElementById("all-articles");

userName.textContent = localStorage.getItem("name");
command.textContent = localStorage.getItem("orderId");
price.textContent = localStorage.getItem("commandPrice") + "€";
acticlesNum = JSON.parse(localStorage.getItem("products"))
acticles.textContent = acticlesNum.length;
allActicles.textContent = localStorage.getItem("allProduct");