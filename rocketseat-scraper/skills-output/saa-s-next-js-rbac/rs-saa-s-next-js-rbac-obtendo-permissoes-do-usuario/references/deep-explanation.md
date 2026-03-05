# Deep Explanation: Obtendo Permissoes do Usuario

## Por que retornar null em vez de throw?

O instrutor explica um trade-off importante: a funcao `ability()` e usada no Header, que e um componente compartilhado em toda a aplicacao. Se o usuario estiver em uma pagina publica (sem organizacao selecionada), lancar um erro quebraria a aplicacao inteira.

A decisao e pragmatica: "Se em algum momento eu usar esse header em um componente que o usuario nao esteja autenticado, o que seria o ideal? Eu dar um erro, ou eu so nao mostrar a listagem de projetos?" — a resposta e nao mostrar, usando optional chaining.

## Cadeia de dependencias

A arquitetura segue uma cadeia clara:

```
cookies('org') → getCurrentOrg() → getCurrentMembership() → ability()
                                          ↓
                                   getMembership(org) [HTTP call]
                                          ↓
                                   { id, role, userId, organizationId }
                                          ↓
                                   defineAbilityFor({ id, role })
                                          ↓
                                   CASL Ability instance
```

Cada funcao na cadeia pode retornar null, e o null propaga graciosamente ate o consumidor.

## Compartilhamento de tipos entre front e back

O instrutor destaca que o tipo `Role` vem do pacote `@saas/auth`, que e um pacote interno do monorepo usado tanto pelo backend quanto pelo frontend. Isso garante type safety: se uma nova role for adicionada, o TypeScript vai apontar todos os lugares que precisam ser atualizados.

Para isso funcionar, foi necessario adicionar `@saas/auth` como dependencia do pacote de API do frontend (`pnpm install` para resolver a referencia interna).

## Por que separar getCurrentOrg?

Antes, o codigo de obter a organizacao atual estava inline no `OrganizationSwitcher`. O instrutor extrai para uma funcao reutilizavel porque:
1. `getCurrentMembership` tambem precisa da org
2. Outros componentes futuros vao precisar
3. Encapsula o detalhe de implementacao (cookies) atras de uma interface limpa
4. Retorna `null` em vez de `undefined` — preferencia do instrutor por consistencia

## Evolucao do backend

O instrutor percebeu que a rota `getMembership` nao retornava `userId`, apenas `id` (da membership) e `role`. Como `defineAbilityFor` precisa do ID do usuario, ele adicionou `userId` na resposta do backend. Isso mostra que frontend e backend co-evoluem quando se implementa permissoes.

## Demonstracao pratica de RBAC funcionando

O instrutor demonstra no navegador:
- **Admin** → ve "projetos" (tem permissao `get` em `Project`)
- **Member** → ve "projetos" (tambem tem permissao)
- **Billing** → NAO ve "projetos" (role billing nao tem essa permissao)
- **Sem org** → NAO ve "projetos" (ability retorna null, optional chaining impede render)