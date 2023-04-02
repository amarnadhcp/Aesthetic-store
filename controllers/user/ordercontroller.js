const ordermodel = require("../../models/ordermodel")
const usermodel = require("../../models/usermodel")
const categorymodel = require("../../models/categorymodel")
const productmodel = require("../../models/productmodel")
const couponmodel = require('../../models/couponmodel')
const { v4: uuidv4 } = require("uuid")
const Razorpay = require('razorpay')
const crypto = require('crypto')

require('dotenv').config()
var instance = new Razorpay({
    key_id: process.env.KEY_ID,
    key_secret: process.env.KEY_SECRET
});




const placeorder = async (req, res) => {

    try {
        const method = req.body.paymentoption

        if (method == "COD") {

            if (req.body.selectedAddress == null) {
                res.json({ addrequired: true })
            } else {

                const id = req.session.user._id
                //    const userdata = usermodel.findOne({_id:id}).populate("cart.populate")
                //    const categorydata = categorymodel.find({})
                const productpush = []
                const orderdata = req.body
                orderdata.product = productpush

                // converting to array
                if (!Array.isArray(orderdata.productId)) {
                    orderdata.productId = [orderdata.productId]
                }
                if (!Array.isArray(orderdata.quantity)) {
                    orderdata.quantity = [orderdata.quantity]
                }
                if (!Array.isArray(orderdata.singleTotal)) {
                    orderdata.singleTotal = [orderdata.singleTotal]
                }
                if (!Array.isArray(orderdata.sprice)) {
                    orderdata.sprice = [orderdata.sprice]
                }

                for (let i = 0; i < orderdata.productId.length; i++) {
                    let productsId = orderdata.productId[i]
                    let quantitys = orderdata.quantity[i]
                    let singleTotals = orderdata.singleTotal[i]
                    let sprices = orderdata.sprice[i]
                    productpush.push({ productId: productsId, quantity: quantitys, singleTotal: singleTotals, sprice: sprices })
                }


                const order = new ordermodel({
                    userId: req.session.user._id,
                    deliveryAddress: req.body.selectedAddress,
                    product: orderdata.product,
                    total: req.body.total,
                    payementType: req.body.paymentoption,
                    status: "confirmed",
                    orderId: `oderId_${uuidv4()}`,
                    date: Date.now()

                })

                const neworderdata = await order.save()

                //coupon appliyin
                const discount = await couponmodel.updateOne({ code: req.body.code }, { $push: { userused: id } })

                res.json({ success: true })
            }
        }
        else if (method == "UPI") {


            const id = req.session.user._id
            const productpush = []
            const orderdata = req.body

            if (req.body.selectedAddress == null) {
                res.json({ addrequired: true })
            } else {



                // converting to array
                if (!Array.isArray(orderdata.productId)) {
                    orderdata.productId = [orderdata.productId]
                }
                if (!Array.isArray(orderdata.quantity)) {
                    orderdata.quantity = [orderdata.quantity]
                }
                if (!Array.isArray(orderdata.singleTotal)) {
                    orderdata.singleTotal = [orderdata.singleTotal]
                }
                if (!Array.isArray(orderdata.sprice)) {
                    orderdata.sprice = [orderdata.sprice]
                }

                for (let i = 0; i < orderdata.productId.length; i++) {
                    let productsId = orderdata.productId[i]
                    let quantitys = orderdata.quantity[i]
                    let singleTotals = orderdata.singleTotal[i]
                    let sprices = orderdata.sprice[i]
                    productpush.push({ productId: productsId, quantity: quantitys, singleTotal: singleTotals, sprice: sprices })
                }

                //status updating


                const order = new ordermodel({
                    userId: req.session.user._id,
                    deliveryAddress: req.body.selectedAddress,
                    product: productpush,
                    total: req.body.total,
                    payementType: req.body.paymentoption,
                    status: "Payment failed",
                    orderId: `oderId_${uuidv4()}`,
                    date: Date.now()


                })

                await couponmodel.updateOne({ code: req.body.code }, { $push: { userused: id } })
                const neworderdata = await order.save()


                const latestOrder = await ordermodel.findOne({}).sort({ date: -1 }).lean()

                if (latestOrder) {
                    let options = {
                        amount: orderdata.total * 100,
                        currency: "INR",
                        receipt: "" + latestOrder._id
                    }
                    instance.orders.create(options, function (err, order) {
                        res.json({ viewRazorpay: true, order })
                    })

                } else {
                    res.json({ viewRazorpay: false })
                }


            }

        } else if (method == "WALLET") {


            const id = req.session.user._id
            const productpush = []
            const orderdata = req.body

            const user = await usermodel.findOne({ _id: id })
            if (req.body.selectedAddress == null) {
                res.json({ addrequired: true })

            } else {

                // checking weathere wallet is empty
                const orderdata = req.body
                if (orderdata.total > user.wallet) {
                    res.json({ walletEmpty: true })
                } else {


                    // converting to array
                    if (!Array.isArray(orderdata.productId)) {
                        orderdata.productId = [orderdata.productId]
                    }
                    if (!Array.isArray(orderdata.quantity)) {
                        orderdata.quantity = [orderdata.quantity]
                    }
                    if (!Array.isArray(orderdata.singleTotal)) {
                        orderdata.singleTotal = [orderdata.singleTotal]
                    }
                    if (!Array.isArray(orderdata.sprice)) {
                        orderdata.sprice = [orderdata.sprice]
                    }

                    for (let i = 0; i < orderdata.productId.length; i++) {
                        let productsId = orderdata.productId[i]
                        let quantitys = orderdata.quantity[i]
                        let singleTotals = orderdata.singleTotal[i]
                        let sprices = orderdata.sprice[i]
                        productpush.push({ productId: productsId, quantity: quantitys, singleTotal: singleTotals, sprice: sprices })
                    }


                    const order = new ordermodel({
                        userId: req.session.user._id,
                        deliveryAddress: req.body.selectedAddress,
                        product: productpush,
                        total: req.body.total,
                        payementType: req.body.paymentoption,
                        status: "confirmed",
                        orderId: `oderId_${uuidv4()}`,
                        date: Date.now()

                    })

                    await couponmodel.updateOne({ code: req.body.code }, { $push: { userused: id } })
                    const neworderdata = await order.save()


                    // wallet amount decreasing
                    const balance = user.wallet - orderdata.total;
                    const walletMinus = await usermodel.updateOne({ _id: id }, { $set: { wallet: balance } });

                    res.json({ success: true })

                }

            }
        }

    } catch (error) {
        console.log(error.message);

    }
}





