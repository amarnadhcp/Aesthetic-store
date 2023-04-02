
const productschema = require('../../models/productmodel')
const category=require('../../models/categorymodel')
const path = require('path')

const fs=require('fs')
const { updatedata } = require('./admincontroller')


const allproduct = async(req,res,next)=>{
  try{
       const Data = await productschema.find({}).populate('category')
       const refcategory = await productschema.find({}).populate('category')
      
       res.render("allproducts",{productdata : Data , refdata :refcategory})
  }catch(error){
   next(error)
  }
}



const productadding =async(req,res,next)=>{
  
   if (req.body.form_product.trim()==""|| req.body.form_category.trim()==""  || req.body.form_description.trim()=="" || req.body.form_stock.trim()=="" || req.body.form_price.trim()=="" ){

     const categorydata=  await category.find({})

     res.render('addproducts',{categorydata:categorydata, message:"all fields are required"})
   }
   else{

    try{
        const image =[];
        for(file of req.files){
            image.push(file.filename);
       
        }
        for (var i=0;i<req.files.length;i++){
            image[i] = req.files[i].filename
        }

        const product = new productschema ({
            name:req.body.form_product,
            price:req.body.form_price,
            description:req.body.form_description,
            image:image,
            category:req.body.form_category,
            stock:req.body.form_stock,
            status:req.body.form_status
        });

        const productData = await product.save();

        if(productData){
            res.redirect('/admin/allproducts')
        }else{
            res.render("addproducts",{message:"action failed"})
        }

    }catch(error){

      next(error);

   }
   }
}


const productshow = async (req,res)=>{
    try{
      const CategoryData = await  category.find({})
      
        res.render('addproducts',{categorydata:CategoryData})

}catch(error){
    console.log(error.message);
}
} 


const deleteproduct = async(req,res)=>{
  try{
    const id =req.params.id
      
    await   productschema.deleteOne({_id:id})
    res.redirect("/admin/allproducts")

  }catch(error){
    console.log(error.message)
  }         

}


const editproductshow =async(req,res)=>{
   try{
     const id = req.params.id
     const productData = await productschema.findOne({_id:id}).populate('category')
     
      const categoryData = await category.find()
    

      res. render('editproduct',{productdata:productData ,categorydata:categoryData })
     
    }catch(error){
    console.log(error.message);
  }
}


const  editingproduct = async(req,res)=>{

  if (req.body.form_product.trim()=== "" || req.body.form_category.trim() === "" || req.body.form_description.trim() === "" || req.body.form_stock.trim() === "" || req.body.form_price.trim() === "" ) {
    const id = req.params.id
    const productData = await productschema.findOne({_id:id}).populate('category')
    const categoryData = await category.find()

   res.render('editproduct',{productdata: productData, message:"All fields required",categorydata:categoryData})
}else{

  try{
        const arrayimg = []
        for(file of req.files){
          arrayimg.push(file.filename)
        }
        if(arrayimg !=""){
          const id = req.params.id
         
         const ask =  await productschema.updateOne({_id:id},{$set:{
            name:req.body.form_product,
            image:arrayimg,
            category:req.body.form_category,
            stock:req.body.form_stock,
            price:req.body.form_price,
            description:req.body.form_description
          }})
         
          res.redirect('/admin/allproducts')
        }
        else{
              const id = req.params.id
          await productschema.updateOne({_id:id},{$set:{
            name:req.body.form_product,
            category:req.body.form_category,
            stock:req.body.form_stock,
            price:req.body.form_price,
            description:req.body.form_description
        }})
        res.redirect('/admin/allproducts')
        }
  }
  catch(error){
     console.log(error.message);
  }

}
}


const deleteimage = async(req,res)=>{
  try{
    const imgid =req.params.imgid
    const prodid =req.params.prodid
    
    fs.unlink(path.join(__dirname,"/productImages/",imgid),()=>{})
    const productimg  = await  productschema.updateOne({_id:prodid},{$pull:{image:imgid}})

    res.redirect('/admin/editproduct/'+prodid)



  }catch(error){
    console.log(error.message)
  }

}


const updateimage = async (req, res) => {

  try {

    const id = req.params.id
    const prodata = await productschema.findOne({ _id: id })
    const imglength = prodata.image.length

    if (imglength <= 3) {
      let images = []
      for (file of req.files) {
        images.push(file.filename)
      }

      if (imglength + images.length <= 3) {

        const updatedata = await productschema.updateOne({ _id: id }, { $addToSet: { image: { $each: images } } })

        res.redirect("/admin/editproduct/" + id)
      } else {

        const productData = await productschema.findOne({ _id: id }).populate('category')
        const categoryData = await category.find()
        res.render('editproduct', { productdata: productData, categorydata: categoryData , imgfull: true})

      }

    } else {
      res.redirect("/admin/editproduct/")
    }

  } catch (error) {
    console.log(error.message);
  }

}


const productstatus = async(req,res)=>{
  try { 
    const id = req.params.id
    const productdata = await productschema.findOne({_id:id})

    if(productdata.status){
    
      await productschema.updateOne({_id:id},{$set:{status:false}})
    }else{
     
      await productschema.updateOne({_id:id},{$set:{status:true}})
    }
    res.redirect("/admin/allproducts")
  } catch (error) {
    console.log(error.message);
  }
}


const viewproduct = async (req, res) => {
  try {
      const id = req.params.id
      const userdata = req.session.user
      const data = await productschema.findOne({ _id: id }).populate('category')
  
      res.render("viewproduct", { Data: data, userData: userdata })
    
  } catch (error) {
    console.log(error.message);
  }
}


module.exports = {

    allproduct,
    productshow,
    productadding,
    deleteproduct,
    editproductshow,
    editingproduct,
    deleteimage ,
    updateimage,
    productstatus,
    viewproduct
   
}