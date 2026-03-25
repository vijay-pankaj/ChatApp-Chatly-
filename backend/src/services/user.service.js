const userRepo=require('../repositories/user.repository');
const getUsers=async()=>{
    const users=await userRepo.getAllUsers();
    return users;
}
module.exports={
    getUsers,
}