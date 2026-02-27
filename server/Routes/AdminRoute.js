import express  from 'express'
import pool, { promisePool } from '../Utils/db.js'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import multer from 'multer'
import path from 'path'
import { fileURLToPath } from 'url'
import fs from 'fs'
import rateLimit from 'express-rate-limit'
import { z } from 'zod'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// const router = express.Router()

// Ensure upload directory exists
const uploadDir = path.join(__dirname, '..', 'Public', 'Images')
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true })
}

// Configure multer for file upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir)
  },
  filename: (req, file, cb) => {
    cb(null, file.fieldname + "_" + Date.now() + path.extname(file.originalname))
  }
})

const upload = multer({
  storage: storage
})

const router = express.Router();
const con = pool;

// Rate limit login to prevent brute force
const loginLimiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 10,
  message: { loginStatus: false, Error: "Too many login attempts. Try again later." },
});

// Server-side validation schemas
const registerSchema = z.object({
  name: z.string().trim().min(2).max(60),
  email: z.string().trim().email().max(120),
  password: z
    .string()
    .min(8)
    .max(128)
    .regex(/[a-z]/)
    .regex(/[A-Z]/)
    .regex(/\d/)
    .regex(/[@$!%*?&()[\]{}<>^#~+=_\-\\/|:;"',.]/),
});

const loginSchema = z.object({
  email: z.string().trim().email(),
  password: z.string().min(8).max(128),
});

// ADMIN REGISTER
router.post("/adminregister", async (req, res) => {
  const parsed = registerSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ Status: false, Error: "Invalid input", Details: parsed.error.issues });
    // Don't expose too much detail in production
  }

  const { name, email, password } = parsed.data;

  try {
    // Check if email exists
    const [existing] = await promisePool.execute("SELECT id FROM admins WHERE email = ? LIMIT 1", [email]);
    if (existing.length > 0) {
      return res.status(409).json({ Status: false, Error: "Email already registered" });
    }

    // Hash password
    const saltRounds = 12;
    const password_hash = await bcrypt.hash(password, saltRounds);

    // Insert admin (parameterized query prevents SQL injection)
    const [result] = await promisePool.execute(
      "INSERT INTO admins (name, email, password_hash) VALUES (?, ?, ?)",
      [name, email, password_hash]
    );

    return res.json({ Status: true, id: result.insertId });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ Status: false, Error: "Server error" });
  }
});

// ADMIN LOGIN
router.post("/adminlogin", loginLimiter, async (req, res) => {
  console.log(' Admin login attempt:', req.body.email);
  console.log('JWT_SECRET loaded:', process.env.JWT_SECRET ? 'Yes' : 'No');
  
  const parsed = loginSchema.safeParse(req.body);
  if (!parsed.success) {
    console.log(' Validation failed:', parsed.error.issues);
    return res.status(400).json({ loginStatus: false, Error: "Invalid input" });
  }

  const { email, password } = parsed.data;

  try {
    const [rows] = await promisePool.execute(
      "SELECT id, email, password_hash FROM admins WHERE email = ? LIMIT 1",
      [email]
    );

    console.log(' Query result rows:', rows.length);

    if (rows.length === 0) {
      console.log(' No admin found with email:', email);
      return res.json({ loginStatus: false, Error: "Invalid email or password" });
    }

    const admin = rows[0];
    console.log(' Admin found:', admin.email);
    
    const match = await bcrypt.compare(password, admin.password_hash);
    console.log(' Password match:', match);

    if (!match) {
      return res.json({ loginStatus: false, Error: "Invalid email or password" });
    }

    // Create JWT
    const token = jwt.sign(
      { id: admin.id, role: "admin" },
      process.env.JWT_SECRET,
      { expiresIn: "2h" }
    );

    console.log(' Login successful for:', email);
    // Option A: Send token in JSON (simple)
    return res.json({ loginStatus: true, id: admin.id, token });

    // Option B (more secure): httpOnly cookie (if you want)
    // res.cookie("token", token, { httpOnly: true, secure: true, sameSite: "strict" });
    // return res.json({ loginStatus: true, id: admin.id });
  } catch (err) {
    console.error(' Login error:', err.message);
    console.error('Full error:', err);
    return res.status(500).json({ loginStatus: false, Error: "Server error" });
  }
});

