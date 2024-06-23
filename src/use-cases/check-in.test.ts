import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { InMemoryCheckInsRepository } from '@/repositories/in-memory/in-memory-check-ins-repository'
import { CheckInUseCase } from './check-in'
import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms-repository'
import { Decimal } from '@prisma/client/runtime/library'
import { MaxNumberOfCheckInsError } from './erros/max-number-of-check-ins-error'
import { MaxDistanceError } from './erros/max-distance-error'

let checkInsRepository: InMemoryCheckInsRepository
let gymsRepository: InMemoryGymsRepository
let sut: CheckInUseCase

describe('Use Case: Check In', () => {
  beforeEach(async () => {
    checkInsRepository = new InMemoryCheckInsRepository()
    gymsRepository = new InMemoryGymsRepository()
    sut = new CheckInUseCase(checkInsRepository, gymsRepository) // system under test

    await gymsRepository.create({
      id: 'gym-01',
      title: 'JS Gym',
      latitude: -23.51958,
      longitude: -46.4125952,
      phone: null,
      description: null,
    })

    vi.useFakeTimers() // create mock
  })

  afterEach(() => {
    vi.useRealTimers() // delete mock
  })

  it('should be able to check in', async () => {
    const { checkIn } = await sut.execute({
      userId: 'user-01',
      gymId: 'gym-01',
      userLatitude: -23.51958,
      userLongitude: -46.4125952,
    })

    expect(checkIn.id).toEqual(expect.any(String))
  })

  it('should not be able to check in twice in the same day', async () => {
    vi.setSystemTime(new Date(2024, 5, 17, 8, 0, 0)) // fixs date: 2024-06-17T11:00:00.000Z

    await sut.execute({
      userId: 'user-01',
      gymId: 'gym-01',
      userLatitude: -23.51958,
      userLongitude: -46.4125952,
    })

    await expect(() =>
      sut.execute({
        userId: 'user-01',
        gymId: 'gym-01',
        userLatitude: -23.51958,
        userLongitude: -46.4125952,
      }),
    ).rejects.toBeInstanceOf(MaxNumberOfCheckInsError)
  })

  it('should be able to check in twice but in different days', async () => {
    vi.setSystemTime(new Date(2024, 5, 17, 8, 0, 0)) // fixs date: 2024-06-17T11:00:00.000Z

    await sut.execute({
      userId: 'user-01',
      gymId: 'gym-01',
      userLatitude: -23.51958,
      userLongitude: -46.4125952,
    })

    vi.setSystemTime(new Date(2024, 5, 18, 8, 0, 0)) // fixs date: 2024-06-17T11:00:00.000Z

    const { checkIn } = await sut.execute({
      userId: 'user-01',
      gymId: 'gym-01',
      userLatitude: -23.51958,
      userLongitude: -46.4125952,
    })

    expect(checkIn.id).toEqual(expect.any(String))
  })

  it('should not be able to check in on distant gym', async () => {
    gymsRepository.gymList.push({
      id: 'gym-02',
      title: 'Node Gym',
      latitude: new Decimal(-23.4113031),
      longitude: new Decimal(-46.7864308),
      phone: '',
      description: '',
    })

    await expect(() =>
      sut.execute({
        userId: 'user-01',
        gymId: 'gym-02',
        userLatitude: -23.51958,
        userLongitude: -46.4125952,
      }),
    ).rejects.toBeInstanceOf(MaxDistanceError)
  })
})
