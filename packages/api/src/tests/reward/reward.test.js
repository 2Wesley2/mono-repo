import loaders from '#src/core/loaders/index.js';
import RewardModel from '#src/resources/modules/cashback/RewardModel.js';
import mongoose from 'mongoose'; // para gerar ObjectId quando necessário
jest.setTimeout(30000);

const ownerId = '67a3c5cbe96f2b4665c5e79c';

let rewardModel;

describe('Testes da RewardModel', () => {
  beforeAll(async () => {
    await loaders.mongoose.init();
    // Instância sem schema customizado, usando o default que já possui creditOfConsumption e usageConditions.
    rewardModel = new RewardModel();
  });

  afterAll(async () => {
    // Se desejar limpar a base de dados para os testes, descomente a linha abaixo:
    // await loaders.mongoose.dropDatabase('system_test');
    await loaders.mongoose.disconnect();
  });

  describe('Criação da configuração (createConfig)', () => {
    beforeEach(async () => {
      // Limpa os documentos antes de cada teste deste grupo.
      await rewardModel.model.deleteMany({});
    });

    test('deve criar um documento novo com o ownerId completamente default', async () => {
      const newConfigData = {
        creditOfConsumption: {
          generationCondition: {},
        },
        usageConditions: {
          temporalValidity: {
            usagePeriods: [],
          },
          progressiveAccumulation: {
            enabled: false,
          },
          usage: {},
        },
      };
      const createdDoc = await rewardModel.createConfig(ownerId, newConfigData);
      expect(createdDoc.ownerId).toBeDefined();
      expect(createdDoc.type).toBe('reward');

      // Valida a existência da configuração reward
      expect(createdDoc.config).toBeDefined();
      expect(createdDoc.config.reward).toBeDefined();

      // Valida a configuração padrão de creditOfConsumption
      expect(createdDoc.config.reward.creditOfConsumption).toBeDefined();
      expect(createdDoc.config.reward.creditOfConsumption.enabled).toBe(false);
      expect(createdDoc.config.reward.creditOfConsumption.generationCondition).toBeDefined();
      expect(createdDoc.config.reward.creditOfConsumption.generationCondition.ranges).toEqual([]);
      expect(createdDoc.config.reward.creditOfConsumption.generationCondition.products).toEqual([]);

      // Valida a configuração padrão de usageConditions
      expect(createdDoc.config.reward.usageConditions).toBeDefined();

      // Valida o subcampo temporalValidity
      expect(createdDoc.config.reward.usageConditions.temporalValidity).toBeDefined();
      expect(createdDoc.config.reward.usageConditions.temporalValidity.expirationDate).toBeUndefined();
      expect(createdDoc.config.reward.usageConditions.temporalValidity.usagePeriods).toEqual([]);

      // Valida a configuração padrão de progressiveAccumulation
      expect(createdDoc.config.reward.usageConditions.progressiveAccumulation).toBeDefined();
      expect(createdDoc.config.reward.usageConditions.progressiveAccumulation.enabled).toBe(false);
      expect(createdDoc.config.reward.usageConditions.progressiveAccumulation.maxBalance).toBeUndefined();

      // Valida a configuração padrão de usage (modo e maxPercentage)
      expect(createdDoc.config.reward.usageConditions.usage).toBeDefined();
      expect(createdDoc.config.reward.usageConditions.usage.mode).toBe('integral');
      expect(createdDoc.config.reward.usageConditions.usage.maxPercentage).toBe(100);
    });

    test('deve lançar erro ao tentar criar uma configuração para um owner que já possui configuração', async () => {
      const newConfigData = {
        creditOfConsumption: {
          generationCondition: {},
        },
        usageConditions: {
          temporalValidity: { usagePeriods: [] },
          progressiveAccumulation: { enabled: false },
          usage: {},
        },
      };

      // Cria a configuração pela primeira vez
      await rewardModel.createConfig(ownerId, newConfigData);

      // Tenta criar novamente para o mesmo owner e espera erro
      await expect(rewardModel.createConfig(ownerId, newConfigData)).rejects.toThrow(
        `Já existe uma configuração para o ownerId ${ownerId}.`,
      );
    });
  });

  describe('Atualização da configuração (updateConfig)', () => {
    beforeEach(async () => {
      // Limpa os documentos antes de cada teste deste grupo.
      await rewardModel.model.deleteMany({});
      // Cria um documento padrão para o ownerId usado
      await rewardModel.createConfig(ownerId, {
        creditOfConsumption: { generationCondition: {} },
        usageConditions: {
          temporalValidity: { usagePeriods: [] },
          progressiveAccumulation: { enabled: false },
          usage: {},
        },
      });
    });

    test('deve atualizar a configuração reward para o owner existente', async () => {
      const newConfigData = {
        creditOfConsumption: {
          enabled: true,
          generationCondition: {
            ranges: [
              {
                minValue: 10,
                maxValue: 20,
                creditValue: 5,
              },
            ],
            products: [new mongoose.Types.ObjectId()],
          },
        },
        usageConditions: {
          temporalValidity: {
            expirationDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
            usagePeriods: [],
          },
          progressiveAccumulation: {
            enabled: true,
            maxBalance: 100,
          },
          usage: {
            mode: 'integral',
            maxPercentage: 100,
          },
        },
      };

      const updatedDoc = await rewardModel.updateConfig(ownerId, newConfigData);
      expect(updatedDoc.config.reward.creditOfConsumption.enabled).toBe(true);
      expect(updatedDoc.config.reward.creditOfConsumption.generationCondition.ranges).toHaveLength(1);
      expect(updatedDoc.config.reward.creditOfConsumption.generationCondition.ranges[0].minValue).toBe(10);
      expect(updatedDoc.config.reward.creditOfConsumption.generationCondition.ranges[0].maxValue).toBe(20);
      expect(updatedDoc.config.reward.creditOfConsumption.generationCondition.ranges[0].creditValue).toBe(5);
      expect(updatedDoc.config.reward.usageConditions.usage.mode).toBe('integral');
      expect(updatedDoc.config.reward.usageConditions.usage.maxPercentage).toBe(100);
    });

    test('deve lançar erro ao tentar atualizar configuração para um owner inexistente', async () => {
      const invalidOwnerId = '000000000000000000000000';
      const newConfigData = {
        creditOfConsumption: {
          enabled: true,
          generationCondition: {
            ranges: [
              {
                minValue: 10,
                maxValue: 20,
                creditValue: 5,
              },
            ],
            products: [],
          },
        },
        conversion: {
          enabled: false,
        },
        exclusiveBenefit: {
          enabled: false,
        },
        usageConditions: {
          temporalValidity: {
            expirationDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
            usagePeriods: [],
          },
          progressiveAccumulation: {
            enabled: false,
            maxBalance: 0,
          },
          usage: {
            mode: 'integral',
            maxPercentage: 100,
          },
        },
      };

      await expect(rewardModel.updateConfig(invalidOwnerId, newConfigData)).rejects.toThrow(
        `Nenhum cashback reward encontrado para o ownerId ${invalidOwnerId}.`,
      );
    });
  });

  describe('Validações do schema na criação do documento (usando updateConfig)', () => {
    beforeEach(async () => {
      // Limpa e cria um documento para o ownerId usado
      await rewardModel.model.deleteMany({});
      await rewardModel.createConfig(ownerId, {
        creditOfConsumption: { generationCondition: {} },
        usageConditions: {
          temporalValidity: { usagePeriods: [] },
          progressiveAccumulation: { enabled: false },
          usage: {},
        },
      });
    });

    test('deve atualizar documento válido com todas as configurações corretamente definidas', async () => {
      const newConfigData = {
        creditOfConsumption: {
          enabled: true,
          generationCondition: {
            ranges: [
              {
                minValue: 5,
                maxValue: 15,
                creditValue: 3,
              },
            ],
            products: [new mongoose.Types.ObjectId()],
          },
        },
        conversion: {
          enabled: false,
        },
        exclusiveBenefit: {
          enabled: false,
        },
        usageConditions: {
          temporalValidity: {
            expirationDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
            usagePeriods: [],
          },
          progressiveAccumulation: {
            enabled: true,
            maxBalance: 200,
          },
          usage: {
            mode: 'partial',
            maxPercentage: 50,
          },
        },
      };

      const updatedDoc = await rewardModel.updateConfig(ownerId, newConfigData);
      expect(updatedDoc).toBeDefined();
      expect(updatedDoc.config.reward.creditOfConsumption.enabled).toBe(true);
    });

    test('deve falhar validação quando creditOfConsumption estiver habilitado mas generationCondition não possuir ranges nem products', async () => {
      const newConfigData = {
        creditOfConsumption: {
          enabled: true,
          generationCondition: {
            ranges: [],
            products: [],
          },
        },
        conversion: {
          enabled: false,
        },
        exclusiveBenefit: {
          enabled: false,
        },
        usageConditions: {
          temporalValidity: {
            expirationDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
            usagePeriods: [],
          },
          progressiveAccumulation: {
            enabled: true,
            maxBalance: 200,
          },
          usage: {
            mode: 'partial',
            maxPercentage: 50,
          },
        },
      };

      await expect(rewardModel.updateConfig(ownerId, newConfigData)).rejects.toThrow(
        /When enabled, at least one range or product must be defined for credit generation/,
      );
    });

    test('deve falhar validação quando usage.mode é "integral" mas maxPercentage não é 100', async () => {
      const newConfigData = {
        creditOfConsumption: {
          enabled: true,
          generationCondition: {
            ranges: [
              {
                minValue: 5,
                maxValue: 15,
                creditValue: 3,
              },
            ],
            products: [new mongoose.Types.ObjectId()],
          },
        },
        conversion: {
          enabled: false,
        },
        exclusiveBenefit: {
          enabled: false,
        },
        usageConditions: {
          temporalValidity: {
            expirationDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
            usagePeriods: [],
          },
          progressiveAccumulation: {
            enabled: false,
            maxBalance: 0,
          },
          usage: {
            mode: 'integral',
            maxPercentage: 90, // incorreto para mode "integral"
          },
        },
      };

      await expect(rewardModel.updateConfig(ownerId, newConfigData)).rejects.toThrow(
        /If usage mode is "integral", maxPercentage must be 100; if "partial", maxPercentage cannot be 100/,
      );
    });

    test('deve falhar validação quando temporalValidity tiver expirationDate e usagePeriods definidos simultaneamente', async () => {
      const newConfigData = {
        creditOfConsumption: {
          enabled: true,
          generationCondition: {
            ranges: [
              {
                minValue: 5,
                maxValue: 15,
                creditValue: 3,
              },
            ],
            products: [new mongoose.Types.ObjectId()],
          },
        },
        conversion: {
          enabled: false,
        },
        exclusiveBenefit: {
          enabled: false,
        },
        usageConditions: {
          temporalValidity: {
            expirationDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
            usagePeriods: [
              {
                start: new Date(),
                end: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
              },
            ],
          },
          progressiveAccumulation: {
            enabled: false,
            maxBalance: 0,
          },
          usage: {
            mode: 'partial',
            maxPercentage: 50,
          },
        },
      };

      await expect(rewardModel.updateConfig(ownerId, newConfigData)).rejects.toThrow(
        /Either expirationDate or usagePeriods must be defined exclusively/,
      );
    });
  });
});
