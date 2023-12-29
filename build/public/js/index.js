"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tw_elements_es_min_js_1 = require("/tw-elements/dist/js/tw-elements.es.min.js");
(0, tw_elements_es_min_js_1.initTE)({ Modal: tw_elements_es_min_js_1.Modal, Ripple: tw_elements_es_min_js_1.Ripple });
(0, tw_elements_es_min_js_1.initTE)({ Carousel: tw_elements_es_min_js_1.Carousel }, true);
document.querySelector(".recent-jobs").innerHTML = [...Array(7)]
    .map(() => `<a>	<div class="recent-card shadow-md p-5 rounded-md ">
						<div class="recent-head flex items-center mb-4">
							<img
								src="/images/brendan.jpg"
								alt=""
								class="rounded-full w-10 h-10 object-cover inline-block mr-4"
							/>
							<div class="m-0 p-0 box-border outline-none border-none">
								<b class="name block">Sales Executive</b>
								<small class="desc text-gray-700"
									>Gafford Property &amp; Homes</small
								>
							</div>
						</div>

						<div class="tags flex items-center">
							<span
								class="tag inline-block mr-4 px-4 py-2 border border-blue-500 rounded-full bg-blue-200 text-blue-500 text-sm"
								>Full Time</span
							>
							<span
								class="tag inline-block mr-4 px-4 py-2 border border-blue-500 rounded-full bg-blue-200 text-blue-500 text-sm"
								>Onsite</span
							>
							<span
								class="tag inline-block mr-4 px-4 py-2 border border-blue-500 rounded-full bg-blue-200 text-blue-500 text-sm"
								>Junior</span
							>
						</div>

						<p class="my-4">
							Lorem ipsum dolor sit amet consectetur adipisicing elit. Soluta
							architecto obcaecati, minima officiis enim id repellendus beatae
							voluptate provident aut doloremque! Vel, debitis esse impedit
							praesentium pariatur repellendus consequatur in.
						</p>

						<div
							class="botton pt-4 border-t border-gray-200 flex items-center justify-between text-sm text-gray-700"
						>
							<div class="salary">Salary: N210,000 - N300,000</div>
							<div class="posted">Posted 2 hours ago</div>
						</div>
					</div></a>`)
    .join("");
//# sourceMappingURL=index.js.map