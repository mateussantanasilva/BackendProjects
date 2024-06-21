import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import request from 'supertest'
import { app } from '@/app'
import { createAndAuthenticateUser } from '@/utils/tests/create-and-authenticate.user'

describe('E2E: Nearby Gyms', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('should be able to list nearby gyms', async () => {
    const { token } = await createAndAuthenticateUser(app)

    await request(app.server)
      .post('/gyms')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'JS Gym',
        description: 'Some description',
        phone: '11999999999',
        latitude: -23.51958,
        longitude: -46.4125952,
      })

    await request(app.server)
      .post('/gyms')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'TS Gym',
        description: 'Some description',
        phone: '11999999999',
        latitude: -23.363563,
        longitude: -49.1944966,
      })

    const response = await request(app.server)
      .get('/gyms/nearby')
      .query({
        latitude: '-23.51958',
        longitude: '-46.4125952',
      })
      .set('Authorization', `Bearer ${token}`)
      .send()

    expect(response.statusCode).toEqual(200)
    expect(response.body.gyms).toHaveLength(1)
    expect(response.body.gyms).toEqual([
      expect.objectContaining({
        title: 'JS Gym',
      }),
    ])
  })
})
