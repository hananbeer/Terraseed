const express = require('express');
const fileUpload = require('express-fileupload');
const cors = require('cors');
const bodyParser = require('body-parser');
// const morgan = require('morgan');
// const _ = require('lodash');

const app = express();

// // enable files upload
// app.use(fileUpload({
//     createParentPath: true
// }));

//add other middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
// app.use(morgan('dev'));

app.use(fileUpload({
  // createParentPath: true,
  // limits: {
  //     fileSize: 10000000 //1mb
  // },
  // abortOnLimit: true
}))

app.post('/upload', function(req, res) {
  console.log(req.user)
  console.log(req.files); // the uploaded file object
});

app.use(express.static('./src')) //, [options]))

//start app 
const port = process.env.PORT || 8000;

app.listen(port, () => 
  console.log(`App is listening on port ${port}.`)
);
