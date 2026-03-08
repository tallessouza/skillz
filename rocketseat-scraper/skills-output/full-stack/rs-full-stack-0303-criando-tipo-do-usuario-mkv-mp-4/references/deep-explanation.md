# Deep Explanation: Tipagem de Contexto com DTOs

## Por que criar uma pasta `dtos/`?

O instrutor introduz o conceito de **Data Transfer Objects** — objetos que representam dados que trafegam entre front-end e back-end. A pasta `dtos/` serve como um contrato visual: "aqui estão as formas dos dados que vêm/vão para a API".

Isso é diferente de:
- `types/` — que poderia ter qualquer tipo (utils, helpers, etc.)
- `models/` — que implica lógica de negócio
- `interfaces/` — que mistura contratos de componentes com dados de API

A escolha de `dtos/` é intencional: comunica que esses tipos espelham estruturas da API.

## A estratégia do `.d.ts` para tipagens globais

O instrutor usa arquivos `.d.ts` (declaration files) em vez de arquivos `.ts` normais. A vantagem principal: **tipos definidos em `.d.ts` ficam disponíveis globalmente sem precisar de import**.

Quando ele cria `UserAPIResponse` em `user.d.ts`, pode usar esse tipo em qualquer arquivo do projeto — no contexto, nos componentes, nos hooks — sem escrever `import { UserAPIResponse } from '...'`.

O instrutor destaca: "Por a gente criar uma tipagem global, eu dando Enter eu não preciso importar essa tipagem. Por isso que quando posso, eu gosto de utilizar essa estratégia."

### Quando usar `.d.ts` vs `.ts`

- `.d.ts`: tipos que serão usados em múltiplos arquivos do projeto (DTOs, tipos de API)
- `.ts` com export: tipos locais a um módulo ou que precisam de lógica associada

## Tipe apenas o que você usa

O instrutor faz questão de destacar: **"Você não precisa do retorno inteiro da API. Você pode tipar apenas aquilo que te interessa, só aquilo que você quer usar dentro da aplicação."**

Isso é pragmático. Se a API retorna 20 campos mas você só usa `id`, `name`, `email` e `role`, não crie tipos para os outros 16. Benefícios:

1. **Menos manutenção** — se a API adiciona campos que você não usa, nada quebra
2. **Documentação implícita** — os tipos mostram exatamente o que a app consome
3. **Menor acoplamento** — mudanças no backend que não afetam seus campos não geram trabalho

## Union types para roles/enums

Em vez de usar `string` para o campo `role`, o instrutor cria um type union literal:

```typescript
type UserAPIRole = "employee" | "manager" | "admin"
```

Isso dá autocomplete e validação em tempo de compilação. Se alguém tentar comparar `role === "employe"` (typo), o TypeScript avisa.

## Tipando o contexto com nullable session

O padrão `session: UserAPIResponse | null` é fundamental:

- `null` = nenhum usuário logado
- `UserAPIResponse` = usuário autenticado com dados disponíveis

O TypeScript força o consumidor a verificar null antes de acessar dados:

```typescript
context.session?.user?.name  // a interrogação é obrigatória
```

O instrutor demonstra isso: "Como o usuário pode ser nulo, ele já coloca a interrogação."

## O padrão `createContext({} as AuthContext)`

Usar `{} as AuthContext` é um cast que diz "confie em mim, o provider vai preencher". Funciona porque o contexto só é consumido dentro do Provider, onde os valores reais existem. É preferível a definir valores default complexos que nunca serão usados.

## useState com tipagem explícita

```typescript
const [session, setSession] = useState<UserAPIResponse | null>(null)
```

Sem o generic `<UserAPIResponse | null>`, o TypeScript inferiria o tipo como `null` (literal), e `setSession` não aceitaria um `UserAPIResponse`. O generic é obrigatório quando o estado começa com um tipo diferente do que terá depois.