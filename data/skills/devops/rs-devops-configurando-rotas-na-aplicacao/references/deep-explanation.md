# Deep Explanation: Rotas de Health Check para Kubernetes

## Por que separar /health e /ready?

O instrutor enfatiza uma distincao fundamental que muitos desenvolvedores ignoram: **cada probe do Kubernetes tem uma responsabilidade diferente**.

### Tres probes, dois endpoints

- **Startup Probe** → usa `/health` — verifica se a aplicacao ja subiu
- **Liveness Probe** → usa `/health` — verifica se a aplicacao esta viva (nao travou)
- **Readiness Probe** → usa `/ready` — verifica se a aplicacao esta pronta para receber trafego

O instrutor explica: "Uma coisa é você entender se a sua aplicação está pronta. Outra coisa são dois pontos: se ela já subiu e se ela está viva." Startup e liveness compartilham o mesmo endpoint porque ambos testam o processo em si. Readiness testa algo diferente: a capacidade de atender requisicoes, o que inclui dependencias externas.

### A pergunta que todo dev faz: "Nao poderia ter so uma rota?"

O instrutor antecipa essa duvida: "Você poderia sim, ok? Você poderia ter, no caso aqui, só o checkHealth mais genérico e colocar ele em todas as estruturas." Mas o ponto e justamente a **quebra de escopo**:

- `/health` = teste de vivacidade do processo
- `/ready` = validacao de prontidao (inclui dependencias)

Com uma unica rota, se o banco cair, o liveness probe falha e o Kubernetes reinicia o container — quando na verdade o container esta vivo, so nao esta pronto. A separacao evita restarts desnecessarios.

## Terminus: quando usar

O instrutor menciona o `@nestjs/terminus` como recomendacao para apps com dependencias externas: "É uma lib que facilita demais você basicamente testar os seus serviços externos. Na prática, o Terminus ele faz ping."

O fluxo com Terminus:
1. Voce registra os servicos que quer monitorar (banco, Redis, API externa)
2. Quando `/ready` e chamado, Terminus pinga cada servico
3. Agrega os resultados em uma lista
4. Retorna healthy/unhealthy baseado no resultado

No caso da aula, a app nao tem dependencias externas, entao ambas as rotas retornam `ok` diretamente. O instrutor deixa claro: "essa aplicação não tem nenhuma dependência. Se ela tivesse dependência nós teríamos que testar essa dependência."

## Estrutura organizacional

O instrutor cria uma pasta `health/` separada com controller e service proprios. Isso segue o padrao NestJS de modularizacao por dominio. Health checks nao sao logica de negocio — sao infraestrutura. Mante-los separados facilita:

- Encontrar rapidamente as rotas de probe
- Modificar sem tocar na logica de negocio
- Reutilizar em diferentes projetos

## Fluxo completo: da rota ao Kubernetes

1. Cria as rotas na aplicacao (`/health`, `/ready`)
2. Testa localmente (`npm run start:dev` + chamadas HTTP)
3. Faz build da imagem Docker (`docker build -t app:v6 .`)
4. Push da imagem para registry (`docker push`)
5. Configura as probes no deployment YAML do Kubernetes (proxima aula)

O instrutor enfatiza testar antes de containerizar: "só pra gente fazer um teste, deixa eu rodar aqui a aplicação antes de containerizar ela só pra garantir que vai estar certinho."