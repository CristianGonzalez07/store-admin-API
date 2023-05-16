import bcrypt from "bcrypt";
import dotenv from 'dotenv';
import jsonwebtoken from "jsonwebtoken";
import MongoService from "../services/index.js";

const UsersService = new MongoService("Users");

dotenv.config();

const authCheck = (token) => {
  if(token){
    token = token.replace("Bearer ","")
    try {
      var decoded = jsonwebtoken.verify(token, process.env.SECRET);
      return decoded
    } catch(err) {
      console.log({err})
      return null
    }
  }else{
    return null
  }
}

const resolvers = {
  Query: {
    async login(parent, { user }, { authorization }) {
      const storedUser = await UsersService.get({email:user.email});
      if(storedUser){
        let auth = null;
        await bcrypt.compare(user.password, storedUser.password) 
        .then(function(result) {
          if(result){
            var token = jsonwebtoken.sign({ name:user.name }, process.env.SECRET, { expiresIn: '1h' }, { algorithm: 'HS256',noTimestamp: true});
            auth = {
              name:storedUser.name,
              _id:storedUser._id,
              token
            }
          }
        });
        return auth ? JSON.stringify(auth) : "Error"
      }else{
        return "Error"
      }
    },
  }, 
  Mutation: {    
    async signUp(parent, { user }, { authorization }) {
      const created_at = new Date().toISOString();
      user.created_at = created_at;
      await bcrypt.hash(user.password, 10).then((hash) =>{
        user.password = hash
      });
      const [res,error] = await UsersService.create(user);
      if(!error){
        return "Success"
      }else{
        console.log("error: ", res)
      }
    },
  },
};

export { resolvers };