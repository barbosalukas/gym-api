import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";
import { makeValidatedCheckInUseCase } from "../../../use-cases/factories/make-validated-check-in-use-case";

export async function validate(request: FastifyRequest, reply: FastifyReply) {
  const validateCheckInParamsSchema = z.object({
    checkInId: z.uuid(),
  });

  const { checkInId } = validateCheckInParamsSchema.parse(request.params);

  const validatedCheckInUseCase = makeValidatedCheckInUseCase();

  await validatedCheckInUseCase.execute({
    checkInId,
  });

  return reply.status(204).send();
}
