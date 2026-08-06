import { beforeEach, describe, expect, it } from "vitest";
import { InMemoryGymsRepository } from "../repositories/in-memory/in-memory-gyms-repository";
import { CreateGymUseCase } from "./create-gym";

let gymsRepository: InMemoryGymsRepository;
let sut: CreateGymUseCase;

describe("Create Gym Use Case", () => {
  beforeEach(() => {
    gymsRepository = new InMemoryGymsRepository();
    sut = new CreateGymUseCase(gymsRepository);
  });
  it("should to create gym", async () => {
    const { gym } = await sut.execute({
      title: "JavaScript Gym",
      description: "",
      phone: "",
      latitude: -23.4553304,
      longitude: -46.4489193,
    });

    expect(gym.id).toEqual(expect.any(String));
  });
});
