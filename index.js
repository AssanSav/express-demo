const Joi = require("joi-browser")
const authenticate = require("./auth")
const logger = require("./logger")
const express = require("express")
const app = express()

app.use(express.json())
app.use(logger)
app.use(authenticate)

const courses = [
  { id: 1, name: "course" },
  { id: 2, name: "course2" },
  { id: 3, name: "course3" }
]

const validate = (course) => {
  const schema = {
    name: Joi.string().min(3).required()
  }
  return Joi.validate(course, schema)
}



app.get("/", (req, res) => {
  res.send("Hello world!!!")
})


app.get("/api/courses", (req, res) => {
  res.send(courses)
})


app.get("/api/courses/:id", (req, res) => {
  const course = courses.find(c => c.id === parseInt(req.params.id))
  if (!course) {
    res.status(404).send(`The course with the given id:${req.params.id} is not found!`)
    return;
  }
  else res.send(course)
})


app.post("/api/courses", (req, res) => {
  const {error}= validate(req.body)
  if (error) {
    res.status(400).send(error.details[0].message)
    return;
  }
  const course = {
    id: courses.length + 1,
    name: req.body.name
  };
  courses.push(course)
  res.status(200).send(course)
})


app.put("/api/courses/:id", (req, res) => {
  let course = courses.find(c => c.id === parseInt(req.params.id))
  if (!course) {
    res.status(404).send(`The course with the given id:${req.params.id} is not found!`)
    return;
  }
  const {error} = validate(req.body)
  if (error) {
    res.status(404).send(error.details[0].message)
    return;
  }
  course.name = req.body.name
  res.status(200).send(course)
})


app.delete("/api/courses/:id", (req, res) => {
  const course = courses.find(c => c.id === parseInt(req.params.id))
  if(!course){
    res.status(404).send(`The course with the given id:${req.params.id} is not found!`)
    return;
  }
  const index = courses.indexOf(course)
  courses.splice(index, 1)
  res.status(200).send(course)
})


const port = process.env.PORT || 3000
app.listen(port, () => console.log(`Listening on port ${port}...`))
