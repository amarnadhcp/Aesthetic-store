const bannermodel = require('../../models/bannermodel')
const path = require('path')


const bannershow = async (req, res) => {
  try {
    const newbannerdata = await bannermodel.find()
    res.render("banner", { bannerdata: newbannerdata })
  } catch (error) {
    console.log(error.message);
  }

}


const addbannershow = async (req, res) => {
  try {
    res.render('addbanner')
  } catch (error) {
    console.log(error.message);
  }

}


//   const addingbanner = async (req,res,next)=>{
//     try{
//           formdescription =req.body.description.trim()
//          newdescription = formdescription
//          Bimg = req.file.filename

//          const banner = new bannermodel({
//             description:newdescription,
//             bannerimg:Bimg 
//          })

//          const newbanner = await banner.save()

//          if(newbanner){
//             res.redirect('/admin/banner')
//          }else{
//             res.render('addbanner',{message:"action failed"})
//          }

//     }catch(error){
//         next(error);
//     }


//   }


const addingbanner = async (req, res, next) => {
  try {
    const newdescription = req.body.description.trim()
    const Bimg = req.file.filename;

    if (!newdescription) {
      return res.render('addbanner', { message: 'Description cannot be empty' });
    }

    const banner = new bannermodel({
      description: newdescription,
      bannerimg: Bimg,
    });

    const newbanner = await banner.save();

    if (newbanner) {
      res.redirect('/admin/banner');
    } else {
      res.render('addbanner', { message: 'Action failed' });
    }
  } catch (error) {
    next(error);
  }
};



const deletebanner = async (req, res) => {
  try {

    const id = req.params.id
    await bannermodel.deleteOne({ _id: id })
    res.redirect("/admin/banner")

  } catch (error) {
    console.log(error.message);
  }
}


// const editshow =async(req,res)=>{

//   try{
//     const id = req.params.id
//     const bannerData =await bannermodel.findOne({_id:id})

//     res.render("editbanner",{bannerdata:bannerData})

//   }catch(error){
//     console.log(error.message)
//   }
// }
// const updatebanner =async(req,res)=>{
//   try{
//     const id = req.params._id
//      formdescription = req.body.description
//     newdescription =  formdescription 
//     newimage = req.file.filename
//     if (!newdescription) {
//       return res.render('editbanner', { message: 'Description cannot be empty' });
//     }else{
//       const updated = await bannermodel.updateOne({_id:id},{$set:{ description:newdescription ,bannerimg:newimage }})
//     }
//   }catch(error){
//     console.log(error.message);
//   }
// }


module.exports = {
  bannershow,
  addbannershow,
  addingbanner,
  deletebanner,


}