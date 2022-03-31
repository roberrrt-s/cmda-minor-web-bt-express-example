import express from 'express';
import { engine } from 'express-handlebars';
import bodyParser from "body-parser";
import fs from 'fs';
import multer from 'multer';

const app = express()
const port = process.env.PORT || 3000

// Gebruik template engine handlebars voor DYNAMISCHE content
app.engine('handlebars', engine());
app.set('view engine', 'handlebars');
app.set('views', './views');

// Hierdoor kan ik CSS en JS bestanden aan de client side uitlezen
app.use(express.static('public'));

// Gebruik body-parser om te lezen wat er in POST requests van de form staat
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/uploads/')
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname)
  }
});

var upload = multer({ storage: storage }).single('avatar');

app.post('/afbeelding', upload, (req, res, next) => {

	console.log(req.file)

    //Implement your own logic if needed. Like moving the file, renaming the file, etc.
    res.render('home', {
    	image: req.file.originalname
    });

})

// Route. Luistert naar alle GET requests op /
app.get('/', (req, res) => {

	fs.readFile('informatie.json', 'utf8', function (err, data) {
	  if (err) throw err;
	  let info = JSON.parse(data);

  		res.render('home', {
  			eerder_opgeslagen_data: info
  		})

	});
})

app.get('/user/:id', (req, res) => {

	let input = req.params.id

	if(req.params.id) {
		if(req.params.id === 'robert') {
			input = 'nee doe maar niet';
		}
	}

	res.render('home', {
		persoon: input
	})
})

let userInput;

app.post('/', (req, res) => {
	console.log(req.body)

	userInput = JSON.stringify(req.body.naam)

	fs.writeFile('informatie.json', userInput, 'utf8', cb => {
		console.log('werk dan');
	});


	// vertaalDataNaarSpaans(userInput);

	res.render('home', {
		gebruikersnaam: userInput
	})
})


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})