import request from "supertest";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { app } from "../../../app";
import { createAndAuthenticateUser } from "../../../utils/test/create-and-authenticate-user";

describe("Nearby Gyms (e2e)", async () => {
  beforeAll(async () => {
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  it("should be able list nearby gyms", async () => {
    const { token } = await createAndAuthenticateUser(app);

    const createGymResponse = await request(app.server)
      .post("/gyms")
      .set("Authorization", `Bearer ${token}`)
      .send({
        title: "JavaScript Gym",
        description: "Some description",
        phone: "119999999",
        latitude: -23.4553304,
        longitude: -46.4489193,
      });

    await request(app.server)
      .post("/gyms")
      .set("Authorization", `Bearer ${token}`)
      .send({
        title: "TypeScript Gym",
        description: "Some description",
        phone: "119999999",
        latitude: -23.397051,
        longitude: -46.3085003,
      });

    console.log(createGymResponse.statusCode, createGymResponse.body);

    const response = await request(app.server)
      .get("/gyms/nearby")
      .query({
        latitude: -23.4553304,
        longitude: -46.4489193,
      })
      .set("Authorization", `Bearer ${token}`)
      .send();

    expect(response.statusCode).toEqual(200);
    expect(response.body.gyms).toHaveLength(1);
    expect(response.body.gyms).toEqual([
      expect.objectContaining({
        title: "JavaScript Gym",
      }),
    ]);
  });
});
