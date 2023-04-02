const category=require('../../models/categorymodel')


///category showing
const loadcategory = async(req,res)=>{
    try{
        const categorydata = await category.find({})
        res.render('category',{categorydata:categorydata})
    }
    catch(error){
        console.log(error.message)
    }
}


//  category adding
const addcategory = async (req,res)=>{
    try{
        res.render('addcategory')
    }
    catch(error){
        console.log(error.message)
    }
}


const newcategory = async (req,res)=>{
    try{

        let bodyData =req.body.latestcategory
        bodyData=bodyData.trim()
        let capData = bodyData.toUpperCase()
        let description = req.body.latestdescription

        const allData = await category.findOne({category:capData})
        if(allData){
           res.render('addcategory',{message:"this catgeory alreafy exits"})
        }else if(bodyData=="" || description==""  ){
                res.render("addcategory",{message:"all fields are required"})
        }else{

        const Data = category({category:capData,description:description})

        const result = await Data.save()
        if(result){
            console.log("category saved succesfully")
            res.redirect('/admin/category')

        }
    }
 
    }catch(error){
        console.log(error.message)
    }

}


const editcategory =async (req,res)=>{
   try{
    const id = req.params.id
    const categoryData = await category.findOne({_id:id})

      res.render('editcategory',{categoryData:categoryData})
   }catch(error){
    console.log(error.message)
   }
}



const editingdata = async (req, res) => {
    try {
        let bodyData = req.body.latestcategory;
        bodyData = bodyData.trim();
        let capData = bodyData.toUpperCase();
        let description = req.body.latestdescription;
        let id = req.params.id;

        let collectedData = await category.findById({ _id: id });

        let allCategory = await category.findOne({ category: capData });

        if (!bodyData || bodyData.length === 0 || !description || description.length === 0) {
            res.render('editCategory', { message: "All Fields Are Required", categoryData: collectedData });
        } else if (collectedData.category == capData) {
            if (collectedData.description == description) {
                res.render('editCategory', { message: "No changes made", categoryData: collectedData });
            } else {
                await category.updateOne({ _id: id }, { $set: { category: capData, description: description } });
                res.redirect('/admin/category');
            }
        } else if (allCategory) {
            res.render('editCategory', { message: "Category already exists", categoryData: collectedData });
        } else {
            await category.updateOne({ _id: id }, { $set: { category: capData, description: description } });
            res.redirect('/admin/category');
        }
    } catch (error) {
        console.log(error.message);
    }
}


const deletecategory =async(req,res)=>{
    try{

       let id = req.params.id
        await category.deleteOne({_id:id})
        res.redirect("/admin/category")
       
    }
    catch(error){
        console.log(error.message);
    }
}


module.exports = {
    
    loadcategory,
    addcategory,
    newcategory,
    editcategory,
    editingdata,
    deletecategory

}
