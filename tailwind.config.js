/** @type {import('tailwindcss').Config} */
export default {
	content: [
		"./public/tw-elements/js/**/*.js",
		"./views/**/*.ejs",
		"./node_modules/tw-elements/dist/js/**/*.js",
	],
	darkMode: "class",
	plugins: [require("tw-elements/dist/plugin.cjs")],
};
