import { CheckIn, Prisma } from '@prisma/client'
import { CheckInsRespository } from '../check-ins-repository'
import { randomUUID } from 'node:crypto'
import dayjs from 'dayjs'

export class InMemoryCheckInsRepository implements CheckInsRespository {
  public checkInList: CheckIn[] = []

  async findById(id: string) {
    const checkIn = this.checkInList.find((checkIn) => checkIn.id === id)

    if (!checkIn) return null

    return checkIn
  }

  async findByUserIdOnDate(userId: string, date: Date) {
    const startOfTheDay = dayjs(date).startOf('date')
    const endOfTheDay = dayjs(date).endOf('date')

    const checkInOnSameDate = this.checkInList.find((checkIn) => {
      const checkInDate = dayjs(checkIn.created_at)
      const isOnSameDate =
        (checkInDate.isAfter(startOfTheDay) &&
          checkInDate.isBefore(endOfTheDay)) ||
        checkInDate.isSame(startOfTheDay) ||
        checkInDate.isSame(endOfTheDay)

      return checkIn.user_id === userId && isOnSameDate
    })

    if (!checkInOnSameDate) return null

    return checkInOnSameDate
  }

  async findManyByUserId(userId: string, page: number) {
    return this.checkInList
      .filter((checkIn) => checkIn.user_id === userId)
      .slice((page - 1) * 20, page * 20)
  }

  async countByUserId(userId: string) {
    return this.checkInList.filter((checkIn) => checkIn.user_id === userId)
      .length
  }

  async create(data: Prisma.CheckInUncheckedCreateInput) {
    const checkIn = {
      id: randomUUID(),
      user_id: data.user_id,
      gym_id: data.gym_id,
      validated_at: data.validated_at ? new Date(data.validated_at) : null,
      created_at: new Date(),
    }

    this.checkInList.push(checkIn)

    return checkIn
  }

  async save(checkIn: CheckIn) {
    const checkInIndex = this.checkInList.findIndex(
      (createdCheckIn) => createdCheckIn.id === checkIn.id,
    )

    if (checkInIndex >= 0) {
      this.checkInList[checkInIndex] = checkIn
    }

    return checkIn
  }
}
