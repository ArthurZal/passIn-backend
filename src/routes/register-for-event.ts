import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import z from "zod";
import { prisma } from "../lib/prisma";

export async function registerForEvent(app: FastifyInstance) {
    app
        .withTypeProvider<ZodTypeProvider>()
        .post('/events/:eventId/attendees', {
            schema: {
                body: z.object({
                    name: z.string().min(4),
                    email: z.string().email(),
                }),
                params: z.object({
                    eventId: z.string().uuid(),
                }),
                response: {
                    201: z.object({
                        atteendee: z.number(),
                    })
                }
            }
        }, async (request, reply) => {
            const { eventId } = request.params;
            const { name, email } = request.body;

            const attendeeFromEmail = await prisma.attendee.findUnique({
                where: {
                    eventId_email: {
                        email,
                        eventId,
                    }
                }
            })

            if(attendeeFromEmail !== null) {
                throw new Error('This e-mail is already registered fro this event.')
            }

            const [event, amountOfAttendeesForEvent] = await Promise.all([
                prisma.event.findUnique({
                    where: {
                        id: eventId,
                    }
                }),
                prisma.attendee.count({
                    where: {
                        eventId,
                    }
                })

            ])

            if (event?.maximumAttendees && amountOfAttendeesForEvent >= event?.maximumAttendees) {
                throw new Error('The Maximum number of attendees for this event has been reached.')
            }

            const attendee = await prisma.attendee.create({
                data: {
                    name, 
                    email,
                    eventId,
                }
            })

            return reply.status(201).send({atteendee: attendee.id});

        })
}