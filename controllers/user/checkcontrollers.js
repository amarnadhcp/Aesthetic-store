const usermodel = require('../../models/usermodel')
const couponmodel = require("../../models/couponmodel")



const checkshow = async (req, res) => {
    try {
        
        const id = req.session.user._id

        const userdata = await usermodel.findOne({ _id: id }).populate("cart.product")

       
        if (userdata.cart.length !== 0) {
            res.render("checkout", { userData: userdata })
        }else{
            res.redirect('/cart')
        }

    } catch (error) {
        console.log(error.message);

    }
}





const couponApplying = async (req, res) => {
    try {
        const id = req.session.user._id
        const code = req.body.code
        const carttotal = req.body.carttotal
       
        const coupondata = await couponmodel.findOne({ code: code })
        const userused = await couponmodel.findOne({ code: code, userused: { $in: [id] }} )

        if (coupondata) {
            currentDate = Date.now()
            if (userused) {
                //already used 
                res.json({ used: true });
            } else {
                if (currentDate <= coupondata.expirydate) {
                    if (coupondata.minPurchaseAmount <= carttotal) {
                        let discountAmount = carttotal * (coupondata.percentage / 100)
                        if (discountAmount <= coupondata.maxdiscount) {
                            let discountValue = discountAmount;
                            let newvalue = carttotal - discountValue
                            res.json({success: true, value: newvalue, discountValue: discountValue, code: code });
                        } else {
                            // Return a response indicating the order total is not sufficient to use the coupon
                            // res.json({ amountnokay: true });
                            let discountValue = coupondata.maxdiscount;
                            let newvalue = carttotal - discountValue
                            res.json({success: true, value: newvalue, discountValue: discountValue, code: code });
                        }
                    } else {
                        // Return a response indicating the order total is not sufficient to use the coupon
                        res.json({ lessamount: true });
                    }
                } else {
                    // Return a response indicating the coupon has expired
                    res.json({expired: true });
                }
            }
        } else {
            // coupon is invalid
            res.json({ invalid: true });
        }
    } catch (error) {
        console.log(error.message);
    }
}










module.exports = {
    checkshow,
    couponApplying,
   


}