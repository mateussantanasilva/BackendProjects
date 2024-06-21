import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import request from 'supertest'
import { app } from '@/app'
import { createAndAuthenticateUser } from '@/utils/tests/create-and-authenticate.user'
import { prisma } from '@/lib/prisma'

describe('E2E: Check-in History', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('should be able to list the history of check-ins', async () => {
    const { token } = await createAndAuthenticateUser(app)

    // example to find using prisma (only when you don't have a controller)
    const user = await prisma.user.findFirstOrThrow()

    // example to create using prisma (only when you don't have a controller)
    const gym = await prisma.gym.create({
      data: {
        title: 'JS Gym',
        latitude: -23.51958,
        longitude: -46.4125952,
      },
    })

    // example to create using prisma without rules (RNs) (only when you don't have a controller)
    await prisma.checkIn.createMany({
      data: [
        {
          gym_id: gym.id,
          user_id: user.id,
        },
        {
          gym_id: gym.id,
          user_id: user.id,
        },
      ],
    })

    const response = await request(app.server)
      .get('/check-ins/history')
      .set('Authorization', `Bearer ${token}`)
      .send()

    expect(response.statusCode).toEqual(200)
    expect(response.body.checkIns).toEqual([
      expect.objectContaining({
        gym_id: gym.id,
        user_id: user.id,
      }),
      expect.objectContaining({
        gym_id: gym.id,
        user_id: user.id,
      }),
    ])
  })
})
