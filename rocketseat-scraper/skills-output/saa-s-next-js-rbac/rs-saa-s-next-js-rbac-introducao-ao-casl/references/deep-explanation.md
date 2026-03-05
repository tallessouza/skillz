# Deep Explanation: Introducao ao CASL

## O que e CASL

CASL (pronunciado "Castle") e uma biblioteca **isomorfica** de autorizacao para JavaScript. Isomorfica significa que funciona identicamente no backend e no frontend — mesma API, mesma sintaxe, mesmo codigo.

O instrutor Diego enfatiza que isso so funciona perfeitamente quando backend e frontend sao ambos JavaScript. Se o backend fosse em outra linguagem, seria necessario usar um formato intermediario (JSON, YAML) para compartilhar as definicoes de permissao entre os dois lados.

## A Separacao Critica: CASL vs Regras de Negocio

Este e o insight mais importante da aula. Diego apresenta dois cenarios:

**Cenario:** "Usuario so pode editar tweet se o tweet nao tem likes"

**Opcao A (dentro do CASL):** Colocar a condicao `likesCount: 0` nas conditions do CASL.

**Opcao B (no backend):** CASL so verifica ownership (`authorId: user.id`), e o backend faz `if (tweet.likes > 0) throw error`.

Diego defende a Opcao B na maioria dos casos, pelo seguinte raciocinio:

> "Se a gente estiver seguindo no backend um Domain-Driven Design, uma ideia de a gente ter as regras de negocio da nossa aplicacao bem protegidas numa camada da nossa aplicacao, o CASL nao faria muito sentido porque ele nao esta numa camada muito baixo nivel da nossa aplicacao."

Ou seja: CASL opera no nivel de **autorizacao** (quem pode o que), nao no nivel de **dominio** (quando e sob quais circunstancias). Misturar os dois niveis quebra a separacao de responsabilidades.

### Regra pratica do instrutor

- **Nivel macro → CASL:** "O usuario pode editar posts proprios" ✓
- **Regra de negocio → Backend:** "O post so pode ser editado se foi criado ha pelo menos 3 dias" ✓
- **Mistura → Evitar:** "O usuario pode editar posts proprios criados ha pelo menos 3 dias dentro do CASL" ✗

## Deny-by-Default

CASL segue o principio de negar tudo por padrao. Se voce nao define explicitamente que um usuario pode fazer algo, ele nao pode. Isso significa:

- Voce so precisa definir permissoes positivas (`can`)
- `cannot` so e necessario para revogar algo que ja foi concedido em uma regra mais ampla
- Exemplo: `can('manage', 'all')` seguido de `cannot('delete', 'User')` — admin pode tudo menos deletar usuarios

## Sintaxe MongoDB para Conditions

CASL usa internamente uma classe chamada `MongoQuery` para processar condicoes. Diego elogia a sintaxe do MongoDB para queries condicionais:

> "O Mongo tem uma das melhores sintaxes para a gente escrever condicionais... E uma sintaxe muito boa. E ja por padrao segue uma ideia de JavaScript."

Isso significa que conditions no CASL aceitam operadores como `$eq`, `$ne`, `$in`, `$gt`, `$gte`, etc., seguindo a mesma API do MongoDB.

## Os 4 Conceitos do CASL

1. **Action (UserAction):** Sempre verbos — `create`, `read`, `update`, `delete`, mas tambem verbos customizados como `rename`, `publish`, `archive`. Nao precisa se limitar ao CRUD.

2. **Subject:** Entidades da aplicacao — `User`, `Article`, `Post`, `Comment`. Sao os "substantivos" do sistema de permissoes.

3. **Fields:** Opcional. Permite permissoes granulares por campo. Exemplo: usuario pode atualizar `description` de um artigo mas nao o `title`.

4. **Conditions:** Opcional. Clausulas condicionais usando sintaxe MongoDB. Exemplo: `{ authorId: user.id }` para ownership.

## Cookbook: Roles with Predefined Permissions

Diego indica que para este projeto, as permissoes serao predefinidas no codigo (nao salvas em banco de dados). O banco so armazena informacoes de usuarios e seus roles (cargos). As definicoes de permissao por role ficam no codigo TypeScript, tipadas e versionadas.

A alternativa (Roles with Persisted Permissions) seria para quando voce precisa que um admin configure permissoes dinamicamente via interface — nao e o caso deste projeto.