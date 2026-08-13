import { FastifyInstance } from "fastify";
import { verifyJwt } from "../../../middlewares/verify-jwt";
import { create } from "./create";
import { nearby } from "./nearby";
import { search } from "./search";
import { verifyUserRole } from "../../../middlewares/verify-user-role";

export async function gymRoutes(app: FastifyInstance) {
  app.addHook("onRequest", verifyJwt);

  app.post("/gyms", { onRequest: [verifyUserRole("ADMIN")] }, create);
  app.get("/gyms/nearby", nearby);
  app.get("/gyms/search", search);
}
