import fastify from 'fastify'
import { title } from 'process'
import { z } from 'zod'

const app = fastify()

app.post('/events', async (request, reply) => {
    const createSchema = z.object({
        title: z.string().min(4),
        details: z.string().nullable(),
        maximumAttendees: z.number().int().positive().nullable()
    })
    const data = request.body

     return {message: 'Dados recebidos!', receivedData: data};

})


app.listen({ port: 3333 }).then(()=> {
    console.log('server running: http://localhost:3333')
})