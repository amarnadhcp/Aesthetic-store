const express=require('express')
const adminRoute=express();
const auth =require('../midleware/auth')

const bodyparser=require('body-parser')
adminRoute.use(bodyparser.json())
adminRoute.use(bodyparser.urlencoded({extended:true}))


//view engine
adminRoute.set('view engine','ejs')
adminRoute.set('views','views/admin')

// all controllers requiring
const admincontroller = require('../controllers/admin/admincontroller')
const categorycontroller= require('../controllers/admin/categorycontroller')
const productcontroller = require("../controllers/admin/productcontroller");
const bannercontroller =require('../controllers/admin/bannercontroller')
const ordercontroller = require("../controllers/admin/ordercontrollers")
const couponcontroller = require("../controllers/admin/couponcontroller")


const path = require('path')

// multer
const multer= require('multer');
// const { ISLOGOUT } = require('../midleware/auth');
const storage= multer.diskStorage({
  destination: function(req,file,cb){
      cb(null,path.join(__dirname,'../public/productImages'))
  },
  filename:function(req,file,cb){
      const name = Date.now()+'-'+file.originalname;
      cb(null,name)
  }
})
const upload = multer({storage:storage})


//adminroutes
adminRoute.get('/',auth.isLogout,admincontroller.loadlogin)
adminRoute.get("/dashboard",auth.isLogin,admincontroller.loaddashboard)
adminRoute.post("/",admincontroller. loginverification)
adminRoute.get('/logout',admincontroller.logout)


 ///dashboard
 adminRoute.post("/salesReport",auth.isLogin,admincontroller.SalesReport)

adminRoute.get("/category",auth.isLogin,categorycontroller.loadcategory)
adminRoute.get("/addcategory",auth.isLogin,categorycontroller.addcategory)
adminRoute.get("/category/editcategory/:id",auth.isLogin,categorycontroller.editcategory)
adminRoute.get('/category/delete/:id',auth.isLogin,categorycontroller.deletecategory)

adminRoute.get('/allproducts',auth.isLogin,productcontroller.allproduct)
adminRoute.get("/addproducts",auth.isLogin,productcontroller.productshow)
adminRoute.get("/deleteproduct/:id",auth.isLogin,productcontroller.deleteproduct)

adminRoute.get('/editproduct/:id',auth.isLogin,productcontroller.editproductshow)
adminRoute.get('/users',auth.isLogin,admincontroller.usersdata)
adminRoute.get('/useractive/:id',admincontroller.userAction)
adminRoute.get('/deleteimg/:imgid/:prodid',auth.isLogin,productcontroller.deleteimage)




adminRoute.post("/category/addcategory",categorycontroller.newcategory)
adminRoute.post("/category/editcategory/:id",categorycontroller.editingdata)


//products
adminRoute.post("/addproducts",upload.array('image'),productcontroller.productadding)
adminRoute.post('/editproduct/:id',upload.array('image'),productcontroller.editingproduct)
adminRoute.post("/editproducts/updateimage/:id",upload.array('image'),productcontroller.updateimage)
//list and unlist 
adminRoute.get("/statusupdation/:id",auth.isLogin,productcontroller.productstatus)
//productdetials
adminRoute.get("/adminproductdetails/:id",auth.isLogin,productcontroller.viewproduct)




//banner routes
adminRoute.get('/banner',auth.isLogin,bannercontroller.bannershow)
adminRoute.get("/banner/addbanner",auth.isLogin,bannercontroller.addbannershow)
adminRoute.post("/banner/addbanner",upload.single('image'),bannercontroller.addingbanner)
adminRoute.get("/deletebanner/:id",auth.isLogin,bannercontroller.deletebanner)
// adminRoute.get("/editbanner/:id",auth.isLogin,bannercontroller.editshow)
// adminRoute.post("/editbanner/:id",bannercontroller.updatebanner)



//orderssss
adminRoute.get("/orders",auth.isLogin,ordercontroller.userordershow)
adminRoute.get("/orderdetails/:id",auth.isLogin,ordercontroller.orderdetails)



///coupon
adminRoute.get("/coupon",auth.isLogin,couponcontroller.couponshow)
adminRoute.get("/coupon/addcoupon",auth.isLogin,couponcontroller.newcouponshow)
adminRoute.post("/coupon/addcoupon",couponcontroller.addcoupon)
adminRoute.get("/deletecoupon/:id",auth.isLogin,couponcontroller.deletecoupon)


////status updation 
 adminRoute.post("/statusupdation",auth.isLogin,ordercontroller.statusUpdation)


 adminRoute.use(function(req,res,next){
  res.render('404')
})


module.exports = adminRoute 