const usermodel = require('../../models/usermodel')
const productmodel = require('../../models/productmodel')

const showcart =async(req,res)=>{
  try{

    const id = req.session.user._id
    const userdata = await usermodel.findOne({_id:id}).populate('cart.product')
    res.render('cart',{userData:userdata})

  }catch(error){
    
    console.log(error.message);
  }

}


const Qtychange = async(req,res)=>{
  
  try{
      if(req.session.user){
      
        const id = req.session.user._id
        const price = req.body.price

        const proid = req.body.productid
        const count = req.body.count
        productData = await productmodel.findOne({_id:proid})
        //qty increment and decrement
        const Qtyupdating = await usermodel.updateOne({_id:id , 'cart.product':proid},{$inc:{'cart.$.quantity':count}})
        //updating price
        const currentqty = await usermodel.findOne({_id:id,'cart.product':proid},{_id:0 ,'cart.quantity.$':1})
   
        const totalprice = price * currentqty.cart[0].quantity
        const updatingprice = await usermodel.updateOne({_id:id,'cart.product':proid},{$set:{'cart.$.prdtotalprice':totalprice}})
        //grand total
        const cart = await usermodel.findOne({_id:id}).populate('cart.product').exec()
        let sum= 0
        for(let i = 0; i<cart.cart.length; i++){
          sum =sum+cart.cart[i].prdtotalprice
        }
        const carttotalprice = await usermodel.updateOne({_id:id},{$set:{carttotalprice:sum}})


        res.json({success:true, totalprice , sum})
      }

  }catch(error){
    console.log(error.message);
  }

}



const deletecart = async(req,res)=>{
  try{
   const id = req.session.user._id
   const proid = req.body.productId

   const found = await usermodel.updateOne({_id:id},{$pull:{cart:{product:proid}}})
  
   if(found){
    res.json({success:true})

    const cart = await usermodel.findOne({_id:id}).populate('cart.product').exec()
        let sum= 0
        for(let i = 0; i<cart.cart.length; i++){
          sum =sum+cart.cart[i].prdtotalprice
        }
        const carttotalprice = await usermodel.updateOne({_id:id},{$set:{carttotalprice:sum}})
      }
  }catch(error){
    console.log(error.message);
  }
  
}


module.exports={
    showcart,
    Qtychange,
    deletecart,
  
}