import express, { json } from "express"
import { v4 as uuidv4 } from 'uuid';
import db from "./lib/db.js"
import bcrypt from 'bcrypt'
import cors from "cors"
import jwt from "jsonwebtoken"


const app = express();
const port = 3000;

app.use(cors({
  origin: 'http://localhost:5173', 
  credentials: true,                
}));


try {
    const conn = await db.getConnection();
    console.log("✅ Connected to MySQL successfully!");
    conn.release();
} catch (err) {
    console.error("❌ DB connection failed:", err.message);
}

const jwtsecret = process.env.JWT_SECRET;
app.use(json());

app.listen(port,()=>{
    console.log(`server is running on port ${port}`)
});


app.post("/api/login", async (req, res) => {
    const data = req.body;
    const {email , password} = data;
    console.log('Received data:', email , password);
    const [database] = await db.execute('Select * FROM users WHERE email = ?', [email]);

    if(database.length == 0){
        return res.status(401).json({success:false,message:"User not found"});
    }else if(!(await bcrypt.compare(password,database[0].password))){
        return res.status(401).json({status:false,message:"Invalid password"})
    }else{
        
        const token = jwt.sign({
            email:email
        },jwtsecret,{
            expiresIn:'24h'
        });
        return res.status(200).json({
            success:true,
            message:"Login successful",
            token,
            user:database[0].username,
            role:database[0].role
        });
    }
});


app.post("/api/registration", async(req,res)=>{
    const {username,email,password}  = req.body;
    console.log('Received registration data:', username, email, password);


    const [databaseDataEmail] = await db.execute('SELECT email FROM users WHERE email = ?', [email]);
    const [databaseDataUsername] = await db.execute('SELECT username FROM users WHERE username = ?', [username]);
    console.log(databaseDataEmail.length);

    if(databaseDataEmail.length == 1){
        console.log('User already exists with email:', email);
        return res.status(409).json({ success: false, message: "Email already exists" });
    }else if(databaseDataUsername.length == 1){
        console.log('User already exists with username:', username);
        return res.status(409).json({ success: false, message: "Username already exists" });
    }else{
        console.log('User can be registered');
        const hashedPass = await bcrypt.hash(password, 12);
    const id = uuidv4();
    const [result] = await db.execute(
                'INSERT INTO users (id, username, email, password, role) VALUES (?, ?, ?, ?, ?)',
                [id, username, email, hashedPass, 'user']
        );
        
        console.log('User inserted successfully:', result.insertId);
        return res.status(201).json({ success: true, message: "User registered successfully" });    
    }

    
});

    const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ 
        success: false, 
        message: 'Access token required' 
        });
    }

    jwt.verify(token, jwtsecret, (err, user) => {
        if (err) {
        return res.status(403).json({ 
            success: false, 
            message: 'Invalid or expired token' 
        });
        }
        req.user = user;
        next();
    });
    };


    app.get("/api/me", authenticateToken, async (req, res) => {
    try {
        const email = req.user.email;
        
        // Get user data from database
        const [database] = await db.execute(
        'SELECT id, username, email, role FROM users WHERE email = ?', 
        [email]
        );

        if (database.length === 0) {
        return res.status(404).json({
            success: false,
            message: "User not found"
        });
        }

        const user = database[0];
        
        return res.status(200).json({
        success: true,
        user: {
            id: user.id,
            username: user.username,
            email: user.email,
            role: user.role
        }
        });

    } catch (error) {
        console.error("Error in /api/me:", error);
        return res.status(500).json({
        success: false,
        message: "Internal server error"
        });
    }
    });

    app.get("/api/dashboard", async (req, res) => {
        console.log("Fetching all cars");
        const [data] = await db.execute('SELECT * FROM cars');
        console.log(data[0]);
        return res.json({data});
    });

    app.get("/api/dashboard/:id",async (req,res)=>{
        const id = req.params.id;
        const [data] = await db.execute("SELECT * FROM cars WHERE id = ?", [id]);
        console.log(data[0])
        return res.json({data:data[0]});
    })

    app.get("/api/admin/cars", authenticateToken, async (req, res) => {
        console.log("Fetching all cars");
        const [data] = await db.execute('SELECT * FROM cars');
        console.log(data[0]);
        return res.json({data});
    });
