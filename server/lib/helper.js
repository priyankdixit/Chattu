import { userSocketIDs } from "../utils/utility.js";

export const getOtherMember = (members, userId) =>
    members.find((member) => member._id.toString() !== userId.toString());

export const getSockets=(users=[])=>{
   return users.map((user)=> userSocketIDs.get(user._id.toString()));
}