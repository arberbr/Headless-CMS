const fileUpload = async files => {
	const data = new FormData();
	data.append("file", files[0]);
	data.append("upload_preset", process.env.REACT_APP_CLOUDINARY_PRESET);
	const res = await fetch(process.env.REACT_APP_CLOUDINARY_UPLOAD, {
		method: "POST",
		body: data
	});
	const file = await res.json();
	return file;
};

export default fileUpload;
