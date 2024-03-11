const app = require("../app.js");
const request = require("supertest");
const db = require("../db/connection.js");
const testData = require("../db/data/test-data/index.js");
const seed = require("../db/seeds/seed.js");
const endPoints = require("../endpoints.json");
const comments = require("../db/data/test-data/comments.js");

beforeEach(() => seed(testData));
afterAll(() => db.end());

describe("nc_news", () => {
  describe("GET /api/topics", () => {
    test("Status:200 should return an array of topic objects having the properties slug and description", () => {
      return request(app)
        .get("/api/topics")
        .expect(200)
        .then(({ body }) => {
          const { topics } = body;
          expect(topics).toBeInstanceOf(Array);
          expect(topics).toHaveLength(3);
          topics.forEach((topic) => {
            expect(topic).toMatchObject({
              slug: expect.any(String),
              description: expect.any(String),
            });
          });
        });
    });
    test("Status:404 when passing an invalid endpoint for api/topics", () => {
      return request(app)
        .get("/api/invalidendpoint")
        .expect(404)
        .then((response) => {
          expect(response.body.msg).toBe("Not found!");
        });
    });
  });
  describe("GET /api", () => {
    test("Status 200: returns an object describing all the available endpoints on your API", () => {
      return request(app)
        .get("/api")
        .expect(200)
        .then((response) => {
          expect(response.body.endPoints).toEqual(endPoints);
        });
    });
  });
  describe("GET /api/articles/:article_id", () => {
    test("Status 200: returrns an article object requested by its id with its corresponding properties", () => {
      return request(app)
        .get("/api/articles/2")
        .expect(200)
        .then((response) => {
          expect(response.body.article.article_id).toBe(2);
        });
    });
    test("Returns an article object with properties article_id, title, topic, author, body, created_at, votes and article_img_url", () => {
      return request(app)
        .get("/api/articles/2")
        .expect(200)
        .then((response) => {
          const objectArticle = response.body.article;
          expect(objectArticle).toMatchObject({
            article_id: expect.any(Number),
            title: expect.any(String),
            topic: expect.any(String),
            author: expect.any(String),
            body: expect.any(String),
            created_at: expect.any(String),
            votes: expect.any(Number),
            article_img_url: expect.any(String),
          });
        });
    });
    test("Should respond with error if given article id is an invalid type (not a number)", () => {
      return request(app)
        .get("/api/articles/invalidtype")
        .expect(400)
        .then((response) => {
          const error = response.body;

          expect(error.msg).toBe("Bad request");
        });
    });
    test("Should respond error 404 if passed a non existent id", () => {
      return request(app)
        .get("/api/articles/9999")
        .expect(404)
        .then((response) => {
          const error = response.body;
          expect(error.msg).toBe("Not found");
        });
    });
  });
  describe("GET /api/articles", () => {
    test("Status: 200 returns array of article objects with its properties sorted by date desc and not include body property", () => {
      return request(app)
        .get("/api/articles")
        .expect(200)
        .then((response) => {
          const arrayOfArticles = response.body;
          arrayOfArticles.forEach((article) => {
            expect(article).toMatchObject({
              article_id: expect.any(Number),
              title: expect.any(String),
              topic: expect.any(String),
              author: expect.any(String),
              created_at: expect.any(String),
              votes: expect.any(Number),
              article_img_url: expect.any(String),
              comment_count: expect.any(Number),
            });
            expect(Object.prototype.hasOwnProperty.call(article, "body")).toBe(
              false
            );
          });
        });
    });
    test("Array of objects is sorted by created_at in descending order", () => {
      return request(app)
        .get("/api/articles")
        .expect(200)
        .then((response) => {
          const arrayOfArticles = response.body;
          expect(arrayOfArticles).toBeSortedBy("created_at", {
            descending: true,
          });
        });
    });
    test("Status:404 when passing an invalid endpoint for api/articles", () => {
      return request(app)
        .get("/api/articlesendpointnotvalid")
        .expect(404)
        .then((response) => {
          expect(response.body.msg).toBe("Not found!");
        });
    });
  });
  describe("GET /api/articles/:article_id/comments", () => {
    test("Status: 200 returning an array of comments for the given article_id having the following properties: comment_id, votes, created_at, author, body, article_id", () => {
      return request(app)
        .get("/api/articles/1/comments")
        .expect(200)
        .then((response) => {
          const arrayOfComments = response.body;
          arrayOfComments.forEach((comment) => {
            expect(comment).toMatchObject({
              comment_id: expect.any(Number),
              body: expect.any(String),
              article_id: 1,
              author: expect.any(String),
              votes: expect.any(Number),
              created_at: expect.any(String),
            });
          });
        });
    });
    test("Array of comments is sorted by created_at in descending order", () => {
      return request(app)
        .get("/api/articles/1/comments")
        .expect(200)
        .then((response) => {
          const arrayOfComments = response.body;
          expect(arrayOfComments).toBeSortedBy("created_at", {
            descending: true,
          });
        });
    });
    test("Status 404 error when passed and inexistent id", () => {
      return request(app)
        .get("/api/articles/13/comments")
        .expect(404)
        .then((response) => {
          const arrayOfComments = response.body;

          expect(arrayOfComments.msg).toBe("Not found!");
        });
    });
    test("Should respond with error of bad request if given an invalid id", () => {
      return request(app)
        .get("/api/articles/idisinvalid/comments")
        .expect(400)
        .then((response) => {
          const error = response.body;
          expect(error.msg).toBe("Bad request");
        });
    });
  });
  describe("POST /api/articles/:article_id/comments", () => {
    test("Status 201 when insterting new comment", () => {
      return request(app)
        .post("/api/articles/1/comments")
        .send({
          username: "rogersop",
          body: "Excellent article",
        })
        .expect(201)
        .then((result) => {
          expect(result.body.comment_id).toBe(19);
          expect(result.body.body).toBe("Excellent article");
          expect(result.body.article_id).toBe(1);
          expect(result.body.author).toBe("rogersop");
          expect(result.body.votes).toBe(0);
          expect(result.body).toHaveProperty("created_at");
        });
    });
    test("Status 400 with error message when request object is missing keys", () => {
      return request(app)
        .post("/api/articles/1/comments")
        .send({
          username: "rogersop",
        })
        .expect(400)
        .then((result) => {
          expect(result.body.msg).toBe("Bad request");
        });
    });
    test("Should respond with error 400 status of bad request if given an invalid id", () => {
      return request(app)
        .post("/api/articles/idisinvalid/comments")
        .send({
          username: "rogersop",
          body: "Excellent article",
        })
        .expect(400)
        .then((response) => {
          const error = response.body;
          expect(error.msg).toBe("Bad request");
        });
    });
    test("Should respond with error 404 status of not found if given an inexistent id", () => {
      return request(app)
        .post("/api/articles/99999/comments")
        .send({
          username: "rogersop",
          body: "Excellent article",
        })
        .expect(404)
        .then((response) => {
          const error = response.body;
          expect(error.msg).toBe("Not found");
        });
    });
    test("Should respond with error 404 status of not found if user does not exist", () => {
      return request(app)
        .post("/api/articles/1/comments")
        .send({
          username: "userdoesnotexist",
          body: "Excellent article",
        })
        .expect(404)
        .then((response) => {
          const error = response.body;
          expect(error.msg).toBe("Not found!");
        });
    });
  });
  describe("CORE: PATCH /api/articles/:article_id", () => {
    test("Status 200 request body accepts an object in the form { inc_votes: newVote }.", () => {
      return request(app)
        .patch("/api/articles/1")
        .send({ inc_votes: 1 })
        .expect(200)
        .then((result) => {
          expect(result.body.updatedArticle.votes).toBe(101);
        });
    });
    test("Should respond with error 400 status of bad request if given an invalid id", () => {
      return request(app)
        .patch("/api/articles/idisinvalid")
        .send({ inc_votes: 1 })
        .expect(400)
        .then((response) => {
          const error = response.body;
          expect(error.msg).toBe("Bad request");
        });
    });
    test("Should respond with error 404 status of not found if user does not exist", () => {
      return request(app)
        .patch("/api/articles/999999")
        .send({ inc_votes: 1 })
        .expect(404)
        .then((response) => {
          const error = response.body;
          expect(error.msg).toBe("Not found!");
        });
    });
    test("Should respond with error 400 status of bad request if given an empty patch", () => {
      return request(app)
        .patch("/api/articles/idisinvalid")
        .send({})
        .expect(400)
        .then((response) => {
          const error = response.body;
          expect(error.msg).toBe("Bad request");
        });
    });
    test("Should respond with error 400 status of bad request if given an invalid data type", () => {
      return request(app)
        .patch("/api/articles/idisinvalid")
        .send({ inc_votes: "number" })
        .expect(400)
        .then((response) => {
          const error = response.body;
          expect(error.msg).toBe("Bad request");
        });
    });
  });
  describe("CORE: DELETE /api/comments/:comment_id", () => {
    test("Status 204 delete the given comment by comment_id.", () => {
      return request(app)
        .del("/api/comments/1")
        .expect(204)
        .then((result) => {
        
          expect(result.body).toEqual({});
        });
    });
  });
});
