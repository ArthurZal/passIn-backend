import fastify from 'fastify'

const app = fastify()

app.post('/events', async (request, reply) => {
    const data = request.body

     return {message: 'Dados recebidos!', receivedData: data};

})

app.get('/teste', ()=>{
    return 'Rota de teste'
})


app.listen({ port: 3333 }).then(()=> {
    console.log('server running: http://localhost:3333')
})