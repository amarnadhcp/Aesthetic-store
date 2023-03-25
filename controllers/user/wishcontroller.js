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
        id = req.session.user._id
        proid = req.body.productId

        const data = await usermodel.findOne({ _id: id, "wishlist.product": proid })

        if (data) {
            res.json({ success: true })
        } else {
            const wishdata = await usermodel.updateOne({ _id: id }, { $push: { wishlist: { product: proid } } })
            if (wishdata) {
                res.json({ success: true })
            }
        }
    } catch (error) {
        console.log(Error.message)
    }

}




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

        const id = req.session.user._id
        const proid = req.body.productId
        const price = req.body.price

        const data = await usermodel.findOne({ _id: id, 'cart.product': proid })

        if (data) {

            res.json({ succes: false })
        } else {
            const newcart = await usermodel.updateOne({ _id: id }, { $push: { cart: { product: proid, prdtotalprice: price, quantity: 1 } } })

            if (newcart) {
                const newwish = await usermodel.updateOne({ _id: id }, { $pull: { wishlist: { product: proid } } })
                if (newwish) {
                    res.json({ success: true })
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