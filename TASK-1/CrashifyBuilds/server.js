import express from "express";
import bcrypt from "bcrypt";
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getFirestore,doc,collection,setDoc,getDoc,updateDoc, getDocs, query,where, deleteDoc,limit} from "firebase/firestore"
import stripe from 'stripe';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-librarie

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyB1OpmfLgohkoq3oVYc-T2LkOQFZezF2jo",
  authDomain: "myecom-website.firebaseapp.com",
  projectId: "myecom-website",
  storageBucket: "myecom-website.appspot.com",
  messagingSenderId: "851453902535",
  appId: "1:851453902535:web:a3de2f471636a6c2c188e2"
};

// Initialize Firebase
const firebase = initializeApp(firebaseConfig);
const db = getFirestore();
const app=express();

app.use(express.static("public"));  //now the html file gets its css file
app.use(express.json())            //this is use for form sharing



// // SDK initialization
// import ImageKit from "imagekit-javascript"
// var imagekit = new ImageKit({
//     publicKey : "public_avyVotsablQeL1DwYZ+yuLhFsg8=",
//     urlEndpoint : "https://ik.imagekit.io/yned7vav0",
//     authenticationEndpoint : "http://www.yourserver.com/auth",
// });

//routes
//home route

import "dotenv/config";

app.get('/',(req,res)=>{
    res.sendFile("index.html",{root : "public"})  //here we give the starting html file and the folder name
})

//signup route
app.get('/signup',(req,res)=>{
    res.sendFile('signup.html', { root: 'public' })
})
app.post('/signup',(req,res)=>{
    const{name,email,password,number,tac}=req.body;
    if(name.length<1)
    {
        res.json({'alert':'Please enter your name'});
    }
    else if(!email.length)
    {
        res.json({'alert':'Enter your email'});
    }
    else if(password.length<8)
    {
        res.json({'alert':'password must be 8 letters long'});
    }
    else if(!Number(number) || number.length<10)
    {
        res.json({'alert':'invalid number,please enter valid one'});
    }
    else if(tac==false)
    {
        res.json({'alert':'you must agree to our terms and condition'});
    }
    else{
        const users = collection(db,"users");
        getDoc(doc(users,email)).then(user=>{
            if (user.exists()){
                return res.json({'alert':'email already exists'})
            }
            else{
                bcrypt.genSalt(10,(err,salt)=>{
                    bcrypt.hash(password,salt,(err,hash)=>{
                        req.body.password = hash;
                        req.body.seller = false;
                        setDoc(doc(users,email),req.body).then(data =>{
                            res.json({
                                name:req.body.name,
                                email:req.body.email,
                                seller:req.body.seller,
                            })
                        })
                    })
                })
            }
        })
    }
})

//contact route
app.get('/contact',(req,res)=>{
    res.sendFile('contact.html', { root: 'public' })
})
app.post('/contact',(req,res)=>{
    let {name, email, textarea} = req.body;
    if(name.length<1){
        return res.json({'alert': 'Please enter your Name'})
    }
    else if(!email.length){
        return res.json({'alert': 'Please enter your Email'})
    }
    else if(!textarea.length){
        return res.json({'alert': 'Please enter your Messege'})
    }else{
        const contact = collection(db,"contact");
        
        setDoc(doc(contact,email),req.body).then(data =>{
            res.json({
                name:req.body.name,
                email:req.body.email,
                textarea:req.body.textarea,
            })
        })
    
    }
})

//login route
app.get('/login',(req,res)=>{
    res.sendFile('login.html', { root: 'public' });
})

app.post('/login',(req,res)=>{
    let{email,password}=req.body;
    if(!email.length || !password.length){
        return res.json({'alert': 'fill all the inputs'})
    }
    const users = collection(db,"users");
    getDoc(doc(users,email))
    .then(user=>{
        if(!user.exists()){
            return res.json({'alert':'no user found with this email'})
        }
        else{
            bcrypt.compare(password,user.data().password,(err,result)=>{
                if(result){
                    let data = user.data();
                    return res.json({
                        name: data.name,
                        email: data.email,
                        seller: data.seller
                    })
                }
                else{
                    return res.json({'alert':'wrong password'});
                }
            })
        }
    })
})

