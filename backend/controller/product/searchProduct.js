const productModel = require("../../models/productModel")

const searchProduct = async(req, res)=>{
    try{
        const query = req.query.q

        const regex = new RegExp(query, 'i', 'g')

        const product = await productModel.find({
            "$or" : [
                {
                    productName : regex
                },
                {
                    category : regex
                }
            ]
        })
        res.json({
            data : product,
            message : "Saerch Product List",
            error : false,
            success : true
        })

        console.log(query)
    }catch(err){
        res.json({
            message : err?.message || err,
            error : true,
            success : false
        })
    }
}

module.exports = searchProduct