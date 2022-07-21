const express = require('express')
const db = require('../db')
const router = express.Router()
const ExpressError = require('../expressError')


router.get('/', async (req, res, next)=>{
    try{
  
        let results = await db.query('SELECT * FROM companies;')
        console.log('meeeeeeeeeeeeeeeee')
        console.log(results.rows, 'serverside')
        return res.json({results:results.rows})
    }catch(e){
        next(e)
    }
})

router.get('/:code', async (req, res, next)=>{
    
    try{
        const {code} = req.params
        console.log(code)
        
        let results = await db.query('SELECT * FROM companies WHERE code=$1', [code])
        console.log(results.rows.length)
        if(results.rows.length == 0){
            throw new ExpressError(`CODE [${code}] does not exist`, 404)
        }
        
        return res.json({results:results.rows})
    }catch(e){
        next(e)
    }
    
})

router.post('/', async (req, res, next)=>{
    try{
        let {code, name, description} = req.body
        if(!code || !name || !description){
            throw new ExpressError('MISING DATA', 400)
        }
        let results = await db.query(`INSERT INTO companies (code, name, description) VALUES ($1,$2,$3) RETURNING code, name, description`, [code,name,description])
        return res.status(201).json({results:results.rows[0]})
    }catch(e){
        next(e)
    }
})

router.put('/:code', async (req, res, next)=>{
    try{
        let {code} = req.params;
        let {name,description} = req.body;
        console.log(name, description)
        // const results = await db.query('UPDATE users SET name=$1, type=$2 WHERE id=$3 RETURNING id, name, type', [name, type, id])
        const results = await db.query(`UPDATE companies SET name=$1, description=$2 WHERE code=$3 RETURNING code, name, description`, [name,description,code])
        console.log(results.rows)
        console.log(results.rows.length)
        //WHY ISNT THE ERROR BEING THROWN??
        if (results.rows.length === 0) {
            throw new ExpressError(`Can't update user with id of ${id}`, 404)
          }
        return res.status(200).json({results:results.rows[0]})
    }catch(e){
        next(e)
    }
})

router.delete('/:code', async (req, res, next) => {
    try {
      const results = db.query('DELETE FROM companies WHERE code = $1', [req.params.code])
      return res.send({ msg: "DELETED!" })
    } catch (e) {
      return next(e)
    }
  })




module.exports = router