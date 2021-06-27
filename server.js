const Product = require("./models/products.models")
const { hbs } = require("./lib");
const lib = require("./lib");
const app = lib.express();
const mongoose = lib.mongoose;
const session = lib.session;
const bodyParser = lib.bodyParser;
const User = require("./models/users.models");
hbs.registerHelper("isEqual", function (v1, v2, options){
    return (v1 == v2) ? options.fn(this) : options.inverse(this);
})
app.use(session({
    resave: true,
    saveUninitialized: true,
    secret: "123456",
    cookie: { maxAge: 600000 }
}))
hbs.registerPartials("views/partials")
app.use(bodyParser.urlencoded({
    extended: true
}))

app.set("view engine", "hbs");
app.set("view options", { layout: "layouts/main.hbs" })
app.use(lib.express.static(lib.path.join(__dirname, "/views")))

const uri = "mongodb+srv://peps1man:dongochieu@cluster0.smhlw.mongodb.net/test"
mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(function () {
        console.log("Database connected!")
    }).catch(function (err) {
        console.log(err)
    })



app.get('/', async function (req, res) {
    //Tim kiem tat ca san pham
    var products = await Product.find({})
    //O search rong = tim tat ca san pham
    if(req.query.search) {
        //tim san pham ma khong can ghi day du ten
        var query = {"$regex": req.query.search, "$options": "i"} 
        products = await Product.find({name: query})
    }
    var userSession = "Guest";
    if(req.session.user) userSession = req.session.user; 
    res.render("index", {title: "Main Page", user: userSession, productData: products})
})

app.get('/login', function (req, res) {
    res.render("users/login", {title: "Login"})
})

app.post('/login', async function (req,res) {
    function notify(message) {
        res.render("users/login", {title: "Login", message: message})
    }
    if(!req.body.username || !req.body.password) return notify("Please enter username/password")
    else if(req.body.username.length < 5 || req.body.password.length < 5) return notify("Username/password must exceeds 5 characters!")
    await User.findOne({username: req.body.username, password: req.body.password}, function (err, result){
        if(err) notify("Login failed!");
        else {
            if(!result) return notify("Account incorrect!")
            req.session.user = req.body.username;
            res.redirect("/")
        }
    })
})

app.get('/signup', function (req, res) {
    res.render("users/signup", {title: "Sign up"})
})

app.post('/signup', async function (req, res) {
    //render trang web + tin nhan
    
    function notify(message) {
        res.render("users/signup", {title: "Sign up", message: message})
    }
    if(!req.body.username || !req.body.password) return notify("Please enter username/password")
    else if(req.body.username.length < 5 || req.body.password.length < 5) return notify("Username/password must exceeds 5 characters!")
    await User.create({username: req.body.username, password: req.body.password}, function (err) {
        if(err) notify("Failed to sign up!");
        else notify("Sign up success!");
    })
})
app.get('/logout', function (req,res) {
    req.session.user = undefined
    res.redirect("/login")
})
var port = process.env.PORT || 3000;
app.listen(port)

