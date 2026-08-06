import { CheckIn } from "../generated/prisma/client";
import { CheckInsRepository } from "../repositories/check-ins-repository";
import { GymsRepository } from "../repositories/gyms-repository";
import { getDistanceBetweenCoordinate } from "../utils/get-distance-between-coordinates";
import { MaxDistanceError } from "./error/max-distance-error";
import { MaxNumberOfCheckInsError } from "./error/max-number-of-check-ins-error";
import { ResourceNotFoundError } from "./error/resource-not-found-error";

interface CheckInsUseCaseRequest {
  userId: string;
  gymId: string;
  userLatitude: number;
  userLongitude: number;
}

interface CheckInsUseCaseResponse {
  checkIn: CheckIn;
}

export class CheckInsUseCase {
  constructor(
    private checkInsRepository: CheckInsRepository,
    private gymsRepository: GymsRepository,
  ) {}

  async execute({
    userId,
    gymId,
    userLatitude,
    userLongitude,
  }: CheckInsUseCaseRequest): Promise<CheckInsUseCaseResponse> {
    const gym = await this.gymsRepository.findById(gymId);

    if (!gym) {
      throw new ResourceNotFoundError();
    }

    const distance = getDistanceBetweenCoordinate(
      { latitude: userLatitude, longitude: userLongitude },
      {
        latitude: gym.latitude.toNumber(),
        longitude: gym.longitude.toNumber(),
      },
    );

    const MAX_DISTANCE_IN_KILOMETERS = 0.1;

    if (distance > MAX_DISTANCE_IN_KILOMETERS) {
      throw new MaxDistanceError();
    }

    const checkInOnSameDay = await this.checkInsRepository.findByUserIdOnDate(
      userId,
      new Date(),
    );

    if (checkInOnSameDay) {
      throw new MaxNumberOfCheckInsError();
    }

    const checkIn = await this.checkInsRepository.create({
      user_id: userId,
      gym_id: gymId,
    });

    return {
      checkIn,
    };
  }
}
