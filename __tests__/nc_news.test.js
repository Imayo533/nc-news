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
    describe("GET /api/articles/:article_id",()=>{
        test("Status 200: returrns an article object requested by its id with its corresponding properties",()=>{
            return request(app)
            .get("/api/articles/2")
            .expect(200)
            .then((response)=>{
                expect(response.body.article.article_id).toBe(2)
            })
        })
        test("Returns an article object with properties article_id, title, topic, author, body, created_at, votes and article_img_url", ()=>{
            return request(app)
            .get("/api/articles/2")
            .expect(200)
            .then((response)=>{
                const objectArticle = response.body.article
                    expect(objectArticle).toMatchObject({
                        article_id: expect.any(Number),
                        title: expect.any(String),
                        topic: expect.any(String),
                        author: expect.any(String),
                        body: expect.any(String),
                        created_at: expect.any(String),
                        votes: expect.any(Number),
                        article_img_url: expect.any(String)
                    })
            })
        })
        test("Should respond with error if given article id is an invalid type (not a number)", ()=>{
            return request(app)
            .get("/api/articles/invalidtype")
            .expect(400)
            .then((response)=>{
                const error = response.body
                expect(error.msg).toBe("Bad request")
            })
        })
    })
    describe("GET /api/articles", ()=>{
        test("Status: 200 returns array of article objects with its properties sorted by date desc and not include body property", ()=>{
            return request(app)
            .get("/api/articles")
            .expect(200)
            .then((response)=>{
                const arrayOfArticles = response.body
                arrayOfArticles.forEach((article)=>{
                    expect(article).toMatchObject({
                        article_id: expect.any(Number),
                        title: expect.any(String),
                        topic: expect.any(String),
                        author: expect.any(String),
                        created_at: expect.any(String),
                        votes: expect.any(Number),
                        article_img_url: expect.any(String),
                        comment_count: expect.any(String)
                    })
                })
            })
        })
        test("Array of objects is sorted by created_at in descending order", ()=>{
            return request(app)
            .get("/api/articles")
            .expect(200)
            .then((response)=>{
                const arrayOfArticles = response.body
                expect(arrayOfArticles).toBeSortedBy("created_at", {
                    descending: true,
                })
            })
        })
        test("Status:404 when passing an invalid endpoint for api/articles", ()=>{
            return request(app)
            .get("/api/articlesendpointnotvalid")
            .expect(404)
            .then((response)=>{
                expect(response.body.msg).toBe("Not found!")
            })
        })
    })
})