import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'
import { makeCheckInUseCase } from '@/use-cases/factories/make-check-in-use-case'

export async function create(request: FastifyRequest, reply: FastifyReply) {
  const createCheckInParamsSchema = z.object({
    gymId: z.string().uuid(),
  })

  const createCheckInBodySchema = z.object({
    latitude: z.number().refine((value) => {
      // refine add non-native zod verification
      return Math.abs(value) <= 90 // abs transform number to positive
    }),
    longitude: z.number().refine((value) => {
      // refine add non-native zod verification
      return Math.abs(value) <= 180 // abs transform number to positive
    }),
  })

  const { gymId } = createCheckInParamsSchema.parse(request.params)
  const { latitude, longitude } = createCheckInBodySchema.parse(request.body)

  const checkInUseCase = makeCheckInUseCase()

  await checkInUseCase.execute({
    userLatitude: latitude,
    userLongitude: longitude,
    userId: request.user.sub,
    gymId,
  })

  return reply.status(201).send()
}
