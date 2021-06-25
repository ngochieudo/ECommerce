const lib = require("./lib");
const app = lib.express;
const mongoose = lib.mongoose;
const session = lib.session;
const bodyParser = lib.bodyParser;
app.use(session({
    resave: true,
    saveUninitialized: true,
    secret: "123456",
    cookie: { maxAge: 600000 }
}))

app.use(bodyParser.urlencoded({
    extended: true
}))

app.set("view engine", "hbs")
app.use(lib.express.static(lib.path.join(__dirname, "/")))

const uri = "mongodb+srv://peps1man:dongochieu@cluster0.smhlw.mongodb.net/test"
mongoose.connect(uri, {useNewUrlParser: true, useUnifiedTopology: true })
.then(function (){
    console.log("Database connected!")
}).catch(function (err){
    console.log(err)
})



app.get('/', function (req, res){

})
