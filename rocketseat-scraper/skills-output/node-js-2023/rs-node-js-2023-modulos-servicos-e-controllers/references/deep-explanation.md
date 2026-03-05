# Deep Explanation: Módulos, Serviços e Controllers no NestJS

## O que são Decorators

Decorators são funções que adicionam comportamento a algo — uma classe, um método, uma propriedade ou uma variável. Existem desde a época do Java (JSP, JSF) e o NestJS faz uso intenso deles.

### Modelo mental do Diego

Pense no decorator como uma função:

```
function decorator(algo) {
  // modifica o "algo"
  return algoModificado
}
```

Quando você coloca `@Controller` em cima de uma classe, é como se passasse essa classe como parâmetro para a função `Controller`. Ela recebe a classe, modifica o comportamento (registra como handler HTTP), e retorna a classe modificada.

O decorator `@Get()` em cima de um método faz a mesma coisa: recebe o método, marca ele como handler para requisições GET naquele path.

## A estrutura de três arquivos

O NestJS é muito opinativo sobre os tipos de arquivo:

1. **Controller** — porta de entrada HTTP. Identificado por `@Controller()`. Cada método decorado com `@Get()`, `@Post()` etc. vira uma rota.
2. **Service/Provider** — tudo que não é controller. Identificado por `@Injectable()`. O nome "service" é convenção, mas o NestJS internamente chama de "provider".
3. **Module** — o arquivo que junta tudo. Classe vazia com `@Module()` que declara controllers e providers.

### Insight do instrutor sobre providers

> "Serviços podem ser qualquer coisa. Na verdade, até o Nest botou como App.Service, mas aqui, como você pode ver, é Provider. Ou seja, tudo o que não é controller, provavelmente vai ser um provider."

Isso é importante: não se prenda ao nome "service". Um repositório é provider. Um caso de uso é provider. Um serviço de email é provider. A regra é simples: recebe HTTP? Controller. Não recebe? Provider.

## Inversão de dependência no NestJS

O NestJS aplica inversão de dependência desde o momento 1. O controller nunca faz `new AppService()` — ele recebe a dependência pelo construtor.

### Como a mágica acontece

1. O controller declara que precisa de `AppService` no construtor
2. O module lista `AppService` em `providers[]`
3. O NestJS olha: "o controller precisa de AppService, tenho um provider que bate? Sim!"
4. O NestJS injeta automaticamente

Para isso funcionar, o provider **precisa** ter `@Injectable()` — isso diz ao NestJS que a classe é "injetável", ou seja, pode ser dependência de outras classes.

## Roteamento via decorators

- O **nome do método** é irrelevante para o roteamento. `index()`, `getHello()`, `foo()` — não importa
- O que define a rota é o **decorator**: `@Get('/hello')` = requisição GET em `/hello`
- Sem parâmetro no decorator (ex: `@Get()`), a rota é a raiz `/`
- O parâmetro do `@Controller('/api')` vira **prefixo** de todas as rotas daquele controller

## Import/Export entre módulos

Quando a aplicação cresce (ex: 50 rotas), você separa em múltiplos módulos e usa `imports[]` para conectá-los. Um módulo pode importar outro, criando um efeito cascata. O `AppModule` é sempre a raiz — é ele que é passado para `NestFactory.create()`.

## O arquivo main.ts

O `main.ts` é o ponto de entrada da aplicação:

```typescript
const app = await NestFactory.create(AppModule)
await app.listen(3333)
```

O `NestFactory.create` sempre recebe um módulo inicial. Esse módulo raiz (`AppModule`) nunca deixa de existir.