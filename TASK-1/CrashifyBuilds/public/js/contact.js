
let formBtn = document.querySelector('.btn');
//let loader = document.querySelector('.loader');
formBtn.addEventListener('click', ()=>{
    let name = document.querySelector('#cname') ;
    let email = document.querySelector('#cemail') ;
    let textarea = document.querySelector('#ctextarea');
    
    if(name.value.length<1){
        showFormError("Please enter your name");
    }
    else if(!email.value.length){
        showFormError("Please enter your Email");
    }
    else if(!textarea.value.length){
        showFormError("Please enter your message");
    }
    else{
        // loader.style.display = 'block';
        console.log("hvbeuaeuhsjhE");
        sendData('/contact',{
            name: name.value,
            email: email.value,
            textarea: textarea.value
        })
    }
})
/*
window.onload = () =>{
    user = JSON.parse(sessionStorage.user || null);
    if(user == null){
        location.replace('/login');
    }
}
let applyBtn = document.querySelector('.con-btn');

applyBtn.addEventListener('click', ()=>{

    let businessName = document.querySelector('#name').value;
    let address = document.querySelector('#address').value;
    let number = document.querySelector('#number').value;
    let about = document.querySelector('#about').value;
    
    if(!businessName.length || !about.length || !address.length || number < 10 || !Number(number)){
        showFormError('some information(s) is/are incorrect');
    }
    else{
        //send data
        loader.style.display = 'block';
        sendData('/seller',{
            name: businessName,
            address: address,
            about: about,
            number: number,
            email: JSON.parse(sessionStorage.user).email
        })
    }
})*/