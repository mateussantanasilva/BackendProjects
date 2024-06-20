import { Gym, Prisma } from '@prisma/client'
import { FindManyNearbyParams, GymsRepository } from '../gyms-repository'
import { randomUUID } from 'node:crypto'
import { getDistanceBetweenCoordinates } from '@/utils/get-distance-between-coodinates'

export class InMemoryGymsRepository implements GymsRepository {
  public gymList: Gym[] = []

  async findById(id: string) {
    const gym = this.gymList.find((item) => item.id === id)

    if (!gym) return null

    return gym
  }

  async findManyNearby({ latitude, longitude }: FindManyNearbyParams) {
    return this.gymList.filter((gym) => {
      const distance = getDistanceBetweenCoordinates(
        { latitude, longitude },
        {
          latitude: gym.latitude.toNumber(),
          longitude: gym.longitude.toNumber(),
        },
      )

      const DISTANCE_IN_KILOMETERS = 10

      return distance <= DISTANCE_IN_KILOMETERS
    })
  }

  async searchMany(query: string, page: number) {
    return this.gymList
      .filter((gym) => gym.title.includes(query))
      .slice((page - 1) * 20, page * 20)
  }

  async create(data: Prisma.GymCreateInput) {
    const gym = {
      id: data.id ?? randomUUID(),
      title: data.title,
      description: data.description ?? null,
      phone: data.phone ?? null,
      latitude: new Prisma.Decimal(data.latitude.toString()),
      longitude: new Prisma.Decimal(data.longitude.toString()),
    }

    this.gymList.push(gym)

    return gym
  }
}
