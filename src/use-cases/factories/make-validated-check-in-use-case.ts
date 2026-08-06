import { PrismaCheckInsRepository } from "../../repositories/prisma/prisma-check-ins-repository";
import { ValidatedCheckInsUseCase } from "../validated-check-in";

export function makeValidatedCheckInUseCase() {
  const checkInsRepository = new PrismaCheckInsRepository();
  const useCase = new ValidatedCheckInsUseCase(checkInsRepository);

  return useCase;
}
