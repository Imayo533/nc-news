const app = require("../app.js");
const request = require("supertest");
const db = require('../db/connection.js');
const testData = require('../db/data/test-data/index.js');
const seed = require('../db/seeds/seed.js');
const endPoints = require("../endpoints.json")

beforeEach(() => seed (testData));
afterAll(() => db.end());

describe("nc_news",()=>{
    describe("GET /api/topics", ()=>{
        test("Status:200 should return an array of topic objects having the properties slug and description", ()=>{
            return request(app)
            .get("/api/topics")
            .expect(200)
            .then(({body})=>{
                const {topics}=body
                expect(topics).toBeInstanceOf(Array)
                expect(topics).toHaveLength(3)
                topics.forEach((topic)=>{
                    expect(topic).toMatchObject({
                        slug: expect.any(String),
                        description: expect.any(String)
                    })
                })
            })
        })
        test("Status:404 when passing an invalid endpoint for api/topics", ()=>{
            return request(app)
            .get("/api/invalidendpoint")
            .expect(404)
            .then((response)=>{
                expect(response.body.msg).toBe("Not found!")
            })
        })
    })
    describe("GET /api",()=>{
        test("Status 200: returns an object describing all the available endpoints on your API",()=>{
            return request(app)
            .get("/api")
            .expect(200)
            .then((response)=>{
                expect(response.body.endPoints).toEqual(endPoints)
            })
        })
    })
})