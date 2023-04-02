const couponmodel = require("../../models/couponmodel")


const couponshow = async(req,res)=>{

    try {

    coupondata = await couponmodel.find({})    
    res.render("allcoupon",{couponData:coupondata})


    } catch (error) {
        console.log(error.message);
        
    }
}


const newcouponshow = async(req,res)=>{
    try {
        res.render("addcoupon")
        
    } catch (error) {
        console.log(error.message);
        
    }

}


const addcoupon= async(req,res)=>{
    try {
        const existingCoupon = await couponmodel.findOne({ code: req.body.code });
        if (existingCoupon) {
            res.render("addcoupon",{message:"Coupon code already exists."});
        } else if(req.body.code.trim()=="" || req.body.minPurchaseAmount.trim()=="" ||req.body.maxdiscount.trim()=="" ||req.body.percentage.trim()=="" || req.body.expirydate.trim()==""  ){
            res.render("addcoupon",{message:"All fields are required."});
        } else {
            const coupon =  new couponmodel({
                code:req.body.code,
                minPurchaseAmount:req.body.minPurchaseAmount,
                maxdiscount:req.body.maxdiscount,
                percentage:req.body.percentage,
                expirydate:req.body.expirydate,
            }) 
            const newcoupon = await coupon.save()
            res.redirect("/admin/coupon")
        }
    } catch(error) {
        console.log(error.message);
    }
}


const deletecoupon  = async(req,res)=>{
    try {

      const id = req.params.id
      const deleted = await couponmodel.deleteOne({_id:id})
      res.redirect("/admin/coupon")
        
    } catch (error) {
      console.log(error.message);
    }
}


module.exports={
    couponshow,
    newcouponshow ,
    addcoupon,
    deletecoupon
    
}