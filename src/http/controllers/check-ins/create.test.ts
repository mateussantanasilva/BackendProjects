import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import request from 'supertest'
import { app } from '@/app'
import { createAndAuthenticateUser } from '@/utils/tests/create-and-authenticate.user'
import { prisma } from '@/lib/prisma'

describe('E2E: Create Check-in', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('should be able to create a check-in', async () => {
    const { token } = await createAndAuthenticateUser(app)

    // example to create a gym using prisma (only when you don't have a controller)
    const gym = await prisma.gym.create({
      data: {
        title: 'JS Gym',
        latitude: -23.51958,
        longitude: -46.4125952,
      },
    })

    const response = await request(app.server)
      .post(`/gyms/${gym.id}/check-ins`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        latitude: -23.51958,
        longitude: -46.4125952,
      })

    expect(response.statusCode).toEqual(201)
  })
})
