const navbar= document.querySelector('.navbar');
window.addEventListener('scroll',()=>{
    if(scrollY>=180){
        navbar.classList.add('bg');
    }else{
        navbar.classList.remove('bg');
    }
})
const createNavbar = () => {
    let navbar = document.querySelector('.navbar');
    navbar.innerHTML += `
        <ul class="links-container">
            <li class="link-item"><a href="index.html" class="link active">Home</a></li>
            <li class="link-item"><a href='/get-all-products' class="link">Products</a></li>
            <li class="link-item"><a href="about.html" class="link">About</a></li>
            
        </ul>
    <div class="user-interactions">
        <div class="search-box">
            <input type="text" class="search" placeholder="search item">
            <button class="search-btn"><img src="../img/search.png" alt=""></button>
        </div>
        <div class="cart" onclick="location.href = '/cart'">
            <img src="../img/shopping-cart.png" class="cart-icon" alt="">
        </div>
        <div class="user">
            <img src="../img/user.png" class="user-icon" alt="">
            <div class="user-icon-popup">
                <p>login to your account</p>
                <a>login</a>
            </div>
        </div>
    </div>

`
}

createNavbar();

let userIcon = document.querySelector('.user-icon');
let userPopupIcon = document.querySelector('.user-icon-popup');
userIcon.addEventListener('click',()=> userPopupIcon.classList.toggle('active'))

let text = userPopupIcon.querySelector('p');
let actionBtn = userPopupIcon.querySelector('a');
let user = JSON.parse(sessionStorage.user || null);

if(user != null){
    text.innerHTML=`log in as, ${user.name}`;
    actionBtn.innerHTML='log out';
    actionBtn.addEventListener('click',()=>logout());
}
else{
    text.innerHTML='login to your account';
    actionBtn.innerHTML='login';
    actionBtn.addEventListener('click',() => loginm());
}
const logout = ()=>{
    
    sessionStorage.clear()
    location.reload();
}
const loginm = ()=>{
    location.href='/login';
}
//console.log(`${user.seller}`);
if(!user.seller){
    
    let forSeller = document.querySelector(".for-seller");
    forSeller.innerHTML = 'seller';
    forSeller.addEventListener('click',() => transferseller());
}
else{
    let forSeller = document.querySelector(".for-seller");
    forSeller.innerHTML = 'dashboard';
    forSeller.addEventListener('click',() => transferdashboard());
}
const transferseller = ()=>{
    location.href='/seller';
}
const transferdashboard =()=>{
    location.href='/dashboard';
}
let searchBtn = document.querySelector('.search-btn')
let searchBox = document.querySelector('.search');

searchBtn.addEventListener('click', () => {
    if(searchBox.value.length){
        location.href = `/search/${searchBox.value}`;
    }
})
const updateNavCartCounter = () => {
    let cartCounter = document.querySelector('.cart-item-count');

    let cartItem = JSON.parse(localStorage.getItem('cart'));

    if(cartItem == null){
        cartCounter.innerHTML = '00';
    } else{
        if(cartItem.length > 9){
            cartCounter.innerHTML = '9+';
        } else if(cartItem.length <= 9){
            cartCounter.innerHTML = `0${cartItem.length}`
        }
    }
}

updateNavCartCounter();