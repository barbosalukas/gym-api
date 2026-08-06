import request from "supertest";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { app } from "../../../app";
import { createAndAuthenticateUser } from "../../../utils/test/create-and-authenticate-user";

describe("Create Gym (e2e)", async () => {
  beforeAll(async () => {
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  it("should be able to create a gym", async () => {
    const { token } = await createAndAuthenticateUser(app);

    const response = await request(app.server)
      .post("/gyms")
      .set("Authorization", `Bearer ${token}`)
      .send({
        title: "JavaScript Gym",
        description: "Some description",
        phone: "119999999",
        latitude: -23.4553304,
        longitude: -46.4489193,
      });

    expect(response.statusCode).toEqual(201);
  });
});
