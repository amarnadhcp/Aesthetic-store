const usermodel = require('../../models/usermodel')
const bcrypt = require('bcrypt')
const productschema = require('../../models/productmodel')
const bannermodel = require('../../models/bannermodel');
const ordermodel = require('../../models/ordermodel');
const categorymodel = require('../../models/categorymodel');
const productmodel = require('../../models/productmodel');



require('dotenv').config();
const accountsid = process.env.TWILIO_ACCOUNT_SID;
const authtoken = process.env.TWILIO_AUTH_TOKEN;
const client = require("twilio")(accountsid, authtoken);





const loadhomepage = async (req, res) => {

  try {

    const productdata = await productschema.find({}).populate('category')
    const newbannerdata = await bannermodel.find({})


    if (productdata) {
      if (req.session.user) {
        session = req.session.user._id
        userdata = await usermodel.findOne({ _id: session })
        res.render('userhome', { productData: productdata, userData: userdata, bannerdata: newbannerdata })
      } else {
        res.render('userhome', { productData: productdata, bannerdata: newbannerdata })

      }
    }


  } catch (error) {
    console.log(error.message);
  }
}



const loadloginpage = async (req, res) => {

  try {
    res.render('userlogin')

  } catch (error) {
    console.log(error.message);
  }
}

const loaduserpage = async (req, res) => {

  try {
    res.render('usersignup')
  } catch (error) {
    console.log(error.message);
  }
}


// sign code to save datas to database and also checking wether there is same content in the data base and null check
const signupverification = async (req, res, next) => {

  req.session.user = req.body
  form_username = req.body.username
  const found = await usermodel.findOne({ username: form_username })

  if (found) {

    res.render('usersignup', { message: "This username already exists, try another name" })
  }
  else if (req.body.firstname == "" || req.body.lastname == "" || req.body.username == "" || req.body.phonenumber == "" || req.body.email == "" || req.body.password == "") {

    res.render('usersignup', { message: "All fields required" })
  } else {
    mobile = req.body.phonenumber
    try {
      const otpResponse = await client.verify.v2
        .services('VAd5d84a0436f4325d4c4e92e275d40e25')
        .verifications.create({
          to: `+91${mobile}`,
          channel: 'sms'
        })
      res.render('otppage')

    } catch (error) {
      next(error);
    }
  }

}


//verifying otp
const verifyOtp = async (req, res, next) => {
  const otp = req.body.otp;
  try {
    req.session.user
    const details = req.session.user;

    const verifiedResponse = await client.verify.v2
      .services('VAd5d84a0436f4325d4c4e92e275d40e25')
      .verificationChecks.create({
        to: `+91${details.phonenumber}`,
        code: otp,
      })
    console.log('details' + details)
    if (verifiedResponse.status === 'approved') {
      details.password = await bcrypt.hash(details.password, 10)
      const userdata = new usermodel({
        firstname: details.firstname,
        lastname: details.lastname,
        email: details.email,
        username: details.username,
        password: details.password,
        mobilenumber: details.phonenumber

      })
      const userData = await userdata.save();
      req.session.user = userData
      if (userData) {
        res.redirect('/');
      } else {
        res.render('otppage', { message: "wrong otp" })
      }

    } else {
      res.render('otppage', { message: "wrong otp" })
    }
  } catch (error) {
    next(error);
  }
}



//login verfiction of user 
const loginverification = async (req, res) => {
  try {

    if (!req.body.email || !req.body.password) {
      return res.render("userlogin", { message: "All fields are required" });
    }

    const user = await usermodel.findOne({ email: req.body.email });
    if (!user) {
      return res.render("userlogin", { message: "Invalid email or password" });
    }

    if (!user.status) {
      return res.render("userlogin", { message: "You have been blocked" });
    }


    const passwordMatch = await bcrypt.compare(req.body.password, user.password);
    if (!passwordMatch) {
      return res.render("userlogin", { message: "Invalid email or password" });
    }

    req.session.user = user;
    return res.redirect("/");
  } catch (error) {
    console.error(error.message);
    return res.render("userlogin", { message: "An error occurred" });
  }
};






const logout = async (req, res) => {

  try {
    req.session.user = null
    // const productdata = await productschema.find({}).populate('category')
    // res.render('userhome',{productData:productdata})
    res.redirect('/')

  } catch (error) {
    console.log(error.message);
  }


}


//////////////////////////   view page showing of products /////////////////////////////////////// 
const viewproduct = async (req, res) => {

  try {
    if (req.session.user) {
      const id = req.params.id
      const userdata = req.session.user
      const data = await productschema.findOne({ _id: id })
      res.render("productview", { Data: data, userData: userdata })
    } else {

      const id = req.params.id

      const data = await productschema.findOne({ _id: id })
      res.render("productview", { Data: data })
    }
  } catch (error) {
    console.log(error.message);
  }
}



