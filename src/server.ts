import fastify from 'fastify'

const app = fastify()

app.get('/', ()=>{
    return 'Rota principal'
})

app.get('/teste', ()=>{
    return 'Rota de teste'
})


app.listen({ port: 3333 }).then(()=> {
    console.log('server running: http://localhost:3333')
})