const express = require('express')
const morgan = require('morgan')
const app = express()


morgan.token('body', (req, res) => { return req.method === 'POST' ? JSON.stringify(req.body) : '' })


app.use(express.json())
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

let persons = [
    {
        "id": 1,
        "name": "Arto Hellas",
        "number": "040-123456"
    },
    {
        "id": 2,
        "name": "Ada Lovelace",
        "number": "39-44-5323523"
    },
    {
        "id": 3,
        "name": "Dan Abramov",
        "number": "12-43-234345"
    },
    {
        "id": 4,
        "name": "Mary Poppendieck",
        "number": "39-23-6423122"
    }
]

app.get('/', (request, response) => {
    response.send('<h1>Hello World!</h1>')
})

app.get('/api/persons', (request, response) => {
    response.json(persons)
})

app.get('/api/info', (request, response) => {
    response.send(`<div> <div>Phonebook has info for ${persons.length} people</div> <br/> <div>${new Date().toISOString()}</div> </div>`)
})

app.get('/api/persons/:id', (request, response) => {
    const person = persons.find(person => person.id === Number(request.params.id))
    if (person) {
        return response.json(person)
    }

    response.status(404).end()



})

app.delete('/api/persons/:id', (request, response) => {
    persons = persons.filter(person => person.id !== Number(request.params.id))
    response.status(204).end()

})


const generateId = () => {
    const maxId = persons.length > 0
        ? Math.max(...persons.map(n => n.id))
        : 0
    return maxId + 1
}

app.post('/api/persons', (request, response) => {
    const body = request.body

    if (!body.name || !body.number) {
        return response.status(400).json({
            error: !body.name ? 'name missing' : 'number missing'
        })
    }

    if (persons.some(person => person.name === body.name)) {
        return response.status(409).json({
            error: `${body.name} is already in the phonebook`
        })
    }

    const person = {
        id: generateId(),
        name: body.name,
        number: body.number,

    }

    persons = persons.concat(person)

    response.json(person)
})


const PORT = 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})