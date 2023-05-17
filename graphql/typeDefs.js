
const typeDefs = `
  # Representa un usuario
  type User {
    _id: ID
    name: String!
    email: String!
    password: String!
    created_at: String!
  }

  # Representa un producto
  type Product {
    _id:ID!
    title:String!
    description:String!
    img:String!
    price:Float!
    category:String!
    stock:Int!
    created_at:String!
    updated_at:String!
  }

  # Representa una venta
  type Sale {
    _id:ID!
    product_id:ID!
    date:String!
    amount:Float!
  }

  # Entrada para crear un usuario
  input UserInput {
    name: String!
    email: String!
    password: String!
  }

  # Entrada para crear/editar un producto
  input ProductInput {
    _id:String
    title:String!
    description:String!
    img:String!
    price:Float!
    category:String!
    stock:Int!
  }

  # Entrada para autenticar un usuario
  input LoginInput {
    email: String!
    password: String!
  }

  # Consultas disponibles
  type Query {
    # autentica un usuario
    login(user: LoginInput!): String
  }

  # Mutaciones disponibles
  type Mutation {
    # Registra un nuevo usuario
    signUp(user: UserInput!): String
    
    # Registra un nuevo producto
    addProduct(product: ProductInput!): String

    # Registra un nuevo producto
    addMultipleProducts(products: [ProductInput!]): String

    # Registra un producto existente
    editProduct(product: ProductInput!): String

    # Elimina un producto existente
    deleteProduct(id: String!): String
  }
`;

export { typeDefs };