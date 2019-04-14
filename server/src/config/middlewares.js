import { ApolloServer, gql } from "apollo-server-express";
import typeDefs from "../graphql/schema";
import resolvers from "../graphql/resolvers";
import constants from "./constants";
import { decodeToken } from "../services/auth";

async function auth(req, res, next) {
  try {
    const token = req.headers.authorization;
    if (token != null) {
      const user = await decodeToken(token);
      req.user = user;
    } else {
      req.user = null;
    }
    return next();
  } catch (error) {
    throw error;
  }
}

export default app => {
  app.use(auth);

  const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: ({ req, res }) => ({
      user: req.user
    }),
    playground: {
      endpoint: constants.GRAPHQL_PATH,
      settings: {
        "editor.theme": "light"
      }
    }
  });

  server.applyMiddleware({ app });
};