//Dashboard route

app.get('/dashboard',(req,res) =>{
    res.sendFile("dashboard.html",{root: "public"});
})

//add-product route

app.get('/add-product',(req,res) =>{
    res.sendFile("add-product.html", {root: "public"});
    
})

app.get('/add-product/:id',(req,res) =>{
    res.sendFile("add-product.html", {root: "public"});
    
})

app.post('/add-product',(req,res) =>{
    let {name,shortDes,price,detail,tags,image,email,draft,id} = req.body;

    /*if(!name.length)
    {
        res.json({'alert':'should enter product name'});
    }else if(!shortDes.length){
        res.json({'alert':'should enter description at least 80 letters long'});
    }else if(!price.length || !Number(price)){
        res.json({'alert':'should enter valid price'});
    }else if(!detail.length){
        res.json({'alert':'must enter details'});
    }else if(!tags.length){
        res.json({'alert':' enter tags'});
    }*/
    if(!draft)
    {if(!name.length)
        {
            res.json({'alert':'should enter product name'});
        }else if(!shortDes.length){
            res.json({'alert':'should enter description at least 80 letters long'});
        }else if(!price.length || !Number(price)){
            res.json({'alert':'should enter valid price'});
        }else if(!detail.length){
            res.json({'alert':'must enter details'});
        }else if(!tags.length){
            res.json({'alert':' enter tags'});
        }
    }
    
    let docName =id == undefined ? `${name.toLowerCase()}-${Math.floor(Math.random()*50000)}`: id ;
    
    let products = collection(db,"products");

    setDoc(doc(products,docName),req.body)
    .then(data =>{
        res.json({'product':name})
    })
    .catch(err =>{
        res.json({'alert':'some error occured'})
    })

})


//seller route

app.get('/seller',(req,res)=>{
    res.sendFile("seller.html",{root : "public"})
})

app.post('/seller',(req,res)=>{
    let {name , address, about, number, email} = req.body;
    if(!name.length || !about.length || !address.length || number<10 || !Number(number)){
        return res.json({'alert':'some information(s) is/are incorrect'});
    }else{
        //update seller data
        const sellers = collection(db , "sellers");
        setDoc(doc(sellers,email),req.body)
        .then(data=>{
            const users = collection(db, "users");
            updateDoc(doc(users,email),{
                seller: true
            })
            .then(data=>{
                res.json({'seller':true})
            })
        })
     }

})

//get all products
app.get('/get-all-products',(req,res)=>{
    res.sendFile("all-products.html",{root:'public'})
})

app.post('/get-all-products',(req,res)=>{
    // let {email,id,tag} = req.body
    let products = collection(db,"products");
    let docRef;
    
    docRef = getDocs(query(products))
    

    docRef.then(products =>{
        if(products.empty){
            return res.json('no products');
        }
        let productArr = []
        
        products.forEach(item =>{
            let data = item.data();
            data.id = item.id;
            productArr.push(data);
        })
    
        
        res.json(productArr);
    })
})


app.post('/get-products',(req,res)=>{
    let {email,id,tag} = req.body
    let products = collection(db,"products");
    let docRef;
    if(id)
    {
        docRef = getDoc(doc(products,id));
    }
    else if(tag){
        docRef = getDocs(query(products,where("tags","array-contains",tag)))
    }
    else{
        docRef = getDocs(query(products,where("email","==",email)))
    }
    

    docRef.then(products =>{
        if(products.empty){
            return res.json('no products');
        }
        let productArr = []
        if(id)
        {
            return res.json(products.data());
        }
        else{
            products.forEach(item =>{
                let data = item.data();
                data.id = item.id;
                productArr.push(data);
            })
        }
        
        res.json(productArr);
    })
})

