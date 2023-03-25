const express = require('express')

const userRoute = express()

const auth =require('../midleware/userauth')

const bodyparser=require('body-parser')
userRoute.use(bodyparser.json())
userRoute.use(bodyparser.urlencoded({extended:true}))


userRoute.set('view engine','ejs')
userRoute.set('views','views/user')

//////////////// all controllers requied///////////////////////////
const usercontroller = require('../controllers/user/usercontroller')
const wishcontroller =require('../controllers/user/wishcontroller')
const cartcontroller =require('../controllers/user/cartcontroller')
const checkoutcontroller = require("../controllers/user/checkcontrollers")
const ordercontroller = require("../controllers/user/ordercontroller")
///////////////////////////////////////////////////////////////////

//beginings
userRoute.get('/',usercontroller.loadhomepage)
userRoute.get('/loginpage',auth.isLogin,usercontroller.loadloginpage)
userRoute.get("/signup",usercontroller.loaduserpage)
userRoute.get("/userlogout",auth.isLogout,usercontroller.logout)


userRoute.post("/signup",usercontroller.signupverification)
userRoute.post('/loginpage',usercontroller.loginverification)
userRoute.post("/verifyotp",usercontroller.verifyOtp)



////productsss
userRoute.get("/allproducts",usercontroller.allproduct)
userRoute.get("/views/:id",usercontroller.viewproduct)
userRoute.get("/categoryshow/:id",usercontroller.categoryWiseFilter)



//profile
userRoute.get("/profile",auth.isLogout,usercontroller.profileshow)
userRoute.get("/viewaddress",auth.isLogout,usercontroller.alladdress)
userRoute.get("/walletHistory",auth.isLogout,usercontroller.walletHistory)
userRoute.get("/vieworders",auth.isLogout,usercontroller.vieworders)
// userRoute.get("/editaddress/:id",usercontroller.editaddress)

userRoute.post("/editaddress/:id",auth.isLogout,usercontroller.editaddress)
userRoute.post("/addingAddress",auth.isLogout,usercontroller.addAddress)
userRoute.post("/deleteaddress",auth.isLogout,usercontroller.deleteaddress)


//wishlist 
userRoute.get('/wishlist',auth.isLogout,wishcontroller.wishlistshow)
userRoute.post('/addtowishlist',auth.isLogout,wishcontroller.addtowishlist)
userRoute.post('/deletewish',auth.isLogout,wishcontroller.deletewish)


//cart 
userRoute.get("/cart",auth.isLogout,cartcontroller.showcart)
userRoute.post("/addtocart",auth.isLogout,wishcontroller.addtocart)
userRoute.post("/changeqty",auth.isLogout,cartcontroller.Qtychange)
userRoute.post("/deletecart",auth.isLogout,cartcontroller.deletecart)


//checkout
userRoute.get("/checkout",auth.isLogout,checkoutcontroller.checkshow)
userRoute.post("/applycoupon",auth.isLogout,checkoutcontroller.couponApplying)




///ordersssss
userRoute.post("/placeorder",auth.isLogout,ordercontroller.placeorder)
userRoute.post('/verify-payment',ordercontroller.PaymentVerified)
userRoute.get("/ordersuccess",auth.isLogout,ordercontroller.successhow)

userRoute.post("/cancelorder",auth.isLogout,ordercontroller.CancelOrder)
userRoute.post("/returnorder",auth.isLogout,ordercontroller.returnOrder)



userRoute.use(function(req,res,next){
    res.render('404')
})


module.exports =userRoute