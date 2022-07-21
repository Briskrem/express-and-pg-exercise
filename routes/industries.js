const express = require('express')
const db = require('../db')
const router = express.Router()
const ExpressError = require('../expressError')

router.get('/', async (req, res, next)=>{
    try{
  
        let results = await db.query('SELECT * FROM industries;')
        console.log('yikess')
        console.log(results.rows, 'serverside')
        return res.json({results:results.rows})
    }catch(e){
        next(e)
    }
})

//get companies based on industry
router.get("/:id", async function (req, res, next) {
    try {
        console.log(req.params.id,'ooooooooooooooooooooooo')
        const result = await db.query(
                `SELECT c.code, c.name, i.field
                FROM companies AS c
                    LEFT JOIN companies_industries AS ci 
                    ON c.code = ci.company_code
                    LEFT JOIN industries AS i ON ci.industry_code = i.code
                WHERE i.code = $1;`,
            [req.params.id]);
        
        console.log(result.rows)

        let { code, name,field } = result.rows[0];
        // let tags = result.rows.map(r => r.tag);
    
        return res.json({ code,name, field});
    }
  
    catch (err) {
      return next(err);
    }
  });


module.exports = router