app.post('/delete-product',(req,res)=>{
    let {id} = req.body;
    deleteDoc(doc(collection(db,"products"),id))
    .then(data =>{
        res.json('success');
    }).catch(err =>{
        res.json('err');
    })
})

app.get('/products/:id',(req,res)=>{
    res.sendFile("product.html",{root:"public"})
})

app.get('/search/:key',(req,res)=>{
    res.sendFile("search.html",{root:"public"})
})


app.post('/add-review',(req,res)=>{
    let {headline,review,rate,email,product}=req.body;
    if(!headline.length || !review.length || rate == 0 || email == null || !product){
        return res.json({'alert':'Fill all the inputs'});
    }
    let reviews = collection(db, "reviews");
    let docName = `review-${email}-${product}`;

    setDoc(doc(reviews, docName), req.body)
    .then(data => {
        return res.json('review')
    }).catch(err => {
        console.log(err)
        res.json({'alert': 'some err occured'})
    });
})

app.post('/get-reviews', (req, res) => {
    let { product, email } = req.body;

    let reviews = collection(db, "reviews");

    getDocs(query(reviews, where("product", "==", product)), limit(4))
    .then(review => {
        let reviewArr = [];

        if(review.empty){
            return res.json(reviewArr);
        }

        let userEmail = false;

        review.forEach((item, i) => {
            let reivewEmail = item.data().email;
            if(reivewEmail == email){
                userEmail = true;
            }
            reviewArr.push(item.data())
        })

        if(!userEmail){
            getDoc(doc(reviews, `review-${email}-${product}`))
            .then(data => reviewArr.push(data.data()))
        }

        return res.json(reviewArr);
    })
})


app.get('/cart', (req, res) => {
    res.sendFile("cart.html", { root : "public" })
})

app.get('/checkout',(req,res)=>{
    res.sendFile("checkout.html",{root:"public"});
})

let stripeGateway = stripe(process.env.stripe_key);
let DOMAIN = process.env.DOMAIN;


app.post('/stipe-checkout', async(req,res)=>{
    // const customer = await stripeGateway.customers.create({
    //     email: 'puru@gmail.com',
    //     name: 'puru',
    //   });
    const session = await stripeGateway.checkout.sessions.create({
        payment_method_types: ["card"],
        mode:"payment",
        success_url:`${DOMAIN}/success?session_id={CHECKOUT_SESSION_ID}&orders=${JSON.stringify(req.body)}`,
        cancel_url:`${DOMAIN}/checkout?payment_fail=true`,
        customer_creation:'always',
        line_items: req.body.items.map(item =>{
            return{
                price_data:{
                    currency:'inr',
                    product_data:{
                        name:item.name,
                        description:item.shortDes,
                        images:[item.image]
                    },
                    unit_amount:item.price * 100
                },
                quantity:item.item
                
            }
        })
    })
    res.json(session.url)
})



app.get('/success',async(req,res)=>{
    let {session_id, orders}=req.query;

    try{
        let order = orders+'"}]}';
        // console.log(order);
        const session = await stripeGateway.checkout.sessions.retrieve(session_id);
        const customer = await stripeGateway.customers.retrieve(session.customer);

       // console.log(customer);
        let date = new Date();
        let orders_collection = collection(db,"orders-detail");
        let docName = `${customer.email}-order-${date.getTime()}`;
        setDoc(doc(orders_collection,docName),JSON.parse(order))
        .then(data =>{
            res.redirect('/checkout?payment=done')
        })
    }catch(err){
        res.redirect("/404");
        console.log(err);
        // res.redirect("/checkout?payment=done");
    }
})






//404 route
app.get('/404',(req,res)=>{
    res.sendFile("404.html",{root : "public"})
})
app.use((req,res)=>{
    res.redirect('/404')
})



app.listen(5501,()=>{
    console.log('Server is running on port 5501')
})