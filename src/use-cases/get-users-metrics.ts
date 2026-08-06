import { CheckInsRepository } from "../repositories/check-ins-repository";

interface GetUsersMetricsUseCaseRequest {
  userId: string;
}

interface GetUsersMetricsUseCaseResponse {
  checkInsCount: number;
}

export class GetUsersMetricsUseCase {
  constructor(private checkInsRepository: CheckInsRepository) {}

  async execute({
    userId,
  }: GetUsersMetricsUseCaseRequest): Promise<GetUsersMetricsUseCaseResponse> {
    const checkInsCount = await this.checkInsRepository.countByUserId(userId);

    return {
      checkInsCount,
    };
  }
}
