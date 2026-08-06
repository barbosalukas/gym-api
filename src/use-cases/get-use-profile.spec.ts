import { beforeEach, describe, expect, it } from "vitest";
import { InMemoryUserRepository } from "../repositories/in-memory/in-memory-user-repository";
import { hash } from "bcryptjs";
import { GetUseProfile } from "./get-use-profile";
import { ResourceNotFoundError } from "./error/resource-not-found-error";

let userRepository: InMemoryUserRepository;
let sut: GetUseProfile;

describe("Get User Profile Use Case", () => {
  beforeEach(() => {
    userRepository = new InMemoryUserRepository();
    sut = new GetUseProfile(userRepository);
  });

  it("should be able to get user profile", async () => {
    const createdUser = await userRepository.create({
      name: "John Doe",
      email: "johndoe@example.com",
      password_hash: await hash("123456", 6),
    });

    const { user } = await sut.execute({
      userId: createdUser.id,
    });

    expect(user.name).toEqual("John Doe");
  });

  it("should not be able to get user profile with wrong id", async () => {
    await expect(() =>
      sut.execute({
        userId: "not-exists-id",
      }),
    ).rejects.toBeInstanceOf(ResourceNotFoundError);
  });
});
