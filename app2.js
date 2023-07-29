const express = require('express')
const cors = require('cors')
const fs = require('fs')
const path = require('path')
const port = 3000
require('dotenv').config()


//////////////////////////////////////////////////////////////////////////////////

const app = express()

const server = require("http").Server(app)
const io = require("socket.io")(server)

app.use(cors())
///////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////Always add these///////////////////////////////
app.set('view engine', 'html'); 
app.engine('html', require('ejs').renderFile)
app.use(express.json({limit: '50mb'}));
app.use(express.urlencoded({limit: '50mb'}));
app.use(express.static(__dirname+'/public/'));
app.use('/assets', express.static(path.join(__dirname, 'assets')))
// app.use('/models', express.static(path.join(__dirname, '/public/models')))
// app.use('/js', express.static(path.join(__dirname, 'js')))
// app.use('/views', express.static(path.join(__dirname, '/public/views')))
  

app.get('/',(req,res) => {
    res.render('index1.html')
});


// Registration Form submit handling
app.get("/register", (req, res) => {
    res.render('reg.html')
})
 
app.post('/addUser', (req,res) => {
    const data = req.body;
    // console.log(data)
    const imageData = data.image64.replace(/^data:image\/\w+;base64,/, '');
    // console.log(imageData)
     const buffer = Buffer.from(imageData, 'base64');
    //  console.log(buffer)
    fs.mkdirSync(`./assets/images/labels/${data.name}`)
     const imgName = `./assets/images/labels/${data.name}/1.png`
    fs.writeFileSync(imgName, buffer, err => {
          if (err) {  res.status(500).send({ error: 'Error saving image' })} 
          else {  res.send({ 'ImageName':imgName })
                 console.log('Added New User!')}
    });
})

app.get('/getLabels', (req,res)=>{
    const testFolder = path.join(__dirname, './assets/images/labels');
    // const fs = require('fs');
    // console.log(path.join(__dirname, ''))
    let labels = [];
    fs.readdirSync(testFolder).forEach(file => {
        // console.log(file);
        labels.push(file)
    });
    // console.log(labels)
    res.send(labels)
})

// io.on('connection', function (socket) {
//     socket.on('hello',()=>{
//         const testFolder = path.join(__dirname, './assets/images/labels');
//         // const fs = require('fs');
//         // console.log(path.join(__dirname, ''))
//         let labels = [];
//         fs.readdirSync(testFolder).forEach(file => {
//             // console.log(file);
//             labels.push(file)
//         });
//         // console.log(labels)
//         socket.emit('labels',labels)
//     })
// })




server.listen(port, ()=>console.log(`App started running on port: ${port}`))