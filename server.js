const express = require('express');
const router = express.Router();
const morgan = require('morgan');
const bodyParser = require('body-parser');

const {BlogPosts} = require('./models.js');

const jsonParser = bodyParser.json();

const app = express();

app.use(morgan('common'));

// adding some blog posts
BlogPosts.create(
	'How to Lose A Guy In 10 Days', 
	'content content content',
	'Andy Anderson',
	'May 15, 2018');
BlogPosts.create(
	'Makeup Tutorial for the Low-Budget Professional',
	'content content content',
	'Sam Sameulson',
	'June 12, 2018');
BlogPosts.create(
	'Recipe for the Best Chocolate Pie',
	'content content content',
	'Paula Dean',
	'July 3, 2018');

app.get('/blog-posts', (req, res)=>{
	res.json(BlogPosts.get());
})

app.post('/blog-posts', jsonParser, (req, res)=>{
	const requiredFields = ['title', 'content', 'author', 'publishDate'];
	for (let i=0; i<requiredFields.length; i++){
		const field = requiredFields[i];
		if (!(field in req.body)){
			const message = `Missing \`${field}\` in request body`
			console.error(message);
			return res.status(400).send(message);
		}
	}
	const post = BlogPosts.create(req.body.title, req.body.content, req.body.author, req.body.publishDate);
	res.status(201).json(post);
})


app.put('/blog-posts/:id', jsonParser, (req, res)=>{
	const requiredFields = ['title', 'content', 'author', 'publishDate'];
	for (let i=0; i<requiredFields.length; i++){
		const field = requiredFields[i];
		if (!(field in req.body)){
			const message = `Missing \`${field}\` in request body`
			console.error(message);
			return res.status(400).send(message);
		}
	}
	if (req.params.id != req.body.id) {
		const message = `Request path id \`${req.params.id}\` and request body id \`${req.body.id}\` must match`
		console.error(message);
		return res.status(400).send(message)
	}
	console.log(`Updating blog posts \`${req.params.id}\``);
	BlogPosts.update({
		id: req.params.id,
		title: req.body.title,
		content: req.body.content,
		author: req.body.author,
		publishDate: req.body.publishDate
	});
	res.status(204).end()
});

app.delete('/blog-posts/:id', (req, res)=>{
	BlogPosts.delete(req.params.id);
	console.log(`Deleted blog post \`{req.params.id}\``);
	res.status(204).end()
})

app.listen(process.env.PORT || 8080, () => {
  console.log(`Your app is listening on port ${process.env.PORT || 8080}`);
});




