const useModel = require("../../models/userModel")
async function allUsers(req, res){
    try{
        console.log("userid all Users", req.userid)
        const allUsers = await useModel.find()
        res.json({
            message: "All User",
            data : allUsers,
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

module.exports = allUsers