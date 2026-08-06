import { beforeEach, describe, expect, it } from "vitest";
import { InMemoryUserRepository } from "../repositories/in-memory/in-memory-user-repository";
import { InvalidCredentialError } from "./error/invalid-credential-error";
import { AuthenticateUseCase } from "./authenticate";
import { hash } from "bcryptjs";

let userRepository: InMemoryUserRepository;
let sut: AuthenticateUseCase;

describe("Authentic Use Case", () => {
  beforeEach(() => {
    userRepository = new InMemoryUserRepository();
    sut = new AuthenticateUseCase(userRepository);
  });

  it("should be able to authenticate", async () => {
    await userRepository.create({
      name: "John Doe",
      email: "johndoe@example.com",
      password_hash: await hash("123456", 6),
    });

    const { user } = await sut.execute({
      email: "johndoe@example.com",
      password: "123456",
    });

    expect(user.id).toEqual(expect.any(String));
  });

  it("should not be able to authenticate with wrong email", async () => {
    await expect(() =>
      sut.execute({
        email: "johndoe@example.com",
        password: "123456",
      }),
    ).rejects.toBeInstanceOf(InvalidCredentialError);
  });

  it("should not be able to authenticate with wrong password", async () => {
    await userRepository.create({
      name: "John Doe",
      email: "johndoe@example.com",
      password_hash: await hash("123456", 6),
    });

    await expect(() =>
      sut.execute({
        email: "johndoe@example.com",
        password: "123123",
      }),
    ).rejects.toBeInstanceOf(InvalidCredentialError);
  });
});
