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

    type Social {
        user: User!
        github: String
        website: String
        facebook: String
        linkedin: String
        stackoverflow: String
    }

    type User {
        _id: ID!
        username: String!
        fullname: String!
        email: String!
        password: String
        bio: String
        avatar: String
        work: String
        location: String
        posts: [Post]!
        socials: Social
        createdAt: String
    }

    type AuthData {
        token: String!
        userId: String!
    }

    type PostData {
        posts: [Post!]!
    }

    input UserInputData {
        username: String!
        email: String!
        fullname: String!
        password: String!
    }

    input UserAccountData {
        email: String!
        fullname: String!
        bio: String
        work: String
        location: String
    }

    input PostInputData {
        title: String!
        content: String!
        excerpt: String
        image: String!
    }

    input SocialInputData {
        github: String
        website: String
        linkedin: String
        facebook: String
        stackoverflow: String
    }

    type RootMutation {
        signup(userInput: UserInputData!) : User!
        createPost(postInput: PostInputData!) : Post!
        deletePost(postId: ID!) : Boolean
        updatePost(postId: ID!, postInput: PostInputData!) : Post!
        updateUser(userId: ID!, userInput: UserAccountData!) : User!
        updateUserSocials(userId: ID, userSocials: SocialInputData) : Boolean
        changePassword(newPassword: String!) : Boolean
    }

    type RootQuery {
        login(email: String!, password: String!) : AuthData!
        posts : PostData!
        post(postSlug: String!) : Post!
        fetchEditPost(postId: ID!) : Post!
        user(id: ID!): User!
        fetchUserByUsername(username: String!) : User!
        searchPosts(keyword: String!): PostData!
    }

    schema {
        query: RootQuery
        mutation: RootMutation
    }
`);
