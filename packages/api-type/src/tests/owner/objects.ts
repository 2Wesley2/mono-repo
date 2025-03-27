export const newOwner = {
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
};

export const responseNewOwner = {
  email: "test@example.com",
  cnpj: "12345678901234",
  legalName: "Test Legal Name",
  tradeName: "Test Trade Name",
  cpf: "12345678901",
  firstName: "Test",
  lastName: "User",
  birthDate: new Date("1990-01-01").toISOString(),
  street: "Test Street",
  neighborhood: "Test Neighborhood",
  houseNumber: "123",
  postalCode: "12345678",
  city: "Test City",
  state: "TS",
  _id: expect.any(String),
  password: expect.any(String),
  createdAt: expect.any(String),
  updatedAt: expect.any(String),
  __v: expect.any(Number),
};

export const ownerSignIn = {
  email: "test@example.com",
  password: "password123",
};

export const newEmployee = {
  email: "employee@example.com",
  password: "password123",
  cpf: "12345678902",
  firstName: "Employee",
  lastName: "Test",
  birthDate: "1995-01-01",
  street: "Employee Street",
  neighborhood: "Employee Neighborhood",
  houseNumber: "456",
  postalCode: "87654321",
  city: "Employee City",
  state: "ES",
};

export const responseNewEmployee = {
  email: "employee@example.com",
  cpf: "12345678902",
  firstName: "Employee",
  lastName: "Test",
  birthDate: new Date("1995-01-01").toISOString(),
  street: "Employee Street",
  neighborhood: "Employee Neighborhood",
  houseNumber: "456",
  postalCode: "87654321",
  city: "Employee City",
  state: "ES",
  _id: expect.any(String),
  owner_id: expect.any(String),
  password: expect.any(String),
  createdAt: expect.any(String),
  updatedAt: expect.any(String),
  __v: expect.any(Number),
};

export const invalidOwnerSignUp = {
  email: "invalid-email",
  password: "short",
  cnpj: "invalid-cnpj",
  legalName: "Invalid Legal Name",
  cpf: "invalid-cpf",
  firstName: "Invalid",
  lastName: "User",
  birthDate: "2000-01-01",
};

export const invalidSignIn = {
  email: "test@example.com",
  password: "wrongpassword",
};

export const invalidSignUpNewEmployee = {
  email: "invalid-email",
  password: "short",
  cnpj: "invalid-cnpj",
  legalName: "",
  cpf: "invalid-cpf",
  firstName: "",
  lastName: "",
  birthDate: "invalid-date",
};
