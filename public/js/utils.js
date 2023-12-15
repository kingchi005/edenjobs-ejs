const formatDate = (date) => {
	const now = new Date();
	const diffInMs = now.getTime() - new Date(date).getTime();

	const diffInSecs = Math.floor(diffInMs / 1000);
	const diffInMins = Math.floor(diffInSecs / 60);
	const diffInHrs = Math.floor(diffInMins / 60);
	const diffInDays = Math.floor(diffInHrs / 24);

	if (diffInSecs < 4) {
		return "just now";
	} else if (diffInSecs < 60) {
		return diffInSecs + " secs ago";
	} else if (diffInMins < 60) {
		return diffInMins + " min ago";
	} else if (diffInHrs < 24) {
		return diffInHrs + " hrs ago";
	} else if (diffInDays === 1) {
		return "yesterday";
	} else if (diffInDays < 6) {
		return diffInDays + " days ago";
	} else {
		return new Date(date).toLocaleDateString();
	}
};
