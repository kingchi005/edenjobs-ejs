"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const faker_1 = require("@faker-js/faker");
const index_1 = __importDefault(require("./index"));
function randomFromArray(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}
const NO_OF = {
    USER: 5,
    APPLICANT: 5,
    EMPLOYER: 5,
    JOB: 30,
    JOBCATEGORY: 5,
    APPLICATION: 5,
};
const company_size_enum = ["startup", "small", "medium", "large", "others"];
const job_type_enum = ["part-time", "full-time", "contract"];
const experience_level_enum = ["entry-level", "mid-level", "advance-level"];
const work_schedule_enum = ["flexibly hours", "night shift", "day time"];
const job_stability_enum = ["long term", "short term"];
const location_type_enum = ["remote", "on-site"];
function seedDB() {
    return __awaiter(this, void 0, void 0, function* () {
        const job_categories = yield seedJobCategory();
        const users = yield seedUser();
        const applicants = [...users]
            .filter((user) => {
            var _a, _b;
            return ((_a = user.applicant_details) === null || _a === void 0 ? void 0 : _a.id) != undefined &&
                ((_b = user.applicant_details) === null || _b === void 0 ? void 0 : _b.id) != null;
        })
            .map((user) => user.applicant_details);
        const employers = [...users]
            .filter((user) => user.employer_details != undefined && user.employer_details != null)
            .map((user) => user.employer_details);
        const jobs = yield seedJob();
        function seedUser() {
            return __awaiter(this, void 0, void 0, function* () {
                const users = [];
                for (let i = 0; i < NO_OF.USER; i++) {
                    const isApplicant = Math.random() < 0.5;
                    const user = yield index_1.default.user.create({
                        data: {
                            first_name: faker_1.faker.person.firstName(),
                            last_name: faker_1.faker.person.lastName(),
                            email: faker_1.faker.internet.email({ provider: "gmail" }),
                            password: "password",
                            username: faker_1.faker.internet.userName(),
                            is_applicant: isApplicant,
                            applicant_details: isApplicant
                                ? {
                                    create: {
                                        avatar: faker_1.faker.internet.avatar(),
                                        cv_resume_url: faker_1.faker.internet.url(),
                                        job_field: randomFromArray([
                                            "Tech",
                                            "Finance",
                                            "Business",
                                            "others",
                                        ]),
                                        job_stability: randomFromArray(job_stability_enum),
                                        location: faker_1.faker.location.secondaryAddress(),
                                        location_type: randomFromArray(location_type_enum),
                                        years_of_experience: randomFromArray([1, 2, 3, 4, 4.5]),
                                        skill_level: randomFromArray(experience_level_enum),
                                        preferred_job_type: randomFromArray(job_type_enum),
                                        skill_set: "others,|eating,|fooding",
                                        work_schedule: randomFromArray(work_schedule_enum),
                                    },
                                }
                                : {},
                            employer_details: !isApplicant
                                ? {
                                    create: {
                                        company_description: faker_1.faker.commerce.productDescription(),
                                        company_name: faker_1.faker.company.name(),
                                        company_email: faker_1.faker.internet.email({ provider: "co" }),
                                        company_logo: faker_1.faker.image.avatarLegacy(),
                                        company_website: faker_1.faker.internet.url(),
                                        company_size: randomFromArray(company_size_enum),
                                        culture: "good values,|nothing else",
                                        location: faker_1.faker.location.streetAddress(),
                                        industry: randomFromArray([
                                            "Tech",
                                            "Finance",
                                            "Business",
                                            "others",
                                        ]),
                                    },
                                }
                                : {},
                        },
                        include: { applicant_details: true, employer_details: true },
                    });
                    users.push(user);
                }
                return users;
            });
        }
        function seedJob() {
            return __awaiter(this, void 0, void 0, function* () {
                const jobs = [];
                for (let i = 0; i < NO_OF.JOB; i++) {
                    const job = yield index_1.default.job.create({
                        data: {
                            title: faker_1.faker.person.jobTitle(),
                            city_location: faker_1.faker.location.city(),
                            benefits: "good things,|love,|joy,|fanta,|etc",
                            description: faker_1.faker.lorem.paragraph(),
                            employment_type: randomFromArray(job_type_enum),
                            expires_at: faker_1.faker.date.soon(),
                            is_remote: Math.random() < 0.5,
                            max_salary: faker_1.faker.number.int({ min: 500, max: 5000 }),
                            min_salary: faker_1.faker.number.int({ max: 100 }),
                            required_experience_years: randomFromArray([1, 2, 3, 4, 5, 6]),
                            state_location: faker_1.faker.location.state(),
                            required_skills: "cooking,|fighting,|giveing life to christ,|and so on",
                            responsibilities: "come,|go,|check,|do your job,|chop",
                            salary_period: randomFromArray([
                                "monthly",
                                "weekly",
                                "bi-weekly",
                                "yearly",
                            ]),
                            category_id: randomFromArray(job_categories).id,
                            publisher_id: randomFromArray(employers).id,
                        },
                    });
                    jobs.push(job);
                }
                return jobs;
            });
        }
        function seedJobCategory() {
            return __awaiter(this, void 0, void 0, function* () {
                const cats = [];
                for (let i = 0; i < NO_OF.JOBCATEGORY; i++) {
                    const cat = yield index_1.default.jobCategory.create({
                        data: { name: faker_1.faker.internet.domainWord() },
                    });
                    cats.push(cat);
                }
                return cats;
            });
        }
        function seedApplication() {
            return __awaiter(this, void 0, void 0, function* () { });
        }
    });
}
seedDB().then(() => console.log("Database seeded successfully"));
//# sourceMappingURL=seed.js.map