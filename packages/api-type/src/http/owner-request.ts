import type { SOwner as OwnerBodyRequest } from "#schema";
import type { SignUpRequest } from "#http";

export type SignUpOwnerRequest = SignUpRequest<OwnerBodyRequest>;
