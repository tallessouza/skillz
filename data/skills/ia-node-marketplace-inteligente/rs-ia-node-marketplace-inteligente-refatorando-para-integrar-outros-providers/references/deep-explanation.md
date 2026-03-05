# Deep Explanation: Refatorando Para Integrar Outros Providers

## Por que classe abstrata e nao interface?

O instrutor enfatiza um ponto critico do NestJS com TypeScript: interfaces sao construcoes puramente de TypeScript que **desaparecem na compilacao para JavaScript**. Isso significa que voce nao pode usar uma interface como valor no campo `provide` do decorator `@Module`. Classe abstrata, por outro lado, existe no JavaScript compilado e pode ser usada como token de injecao de dependencia.

```typescript
// FUNCIONA — classe abstrata existe em runtime
provide: LLMService // classe abstrata

// NAO FUNCIONA — interface some na compilacao
provide: ILLMService // interface = undefined em runtime
```

## O fluxo de dependencia no NestJS

O instrutor demonstra o fluxo completo:

1. `LLMModule` declara um provider com `provide: LLMService` (classe abstrata)
2. `useFactory` decide qual implementacao concreta instanciar
3. `exports: [LLMService]` permite que modulos importadores acessem o servico
4. `CatalogModule` e `ChatModule` fazem `imports: [LLMModule]`
5. Nos servicos desses modulos, injeta-se `LLMService` (a abstrata) — o NestJS resolve para a implementacao concreta

Se voce remover o `exports: [LLMService]` do `LLMModule`, o projeto quebra na compilacao porque os outros modulos nao conseguem resolver o provider.

## Por que copiar prompts ao inves de compartilhar?

O instrutor faz questao de destacar: "os prompts, especificamente, a gente pode reaproveitar, sim, mas eu prefiro que a gente copie e cole, porque é muito provável que a gente tenha que fazer adaptações até para modelos diferentes, quanto mais para empresa completamente diferente."

Prompts sao implementacao especifica. O que funciona bem com GPT-4 pode precisar de ajustes para Gemini. Compartilhar prompts cria acoplamento desnecessario e dificulta otimizacoes por modelo.

## Schemas vs Prompts — regra de separacao

- **Schemas (Zod):** Compartilhados — definem a estrutura de dados que ambos providers devem respeitar
- **Prompts:** Copiados por provider — otimizaveis independentemente
- **Cliente (OpenAI/Gemini SDK):** Especifico de cada implementacao

## O padrao provide/useFactory/inject

O `inject: [ConfigService]` diz ao NestJS: "resolva ConfigService do container de DI e passe como parametro para a factory." A ordem dos parametros no `inject` corresponde a ordem dos argumentos na funcao `useFactory`.

```typescript
useFactory: (configService: ConfigService) => { ... },
inject: [ConfigService], // configService vem daqui
```

## Super() no construtor filho

Quando `OpenAILLMService extends LLMService` e define seu proprio construtor, o `super()` e obrigatorio — mesmo que `LLMService` nao tenha nada no construtor. Isso e uma regra do JavaScript/TypeScript para classes que estendem outras.

## Verificacao pratica

O instrutor mostra que apos toda a refatoracao, basta rodar `npm run start:dev` e verificar que compila sem erros. Ele tambem demonstra que remover o `exports` quebra a compilacao — uma forma pratica de validar que a configuracao de modulos esta correta.