// router.post('/adminlogin', (req, res)=>{
//     console.log(' Admin login attempt:', req.body.email);
    
//     const sqL = "SELECT * FROM admin WHERE email = ? AND password = ?"
//     con.query(sqL, [req.body.email, req.body.password], (err, result)=>{
//         if(err){
//             console.error(' Database error:', err);
//             return res.json({loginStatus: false, Error: "Query error: " + err.message})
//         }
        
//         if(result.length > 0){
//             console.log(' Admin found:', result[0].email);
//             const email = result[0].email;
//             const id = result[0].id;
//             const token = jwt.sign({role: "admin", email: email, id: id},
//                "jwt_secret_key_Excel", {expiresIn:"1d"});
//             res.cookie('token', token);
//             console.log(' Admin login successful!');
//             return res.json({loginStatus: true, id: id});
//         } else {
//             console.log(' Admin not found with email:', req.body.email);
//             return res.json({loginStatus: false, Error: "wrong email or password"});
//         }
//     })
// })

router.get('/category', (req, res) => {
    const sqL = "SELECT * FROM category"
    con.query(sqL, (err, result) => {
        if(err){
            console.error('Error fetching categories:', err);
            return res.json({Status: false, Error: err.message || "Query error"})
        }
        return res.json({Status: true, Result: result});
    });

});

router.post('/add_category', (req, res) => {
    const sqL = "INSERT INTO category (`name`) VALUE (?)"
    con.query(sqL, [req.body.category], (err, result)=>{
        if(err){
            return res.json({Status: false, Error: "Query error"})
        }
        else{
            return res.json({Status: true})
        }
    })
})



// GET ALL EMPLOYEES
// router.get('/add_employee', verifyToken, (req, res) => {
//   const sql = "SELECT * FROM employee"
//   con.query(sql, (err, result) => {
//     if (err) return res.json({ Status: false, Error: err })
//     return res.json({ Status: true, Result: result })
//   })
// })

