window.onload = () =>{
    if(sessionStorage.user){
        user = JSON.parse(sessionStorage.user);
        if(user.email)
        {
            location.replace('/');
        }
    }
}

let formBtn = document.querySelector('.submit-btn');
let loader = document.querySelector('.loader');

formBtn.addEventListener('click',()=>{
    let fullname = document.querySelector('#name') || null;
    let email = document.querySelector('#email');
    let password = document.querySelector('#password');
    let number = document.querySelector('#number') || null;
    let tac = document.querySelector('#tc') || null;
    

    

    if(fullname != null)  //sign up page conditions
    {
        if(fullname.value.length<1)
    {
        showFormError("Please enter your name");
    }
    else if(!email.value.length){
        showFormError("Please enter your Email");
    }
    else if(password.value.length<8)
    {
        showFormError("password must be 8 letters long");
    }
    else if(Number(number)|| number.value.length<10 )
    {
        showFormError("Invalid number,please enter valid one");
    }
    else if (!tac.checked) {
        showFormError("You need to agree with our terms and conditions.");
    }
    else{
        loader.style.display = 'block';
        sendData('/signup',{
            name: fullname.value,
            email: email.value,
            password:password.value,
            number:number.value,
            tac:tac.checked
        })
    }
    }
    
    else{
       if(!email.value.length || !password.value.length)
       {
        showFormError('fill all the inputs')
       }
       else{
        loader.style.display='block';
        sendData('/login',{
            email: email.value,
            password: password.value
        })
       }
    }
})