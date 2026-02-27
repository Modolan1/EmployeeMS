import express from 'express'
import con from '../Utils/db.js'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'

const router = express.Router()

router.post('/employeelogin', (req, res)=>{
    console.log('🔐 Employee login attempt:', req.body.email);
    
    const sqL = "SELECT * FROM employee WHERE email = ?";
    con.query(sqL, [req.body.email], (err, result)=>{
        if(err){
            console.error(' Database error:', err);
            return res.json({loginStatus: false, Error: "Query error: " + err.message})
        }
        
        if(result.length > 0){
            console.log(' Employee found:', result[0].email);
            
            bcrypt.compare(req.body.password, result[0].password, (err, response)=>{
                if(err){
                    console.error(' Password comparison error:', err);
                    return res.json({loginStatus: false, Error: "Authentication error"});
                } 
                
                if(response){
                    console.log(' Password matched! Creating token...');
                    const email = result[0].email;
                    const token = jwt.sign({role: "employee", email: email, id: result[0].id}, 
                        "jwt_secret_key_Excel", {expiresIn:"1d"});
                    res.cookie('token', token);
                    console.log(' Employee login successful!');
                    return res.json({loginStatus: true, id: result[0].id});
                } else {
                    console.log(' Password mismatch for:', req.body.email);
                    return res.json({loginStatus: false, Error: "Wrong email or password"});
                }
            })
        } else {
            console.log(' Employee not found:', req.body.email);
            return res.json({loginStatus: false, Error: "wrong email or password"});
        }
    })
})

router.get('/details/:id', (req, res)=>{
    const id = req.params.id;
    console.log('📋 Fetching employee details for ID:', id);
    
    const sql = "SELECT * FROM employee WHERE id = ?";
    con.query(sql, [id], (err, result)=>{
        if (err) {
            console.error('❌ Error fetching employee details:', err);
            return res.json({Status: false, Error: err.message});
        }
        
        if (result.length === 0) {
            console.log('❌ Employee not found with ID:', id);
            return res.json({Status: false, Error: "Employee not found"});
        }
        
        console.log('✅ Employee details fetched:', result[0].name);
        return res.json(result);
    })
})

router.get('/logout',(req, res)=>{
    console.log('🚪 Employee logging out...');
    res.clearCookie('token');
    console.log('✅ Token cleared, logout successful');
    return res.json({Status: true});
})

export {router as EmployeeRouter}
