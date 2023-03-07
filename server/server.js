const PORT = process.env.PORT ?? 8000;
const express = require('express')
const {v4: uuidv4} = require('uuid');
const cors = require('cors')
const app = express()
const dotenv = require('dotenv')
dotenv.config()
const pool = require('./db')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

// middleware
app.use(cors());
app.use(express.json());

// app.get('/', (req, res) => {
//   res.send('This is the server')
// })

// get all todos
app.get('/todos/:userEmail', async (req, res) => {
  // console.log(req);
  const { userEmail } = req.params;
  // console.log(userEmail);
  try {
    await pool.connect();
    const result = await pool.query('SELECT * FROM todos WHERE user_email = $1', [userEmail])
    res.json(result.rows);
    // await pool.end()
  } catch (err) {
    console.log(err);
  }
})

// post task
app.post('/todos/', async (req, res) => {
  const { user_email, title, progress, date } = req.body
  // console.log(user_email, title, Number(progress), date);
  const id = uuidv4()
  try {
    const newTask = await pool.query(`INSERT INTO todos(id, user_email, title, progress, date) VALUES($1, $2, $3, $4, $5)`, [id, user_email, title, progress, date])
    res.json(newTask)
  } catch (err) {
    console.error(err)
  }
})

// PUT task
app.put('/todos/:id', async(req, res) => {
  const { id } = req.params;
  const {user_email, title, progress, date} = req.body;
  try {
    const editTask = await pool.query('UPDATE todos SET user_email = $1, title = $2, progress = $3, date = $4 WHERE id = $5;', [user_email, title, progress, date, id]);
    res.json(editTask);
  } catch (err) {
    console.error(err)
  }
})

// DELETE task
app.delete('/todos/:id', async(req, res) => {
  const { id } = req.params
   try {
    const deleteTask = await pool.query('DELETE FROM todos WHERE id = $1;', [id])
    res.json(deleteTask)
   } catch (err) {
    console.error(err)
   }
})

// signup
app.post('/signup', async(req, res) => {
  const {email, password} = req.body;
  const salt = bcrypt.genSaltSync(10)
  const hashedPassword = bcrypt.hashSync(password, salt);
  try {
    const signUp = await pool.query(`INSERT INTO users (email, hashed_password) VALUES($1, $2)`, [email, hashedPassword])
    const token = jwt.sign({email}, 'secret', {expiresIn: '1hr'})
    res.json({email, token})
  } catch (err) {
    console.error(err)
    if(err) {
      res.json(err)
    }
  }
})

// login
app.post('/login', async(req, res) => {
  const {email, password} = req.body
  try {
    const users = await pool.query('SELECT * FROM users WHERE email = $1', [email])
    if (!users.rows.length) {
      return res.json({detail: 'user does not exist'})
    }
    const success = await bcrypt.compare(password, users.rows[0].hashed_password)
    const token = jwt.sign({email}, 'secret', {expiresIn: '1hr'})
    if (success) {
      res.json({'email': users.rows[0].email, token})
    } else {
      res.json({detail: 'login failed'})
    }
  } catch (err) {
    console.error(err)
  }
})

app.listen(PORT, () => {
  console.log(`server running on PORT ${PORT}`)
})

