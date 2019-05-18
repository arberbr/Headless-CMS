const { buildSchema } = require("graphql");

module.exports = buildSchema(`
    type Post {
        _id: ID!
        title: String!
        content: String!
        excerpt: String
        slug: String
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
        bio: String
        avatar: String
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
        bio: String
        avatar: String
    }

    input UserAccountData {
        email: String!
        fullname: String!
        bio: String
        avatar: String
    }

    input PostInputData {
        title: String!
        content: String!
        excerpt: String
        image: String!
    }

    type RootMutation {
        signup(userInput: UserInputData!) : User!
        createPost(postInput: PostInputData!) : Post!
        deletePost(postId: ID!) : Boolean
        updatePost(postId: ID!, postInput: PostInputData!) : Post!
        updateUser(userId: ID!, userInput: UserAccountData!) : User!
        changePassword(newPassword: String!) : Boolean
    }

    type RootQuery {
        login(email: String!, password: String!) : AuthData!
        posts : PostData!
        post(postSlug: String!) : Post!
        fetchEditPost(postId: ID!) : Post!
        user(id: ID!): User!
        searchPosts(keyword: String!): PostData!
    }

    schema {
        query: RootQuery
        mutation: RootMutation
    }
`);
