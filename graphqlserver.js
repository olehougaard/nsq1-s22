const { gql, ApolloServer } = require("apollo-server")
const { Neo4jGraphQL } = require("@neo4j/graphql")
const neo4j = require("neo4j-driver")
const fs = require("fs").promises

const driver = neo4j.driver(
    "bolt://localhost:7687",
    neo4j.auth.basic("neo4j", "password"), 
    {encrypted: "ENCRYPTION_OFF"}
)

driver.verifyConnectivity()
.then(() => console.log('Verified'))
.catch(err => console.error(`Error: ${err}`))

fs.readFile('./friends.idl', 'utf8')
.then(gql)
.then(typeDefs => new Neo4jGraphQL({ typeDefs, driver }))
.then(graphQL => graphQL.getSchema())
.then(schema => new ApolloServer({schema}))
.then(server => server.listen())
.then(({ url }) => console.log(`GraphQL server ready on ${url}`))
.catch(console.err)
