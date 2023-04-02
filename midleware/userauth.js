


const isLogin = async (req, res, next) => {

    try {
        if (req.session.user) {
            return res.redirect('/')

        } else {

        }
        next();
    } catch (error) {
        console.log(error.message);
    }
}


const isLogout = async (req, res, next) => {

    try {
        if (req.session.user) {

        } else {
            return res.redirect("/loginpage")
        }
        next();
    } catch (error) {
        console.log(error.message);
    }
}


module.exports = {

    isLogin,
    isLogout


}