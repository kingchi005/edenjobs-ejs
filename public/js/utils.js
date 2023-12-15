const formatDate = (date, future = false) => {
	const prefix = future ? "" : " ago";
	const now = new Date();
	const diffInMs = future
		? new Date(date).getTime() - now.getTime()
		: now.getTime() - new Date(date).getTime();

	const diffInSecs = Math.floor(diffInMs / 1000);
	const diffInMins = Math.floor(diffInSecs / 60);
	const diffInHrs = Math.floor(diffInMins / 60);
	const diffInDays = Math.floor(diffInHrs / 24);

	if (diffInSecs < 4) {
		return "just now";
	} else if (diffInSecs < 60) {
		return diffInSecs + ` secs${prefix}`;
	} else if (diffInMins < 60) {
		return diffInMins + ` min${prefix}`;
	} else if (diffInHrs < 24) {
		return diffInHrs + ` hrs${prefix}`;
	} else if (diffInDays === 1) {
		return "yesterday";
	} else if (diffInDays < (future ? 30 : 6)) {
		return diffInDays + ` days${prefix}`;
	} else {
		return new Date(date).toLocaleDateString();
	}
};
