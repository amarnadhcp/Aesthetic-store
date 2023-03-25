const admin = require ('../../models/adminmodel')
const usermodel =require('../../models/usermodel')
const bcrypt =require('bcrypt')
const ordermodel = require('../../models/ordermodel')

const loadlogin = async(req,res)=>{
    try{
    
        res.render('adminlogin')

    }catch (error){
        console.log(error.message);
    }
}
//loginverification
const loginverification = async (req,res)=>{
    try{

        const name= req.body.name
        const password =req.body.password

        const adminData= await admin.findOne({name:name})
    
        if(adminData){
            if(password===adminData.password){
                req.session.admin_id = adminData._id
                res.redirect('/admin/dashboard')
            }else{
                res.render('adminlogin',{message:"password is incorrect"})
            }
        }else if(name=="" && password==""){
            res.render("adminlogin",{message:"email and password require"})
        }else{
            res.render("adminlogin",{message:"Enter a valid username"})
        } 
    }
    catch(error){
         console.log(error.message)
    }
    
}



const logout =async (req,res)=>{
    try{
        req.session.admin_id = null
        res.redirect('/admin')
    }catch(error){
        console.log(error.message);
    }
}


const loaddashboard = async (req,res)=>{
    try{
         
        // total sales 
        const  totalsales = await ordermodel.find({status:"delivered"})
        let sum = 0 
        for(var i=0 ; i<totalsales.length ; i++){
            sum = sum+totalsales[i].total
        }
        // total saless
        const salescount = await ordermodel.find({}).count()

        // category wise data
        // const casuals = await ordermodel.find({},{category:"casuals"}).count()
        // const formal = await ordermodel.find({category:"formal"}).count()
        // const sports = await ordermodel.find({category:"sports"}).count()
        // console.log("formal --"+formal);
        // console.log("cas --"+casuals);
        // console.log("sports ---"+sports);


        //delivery type cash
        const cod = await ordermodel.find({payementType:"COD"}).count()
        const upi = await ordermodel.find({payementType:"UPI"}).count()
        const wallet  = await ordermodel.find({payementType:"WALLET"}).count()

        //bar graphhhhhhhhhhh
        const deliveryCount = await ordermodel.find({status:"delivered"}).count()
        const confirmedCount = await ordermodel.find({status:"confirmed"}).count()
        const cancelledCount = await ordermodel.find({status:"cancelled"}).count()
        const returnedCount = await ordermodel.find({status:"Returned"}).count()
       


        //////sales grpah
        const salesChart = await ordermodel.aggregate([
            {
              $match: {
                status: {
                  $eq: "delivered"
                }
              }
            },
            {
              $group: {
                _id: { $dateToString: { format: "%Y-%m-%d", date: "$date" } },
                sales: { $sum: "$total" },
              }
            },
            {
              $sort: { _id: 1 }
            },
            {
              $limit: 7
            }
          ])
          const date = salesChart.map((item) => {
            return item._id;
          })
          const sales = salesChart.map((item) => {
            return item.sales;
          })

        

    
     


        res.render("adminhome",{
            sum:sum,
            Totalsales:salescount,
            COD:cod,
            UPI:upi,
            WALLET:wallet,
            deliveryCount,
            confirmedCount,
            cancelledCount,
            returnedCount,
            date,
            sales


        })
    }catch(error){
        console.log(error.message)
    }
}



//// sales repot priniting
const SalesReport = async (req, res) => {
    try {

      const from = new Date(req.body.startDate);
      const to = new Date(req.body.endDate);
      if (req.body.startDate === "" || req.body.endDate === "") {
        
      }else{
        
       const sales = await ordermodel.find({status:"delivered", date:{$gte:new Date(req.body.startDate),$lte:new Date(req.body.endDate)}})
       .populate("product.productId")
console.log("sale qty   :",sales.length);
       res.json({success:true,sales})
     
      }
    
     
    } catch (error) {
      console.log(error.message);
      
    }
  };
  

const getReport = async(req,res)=>{
    try {
        const str = req.params.sales
        const sales = JSON.parse(`${str}`); // convert the string to an array of objects using JSON.parse()

        console.log(typeof sales);
        console.log(sales.length);
        console.log(sales);
        res.render("salesReport",{sales})
    } catch (error) {
        console.log(error.message);
        
    }
}


  


const updatedata = async(req,res)=>{
    try{
       const userData = await User.findByIdAndUpdate({_id:req.body.id},{$set:{name:req.body.name,email:req.body.description}}) 
        
        res.redirect('/admin/category')
    }catch(err){
        console.log(err.message)
    
    }
    }


const usersdata = async(req,res)=>{
    try{
        const userdatas = await usermodel.find({})
        res.render('userdata',{userDatas:userdatas})
    }catch(error){
        console.log(error.message);
    }
}






////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


// user status blocking and unblocking


const userAction = async(req,res)=>{
    try{
       const id=req.params.id
        const userdata = await usermodel.findOne({_id:id}) 
         if(userdata.status){
            await usermodel.updateOne({_id:id}, {$set:{status:false}})
             req.session.user = null
         }else{
            await usermodel.updateOne({_id:id},{$set:{status:true}})
         }
         res.redirect("/admin/users")


    }catch(error){
        console.log(error.message);
    }
}


    








module.exports ={
    loadlogin,
    loginverification,
    loaddashboard ,
    SalesReport,
    getReport,
    updatedata ,
    usersdata,
    logout,
    userAction
    
}