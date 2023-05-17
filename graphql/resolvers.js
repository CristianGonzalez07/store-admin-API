import bcrypt from "bcrypt";
import dotenv from 'dotenv';
import jsonwebtoken from "jsonwebtoken";
import MongoService from "../services/index.js";
import { ObjectId } from "mongodb";

const UsersService = new MongoService("Users");
const ProductsService = new MongoService("Products");
const SalesService = new MongoService("Sales");

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
      const [storedUser,error] = await UsersService.get({email:user.email});
      if(storedUser && !error){
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
        console.log({error,storedUser})
        return "Error"
      }
    },
    async getProducts(parent, args , { authorization }) {
      let token = authCheck(authorization);
      if(token){
        return await ProductsService.getAll([]);
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
    async addProduct(parent, { product }, { authorization }) {
      let token = authCheck(authorization);
      if(token){
        const date = new Date().toISOString();
        product.created_at = date;
        product.updated_at = date;
        const [res,error] = await ProductsService.create(product);
        if(!error){
          return "Success"
        }else{
          console.log("error: ", res)
        }
      }else{
        return "Error"
      }
    },
    async editProduct(parent, { product }, { authorization }) {
      let token = authCheck(authorization);
      if(token){
        const product_id = product._id;
        const date = new Date().toISOString();
        product.updated_at = date;
        delete product._id;
        const [res,error] = await ProductsService.update({_id:new ObjectId(product_id)}, product);
        if(!error){
          return "Success"
        }else{
          console.log("error: ", res)
        }
      }else{
        return "Error"
      }
    },
    async deleteProduct(parent, { id }, { authorization }) {
      let token = authCheck(authorization);
      if(token){
        const [res,error] = await ProductsService.delete({_id:new ObjectId(id)});
        if(!error){
          return "Success"
        }else{
          console.log("error: ", res)
        }
      }else{
        return "Error"
      }
    },
    async addMultipleProducts(parent, { products }, { authorization }) {
      let token = authCheck(authorization);
      if(token){
        const [res,error] = await ProductsService.createMany(products);
        if(!error){
          return "Success"
        }else{
          console.log("error: ", res)
        }
      }else{
        return "Error"
      }
    },
    async sellProduct(parent, { product_id, amount }, { authorization }) {
      let token = authCheck(authorization);
      if(token){
        const date = new Date().toISOString();
        const [res,error] = await SalesService.create({product_id: new ObjectId(product_id), amount, date});
        if(!error){
          return "Success"
        }else{
          console.log("error: ", res)
        }
      }else{
        return "Error"
      }
    },
  },
};

export { resolvers };
