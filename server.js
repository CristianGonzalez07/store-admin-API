import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
import cors from 'cors';
import express from 'express';
import Schema from './graphql/Schema.js';

const app = express();
const corsOptions = {
  origin: process.env.URL,
  optionsSuccessStatus: 200
};
app.use(cors(corsOptions));

const server = new ApolloServer({ ...Schema });

const { url } = await startStandaloneServer(server, {
  context: async ({ req }) => ({ authorization: req.headers.authorization || {} }),
  listen: { port: 4000 },
});
console.log(`🚀  Server ready at: ${url}`);