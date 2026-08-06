import dayjs from "dayjs";
import { CheckIn } from "../generated/prisma/client";
import { CheckInsRepository } from "../repositories/check-ins-repository";
import { ResourceNotFoundError } from "./error/resource-not-found-error";
import { LateCheckInValidationError } from "./error/late-check-in-validation-error";

interface ValidatedCheckInsUseCaseRequest {
  checkInId: string;
}

interface ValidatedCheckInsUseCaseResponse {
  checkIn: CheckIn;
}

export class ValidatedCheckInsUseCase {
  constructor(private checkInsRepository: CheckInsRepository) {}

  async execute({
    checkInId,
  }: ValidatedCheckInsUseCaseRequest): Promise<ValidatedCheckInsUseCaseResponse> {
    const checkIn = await this.checkInsRepository.findById(checkInId);

    if (!checkIn) {
      throw new ResourceNotFoundError();
    }

    const distanceInMinutesFromCheckInCreation = dayjs(new Date()).diff(
      checkIn.created_at,
      "minutes",
    );

    if (distanceInMinutesFromCheckInCreation > 20) {
      throw new LateCheckInValidationError();
    }

    checkIn.validated_at = new Date();

    await this.checkInsRepository.save(checkIn);

    return {
      checkIn,
    };
  }
}
