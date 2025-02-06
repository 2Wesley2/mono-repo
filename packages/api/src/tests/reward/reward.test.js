import loaders from '#src/core/loaders/index.js';
import RewardModel from '#src/resources/modules/cashback/RewardModel.js';
import mongoose from 'mongoose'; // para gerar ObjectId quando necessário
jest.setTimeout(30000);

const ownerId = '67a3c5cbe96f2b4665c5e79c';

let rewardModel;

describe('Testes da RewardModel', () => {
  beforeAll(async () => {
    await loaders.mongoose.init();
    // Criamos a instância sem custom schema, usando o default que já possui creditOfConsumption e usageConditions.
    rewardModel = new RewardModel();
  });

  afterAll(async () => {
    // Se desejar limpar a base de dados para os testes, descomente a linha abaixo:
    // await loaders.mongoose.dropDatabase('system_test');
    await loaders.mongoose.disconnect();
  });

  describe('Teste do método setConfig', () => {
    beforeAll(async () => {
      // Insere um documento inicial do cashback do tipo 'reward' para o owner existente
      await rewardModel.model.create({
        ownerId,
        type: 'reward',
        config: {
          reward: {
            // Para satisfazer a validação de rewardConfiguration,
            // pelo menos uma das configurações deve estar habilitada.
            creditOfConsumption: {
              enabled: false, // inicialmente desabilitado
              generationCondition: {
                ranges: [
                  {
                    minValue: 5,
                    maxValue: 10,
                    creditValue: 2,
                  },
                ],
                products: [],
                _validateGenerationCondition: true,
              },
              _validateRewardConfig: true,
            },
            // Adicionando as outras configurações:
            conversion: {
              enabled: false,
              // Outras propriedades específicas podem ser adicionadas se necessário
            },
            exclusiveBenefit: {
              enabled: false,
              // Outras propriedades específicas podem ser adicionadas se necessário
            },
            // Uso de condições
            usageConditions: {
              temporalValidity: {
                // Configuração válida: apenas expirationDate definida
                expirationDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
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
          },
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
            _validateGenerationCondition: true,
          },
          _validateRewardConfig: true,
        },
        // Ativando também outra configuração (por exemplo, conversão) para garantir a regra de validação de rewardConfiguration.
        conversion: {
          enabled: false,
        },
        exclusiveBenefit: {
          enabled: false,
        },
        // Manutenção das condições de uso válidas:
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

      const updatedDoc = await rewardModel.setConfig(ownerId, newConfigData);

      expect(updatedDoc.config.reward.creditOfConsumption.enabled).toBe(true);
      expect(updatedDoc.config.reward.creditOfConsumption.generationCondition.ranges).toHaveLength(1);
      expect(updatedDoc.config.reward.creditOfConsumption.generationCondition.ranges[0].minValue).toBe(10);
      expect(updatedDoc.config.reward.creditOfConsumption.generationCondition.ranges[0].maxValue).toBe(20);
      expect(updatedDoc.config.reward.creditOfConsumption.generationCondition.ranges[0].creditValue).toBe(5);
      // Validação do uso: modo integral com maxPercentage 100
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
            _validateGenerationCondition: true,
          },
          _validateRewardConfig: true,
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

      await expect(rewardModel.setConfig(invalidOwnerId, newConfigData)).rejects.toThrowError(
        `Nenhum cashback reward encontrado para o ownerId ${invalidOwnerId}.`,
      );
    });
  });

  describe('Validações do schema na criação do documento', () => {
    // Antes de cada teste, limpa a coleção para não interferir com documentos anteriores
    beforeEach(async () => {
      await rewardModel.model.deleteMany({});
    });

    test('deve criar documento válido com todas as configurações corretamente definidas', async () => {
      const doc = await rewardModel.model.create({
        ownerId,
        type: 'reward',
        config: {
          reward: {
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
                _validateGenerationCondition: true,
              },
              _validateRewardConfig: true,
            },
            // Ativando apenas uma das configurações satisfaz a regra de validação de rewardConfiguration.
            conversion: {
              enabled: false,
            },
            exclusiveBenefit: {
              enabled: false,
            },
            usageConditions: {
              temporalValidity: {
                // Configuração válida: somente expirationDate definida
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
          },
        },
      });

      expect(doc).toBeDefined();
      expect(doc.config.reward.creditOfConsumption.enabled).toBe(true);
    });

    test('deve falhar validação quando creditOfConsumption estiver habilitado mas generationCondition não possuir ranges nem products', async () => {
      await expect(
        rewardModel.model.create({
          ownerId,
          type: 'reward',
          config: {
            reward: {
              creditOfConsumption: {
                enabled: true,
                generationCondition: {
                  ranges: [], // vazio
                  products: [], // vazio
                  _validateGenerationCondition: true,
                },
                _validateRewardConfig: true,
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
            },
          },
        }),
      ).rejects.toThrow(/When enabled, at least one range or product must be defined for credit generation/);
    });

    test('deve falhar validação quando usage.mode é "integral" mas maxPercentage não é 100', async () => {
      await expect(
        rewardModel.model.create({
          ownerId,
          type: 'reward',
          config: {
            reward: {
              creditOfConsumption: {
                // Para satisfazer o validateRewardConfiguration, habilitamos pelo menos uma configuração.
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
                  _validateGenerationCondition: true,
                },
                _validateRewardConfig: true,
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
            },
          },
        }),
      ).rejects.toThrow(
        /If usage mode is "integral", maxPercentage must be 100; if "partial", maxPercentage cannot be 100/,
      );
    });

    test('deve falhar validação quando temporalValidity tiver expirationDate e usagePeriods definidos simultaneamente', async () => {
      await expect(
        rewardModel.model.create({
          ownerId,
          type: 'reward',
          config: {
            reward: {
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
                  _validateGenerationCondition: true,
                },
                _validateRewardConfig: true,
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
            },
          },
        }),
      ).rejects.toThrow(/Either expirationDate or usagePeriods must be defined exclusively/);
    });
  });
});
