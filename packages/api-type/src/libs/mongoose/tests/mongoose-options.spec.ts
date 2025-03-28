import { configureOptions } from "../utils/mongoose-options";
import { testCases } from "./test-case";
describe("configureOptions", () => {
  testCases.forEach(({ description, input, expected }) => {
    it(description, () => {
      const options = configureOptions(input);
      expect(options).toEqual(expect.objectContaining(expected));
    });
  });

  it("deve evitar reatribuição do valor true para timestamps", () => {
    const options = configureOptions({
      timestamps: true,
    });
    expect(options.timestamps).toBe(true);

    const optionsWithOverride = configureOptions({
      timestamps: { createdAt: "custom_created_at" },
    });
    expect(optionsWithOverride.timestamps).toEqual({
      createdAt: true,
      updatedAt: true,
    });
  });
});
