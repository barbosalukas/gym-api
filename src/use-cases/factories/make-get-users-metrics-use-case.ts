import { PrismaCheckInsRepository } from "../../repositories/prisma/prisma-check-ins-repository";
import { GetUsersMetricsUseCase } from "../get-users-metrics";

export function makeGetUseMetricsUseCase() {
  const checkInsRepository = new PrismaCheckInsRepository();
  const useCase = new GetUsersMetricsUseCase(checkInsRepository);

  return useCase;
}
