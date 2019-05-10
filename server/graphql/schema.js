const { buildSchema } = require('graphql');

module.exports = buildSchema(`
    type Post {
        _id: ID!
        title: String!
        content: String!
        excerpt: String
        image: String
        user: User!
        createdAt: String!
    }

    type User {
        _id: ID!
        fullname: String!
        email: String!
        password: String
        posts: [Post]!
    }

    type AuthData {
        token: String!
        userId: String!
    }

    type PostData {
        posts: [Post!]!
    }

    input UserInputData {
        email: String!
        fullname: String!
        password: String!
    }

    input PostInputData {
        title: String!
        content: String!
        excerpt: String
        image: String
    }

    type RootMutation {
        signup(userInput: UserInputData!) : User!
        createPost(postInput: PostInputData!) : Post!
        deletePost(postId: ID!) : Boolean
    }

    type RootQuery {
        login(email: String!, password: String!) : AuthData!
        posts : PostData!
        post(postId: ID!) : Post!
        user(id: ID!): User!
    }

    schema {
        query: RootQuery
        mutation: RootMutation
    }
`);
