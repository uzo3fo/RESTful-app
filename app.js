//DEPENDENCIES
var expressSanitizer = require('express-sanitizer');
    methodOverride   = require('method-override');
    bodyParser       = require('body-parser');
    mongoose         = require ('mongoose');
    express          = require('express');
	app              = express();
	
	
  
   

//APP CONFIG
mongoose.connect('mongodb://localhost:27017/restful_app', {useNewUrlParser: true});
app.use(bodyParser.urlencoded({extended: true}));
// expressSanitizer must be after bodyParser
app.use(expressSanitizer());
app.use(express.static('public'));
app.use(methodOverride('_method'));
app.set('view engine', 'ejs');

//SETUP SCHEMA
var blogSchema = new mongoose.Schema({
	title: String,
	image: String,
	body: String,
	created: {type: Date, default: Date.now}
});

//COMPILING SCHEMA INTO A MODEL
var Blog = mongoose.model('Blog', blogSchema);

//CREATING A SINGLE BLOG
/*Blog.create({
	title: 'Brown skin girl',
	image: 'https://images.unsplash.com/photo-1522512115668-c09775d6f424?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60',
	body: 'Brown skin girl the best in the world'
});*/

//ROOT PAGE
app.get('/', (req, res) => {
	res.redirect('/blogs');
});

//INDEX ROUTE--shows all the blogs
app.get('/blogs', (req, res)=>{
	//RETRIEVE BLOG FROM DB
	Blog.find({}, (err, blogs)=>{
		if(err){
			console.log('ERROR!!');
		} else {
			//RENDER INDEX WITH DATA
			res.render('index', {blogs: blogs});
		}
	});
});
	
//NEW ROUTE-- add a new blog
app.get('/blogs/new', (req, res)=>{
	res.render('new');
});

//CREATE ROUTE-- add a new  blog through the form to the index page
app.post('/blogs', (req, res)=>{
	//sanitizing the body
	req.body.blog.body = req.sanitize(req.body.blog.body);
	//create blog
	Blog.create(req.body.blog, (err, newBlog)=>{
		if(err){
			res.render('new');
		} else {
			//redirect to index
			res.redirect('/blogs');
		}
	});
});

//SHOW ROUTE-- shows details about an individual blog
app.get('/blogs/:id', (req, res)=>{
	//finding the correct blog inside the show template
	Blog.findById(req.params.id, (err, foundBlog)=>{
		if(err){
			res.redirect('/blogs');
		} else {
			res.render('show', {blog: foundBlog});
		}
	});
});

// EDIT ROUTE-shows the form for editing a single post
app.get('/blogs/:id/edit', (req, res)=>{
	//find the correct blog
	Blog.findById(req.params.id, (err, foundBlog)=>{
		if(err){
			res.redirect('/blogs');
		} else {
			res.render('edit', {blog: foundBlog});
		}
	});
});

//UPDATE ROUTE
app.put('/blogs/:id', (req, res)=>{
	//sanitizing the body
	req.body.blog.body = req.sanitize(req.body.blog.body);
	//takes three params --id, update and callback
	Blog.findByIdAndUpdate(req.params.id, req.body.blog, (err, updatedBlog)=>{
		if(err){
			res.render('/blogs');
		} else {
			//redirect you to the correct id
			res.redirect('/blogs/' + req.params.id);
		}
	});
});
//DELETE ROUTE

app.delete('/blogs/:id', (req,res)=>{
	//destroy
	Blog.findByIdAndRemove(req.params.id, (err)=>{
		if(err){
			res.redirect('/blogs');
		} else {
			res.redirect('/blogs');
		}
	});
});







app.listen(process.env.PORT||3000,process.env.ID, ()=> { 
      console.log('Server listening on port 3000'); 
});
