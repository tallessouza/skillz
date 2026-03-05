# Deep Explanation: Separando Regras de Negocio

## Principio da Inversao de Dependencia (DIP)

O instrutor enfatiza que o ponto central desta refatoracao e o **Principio da Inversao de Dependencia**. Em vez de importar o Prisma diretamente na server action (dependencia direta da infraestrutura), a dependencia e invertida:

- O **Use Case** depende de uma **interface** (`PromptRepository`)
- A **implementacao concreta** (`PrismaPromptRepository`) implementa essa interface
- A **composicao** acontece na server action, que conecta as pecas

### Analogia visual do instrutor

O instrutor desenhou no Excalidraw:

```
SearchPromptsUseCase ---depende de---> PromptRepository (interface)
                                              ^
                                              |
                                         implementa
                                              |
                                    PrismaPromptRepository
```

A seta de dependencia aponta para a interface, nao para a implementacao. O Use Case "nao faz ideia de quem e" o repository — e nao precisa saber.

## Por que `searchMany` se o Prisma so tem `findMany`?

O instrutor explica que a interface do repository modela o **dominio**, nao o ORM. No Prisma, tanto buscar todos quanto filtrar usam `findMany`. Porem, semanticamente sao operacoes diferentes:

- `findMany()` — buscar todos os prompts
- `searchMany(term)` — filtrar por termo

Abstrair em dois metodos torna o codigo mais legivel e o contrato mais claro. A implementacao concreta traduz isso para as chamadas reais do Prisma.

## O que e um Use Case?

Nas palavras do instrutor: "Use Case e basicamente uma regra de negocio. Ele expressa uma regra de negocio. Ele vai coordenar ali os objetos de dominio."

O Use Case neste caso e simples:
1. Recebe um termo opcional
2. Se nao tem termo → busca todos
3. Se tem termo → filtra

Essa e "a unica orquestracao que ele ta fazendo." A simplicidade e intencional — cada Use Case faz uma coisa.

## Por que a Server Action fica "fina"?

O instrutor destaca: "A nossa server action fica muito mais agnostica. A gente nao fica tao acoplado com aquele tanto de dependencia aqui dentro."

A action antes tinha: Prisma, logica de where, mapeamento de campos. Depois: instancia repository, cria use case, executa. Tres linhas.

## Nivel de intimidade

Expressao usada pelo instrutor: o Use Case "nao precisa ter esse nivel de intimidade, esse nivel de acoplamento" com detalhes como `FormData`. Ele recebe tipos primitivos (string) e trabalha com eles.

## Beneficios para testes

O instrutor menciona varias vezes que "isso vai ajudar muito nos testes." Como o Use Case depende de uma interface, nos testes voce pode passar um repository fake (in-memory) sem precisar de banco de dados real.

## Evolucao incremental

O instrutor deixa claro que a interface `PromptRepository` sera incrementada nas proximas aulas com mais metodos. O pattern permite adicionar funcionalidades sem quebrar o que ja existe.