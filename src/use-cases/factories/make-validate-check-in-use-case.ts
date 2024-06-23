import { PrismaCheckIsRepository } from '@/repositories/prisma/prisma-check-ins-repository'
import { ValidateCheckInUseCase } from '../validate-check-in'

export function makeValidateCheckInUseCase() {
  const checkInsRepository = new PrismaCheckIsRepository()
  const useCase = new ValidateCheckInUseCase(checkInsRepository)

  return useCase
}
