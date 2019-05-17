const timeToRead = text => {
	const wordsPerMinute = 200; // Average case.

	text = text.replace(/<(?:.|\n)*?>/gm, ''); // Remove HTML and leave only text
	let textLength = text.split(' ').length; // Split by words
	if (textLength > 0) {
		let value = Math.ceil(textLength / wordsPerMinute);
		return `${value} min read`;
	} else {
		return '1 min read';
	}
};

export default timeToRead;
