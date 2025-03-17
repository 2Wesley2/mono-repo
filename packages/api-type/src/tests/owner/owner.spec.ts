import request from "supertest";
import { Application } from "express";
import AppServer from "../../resources/app-server";
import { MongooseWrapper } from "#mongoose-wrapper";
import { toArray } from "#src/utils/toArray";
import {
  newOwner,
  ownerSignIn,
  newEmployee,
  invalidOwnerSignUp,
  invalidSignIn,
  responseNewOwner,
  responseNewEmployee,
} from "./objects";

let app: Application;
let ownerCookie: string;

const appServer = new AppServer();

const invalidSignUpNewEmployee = beforeAll(async () => {
  await appServer.start();
  app = appServer.app;
});

afterAll(async () => {
  await MongooseWrapper.deleteDB("system_test");
  await appServer.disconnectDB();
});

describe("Owner endpoint's", () => {
  it("Deve cadastrar um novo usuário owner\n [POST][/owner/sign-up]", async () => {
    const response = await request(app).post("/owner/sign-up").send(newOwner);
    expect(response.status).toBe(201);
    expect(response.body).toEqual(responseNewOwner);
  });
  it("Deve logar o novo usuário owner\n [POST][/owner/sign-in]", async () => {
    const response = await request(app)
      .post("/owner/sign-in")
      .send(ownerSignIn);
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
      .send(newEmployee);
    expect(response.status).toBe(201);
    expect(response.body).toBeDefined();
    expect(response.body).toEqual(responseNewEmployee);
  });
  it("Não deve cadastrar um novo usuário owner com dados inválidos\n [POST][/owner/sign-up]", async () => {
    const response = await request(app)
      .post("/owner/sign-up")
      .send(invalidOwnerSignUp);
    expect(response.status).toBe(400);
  });
  it("Não deve logar o usuário owner com senha incorreta\n [POST][/owner/sign-in]", async () => {
    const response = await request(app)
      .post("/owner/sign-in")
      .send(invalidSignIn);
    expect(response.status).toBe(401);
  });

  it("Não deve cadastrar um novo funcionário sem estar autenticado\n [POST][/owner/create-employee]", async () => {
    const response = await request(app)
      .post("/owner/create-employee")
      .send(invalidSignUpNewEmployee);
    expect(response.status).toBe(403);
  });
});
