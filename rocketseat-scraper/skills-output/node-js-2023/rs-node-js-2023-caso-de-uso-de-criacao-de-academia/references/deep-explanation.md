# Deep Explanation: Caso de Uso de Criacao de Academia

## Null vs Undefined — A Diferenca que Importa

O instrutor destaca uma nuance critica do JavaScript que muitos desenvolvedores confundem:

- **`undefined`** = "nao estou enviando esse campo" → nao mexe no valor existente
- **`null`** = "quero remover/limpar esse valor" → atualiza para vazio
- **valor valido** = "quero atualizar para isso"

### Cenario pratico (update de academia):

```typescript
// Cenario 1: Atualizar apenas o titulo
updateGym({ title: 'Novo Nome' })
// description = undefined → nao mexe na descricao existente

// Cenario 2: Remover a descricao
updateGym({ title: 'Novo Nome', description: null })
// description = null → limpa a descricao

// Cenario 3: Atualizar a descricao
updateGym({ title: 'Novo Nome', description: 'Nova descricao' })
// description = 'Nova descricao' → atualiza
```

Por isso na criacao o tipo e `string | null` (ou voce tem descricao, ou nao tem), mas em um update seria `string | null | undefined` (3 estados semanticos).

O instrutor menciona a famosa "charge do undefined vs null com rolo de papel higienico" — undefined e "nao tem papel", null e "tem o suporte mas esta vazio". Na pratica do codigo, essa diferenca determina comportamento em updates parciais.

## Prisma Decimal — Por que converter?

O Prisma usa um tipo proprio (`Prisma.Decimal`) para campos decimais no banco. No repositorio in-memory, precisamos simular isso. A conversao via `.toString()` garante que qualquer formato numerico (int, float, notacao cientifica) seja aceito pelo construtor do Decimal.

## ID Opcional no Repositorio In-Memory

Ao adicionar `data.id ?? randomUUID()`, ganhamos flexibilidade nos testes:
- Testes que precisam de relacoes entre entidades passam um ID fixo
- Testes simples de criacao deixam o ID ser gerado automaticamente

Isso foi motivado pela refatoracao do teste de check-in, onde antes se fazia `push` direto no array com dados hardcoded. Usando o metodo `create`, o teste fica mais proximo do comportamento real.

## Erros Customizados — Por que nao usar Error generico?

O instrutor cria `MaxDistanceError` e `MaxNumberOfCheckInsError` separados porque:
1. Controllers podem retornar HTTP status codes diferentes por tipo de erro
2. Testes podem validar o tipo especifico com `toBeInstanceOf()`
3. Mensagens de erro ficam centralizadas e consistentes

O `MaxDistanceError` e um erro de seguranca — dificilmente disparado em uso normal, ja que o front-end filtra academias proximas. Mas protege contra uso malicioso da API.

## Confianca dos Testes

Frase-chave do instrutor: "Teste traz muita confianca. Eu rodo os testes, beleza, passou, quer dizer que eu nao estraguei nada."

Apos refatorar o teste de check-in para usar `gymsRepository.create()` ao inves de `push` direto, os testes continuaram passando — validando que a refatoracao foi segura.

## Use Case Sem Regras de Negocio

O `CreateGymUseCase` praticamente nao tem regras de negocio — apenas repassa dados ao repositorio. O instrutor explica que isso e intencional: a regra "academia so pode ser cadastrada por administradores" vira depois, quando a parte de autorizacao for implementada. Primeiro os requisitos funcionais, depois seguranca.