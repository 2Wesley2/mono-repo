import request from "supertest";
import { Application } from "express";
import AppServer from "../../resources/app-server";
import { MongooseWrapper } from "#mongoose-wrapper";

let app: Application;
const appServer = new AppServer();
beforeAll(async () => {
  await appServer.start();
  app = appServer.app;
});

afterAll(async () => {
  await MongooseWrapper.deleteDB("system_test");
  await appServer.shutdown();
});

describe("Owner endpoint's", () => {
  it("Deve cadastrar um novo usuário owner\n [POST][/owner/sign-up]", async () => {
    const response = await request(app).post("/owner/sign-up").send({
      email: "test@example.com",
      password: "password123",
      cnpj: "12345678901234",
      legalName: "Test Legal Name",
      tradeName: "Test Trade Name",
      cpf: "12345678901",
      firstName: "Test",
      lastName: "User",
      birthDate: "1990-01-01",
      street: "Test Street",
      neighborhood: "Test Neighborhood",
      houseNumber: "123",
      postalCode: "12345678",
      city: "Test City",
      state: "TS",
    });
    expect(response.status).toBe(201);
  });
});
