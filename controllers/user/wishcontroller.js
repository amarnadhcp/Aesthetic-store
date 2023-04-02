const usermodel = require('../../models/usermodel')
const productschema = require('../../models/productmodel')


const wishlistshow = async (req, res) => {

    try {
        id = req.session.user._id
        userdata = await usermodel.findOne({ _id: id }).populate('wishlist.product')


        res.render("wishlist", { userData: userdata })

    } catch (error) {
        console.log(error.message)
    }
}


const addtowishlist = async (req, res) => {
    try {
        const userId = req.session.user._id;
        const productId = req.body.productId;

        const data = await usermodel.findOne({ _id: userId, "wishlist.product": productId });

        if (data) {
            // Product is already in the wishlist
            res.json({ success: false, message: "Product is already in your wishlist" });
        } else {
            // Product is not in the wishlist, add it
            const wishdata = await usermodel.updateOne({ _id: userId }, { $push: { wishlist: { product: productId } } });
            if (wishdata) {
                res.json({ success: true, message: "Product added to your wishlist" });
            }
        }
    } catch (error) {
        console.log(Error.message);
        res.json({ success: false, message: "An error occurred while adding the product to your wishlist" });
    }
};


const deletewish = async (req, res) => {
    try {
        const id = req.session.user._id
        const proid = req.body.productId

        const data = await usermodel.updateOne({ _id: id }, { $pull: { wishlist: { product: proid } } })

        if (data) {
            res.json({ success: true })
        }
    } catch (error) {
        console.log(error.message);
    }
}


const addtocart = async (req, res) => {
   try {
        if(req.session.user){
        const id = req.session.user._id
        const proid = req.body.productId
        const price = req.body.price

        const data = await usermodel.findOne({ _id: id, 'cart.product': proid })

        if (data) {

            res.json({ success: true,exist:true })
        } else {
            const newcart = await usermodel.updateOne({ _id: id }, { $push: { cart: { product: proid, prdtotalprice: price, quantity: 1 } } })

            if (newcart) {
                const newwish = await usermodel.updateOne({ _id: id }, { $pull: { wishlist: { product: proid } } })
                if (newwish) {
                    res.json({ success: true,done:true })
                    ////updating cart total price
                    const cart = await usermodel.findOne({ _id: id }).populate('cart.product').exec()
                    let sum = 0
                    for (let i = 0; i < cart.cart.length; i++) {
                        sum = sum + cart.cart[i].prdtotalprice
                    }
                    const carttotalprice = await usermodel.updateOne({ _id: id }, { $set: { carttotalprice: sum } })
                }
            }
        }

    }else{
        res.json({success:true,nouser:true})
    }

    } catch (error) {
        console.log(error.message);
    }

}


module.exports = {
    wishlistshow,
    addtowishlist,
    deletewish,
    addtocart

}