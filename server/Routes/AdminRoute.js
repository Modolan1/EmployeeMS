import express  from 'express'
import con from '../Utils/db.js'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import multer from 'multer'
import path from 'path'

const router = express.Router()

// Configure multer for file upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'Public/Images')
  },
  filename: (req, file, cb) => {
    cb(null, file.fieldname + "_" + Date.now() + path.extname(file.originalname))
  }
})

const upload = multer({
  storage: storage
})

router.post('/adminlogin', (req, res)=>{
    const sqL = "SELECT * FROM admin WHERE email = ? AND password = ?"
    con.query(sqL, [req.body.email, req.body.password], (err, result)=>{
        if(err){
            return res.json({loginStatus: false, Error: "Query error"})
        }
        if(result.length > 0){
            const email = result[0].email;
            const token = jwt.sign({role: "admin", email: email}, "jwt_secret_key_Exceloluwatise",{expiresIn:"1d"});
             res.cookie('token', token)
              return res.json({loginStatus: true, });
           
        }else{
             return res.json({loginStatus: false, Error: "wrong email or password"})
        }
    })
})

router.get('/category', (req, res) => {
    const sqL = "SELECT * FROM category"
    con.query(sqL, (err, result) => {
        if(err){
            return res.json({Status: false, Error: "Query error"})
        }
        return res.json({Status: true, result: result});
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
router.post('/add_employee', upload.single('image'), (req, res) => {
  const sql = `
    INSERT INTO employee (name, email, password, salary, address, image, category_id)
    VALUES (?,?,?,?,?,?,?)
  `;
  
  bcrypt.hash(req.body.password, 10, (err, hash) => {
    if(err) {
      return res.json({Status: false, Error: "Password hashing error"})
    }
    
    const values = [
      req.body.name,
      req.body.email,
      hash,
      req.body.salary,
      req.body.address,
      req.file ? req.file.filename : null,
      req.body.category_id
    ]

    con.query(sql, values, (err, result) => {
      if (err) {
        console.error('Error adding employee:', err);
        return res.json({ Status: false, Error: "Query error" })
      }
      return res.json({ Status: true })
    })
  })
})

router.get('/employee', (req, res) => {
    const sqL = "SELECT * FROM employee"
    con.query(sqL, (err, result) => {
        if(err){
            console.error('Error fetching employees:', err);
            return res.json({Status: false, Error: "Query error"})
        }
        return res.json({Status: true, result: result});
    });
});

// UPDATE EMPLOYEES
// router.put('/update/:id', (req, res) => {
//   const sql = `
//     UPDATE employee
    // SET name=?, email=?, salary=?, address=?,image =?, category=?
//     WHERE id=?
//   `
//   const values = [
//     req.body.name,
//     req.body.email,
//     req.body.salary,
 //      req.body.address,
//     req.body.category,
 //      req.body.image 
//     req.params.id
//   ]

//   con.query(sql, values, (err) => {
//     if (err) return res.json({ Status: false })
//     return res.json({ Status: true })
//   })
// })

// DELETE EMPLOYEE
// router.delete('/delete/:id', verifyToken, (req, res) => {
//   const sql = "DELETE FROM emloyee WHERE id = ?"
//   con.query(sql, [req.params.id], (err) => {
//     if (err) return res.json({ Status: false })
//     return res.json({ Status: true })
//   })
// })
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

router.put('/edit_employee/:id', (req, res)=>{
  const id = req.params.id;
  const sql = `UPDATE employee SET name=?, email=?, salary=?, address=?, category_id=? WHERE id=?`

  const values = [
    req.body.name,
    req.body.email,
    req.body.salary,
    req.body.address,
    req.body.category_id
  ]
  con.query(sql, [...values, id], (err, result) => {
    if(err){
      console.error('Error updating employee:', err);
      return res.json({Status: false, Error: "Query error"})
    }
    return res.json({Status: true});
  });
})

export { router as adminRoute}