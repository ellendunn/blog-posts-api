const chai = require('chai');
const chaiHttp = require('chai-http');

const { app, runServer, closeServer} = require('../server');

const expect = chai.expect;

chai.use(chaiHttp);

describe ("BlogPosts", function() {
	before(function() {
		return runServer();
	});

	after(function() {
		return closeServer();
	});


	it("should list blog post on GET", function() {
		return chai
		.request(app)
		.get("/blog-posts")
		.then(function(res) {
			expect(res).to.have.status(200);
			expect(res).to.be.json;
			expect(res.body).to.be.a("array");
			expect(res.body.length).to.be.at.least(1);
			const expectedKeys = ["id", "title", "content", "author", "publishDate"];
			res.body.forEach(function(item){
				expect(item).to.be.a("object");
				expect(item).to.include.keys(expectedKeys)
			});
		});
	});

	it("should add a blog post on POST", function() {
		const newPost = {
			title: "My Trip to Africa", 
			content: "content content content",
			author: "Ellen Dunn",
			publishDate: "July 19, 2018"
		};
		return chai
		.request(app)
		.post("/blog-posts")
		.send(newPost)
		.then(function(res){
			expect(res).to.have.status(201);
			expect(res).to.be.json;
			expect(res.body).to.include.keys("id", "title", "content", "author", "publishDate");
			expect(res.body.id).to.not.equal(null);
			expect(res.body).to.deep.equal(
				Object.assign(newPost, {id:res.body.id})
			)
		});
	});

	it("should edit a post on PUT", function() {
		const updateData = {
			title: "How I Kept My Cactus Alive", 
			content: "content content content",
			author: "Ellen Dunn",
			publishDate: "July 18, 2018"
		};
		return (
			chai
			.request(app)
			.get("/blog-posts")
			.then(function(res){
				updateData.id = res.body[0].id
				return chai
				.request(app)
				.put(`/blog-posts/${updateData.id}`)
				.send(updateData)
			})
			.then(function(res){
				expect(res).to.have.status(204);
				// expect(res).to.be.json;
				expect(res.body).to.be.a("object");
			})
		);
	});

	it("should delete a post on DELETE", function(){
		return (
			chai
			.request(app)
			.get("/blog-posts")
			.then(function(res){
				return chai
				.request(app)
				.delete(`/blog-posts/${res.body[0].id}`)
			})
			.then(function(res){
				expect(res).to.have.status(204)
			})
		);
	});
})



