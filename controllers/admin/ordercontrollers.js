const ordermodel = require("../../models/ordermodel")
const productmodel = require("../../models/productmodel")
const usermodel = require("../../models/usermodel")


const userordershow = async (req,res)=>{
    try {

        const orderdata = await ordermodel.find({})

        res.render("allorders",{orderData:orderdata})
        
    } catch (error) {
        console.log(error.message);
    }
}


const statusUpdation = async (req, res) => {
    try {
        const orderid = req.body.orderid;
        const newstatus = req.body.status;

        // Status updation
        const updating = await ordermodel.updateOne({ orderId: orderid }, { $set: { status: newstatus } });

        // When returned
        if (newstatus == "Returned") {
            const orderdata = await ordermodel.findOne({ orderId: orderid });

            // Updating product quantity
            for (let i = 0; i < orderdata.product.length; i++) {
                try {
                    const thisis = await productmodel.updateOne({ _id: orderdata.product[i].productId }, { $inc: { stock: orderdata.product[i].quantity } });
                } catch (error) {
                    console.log(error.message);
                    // Handle the error appropriately
                }
            }

            // Refund to wallet
            try {
                const refund = await usermodel.updateOne({ _id: orderdata.userId }, { $inc: { wallet: orderdata.total } });    
            } catch (error) {
                console.log(error.message);
            }
        }

        return res.json({ success: true });
    } catch (error) {
        console.log(error.message);
        // Handle the error appropriately
    }
};



const orderdetails = async (req,res)=>{
    try {
        const orderid = req.params.id
        const orderdata = await ordermodel.findOne({orderId:orderid}).populate("product.productId")
        res.render("orderdetails",{orderData:orderdata})
    } catch (error) {
        console.log(error.message);
    }
}


module.exports={
    userordershow,
    statusUpdation,
    orderdetails
}