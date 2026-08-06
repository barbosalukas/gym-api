import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { InMemoryCheckInsRepository } from "../repositories/in-memory/in-memory-check-in-repositories";
import { ValidatedCheckInsUseCase } from "./validated-check-in";
import { ResourceNotFoundError } from "./error/resource-not-found-error";

let checkInRepository: InMemoryCheckInsRepository;
let sut: ValidatedCheckInsUseCase;

describe("Validated Check-In Use Case", () => {
  beforeEach(async () => {
    checkInRepository = new InMemoryCheckInsRepository();
    sut = new ValidatedCheckInsUseCase(checkInRepository);

    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("should be able to validated check-in", async () => {
    const createdCheckIn = await checkInRepository.create({
      gym_id: "gym-01",
      user_id: "user-01",
    });

    const { checkIn } = await sut.execute({
      checkInId: createdCheckIn.id,
    });

    expect(checkIn.validated_at).toEqual(expect.any(Date));
    expect(checkInRepository.items[0].validated_at).toEqual(expect.any(Date));
  });

  it("should not be able to validated an inexistent check-in", async () => {
    await expect(() =>
      sut.execute({
        checkInId: "Inexistent-check-in-id",
      }),
    ).rejects.toBeInstanceOf(ResourceNotFoundError);
  });

  it("should not be able to validate the check-in after 20 minutes of its creation", async () => {
    vi.setSystemTime(new Date(2026, 6, 28, 13, 30));
    const createdCheckIn = await checkInRepository.create({
      gym_id: "gym-01",
      user_id: "user-01",
    });

    const twentyOneMinutesInMs = 1000 * 60 * 21;

    vi.advanceTimersByTime(twentyOneMinutesInMs);

    await expect(() =>
      sut.execute({
        checkInId: createdCheckIn.id,
      }),
    ).rejects.toBeInstanceOf(Error);
  });
});
