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
const jobs_json_1 = __importDefault(require("../src/models/jobs.json"));
function randomFromArray(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}
function uniqueRandomFromArray(arr) {
    const remainingEle = [...arr];
    return function () {
        if (remainingEle.length === 0) {
            return null;
        }
        let randInd = Math.floor(Math.random() * remainingEle.length);
        return remainingEle.splice(randInd, 1)[0];
    };
}
const NO_OF = {
    USER: 30,
    APPLICANT: 5,
    EMPLOYER: 5,
    JOB: 30,
    JOBCATEGORY: 5,
    APPLICATION: 10,
};
const another_enum = jobs_json_1.default.job_field;
const company_size_enum = jobs_json_1.default.company_size;
const job_type_enum = ["part-time", "full-time", "contract"];
const experience_level_enum = ["entry-level", "mid-level", "advance-level"];
const work_schedule_enum = jobs_json_1.default.work_schedule;
const qualification_enum = jobs_json_1.default.qualifications;
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
        yield seedApplication();
        function seedUser() {
            return __awaiter(this, void 0, void 0, function* () {
                const users = [];
                const randState = jobs_json_1.default.states[faker_1.faker.number.int({ max: jobs_json_1.default.states.length })];
                for (let i = 0; i < NO_OF.USER; i++) {
                    const isApplicant = Math.random() < 0.5;
                    const user = yield index_1.default.user.create({
                        data: {
                            first_name: faker_1.faker.person.firstName(),
                            last_name: faker_1.faker.person.lastName(),
                            email: faker_1.faker.internet.email({ provider: "gmail" }),
                            address: faker_1.faker.location.streetAddress(),
                            password: "$2b$10$qTD1CXcTFhVxcozODRqnH.xgoUIiMBPAado2BqGnQ7qTNChfLXm.a",
                            username: faker_1.faker.internet.userName(),
                            gender: Math.random() < 0.49 ? "M" : "F",
                            date_of_birth: faker_1.faker.date.past({
                                years: randomFromArray([18, 19, 20, 21, 22, 23, 24, 25, 26]),
                            }),
                            is_applicant: isApplicant,
                            applicant_details: isApplicant
                                ? {
                                    create: {
                                        avatar: faker_1.faker.internet.avatar(),
                                        cv_resume_url: faker_1.faker.internet.url(),
                                        job_field: JSON.stringify(randomFromArray(another_enum)),
                                        qualifications: JSON.stringify([...Array(faker_1.faker.number.int({ max: 6 }))].map((el) => randomFromArray(qualification_enum))),
                                        job_stability: randomFromArray(job_stability_enum),
                                        location: faker_1.faker.location.secondaryAddress(),
                                        location_type: randomFromArray(location_type_enum),
                                        years_of_experience: randomFromArray([1, 2, 3, 4, 4.5]),
                                        skill_level: randomFromArray(jobs_json_1.default.job_level),
                                        preferred_job_type: randomFromArray(jobs_json_1.default.job_type),
                                        skill_set: JSON.stringify([
                                            "Farming & Agriculture",
                                            "Food Services & Catering",
                                            "Health & Safety",
                                            "Hospitality & Leisure",
                                            "Human Resources",
                                            "Legal Services",
                                        ]),
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
                                        culture: JSON.stringify(["good values", "nothing else"]),
                                        company_location_city: randState.cities[faker_1.faker.number.int({ max: randState.cities.length })],
                                        company_location_state: randState.name,
                                        company_location_street: faker_1.faker.location.streetAddress(),
                                        industry: randomFromArray(another_enum),
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
                            benefits: "good things|love|joy|fanta|etc",
                            summary: faker_1.faker.lorem.paragraph(),
                            employment_type: randomFromArray(jobs_json_1.default.job_type),
                            experience_level: randomFromArray(jobs_json_1.default.job_level),
                            expires_at: faker_1.faker.date.soon({
                                days: faker_1.faker.number.int({ max: 100, min: 1 }),
                            }),
                            description_and_requirement: faker_1.faker.lorem.paragraphs(4),
                            min_quaification: randomFromArray(qualification_enum),
                            is_remote: Math.random() < 0.5,
                            max_salary: faker_1.faker.number.int({ min: 500, max: 5000 }),
                            min_salary: faker_1.faker.number.int({ max: 100 }),
                            required_experience_years: randomFromArray([1, 2, 3, 4, 5, 6]),
                            state_location: faker_1.faker.location.state(),
                            required_skills: "cooking|fighting|giveing life to christ|and so on",
                            responsibilities: "come|go|check|do your job|chop",
                            salary_period: randomFromArray([
                                "monthly",
                                "weekly",
                                "bi-weekly",
                                "yearly",
                            ]),
                            category_id: randomFromArray(job_categories).id,
                            publisher_id: randomFromArray(employers).id,
                            published_at: faker_1.faker.date.recent({
                                days: faker_1.faker.number.int({ max: 4, min: 1 }),
                            }),
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
                for (let i = 0; i < jobs_json_1.default.job_categories.length; i++) {
                    const cat = yield index_1.default.jobCategory.create({
                        data: { name: jobs_json_1.default.job_categories[i] },
                    });
                    cats.push(cat);
                }
                return cats;
            });
        }
        function seedApplication() {
            var _a;
            return __awaiter(this, void 0, void 0, function* () {
                const applications = [];
                for (let i = 0; i < applicants.length - 2; i++) {
                    const application = yield index_1.default.application.create({
                        data: {
                            content: faker_1.faker.lorem.paragraphs(30),
                            applicant: {
                                connect: { id: (_a = uniqueRandomFromArray(applicants)()) === null || _a === void 0 ? void 0 : _a.id },
                            },
                            job: { connect: { id: randomFromArray(jobs).id } },
                        },
                    });
                    applications.push(application);
                }
                return applications;
            });
        }
    });
}
seedDB().then(() => console.log("Database seeded successfully"));
//# sourceMappingURL=seed.js.map