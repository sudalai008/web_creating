const chai = require("chai");
const chaiHttp = require("chai-http");

const createApp = require("../src/server");

chai.use(chaiHttp);
chai.should();

describe("API /healthz", () => {
  it("it should return 200", done => {
    chai
      .request(createApp())
      .get("/healthz")
      .end((err, res) => {
        res.should.have.status(200);
        done();
      });
  });
});

describe("API /", () => {
  it("returns the database version message", done => {
    const app = createApp({
      raw: () => Promise.resolve([[{ version: "8.0.0" }], []])
    });
    chai
      .request(app)
      .get("/")
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.deep.equal({ message: "Hello, my DB is 8.0.0" });
        done();
      });
  });
});

describe("API /readyz", () => {
  it("reports a database connection failure without exposing details", done => {
    const app = createApp({
      raw: () => Promise.reject(new Error("database credentials rejected"))
    });
    chai
      .request(app)
      .get("/readyz")
      .end((err, res) => {
        res.should.have.status(503);
        res.body.should.deep.equal({ error: "Backend dependency unavailable" });
        done();
      });
  });
});
