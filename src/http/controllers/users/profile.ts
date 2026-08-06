import { FastifyReply, FastifyRequest } from "fastify";
import { makeGetUseProfileUseCase } from "../../../use-cases/factories/make-get-use-profile-use-case";

export async function profile(request: FastifyRequest, reply: FastifyReply) {
  const useProfile = makeGetUseProfileUseCase();
  const { user } = await useProfile.execute({
    userId: request.user.sub,
  });

  return reply.status(200).send({
    user: {
      ...user,
      password_hash: undefined,
    },
  });
}
