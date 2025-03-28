export const testCases = [
  {
    description: "timestamp não deve permitir reatribuição para false",
    input: { timestamps: false },
    expected: { timestamps: true },
  },
  {
    description: "timestamp deve ser true para objeto vazio",
    input: {},
    expected: { timestamps: true },
  },
  {
    description: "timestamp deve ser true para objeto não passado",
    input: undefined,
    expected: { timestamps: true },
  },
  {
    description: "timestamp deve ser true para argumento inválido",
    input: { invalidKey: "invalidValue" } as any,
    expected: { timestamps: true },
  },
  {
    description: "deve mesclar timestamps como objetos",
    input: { timestamps: { createdAt: "created_at" } },
    expected: {
      timestamps: { createdAt: true, updatedAt: true },
    },
  },
  {
    description: "deve validar objetos de timestamps corretamente",
    input: {
      timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
    },
    expected: {
      timestamps: { createdAt: true, updatedAt: true },
    },
  },
  {
    description: "deve lidar com valores inválidos para timestamps",
    input: { timestamps: undefined as unknown as boolean },
    expected: { timestamps: true },
  },
  {
    description:
      "deve garantir que valores internos de timestamps como objeto sejam sempre true",
    input: {
      timestamps: { createdAt: "custom_created_at", updatedAt: false },
    },
    expected: {
      timestamps: { createdAt: true, updatedAt: true },
    },
  },
  {
    description: "deve evitar duplicação de { timestamps: true }",
    input: { timestamps: true },
    expected: { timestamps: true },
  },
  {
    description: "deve garantir que as opções sejam extensíveis",
    input: { customOption: "customValue" } as any,
    expected: { customOption: "customValue", timestamps: true },
  },
];
