# Deep Explanation: Token do Usuário — JWT e Exclusão de Dados Sensíveis

## Por que centralizar a configuração de auth?

O instrutor cria uma pasta `configs/` dentro de `src/` com um arquivo `auth.ts`. A razão é simples: se o secret ou o tempo de expiração estiverem espalhados pelo código, qualquer mudança exige buscar e alterar em múltiplos arquivos. Centralizando em `authConfig.jwt`, você tem um único ponto de verdade.

A estrutura do objeto é intencional:
```typescript
export const authConfig = {
  jwt: {
    secret: "minha-chave",
    expiresIn: "1d",
  },
};
```

O aninhamento `jwt` dentro de `authConfig` prevê que outras configurações de auth podem coexistir (ex: `authConfig.oauth`, `authConfig.session`), mantendo o namespace organizado.

## JWT: O que é o sign() e seus parâmetros

O `sign()` do jsonwebtoken recebe três argumentos:

1. **Payload** — dados que ficam DENTRO do token (não sensíveis). O instrutor passa `{ role: user.role }` para que o token carregue a permissão do usuário.

2. **Secret** — a chave usada para assinar. Quem tem essa chave pode verificar se o token é legítimo. Em produção, DEVE vir de variável de ambiente.

3. **Options** — objeto com configurações:
   - `subject`: claim padrão do JWT (RFC 7519) que identifica o portador. O instrutor usa `user.id`.
   - `expiresIn`: tempo até o token expirar. O formato aceita strings como `"1d"` (1 dia), `"2h"` (2 horas), `"30m"` (30 minutos).

### Por que `subject` e não payload?

O `subject` (campo `sub` no token decodificado) é um claim registrado na especificação JWT. Usar o campo padrão permite que qualquer lib JWT saiba extrair o ID do usuário sem conhecer a estrutura do seu payload customizado.

## Destructuring para excluir dados sensíveis

O instrutor demonstra um padrão elegante em JavaScript/TypeScript:

```typescript
const { password, ...userWithoutPassword } = user;
```

Isso é REST destructuring — separa a propriedade `password` do restante. O resultado:
- `password` contém a senha (que descartamos)
- `userWithoutPassword` contém TODOS os outros campos

### Por que não usar `delete user.password`?

O `delete` muta o objeto original. Se outra parte do código ainda precisa do objeto `user` completo (ex: para logging, para outra operação), ele estaria corrompido. O destructuring é **imutável** — cria um novo objeto sem a propriedade, mantendo o original intacto.

### Extensível para múltiplos campos

O instrutor menciona que "você poderia fazer isso com qualquer outra informação". Por exemplo:

```typescript
const { password, cpf, creditCard, ...safeUser } = user;
```

Cada campo sensível é nomeado e separado, o restante fica limpo.

## Organização de imports — "escadinha"

O instrutor menciona organizar imports em "escadinha" — agrupando por tipo:

1. Configs (`authConfig`)
2. Libs externas (`sign` do jsonwebtoken)
3. Libs internas/Prisma

Isso é preferência de estilo, mas melhora a leitura ao separar visualmente dependências por camada.

## Instalação com versão fixa

O instrutor instala `jsonwebtoken@9.0.2` e `@types/jsonwebtoken@9.0.7` com versões explícitas. Para bibliotecas de segurança, fixar a versão evita que um `npm install` futuro traga uma versão com breaking changes ou vulnerabilidades não testadas.

A tipagem é instalada como devDependency (`-D`) porque só é usada em tempo de compilação TypeScript.

## Fluxo completo da autenticação

1. Usuário envia credenciais (email + senha)
2. API verifica se a senha bate (bcrypt compare, visto em aula anterior)
3. Se válido, gera token JWT com `sign()`
4. Retorna token + dados do usuário SEM a senha
5. Cliente armazena o token e o envia em requisições futuras no header Authorization
6. API valida o token em middleware para autorizar acesso a recursos protegidos

O token funciona como um "crachá digital" — contém quem é o usuário (subject/id) e o que ele pode fazer (role), com data de validade (expiresIn).