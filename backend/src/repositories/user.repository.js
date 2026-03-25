const user=require("../models/user.model")
//getAll
const getAllUsers=async()=>{
    return await user.findAll({
        attributes: ["id", "name", "email"],
    });
};

module.exports={
    getAllUsers,
};