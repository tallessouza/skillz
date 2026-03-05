# Deep Explanation: Testes de Unidade no Backend .NET

## Por que parar o desenvolvimento para testes?

O instrutor (Leo) destaca dois motivos:

1. **Reforcar a importancia dos testes** — projetos precisam de testes de unidade, e nao se deve subestimar seu poder. Com codigo organizado (injecao de dependencia, funcoes com responsabilidade unica), testes ficam simples de implementar.

2. **A questao do Fluent Assertions** — biblioteca muito utilizada no mercado e em empresas ficou paga. Tres estrategias:
   - Pagar a licenca (caro)
   - Fixar na ultima versao gratuita
   - Migrar para alternativa gratuita (Shouldly) — escolha do instrutor

## Sobre o Bogus e dados fake

O Bogus gera dados aleatorios atraves da classe `Faker<T>`. A vantagem sobre dados fixos:
- Cada execucao testa com dados diferentes, aumentando cobertura real
- Evita testes que so passam por coincidencia com dados especificos
- O `Faker` tem categorias semanticas: `Person`, `Internet`, `Commerce`, etc.

### Detalhes do RuleFor

- `f.Person.FirstName` — propriedade (retorna string direto)
- `f.Internet.Email()` — funcao (aceita parametros como nome base)
- `f.Internet.Password()` — funcao com parametros opcionais (length, memorable, regexPattern, prefix)

Parametros opcionais em C# sao identificados pela igualdade na assinatura (`length: int = 10`).

### Correlacao entre propriedades

O segundo parametro do `RuleFor` permite acessar a instancia sendo construida:

```csharp
.RuleFor(user => user.Email, (f, user) => f.Internet.Email(user.Name))
```

Isso garante que se o nome gerado foi "Marcos", o email sera algo como "marcos@hotmail.com" — dados coerentes entre si.

## Solution Folders vs Filesystem

Ponto critico destacado pelo instrutor: criar uma Solution Folder no Visual Studio **nao** cria a pasta no filesystem. Voce precisa criar manualmente no Windows Explorer/terminal para manter a organizacao espelhada.

## Bibliotecas escolhidas

| Biblioteca | Proposito | Instalada em |
|------------|-----------|-------------|
| **Shouldly** | Assertions legiveis (substituto do Fluent Assertions) | Validators.Tests |
| **Moq** | Criar mocks de interfaces | CommonTestUtilities |
| **Bogus** | Gerar dados fake | CommonTestUtilities |

Moq e Bogus ficam no CommonTestUtilities porque sao compartilhados entre todos os projetos de teste.

## Fluxos que serao testados

- Registrar conta de usuario
- Atualizar dados de perfil
- Atualizar senha
- Fazer login

Testes cobrirao: Validators, Use Cases (regras de negocio) e testes de integracao (requisicao na API + verificacao da resposta).