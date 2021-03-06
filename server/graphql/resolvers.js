const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const gravatar = require("gravatar");

const User = require("../models/user");
const Post = require("../models/post");
const Social = require("../models/social");

const slugify = require("../utils/slugify");

module.exports = {
	signup: async function(args, req) {
		const username = args.userInput.username;
		const email = args.userInput.email;
		const fullname = args.userInput.fullname;
		const password = args.userInput.password;

		const checkUserName = await User.findOne({ username: username });
		if (checkUserName) {
			const error = new Error("User already exists!");
			throw error;
		}

		const checkUserEmail = await User.findOne({ email: email });
		if (checkUserEmail) {
			const error = new Error("User already exists!");
			throw error;
		}

		const hashedPassword = await bcrypt.hash(password, 12);
		if (!hashedPassword) {
			const error = new Error("Password hashing failed!");
			throw error;
		}

		const fetchedAvatar = await gravatar.url(email);

		const user = new User({
			username: username,
			email: email,
			fullname: fullname,
			password: hashedPassword,
			avatar: fetchedAvatar
		});

		const createdUser = await user.save();

		return { ...createdUser._doc, _id: createdUser._id.toString() };
	},

	login: async function({ email, password }) {
		const user = await User.findOne({ email: email });
		if (!user) {
			const error = new Error("User not found!");
			error.statusCode = 401;
			throw error;
		}

		const isEqual = await bcrypt.compare(password, user.password);
		if (!isEqual) {
			const error = new Error("Password or E-Mail is incorrect!");
			error.statusCode = 403;
			throw error;
		}

		const token = jwt.sign(
			{
				userId: user._id.toString(),
				email: user.email
			},
			"93ca7df3d65604374fe04fae03c08ae5",
			{ expiresIn: "1h" }
		);

		return {
			token: token,
			userId: user._id.toString()
		};
	},

	createPost: async function({ postInput }, req) {
		if (!req.isAuth) {
			const error = new Error("Not Authenticated!");
			error.code = 401;
			throw error;
		}

		const user = await User.findById(req.userId);
		if (!user) {
			const error = new Error("User not found!");
			error.code = 401;
			throw error;
		}

		const randomNr = Math.floor(Math.random() * 1000 + 1);

		const postSlug = randomNr + "-" + slugify(postInput.title);
		if (!postSlug) {
			const error = new Error("Post slug could not be generated!");
			error.code = 401;
			throw error;
		}

		const post = new Post({
			title: postInput.title,
			content: postInput.content,
			excerpt: postInput.excerpt,
			slug: postSlug,
			image: postInput.image,
			user: user
		});

		const createdPost = await post.save();

		user.posts.push(createdPost);

		await user.save();

		return {
			...createdPost._doc,
			_id: createdPost._id.toString(),
			createdAt: createdPost.createdAt.toISOString(),
			updatedAt: createdPost.updatedAt.toISOString()
		};
	},

	posts: async function(args, req) {
		if (!req.isAuth) {
			const error = new Error("Not Authenticated!");
			error.code = 401;
			throw error;
		}

		const posts = await Post.find()
			.sort({ createdAt: -1 })
			.populate("user");

		if (!posts) {
			const error = new Error("No Posts found!");
			error.statusCode = 404;
			throw error;
		}

		return {
			posts: posts.map(post => {
				return {
					...post._doc,
					_id: post._id.toString(),
					createdAt: post.createdAt.toISOString(),
					updatedAt: post.updatedAt.toISOString()
				};
			})
		};
	},

	post: async function(args, req) {
		if (!req.isAuth) {
			const error = new Error("Not Authenticated!");
			error.code = 401;
			throw error;
		}

		const post = await Post.findOne({ slug: args.postSlug }).populate({
			path: "user",
			model: "User",
			populate: {
				path: "socials",
				model: "Social"
			}
		});
		if (!post) {
			const error = new Error("No Posts found!");
			error.statusCode = 404;
			throw error;
		}

		return {
			...post._doc,
			_id: post._id.toString(),
			createdAt: post.createdAt.toISOString(),
			updatedAt: post.updatedAt.toISOString()
		};
	},

	fetchEditPost: async function(args, req) {
		if (!req.isAuth) {
			const error = new Error("Not Authenticated!");
			error.code = 401;
			throw error;
		}

		const post = await Post.findById(args.postId).populate("user");
		if (!post) {
			const error = new Error("No Posts found!");
			error.statusCode = 404;
			throw error;
		}

		return {
			...post._doc,
			_id: post._id.toString(),
			createdAt: post.createdAt.toISOString(),
			updatedAt: post.updatedAt.toISOString()
		};
	},

	deletePost: async function(args, req) {
		if (!req.isAuth) {
			const error = new Error("Not Authenticated!");
			error.code = 401;
			throw error;
		}

		// get post to be deleted
		const post = await Post.findById(args.postId);
		if (!post) {
			const error = new Error("No Posts found!");
			error.statusCode = 404;
			throw error;
		}

		// check the user has authorization to delete this post
		if (post.user.toString() !== req.userId.toString()) {
			const error = new Error("Not Authorized");
			error.statusCode = 403;
			throw error;
		}

		// delete post
		await Post.findByIdAndRemove(args.postId);

		// get user of the post
		const user = await User.findById(req.userId);
		if (!user) {
			const error = new Error("No user was found!");
			error.statusCode = 404;
			throw error;
		}

		// remove post from the user
		user.posts.pull(args.postId);
		await user.save();

		return true;
	},

	updatePost: async function(args, req) {
		if (!req.isAuth) {
			const error = new Error("Not Authenticated!");
			error.code = 401;
			throw error;
		}

		// get post to be deleted
		const post = await Post.findById(args.postId);
		if (!post) {
			const error = new Error("No Posts found!");
			error.statusCode = 404;
			throw error;
		}

		// check the user has authorization to update this post
		if (post.user.toString() !== req.userId.toString()) {
			const error = new Error("Not Authorized");
			error.statusCode = 403;
			throw error;
		}

		post.title = args.postInput.title;
		post.excerpt = args.postInput.excerpt;
		post.content = args.postInput.content;
		post.image = args.postInput.image;

		const updatedPost = await post.save();

		return {
			...updatedPost._doc,
			_id: updatedPost._id.toString(),
			createdAt: updatedPost.createdAt.toISOString(),
			updatedAt: updatedPost.updatedAt.toISOString()
		};
	},

	user: async function(args, req) {
		const user = await User.findById(req.userId)
			.populate({
				path: "posts",
				options: { sort: "-createdAt" }
			})
			.populate("socials");
		if (!user) {
			const error = new Error("No user was found!");
			error.statusCode = 404;
			throw error;
		}

		return {
			...user._doc,
			_id: user._id.toString(),
			createdAt: user.createdAt.toISOString(),
			updatedAt: user.updatedAt.toISOString()
		};
	},

	fetchUserByUsername: async function(args, req) {
		const user = await User.findOne({ username: args.username })
			.populate({
				path: "posts",
				options: { sort: "-createdAt" }
			})
			.populate("socials");
		if (!user) {
			const error = new Error("No user was found!");
			error.statusCode = 404;
			throw error;
		}

		return {
			...user._doc,
			_id: user._id.toString(),
			createdAt: user.createdAt.toISOString(),
			updatedAt: user.updatedAt.toISOString()
		};
	},

	updateUser: async function(args, req) {
		if (!req.isAuth) {
			const error = new Error("Not Authenticated!");
			error.code = 401;
			throw error;
		}

		const user = await User.findById(req.userId);
		if (!user) {
			const error = new Error("No user was found!");
			error.statusCode = 404;
			throw error;
		}

		if (user._id.toString() !== req.userId.toString()) {
			const error = new Error("Not Authorized");
			error.statusCode = 403;
			throw error;
		}

		const existingUser = await User.findOne({
			email: args.userInput.email
		});
		if (existingUser) {
			if (existingUser._id.toString() !== req.userId.toString()) {
				const error = new Error("User already exists!");
				error.statusCode = 500;
				throw error;
			}
		}

		user.fullname = args.userInput.fullname;
		user.email = args.userInput.email;
		user.bio = args.userInput.bio;
		user.work = args.userInput.work;
		user.location = args.userInput.location;

		const updatedUser = await user.save();

		return {
			...updatedUser._doc,
			_id: updatedUser._id.toString()
		};
	},

	updateUserSocials: async function(args, req) {
		if (!req.isAuth) {
			const error = new Error("Not Authenticated!");
			error.code = 401;
			throw error;
		}

		const user = await User.findById(req.userId);
		if (!user) {
			const error = new Error("No User found!");
			error.statusCode = 401;
			throw error;
		}

		if (args.userId.toString() !== req.userId.toString()) {
			const error = new Error("Not Authorized");
			error.statusCode = 403;
			throw error;
		}

		try {
			const socials = await Social.findOneAndUpdate(
				{ user: req.userId },
				{
					$set: {
						github: args.userSocials.github || "",
						website: args.userSocials.website || "",
						linkedin: args.userSocials.linkedin || "",
						facebook: args.userSocials.facebook || "",
						stackoverflow: args.userSocials.stackoverflow || ""
					}
				},
				{ upsert: true }
			);

			user.socials = socials;
			await user.save();
			return true;
		} catch (err) {
			const error = new Error("Something went wrong");
			error.statusCode = 403;
			throw error;
		}
	},

	searchPosts: async function(args, req) {
		if (!req.isAuth) {
			const error = new Error("Not Authenticated!");
			error.code = 401;
			throw error;
		}

		const posts = await Post.find()
			.or([
				{
					title: { $regex: args.keyword, $options: "i" }
				},
				{
					excerpt: { $regex: args.keyword, $options: "i" }
				},
				{
					content: { $regex: args.keyword, $options: "i" }
				}
			])
			.sort({ title: 1 });

		if (!posts) {
			const error = new Error("No Posts found for given search result!");
			error.statusCode = 404;
			throw error;
		}

		return {
			posts: posts.map(post => {
				return {
					...post._doc,
					_id: post._id.toString(),
					createdAt: post.createdAt.toISOString(),
					updatedAt: post.updatedAt.toISOString()
				};
			})
		};
	},

	changePassword: async function(args, req) {
		if (!req.isAuth) {
			const error = new Error("Not Authenticated!");
			error.code = 401;
			throw error;
		}

		const user = await User.findById(req.userId);
		if (!user) {
			const error = new Error("No user was found!");
			error.statusCode = 404;
			throw error;
		}

		const hashedPassword = await bcrypt.hash(args.newPassword, 12);
		if (!hashedPassword) {
			const error = new Error("Password hashing failed!");
			throw error;
		}

		user.password = hashedPassword;

		await user.save();

		return true;
	}
};
