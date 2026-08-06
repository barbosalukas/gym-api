import { FastifyReply, FastifyRequest } from "fastify";
import { makeGetUseMetricsUseCase } from "../../../use-cases/factories/make-get-users-metrics-use-case";

export async function metrics(request: FastifyRequest, reply: FastifyReply) {
  const getUseMetricsUseCase = makeGetUseMetricsUseCase();

  const { checkInsCount } = await getUseMetricsUseCase.execute({
    userId: request.user.sub,
  });

  return reply.status(200).send({
    checkInsCount,
  });
}
