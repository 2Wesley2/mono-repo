import Controller from "#controller";

// Importar os módulos e dependências necessários

// Bloco describe para todos os testes relacionados ao método getRouter
describe("Controller.getRouter() método getRouter", () => {
  // Testes de comportamento esperado
  describe("Comportamento esperado do método getRouter", () => {
    it("deve retornar um objeto Router com métodos padrão do Express", () => {
      // Configuração inicial: Criar uma instância do Controller
      const controller = new Controller();

      // Execução: Chamar o método getRouter
      const router = controller.getRouter();

      // Verificação: Confirmar que o objeto retornado possui métodos típicos de um Router
      expect(typeof router).toBe("function"); // Verifica se é uma função (middleware)
      expect(router).toHaveProperty("use"); // Verifica se possui o método 'use'
      expect(router).toHaveProperty("route"); // Verifica se possui o método 'route'
      expect(router).toHaveProperty("stack"); // Verifica se possui a propriedade 'stack' (pilha de middlewares)
      expect(Array.isArray(router.stack)).toBe(true); // Verifica se 'stack' é um array
    });

    it("deve retornar a mesma instância de Router ao ser chamado várias vezes", () => {
      const controller = new Controller();

      // Execução: Chamar o método getRouter várias vezes
      const router1 = controller.getRouter();
      const router2 = controller.getRouter();

      // Verificação: Confirmar que ambas as chamadas retornam a mesma instância
      expect(router1).toBe(router2);
      expect(router1).toHaveProperty("use"); // Verifica se a instância compartilhada possui o método 'use'
      expect(router1).toHaveProperty("route"); // Verifica se a instância compartilhada possui o método 'route'
    });
  });

  describe("Comportamento em chamadas simultâneas", () => {
    it("deve retornar a mesma instância de Router em chamadas simultâneas", async () => {
      // Configuração inicial: Criar uma instância do Controller
      const controller = new Controller();

      // Execução: Fazer múltiplas chamadas ao método getRouter simultaneamente
      const [router1, router2, router3] = await Promise.all([
        Promise.resolve(controller.getRouter()),
        Promise.resolve(controller.getRouter()),
        Promise.resolve(controller.getRouter()),
      ]);

      // Verificação: Confirmar que todas as chamadas retornam a mesma instância
      expect(router1).toBe(router2);
      expect(router2).toBe(router3);
    });
  });

  // Testes de casos extremos
  describe("Casos extremos do método getRouter", () => {
    it("deve retornar um Router válido mesmo sem configuração prévia", () => {
      // Configuração inicial: Criar uma instância do Controller
      const controller = new Controller();

      // Execução: Chamar o método getRouter
      const router = controller.getRouter();

      // Verificação: Confirmar que o objeto retornado possui métodos típicos de um Router
      expect(typeof router).toBe("function"); // Verifica se é uma função (middleware)
      expect(router).toHaveProperty("use"); // Verifica se possui o método 'use'
      expect(router).toHaveProperty("route"); // Verifica se possui o método 'route'
      expect(router).toHaveProperty("stack"); // Verifica se possui a propriedade 'stack'
      expect(router.stack.length).toBe(0); // Verifica se a pilha de middlewares está vazia inicialmente
    });

    // Como o método é direto e não recebe parâmetros ou possui lógica complexa,
    // há poucos casos extremos a considerar. O principal caso extremo é garantir que o método
    // se comporte corretamente quando chamado em diferentes contextos, o que é coberto pelos testes acima.
  });
});
