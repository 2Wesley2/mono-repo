import request from "supertest";
import { Application } from "express";
import AppServer from "../../resources/app-server";
import { MongooseWrapper } from "#mongoose-wrapper";
import { toArray } from "#src/utils/toArray";

let app: Application;
let ownerCookie: string;

const appServer = new AppServer();

beforeAll(async () => {
  await appServer.start();
  app = appServer.app;
});

afterAll(async () => {
  await MongooseWrapper.deleteDB("system_test");
  await appServer.disconnectDB();
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
  it("Deve logar o novo usuário owner\n [POST][/owner/sign-in]", async () => {
    const response = await request(app).post("/owner/sign-in").send({
      email: "test@example.com",
      password: "password123",
    });
    expect(response.status).toBe(200);
    const cookiesHeader = response.header["set-cookie"];
    const cookies = toArray(cookiesHeader);
    expect(cookies).toBeDefined();
    expect(cookies.length).toBeGreaterThan(0);
    ownerCookie = cookies.find((cookie: string) => cookie.startsWith("owner="));
    expect(ownerCookie).toBeDefined();
  });
  it("Deve cadastrar um novo funcionário\n [POST][/owner/create-employee]", async () => {
    const response = await request(app)
      .post("/owner/create-employee")
      .set("Cookie", ownerCookie)
      .send({
        email: "john.doe@example.com",
        password: "password123",
        cpf: "12345678901",
        firstName: "Test",
        lastName: "Employee",
        birthDate: "1990-01-01",
        street: "Test Street",
        neighborhood: "Test Neighborhood",
        houseNumber: "123",
        postalCode: "12345678",
        city: "Test City",
        state: "TS",
      });
    expect(response.status).toBe(201);
    expect(response.body).toBeDefined();
  });
  it("Não deve cadastrar um novo usuário owner com dados inválidos\n [POST][/owner/sign-up]", async () => {
    const response = await request(app).post("/owner/sign-up").send({
      email: "invalid-email",
      password: "short",
      cnpj: "invalid-cnpj",
      legalName: "",
      cpf: "invalid-cpf",
      firstName: "",
      lastName: "",
      birthDate: "invalid-date",
    });
    expect(response.status).toBe(400);
  });
  it("Não deve logar o usuário owner com senha incorreta\n [POST][/owner/sign-in]", async () => {
    const response = await request(app).post("/owner/sign-in").send({
      email: "test@example.com",
      password: "wrongpassword",
    });
    expect(response.status).toBe(401);
  });

  it("Não deve cadastrar um novo funcionário sem estar autenticado\n [POST][/owner/create-employee]", async () => {
    const response = await request(app).post("/owner/create-employee").send({
      email: "jane.doe@example.com",
      password: "password123",
      cpf: "12345678901",
      firstName: "Jane",
      lastName: "Doe",
      birthDate: "1990-01-01",
      street: "Test Street",
      neighborhood: "Test Neighborhood",
      houseNumber: "123",
      postalCode: "12345678",
      city: "Test City",
      state: "TS",
    });
    expect(response.status).toBe(403);
  });
});
