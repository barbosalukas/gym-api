import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";
import { InvalidCredentialError } from "../../../use-cases/error/invalid-credential-error";
import { makeAuthenticateUseCase } from "../../../use-cases/factories/make-authenticate-use-case";

export async function authenticate(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const authenticateBodySchema = z.object({
    email: z.email(),
    password: z.string().min(6),
  });

  const { email, password } = authenticateBodySchema.parse(request.body);

  try {
    const authenticUseCase = makeAuthenticateUseCase();

    const { user } = await authenticUseCase.execute({
      email,
      password,
    });

    const token = await reply.jwtSign(
      {},
      {
        sign: {
          sub: user.id,
        },
      },
    );

    return reply.status(200).send({ token });
  } catch (err) {
    if (err instanceof InvalidCredentialError) {
      return reply.status(400).send({ message: err.message });
    }

    throw err;
  }
}