// ADD EMPLOYEE
router.post("/add_employee", upload.single("image"), async (req, res) => {
  try {
    const { name, email, password, salary, address, category_id } = req.body;

    if (!name || !email || !password || !salary || !address || !category_id) {
      return res.json({ Status: false, Error: "All fields are required" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    const imageName = req.file ? req.file.filename : "default.png";

    const sql = `
      INSERT INTO employee 
      (name, email, password, salary, address, image, category_id)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `;

    con.query(
      sql,
      [name, email, hashedPassword, salary, address, imageName, category_id],
      (err, result) => {
        if (err) {
          console.error("Insert error:", err);
          return res.json({ Status: false, Error: err.message });
        }

        return res.json({ Status: true });
      }
    );
  } catch (error) {
    console.error("Server error:", error);
    return res.json({ Status: false, Error: error.message });
  }
});

router.get('/employee', (req, res) => {
    const sqL = "SELECT * FROM employee"
    con.query(sqL, (err, result) => {
        if(err){
            console.error('Error fetching employees - Full error:', err);
            return res.json({Status: false, Error: err.message || "Query error"})
        }
        console.log('Employees fetched successfully:', result.length);
        return res.json({Status: true, Result: result});
    });
});

// UPDATE EMPLOYEES
// router.put('/update/:id', (req, res) => {
//   const sql = `
//     UPDATE employee
//     SET name=?, email=?, salary=?, address=?,image =?, category=?
//     WHERE id=?
//   `
//   const values = [
//     req.body.name,
//     req.body.email,
//     req.body.salary,
//       req.body.address,
//     req.body.category,
//       req.body.image 
//     req.params.id
//   ]

//   con.query(sql, values, (err) => {
//     if (err) return res.json({ Status: false })
//     return res.json({ Status: true })
//   })
// })

// DELETE EMPLOYEE
// DELETE EMPLOYEE
router.delete('/delete_employee/:id', (req, res) => {
  const id = Number(req.params.id);


   if (!id || isNaN(id)) {
    return res.status(400).json({
      Status: false,
      Error: "Invalid employee id"
    });
  }

  const sql = "DELETE FROM employee WHERE id = ?";

  con.query(sql, [id], (err, result) => {
    if (err) {
      console.error("Delete error:", err); // see real error in terminal
      return res.json({ Status: false, Error: err.message });
    }

    if (result.affectedRows === 0) {
      return res.json({ Status: false, Error: "No employee found with that id" });
    }

    return res.json({ Status: true, Result: result });
  });
});

router.get('/employee/:id', (req, res)=>{
  const id = req.params.id;
  const sql = "SELECT * FROM employee WHERE id = ?";
  con.query(sql, [id], (err, result) => {
    if(err){
      console.error('Error fetching employee:', err);
      return res.json({Status: false, Error: "Query error"})
    }
    return res.json({Status: true, Result: result});
  });
});

router.put('/edit_employee/:id', upload.single('image'), (req, res)=>{
  const id = req.params.id;
  
  // Validate required fields
  if (!req.body.name || !req.body.email || !req.body.salary || !req.body.address || !req.body.category_id) {
    return res.status(400).json({Status: false, Error: "All fields are required"});
  }
  
  const sql = `UPDATE employee SET name=?, email=?, salary=?, address=?, category_id=?, image=? WHERE id=?`

  const values = [
    req.body.name,
    req.body.email,
    req.body.salary,
    req.body.address,
    req.body.category_id,
    req.file ? req.file.filename : req.body.image || null
  ]
  con.query(sql, [...values, id], (err, result) => {
    if(err){
      console.error('Error updating employee:', err);
      console.error('SQL Message:', err.sqlMessage);
      return res.json({Status: false, Error: err.sqlMessage || "Query error"})
    }
    return res.json({Status: true, Result: result});
  });
});
// admin count route
router.get('/admin_count',(req, res)=>{
  const sql = "SELECT COUNT(id) as adminTotal from admins";
  con.query(sql, (err, result)=>{
    if(err){
      console.error('Error counting admins:', err);
      return res.json({Status: false, Error: "Query error: " + err.message})
    }
    console.log('Admin count result:', result);
    return res.json({Status: true, Result: result})
  })
})
// employee count route
router.get('/employee_count',(req, res)=>{
  const sql = "SELECT COUNT(*) AS employeeTotal from employee";
  con.query(sql, (err, result)=>{
    if(err){
      console.error('Error counting employees:', err);
      return res.json({Status: false, Error: "Query error: " + err.message})
    }
    console.log('Employee count result:', result);
    return res.json({Status: true, Result: result})
  })
})

// salary count route
router.get('/salary_count',(req, res)=>{
  const sql = "SELECT IFNULL(SUM(salary), 0) AS salaryTotal from employee";
  con.query(sql, (err, result)=>{
    if(err){
      console.error('Error calculating salary:', err);
      return res.json({Status: false, Error: "Query error: " + err.message})
    }
    console.log('Salary total result:', result);
    return res.json({Status: true, Result: result})
  })
})

router.get('/admin_records',(req, res)=>{
  const sql = "SELECT * from admins";
  con.query(sql, (err, result)=>{
    if(err) {
      console.error('Error fetching admin records:', err);
      return res.json({Status: false, Error: "Query error: " + err.message});
    }
    console.log('Admin records fetched:', result.length);
    return res.json({Status: true, Result: result});
  });
});

// Diagnostic endpoints
// router.get('/diagnose/categories', (req, res) => {
//   const sql = "SELECT * FROM category";
//   con.query(sql, (err, result) => {
//     if (err) {
//       return res.json({Status: false, Error: err.sqlMessage});
//     }
//     return res.json({Status: true, Categories: result, Count: result.length});
//   });
// });

// router.get('/diagnose/employee-table', (req, res) => {
//   con.query("DESCRIBE employee", (err, result) => {
//     if (err) {
//       return res.json({Status: false, Error: err.sqlMessage});
//     }
//     return res.json({Status: true, Schema: result});
//   });
// });

export { router as adminRoute };