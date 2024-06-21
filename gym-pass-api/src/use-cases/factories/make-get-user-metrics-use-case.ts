import { PrismaCheckIsRepository } from '@/repositories/prisma/prisma-check-ins-repository'
import { GetUserMetricsUseCase } from '../get-user-metrics'

export function makeGetUserMetricsUseCase() {
  const checkInsRepository = new PrismaCheckIsRepository()
  const useCase = new GetUserMetricsUseCase(checkInsRepository)

  return useCase
}
