process.env.NODE_ENV="test"

const app = require('../app')
const db = require('../db')
const request = require('supertest')

let testUser;
beforeEach(async ()=>{
    const result = await db.query(`INSERT INTO companies (code, name, description) VALUES ('vk', 'vockchrewt', 'poder') RETURNING code, name, description`)
    testUser = result.rows
    // console.log(testUser,'beforeeach')
})

afterEach(async ()=>{
    await db.query('DELETE FROM companies')
})

afterAll(async ()=>{
    await db.end()
})

describe('testing GET', ()=>{
    test('testing /GET', async () => {
        const res = await request(app).get('/companies')
        // console.log(res.body,'res.body')
        
        expect(res.statusCode).toBe(200)
        expect(res.body).toEqual({ results: testUser})
    })
})

describe('testing GET/id', ()=>{
    test('testing /GET/id', async () => {
        const res = await request(app).get(`/companies/${testUser[0].code}`)
        // console.log(res.body,'res.body')
        
        expect(res.statusCode).toBe(200)
        expect(res.body).toEqual({ results: testUser})
    })
    test('test get/:id errors if invalid code', async ()=>{
        const res = await request(app).get(`/companies/jack`)
        // console.log(res.body, 'get id error handling')
        expect(res.statusCode).toBe(404);
    })
})

describe('testing post', ()=>{
    test('testing post/', async ()=>{
        const res = await request(app).post('/companies').send({ code: 'abc', name: 'BillyBob', description: 'staff' });
        // console.log(res.body)
        expect(res.statusCode).toBe(201);
        expect(res.body).toEqual({
            results: { code: 'abc', name: 'BillyBob', description: 'staff' }
        })
    })
})

describe("Put /companies/:id", () => {
    test("Updates a single company", async () => {
        console.log(testUser,'testusser')
      const res = await request(app).put(`/companies/${testUser[0].code}`).send({name: 'BillyBob', description: 'admin' });
      console.log(res.body)
    //   expect(res.statusCode).toBe(200);
      expect(res.body).toEqual({
        results: { code: testUser[0].code, name: 'BillyBob', description: 'admin' }
      })
    })
    test("Responds with 404 for invalid id", async () => {
      const res = await request(app).patch(`/company/moko`).send({ name: 'BillyBob', description: 'admin' });
      expect(res.statusCode).toBe(404);
    })
})

describe("DELETE /companies/", () => {
    test("Deletes a single company", async () => {
      const res = await request(app).delete(`/companies/${testUser[0].code}`);
      expect(res.statusCode).toBe(200);
      expect(res.body).toEqual({ msg: 'DELETED!' })
    })
  })
  
  