//verify payment 
const PaymentVerified = async (req, res) => {

    try {

        if (req.session.user._id) {
            console.log("kerranindooo ivanee");
            const details = req.body
            const latestOrder = await ordermodel.findOne({}).sort({ date: -1 })

            const change = await ordermodel.updateOne({ orderId: latestOrder.orderId }, { $set: { status: "confirmed" } })


            let hmac = crypto.createHmac('sha256', process.env.KEY_SECRET)
            hmac.update(
                details.payment.razorpay_order_id +
                "|" +
                details.payment.razorpay_payment_id
            );

            hmac = hmac.digest("hex");


            if (hmac == details.payment.razorpay_signature) {

                res.json({ status: true })
            } else {
                console.log("Fail");
                res.json({ failed: true })
            }
        } else {
            res.redirect('/loginpage')
        }
    } catch (error) {
        console.log(error.message);
    }
}





const successhow = async (req, res) => {
    try {
        id = req.session.user._id
        const userdatas = await usermodel.findOne({ _id: id })
        const orderdatas = await ordermodel.findOne({ userId: id }).sort({ date: -1 })
        const latestOrderer = await ordermodel.findOne({}).sort({ date: -1 }).lean()

        const order = await ordermodel.findOne({ _id: latestOrderer._id }).populate("product.productId")

        // cart deletion
        const cartdeletion = await usermodel.updateOne(
            { _id: req.session.user._id }, { $set: { cart: [] } })


        //stock decresing
        for (let i = 0; i < latestOrderer.product.length; i++) {

            const product = await productmodel.updateOne({ _id: latestOrderer.product[i].productId }, { $inc: { stock: - latestOrderer.product[i].quantity } });

        }

        res.render("sucesspage", { userData: userdatas, orderData: orderdatas })

    } catch (error) {
        console.log(error.message);
    }
}



const CancelOrder = async (req, res) => {
    try {

        id = req.body.orderId
        const userid = req.session.user._id

        const canceled = await ordermodel.updateOne({ _id: id }, { $set: { status: "cancelled" } })
        if (canceled) {
            res.json({ success: true })

            const orderdata = await ordermodel.findOne({ _id: id })

            // wallet refund
            if (orderdata.payementType == "UPI") {
                const refund = await usermodel.updateOne({ _id: userid }, { $inc: { wallet: orderdata.total } })
            }
            //stock updation
            for (let i = 0; i <= orderdata.product.length; i++) {
                const thisis = await productmodel.updateOne({ _id: orderdata.product[i].productId }, { $inc: { stock: orderdata.product[i].quantity } })

            }

        }


    } catch (error) {
        console.log(error.message);
    }

}


const returnOrder = async (req, res) => {
    try {

        id = req.body.orderId
        const orderData = await ordermodel.updateOne({ _id: id }, { $set: { status: "Return pending" } })
        if (orderdata) {
            res.json({ success: true })
        }
    } catch (error) {
        console.log(error.message);
    }
}



module.exports = {
    placeorder,
    successhow,
    PaymentVerified,
    CancelOrder,
    returnOrder
}