const productModel = require("../../models/productModel")

const getCategoryWiseProduct = async(req, res)=>{
    try{
        const {category} = req?.body || req?.query
        const product = await productModel.find({category})

        res.json({
            data : product,
            message : "product",
            success : true,
            error : false
        })
    }catch(err){
        res.status(400).json({
            message : err.meassge || err,
            error : true,
            success : false
        })
    }
}

module.exports = getCategoryWiseProduct