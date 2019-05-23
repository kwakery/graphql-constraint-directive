[Read Original README.md here](https://github.com/confuser/graphql-constraint-directive/blob/master/README.md)

## For use with Apollo Server 2.0
I forked and changed the package to work a little better with the new version of Apollo-server. You'll need the following to get started:
```js
import {
  ApolloServer,
  gql,
  makeExecutableSchema
} from 'apollo-server';

import {
  ConstraintDirective as constraint,
  directives
} from 'graphql-constraint-directive';

const root = gql`
  type Query {
    _empty: String
  }

  type Mutation {
    _empty: String
  }

  schema {
    query: Query
    mutation: Mutation
  }
`;

// Take out "Expected ..." at beginning
const formatError = function(err) {
  if (err.message.startsWith('Expected type Constraint')) {
     err.message = err.message.split('; ')[1];
  }

  return err;
};

const typeDefs = [root, directives];

const schema = makeExecutableSchema({
  typeDefs,
  schemaDirectives: {
    constraint
  },
  resolvers
});

const server = new ApolloServer({ schema, formatError });
const port = process.env.PORT || 8080;

server.listen({ port }).then(({ url }) => {
  console.log(`🚀  Server ready at ${url} 🛸`);
});


```
