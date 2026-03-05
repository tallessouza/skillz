# Deep Explanation: Arquitetura SaaS Full-Stack

## O que e SaaS e por que importa

O instrutor define SaaS como "um software vendido para varias empresas, onde varias empresas vao conseguir utilizar a mesma aplicacao". A distincao chave que ele faz e: **nao e um software desenvolvido internamente para uso de uma unica empresa**.

Essa distincao parece simples mas tem implicacoes profundas na arquitetura:

- **Isolamento de dados** — empresa A nunca pode ver dados da empresa B
- **Customizacao por tenant** — cada empresa pode ter configuracoes diferentes
- **Escala horizontal** — o sistema precisa suportar N empresas sem redesign
- **Permissionamento granular** — dentro de cada empresa, diferentes usuarios tem diferentes poderes

## Multi-tenancy: o conceito central

O instrutor menciona "multi-tenant" e define tenants como "basicamente varias empresas". Em termos tecnicos:

- **Tenant** = uma organizacao/empresa que usa o SaaS
- **Multi-tenant** = a mesma instancia do software serve multiplos tenants
- **Tenant isolation** = garantia de que dados de um tenant nao vazam para outro

Existem estrategias comuns (nao detalhadas nesta aula, mas contexto importante):
1. **Banco separado por tenant** — isolamento maximo, custo alto
2. **Schema separado por tenant** — bom isolamento, complexidade media
3. **Coluna tenant_id** — menor isolamento, mais simples e barato

## RBAC vs ABAC: estrategias de permissionamento

O instrutor menciona ambos como estrategias que serao exploradas:

- **RBAC (Role-Based Access Control)** — permissoes atreladas a roles (admin, member, billing). Simples, previsivel, cobre a maioria dos casos.
- **ABAC (Attribute-Based Access Control)** — permissoes baseadas em atributos do contexto (o usuario e dono do recurso? esta no horario permitido? o plano permite?). Mais flexivel, mais complexo.

Na pratica, a maioria dos SaaS usa uma combinacao: RBAC para a base + ABAC para regras contextuais.

## Por que monorepo com TurboRepo

O instrutor destaca que o projeto e um monorepo usando TurboRepo. A razao principal: **compartilhamento de codigo entre front e back**.

O caso mais obvio e o permissionamento — as mesmas regras de "quem pode fazer o que" precisam existir:
- No **back-end** para seguranca (negar acesso na API)
- No **front-end** para UX (esconder botoes, desabilitar acoes)

Com monorepo, essas regras vivem em um pacote unico importado por ambos.

TurboRepo adiciona **cache inteligente** — se um pacote nao mudou, nao precisa rebuildar. Isso acelera significativamente o desenvolvimento em projetos com multiplos apps/pacotes.

## Ordem de desenvolvimento: permissoes primeiro

O instrutor e explicito sobre a ordem: "nessas primeiras aulas a gente vai comecar a desenvolver a parte de permissionamento para depois sair desenvolvendo o back-end e depois entao o front-end".

Essa ordem nao e arbitraria:
1. **Permissoes sao transversais** — afetam toda a aplicacao
2. **Sao compartilhadas** — front e back usam o mesmo pacote
3. **Definem o dominio** — quem pode fazer o que define os limites do sistema
4. **Sao dificeis de adicionar depois** — retrofitting permissoes em codigo existente e fonte de bugs de seguranca

## Stack escolhida

| Tecnologia | Versao/Detalhe |
|-----------|----------------|
| Node.js | Back-end runtime |
| Fastify | Framework HTTP (escolhido por performance) |
| Next.js | Versao 14, com Server Components e Server Actions |
| TurboRepo | Gerenciamento de monorepo |

O instrutor menciona especificamente os "recursos de Server Components, Server Actions" do Next.js 14, indicando que o front-end vai usar essas features modernas em vez do modelo tradicional client-side.