import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { InMemoryCheckInsRepository } from "../repositories/in-memory/in-memory-check-in-repositories";
import { CheckInsUseCase } from "./check-in";
import { InMemoryGymsRepository } from "../repositories/in-memory/in-memory-gyms-repository";
import { MaxNumberOfCheckInsError } from "./error/max-number-of-check-ins-error";
import { MaxDistanceError } from "./error/max-distance-error";

let checkInRepository: InMemoryCheckInsRepository;
let gymsRepository: InMemoryGymsRepository;
let sut: CheckInsUseCase;

describe("Check-In Use Case", () => {
  beforeEach(async () => {
    checkInRepository = new InMemoryCheckInsRepository();
    gymsRepository = new InMemoryGymsRepository();
    sut = new CheckInsUseCase(checkInRepository, gymsRepository);

    await gymsRepository.create({
      id: "gym-01",
      title: "JavaScript Gym",
      description: "",
      phone: "",
      latitude: -23.4553304,
      longitude: -46.4489193,
    });

    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("should be able to check in", async () => {
    const { checkIn } = await sut.execute({
      gymId: "gym-01",
      userId: "user-01",
      userLatitude: -23.4553304,
      userLongitude: -46.4489193,
    });

    expect(checkIn.id).toEqual(expect.any(String));
  });

  it("should not be possible to check in twice on the same day.", async () => {
    vi.setSystemTime(new Date(2022, 0, 20, 8, 0, 0));

    await sut.execute({
      gymId: "gym-01",
      userId: "user-01",
      userLatitude: -23.4553304,
      userLongitude: -46.4489193,
    });

    await expect(() =>
      sut.execute({
        gymId: "gym-01",
        userId: "user-01",
        userLatitude: -23.4553304,
        userLongitude: -46.4489193,
      }),
    ).rejects.toBeInstanceOf(MaxNumberOfCheckInsError);
  });

  it("should be possible to check in twice but different day.", async () => {
    vi.setSystemTime(new Date(2022, 0, 20, 8, 0, 0));

    await sut.execute({
      gymId: "gym-01",
      userId: "user-01",
      userLatitude: -23.4553304,
      userLongitude: -46.4489193,
    });

    vi.setSystemTime(new Date(2022, 0, 21, 8, 0, 0));

    const { checkIn } = await sut.execute({
      gymId: "gym-01",
      userId: "user-01",
      userLatitude: -23.4553304,
      userLongitude: -46.4489193,
    });

    expect(checkIn.id).toEqual(expect.any(String));
  });

  it("should not be able to check in on distance gym", async () => {
    await gymsRepository.create({
      id: "gym-02",
      title: "JavaScript Gym",
      description: "",
      phone: "",
      latitude: -23.4328916,
      longitude: -46.430239,
    });

    await expect(() =>
      sut.execute({
        gymId: "gym-02",
        userId: "user-01",
        userLatitude: -23.4553304,
        userLongitude: -46.4489193,
      }),
    ).rejects.toBeInstanceOf(MaxDistanceError);
  });
});
