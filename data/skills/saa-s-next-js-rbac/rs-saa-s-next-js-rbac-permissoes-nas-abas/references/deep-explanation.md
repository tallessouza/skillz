# Deep Explanation: Permissoes nas Abas

## Por que controlar na navegacao e nao so na rota?

O Diego demonstra um principio importante de UX em RBAC: o usuario so deve ver opcoes que ele pode usar. Mostrar uma aba "Settings" para um membro que nao tem permissao de atualizar a organizacao gera frustacao — ele clica, ve uma pagina vazia ou um erro. O controle na navegacao e a primeira camada de defesa visual.

## O padrao de resolucao unica

O Diego resolve todas as permissoes em um unico bloco no topo do componente:

```typescript
const permissions = await ability()
const canUpdateOrganization = permissions.can('update', 'Organization')
const canGetMembers = permissions.can('get', 'User')
// ...
```

Isso e intencional: a funcao `ability()` e async (busca dados do usuario autenticado), entao chama-la uma vez e extrair booleanos e mais eficiente e legivel do que espalhar `await` por todo o JSX.

## A logica OR para paginas compartilhadas

O caso mais interessante que o Diego aborda e a pagina de Settings, que serve para duas coisas: configuracao da organizacao E billing. A decisao de design e:

- Se o usuario pode atualizar a organizacao → mostra a aba
- Se o usuario pode ver billing → tambem mostra a aba
- Dentro da pagina, controla separadamente o que mostrar

Isso evita o erro comum de esconder a aba completamente quando o usuario tem permissao para apenas uma das funcionalidades. O Diego explica: "lá dentro, depois eu controlo o que eu vou mostrar para ele ou não."

## Granularidade por role observada

O Diego testa com tres niveis de acesso:
- **Member**: so ve projetos e membros (sem settings/billing)
- **Admin**: ve tudo
- **Owner**: ve tudo

Cada role tem um conjunto diferente de abas visiveis, demonstrando que o controle e realmente granular — nao e um simples "admin ve tudo, resto nao ve nada".

## Redirect como complemento

O Diego menciona que alem de esconder as abas, e necessario fazer redirect dentro das paginas protegidas. Se um membro acessa `/org/acme/settings` diretamente pela URL, a pagina deve redirecionar. O controle de abas e visual; a protecao real esta na pagina.

## Contexto multi-tenant

Tudo isso acontece no contexto de organizacoes em um SaaS. O mesmo usuario pode ser member em uma org e admin em outra, entao as permissoes sao resolvidas por organizacao ativa (`currentOrg`), nao globalmente.