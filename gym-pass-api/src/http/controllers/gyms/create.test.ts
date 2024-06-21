import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import request from 'supertest'
import { app } from '@/app'
import { createAndAuthenticateUser } from '@/utils/tests/create-and-authenticate.user'

describe('E2E: Create Gym', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('should be able to create a gym', async () => {
    const { token } = await createAndAuthenticateUser(app)

    const response = await request(app.server)
      .post('/gyms')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'JS Gym',
        description: 'Some description',
        phone: '11999999999',
        latitude: -23.51958,
        longitude: -46.4125952,
      })

    expect(response.statusCode).toEqual(201)
  })
})
