const userService=require('../services/user.service')
const getAllUsers=async(req,res)=>{
    try {
        const users=await userService.getUsers();
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({error:error.message})
    }
}
module.exports={
    getAllUsers,
}