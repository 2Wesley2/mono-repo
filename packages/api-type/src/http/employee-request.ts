import type { SEmployee } from "#schema";
import type { SignUpRequest } from "#http";

export type EmployeeBodyRequest = Omit<SEmployee, "owner_id">;
export type SignUpEmployeeRequest = SignUpRequest<SEmployee>;
