import { PrismaUsersRepository } from "../../repositories/prisma/prisma-users-repository";
import { GetUseProfile } from "../get-use-profile";

export function makeGetUseProfileUseCase() {
  const usersRepository = new PrismaUsersRepository();
  const useCase = new GetUseProfile(usersRepository);

  return useCase;
}