const allproduct = async (req, res) => {
  try {

    const productdata = await productschema.find({}).populate("category")

    if (req.session.user) {
      
      const userdata = req.session.user
      res.render("allproducts", { userData: userdata, productData: productdata })
    } else {
      res.render("allproducts", { productData: productdata })
    }

  } catch (error) {
    console.log(error.message);
  }
}




const categoryWiseFilter = async (req, res) => {
  try {
    const category = req.params.id
    const filterddata = await productschema.find({ category: category })
    const categoryname = await categorymodel.findOne({_id:category})

    if (req.session.user) {
      const userdata = req.session.user
      res.render('categoryproduct', { FilterdData: filterddata, userData: userdata, categoryname })

    } else {

      res.render('categoryproduct', { FilterdData: filterddata,categoryname })

    }

  } catch (error) {
    console.log(error.message);

  }
}







// profile showing of user
const profileshow = async (req, res) => {
  try {
    const id = req.session.user._id
    const userdata = await usermodel.findOne({ _id: id })
    res.render('userprofile', { userData: userdata })

  } catch (error) {
    console.log(error.message);
  }

}




const alladdress = async (req, res) => {
  try {

    if (req.session.user) {
      const id = req.session.user._id
      const userdata = await usermodel.findOne({ _id: id })
      res.render("viewaddress", { userData: userdata })
    }

  } catch (error) {
    console.log(error.message);
  }

}


const deleteaddress = async (req, res) => {
  try {
    if (req.session.user) {
      console.log(req.body);
      const AddressId = req.body.AddressId
      const id = req.session.user._id
      console.log(AddressId);

      const deleted = await usermodel.updateOne({ _id: id }, { $pull: { address: { _id: AddressId } } })

      if (deleted) {
        res.json({ success: true })

      }

    }

  } catch (error) {
    console.log(error.message);
  }
}


const editaddress = async (req, res) => {
  try {
    if (req.session.user) {

      if (req.body.country.trim() == "" || req.body.state.trim() == "" || req.body.district.trim() == "" || req.body.pincode.trim() == "" || req.body.housename.trim() == "" || req.body.phone.trim() == "" || req.body.street.trim() == "") {

        res.redirect("/viewaddress")

      } else {

        const id = req.session.user._id;
        const addressId = req.params.id;
        console.log(addressId);
        const update = await usermodel.updateOne(
          { _id: id, "address._id": addressId },
          {
            $set: {
              "address.$": {
                housename: req.body.housename,
                street: req.body.street,
                district: req.body.district,
                state: req.body.state,
                pincode: req.body.pincode,
                country: req.body.country,
                phone: req.body.phone,
              },
            },
          }
        );
        console.log(update);
        res.redirect("/viewaddress");
      }
    } else {
      res.redirect('/')
    }
  } catch (error) {
    console.log(error.message);
  }
};




const vieworders = async (req, res) => {
  try {
    id = req.session.user._id
    const userdata = await usermodel.findOne({ _id: id })
    const orderdata = await ordermodel.find({ userId: id }).populate("product.productId").sort({ _id: -1 });
    res.render("orders", { userData: userdata, orderData: orderdata })

  } catch (error) {
    console.log(error.message);
  }


}




const addAddress = async (req, res) => {
  try {

    if (req.body.country.trim() == "" || req.body.state.trim() == "" || req.body.district.trim() == "" || req.body.pincode.trim() == "" || req.body.housename.trim() == "" || req.body.phone.trim() == "" || req.body.street.trim() == "") {

      //do nothing
      console.log("do nothing");

    } else {

      const addresdata = await usermodel.updateOne({ _id: req.session.user._id }, {
        $push: {
          address: {

            country: req.body.country,
            state: req.body.state,
            district: req.body.district,
            pincode: req.body.pincode,
            housename: req.body.housename,
            phone: req.body.phone,
            street: req.body.street

          }
        }
      })

    }

  } catch (error) {
    console.log(error.message);
  }

}



const walletHistory = async (req, res) => {

  try {
    const id = req.session.user._id
    const  userdata = await usermodel.findOne({_id:id})
    const orderdata = await ordermodel.find({userId : id}).sort({date:-1})
    res.render('wallet',{orderData:orderdata , userData : userdata})

  } catch (error) {
    console.log(error.message);

  }

}







module.exports = {
  loadhomepage,
  loadloginpage,
  loaduserpage,
  signupverification,
  loginverification,
  logout,
  verifyOtp,
  viewproduct,
  allproduct,
  categoryWiseFilter,
  profileshow,
  alladdress,
  deleteaddress,
  editaddress,
  vieworders,
  addAddress,
  walletHistory



}