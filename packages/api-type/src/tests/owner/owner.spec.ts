import request from "supertest";
import { Application } from "express";
import AppServer from "../../resources/app-server";
import { toArray } from "#utils";
import {
  newOwner,
  ownerSignIn,
  newEmployee,
  invalidOwnerSignUp,
  invalidSignIn,
  responseNewOwner,
  responseNewEmployee,
  invalidSignUpNewEmployee,
} from "./objects";

let app: Application;
let ownerCookie: string;

const appServer = new AppServer();

jest.setTimeout(30000); // Aumentar o timeout para 30 segundos

beforeAll(async () => {
  await appServer.start();
  app = appServer.app;

  try {
    await appServer.deleteDB("system_test");
  } catch (error) {}
});

afterAll(async () => {
  try {
    await appServer.disconnectDB(); // Desconectar primeiro
    await appServer.deleteDB("system_test"); // Deletar após desconectar
  } finally {
    await new Promise((resolve) => setTimeout(resolve, 500)); // Garantir que todos os handles sejam liberados
  }
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
      .post("/owner/sign-in") // Corrigir o endpoint
      .send(invalidSignIn);
    expect(response.status).toBe(401); // Garantir que o status seja 401
  });

  it("Não deve cadastrar um novo funcionário sem estar autenticado\n [POST][/owner/create-employee]", async () => {
    const response = await request(app)
      .post("/owner/create-employee")
      .send(invalidSignUpNewEmployee);
    expect(response.status).toBe(403);
  });
});
