const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const User = require('../models/user');
const Post = require('../models/post');

module.exports = {
	signup: async function(args, req) {
		const email = args.userInput.email;
		const fullname = args.userInput.fullname;
		const password = args.userInput.password;

		const existingUser = await User.findOne({ email: email });
		if (existingUser) {
			const error = new Error('User already exists!');
			throw error;
		}

		const hashedPassword = await bcrypt.hash(password, 12);
		if (!hashedPassword) {
			const error = new Error('Password hashing failed!');
			throw error;
		}

		const user = new User({
			email: email,
			fullname: fullname,
			password: hashedPassword
		});

		const createdUser = await user.save();

		return { ...createdUser._doc, _id: createdUser._id.toString() };
	},

	login: async function({ email, password }) {
		const user = await User.findOne({ email: email });
		if (!user) {
			const error = new Error('User not found!');
			error.statusCode = 401;
			throw error;
		}

		const isEqual = await bcrypt.compare(password, user.password);
		if (!isEqual) {
			const error = new Error('Password is incorrect!');
			error.statusCode = 403;
			throw error;
		}

		const token = jwt.sign(
			{
				userId: user._id.toString(),
				email: user.email
			},
			'93ca7df3d65604374fe04fae03c08ae5',
			{ expiresIn: '1h' }
		);

		return {
			token: token,
			userId: user._id.toString()
		};
	},

	createPost: async function({ postInput }, req) {
		if (!req.isAuth) {
			const error = new Error('Not Authenticated!');
			error.code = 401;
			throw error;
		}

		const user = await User.findById(req.userId);
		if (!user) {
			const error = new Error('User not found!');
			error.code = 401;
			throw error;
		}

		const post = new Post({
			title: postInput.title,
			content: postInput.content,
			excerpt: postInput.excerpt,
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
			const error = new Error('Not Authenticated!');
			error.code = 401;
			throw error;
		}

		const posts = await Post.find()
			.sort({ createdAt: -1 })
			.populate('user');

		if (!posts) {
			const error = new Error('No Posts found!');
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
			const error = new Error('Not Authenticated!');
			error.code = 401;
			throw error;
		}

		const post = await Post.findById(args.postId).populate('user');
		if (!post) {
			const error = new Error('No Posts found!');
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
			const error = new Error('Not Authenticated!');
			error.code = 401;
			throw error;
		}

		// get post to be deleted
		const post = await Post.findById(args.postId);
		if (!post) {
			const error = new Error('No Posts found!');
			error.statusCode = 404;
			throw error;
		}

		// check the user has authorization to delete this post
		if (post.user.toString() !== req.userId.toString()) {
			const error = new Error('Not Authorized');
			error.statusCode = 403;
			throw error;
		}

		// delete post
		await Post.findByIdAndRemove(args.postId);

		// get user of the post
		const user = await User.findById(req.userId);
		if (!user) {
			const error = new Error('No user was found!');
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
			const error = new Error('Not Authenticated!');
			error.code = 401;
			throw error;
		}

		// get post to be deleted
		const post = await Post.findById(args.postId);
		if (!post) {
			const error = new Error('No Posts found!');
			error.statusCode = 404;
			throw error;
		}

		// check the user has authorization to update this post
		if (post.user.toString() !== req.userId.toString()) {
			const error = new Error('Not Authorized');
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
		if (!req.isAuth) {
			const error = new Error('Not Authenticated!');
			error.code = 401;
			throw error;
		}

		const user = await User.findById(req.userId).populate('posts');
		if (!user) {
			const error = new Error('No user was found!');
			error.statusCode = 404;
			throw error;
		}

		return {
			...user._doc,
			_id: user._id.toString()
		};
	},

	updateUser: async function(args, req) {
		if (!req.isAuth) {
			const error = new Error('Not Authenticated!');
			error.code = 401;
			throw error;
		}

		const user = await User.findById(req.userId).populate('posts');
		if (!user) {
			const error = new Error('No user was found!');
			error.statusCode = 404;
			throw error;
		}

		if (user._id.toString() !== req.userId.toString()) {
			const error = new Error('Not Authorized');
			error.statusCode = 403;
			throw error;
		}

		user.fullname = args.userInput.fullname;
		user.email = args.userInput.email;
		user.bio = args.userInput.bio;
		user.avatar = args.userInput.avatar || user.avatar;

		const updatedUser = await user.save();

		return {
			...updatedUser._doc,
			_id: updatedUser._id.toString()
		};
	}
};
