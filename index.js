// GraphQL Server Goes Here!

const { GraphQLServer } = require('graphql-yoga') // to avoid setting up webpack not using import
const photos = require('./data/photos.json')
const users = require('./data/users.json')

// represents graphql schema, map to resolvers (scalar types: Int, Float, Boolean, ID, String)
const typeDefs = `
  type Photo {
    id: ID!
    name: String
    description: String
    category: PhotoCategory
  }

  type User {
    id: ID!
    name: String
  }

  enum PhotoCategory {
    LANDSCAPE
    SELFIE
    PORTRAIT
    ACTION
  }

  type Query {
    totalPhotos: Int!
    totalUsers: Int!
    allPhotos: [Photo!]!
    allUsers: [User!]!
  }

  input PostPhotoInput {
    name: String!
    description: String
    category: PhotoCategory=PORTRAIT
  }

  type Mutation {
    postPhoto(input:PostPhotoInput!): Photo!
  }
`

// matching up what our typeDefs need, functions to get data and return it for the fields, can use to process and transform data
const resolvers = {
  Query: {
    totalPhotos: () => photos.length,
    totalUsers: () => users.length,
    allPhotos: () => photos,
    allUsers: () => users
  },

  Mutation: {
    postPhoto: (root, args) => { // root is sometimes written as _ or parent
      const newPhoto = {
        id: '7',
        ...args.input
      }
      photos.push(newPhoto)
      return newPhoto // another option is to return a boolean to confirm if it worked and can also return the object
    }
  }
}

const server = new GraphQLServer({
  typeDefs,
  resolvers
})

const options = {
  port: 4000,
  endpoint: '/graphql',
  playground: '/playground'
}

const ready = ({port}) => console.log(`graph service running on port ${port}`)

server.start(options, ready)
