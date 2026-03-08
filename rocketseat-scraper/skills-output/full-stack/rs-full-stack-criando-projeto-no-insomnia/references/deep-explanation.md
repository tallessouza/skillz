# Deep Explanation: Configurando Projeto no Insomnia

## Por que separar ambientes?

O instrutor enfatiza a criação de um **Shared Environment** separado chamado `Dev` em vez de colocar variáveis diretamente no Base Environment. A razão é dupla:

1. **Organização atual** — Fica claro qual ambiente está ativo visualmente (cor verde para Dev)
2. **Pensamento no futuro** — Quando a API estiver em produção, basta criar outro Shared Environment `Prod` com `base_url` apontando para `https://ip-do-servidor` e alternar entre eles sem modificar nenhuma request

Essa separação é análoga a arquivos `.env.development` e `.env.production` no código — a mesma lógica de isolar configuração por ambiente.

## Hierarquia de variáveis no Insomnia

O Insomnia resolve variáveis em cascata:

1. **Base Environment** — variáveis globais disponíveis em toda a collection
2. **Shared Environment** (ex: Dev, Prod) — sobrescreve ou adiciona variáveis quando selecionado
3. **Folder Environment** — variáveis específicas de uma pasta, disponíveis apenas para requests dentro dela

O instrutor usa essa hierarquia de forma inteligente:
- `base_url` fica no Shared Environment porque muda entre Dev e Prod
- `resource` fica no Folder Environment porque é específico de cada recurso (users, orders, etc.)

## Por que variável `resource` na pasta?

Quando você tem múltiplas rotas para o mesmo recurso (create, list, update, delete), todas compartilham o mesmo path base (`/users`). Colocar isso numa variável `resource` no folder environment:

- **Evita repetição** — mude em um lugar, reflete em todas as requests da pasta
- **Padroniza** — garante consistência no path entre requests
- **Documenta** — o nome da variável deixa explícito qual recurso aquela pasta representa

## Preview de URL no Insomnia

O instrutor destaca o recurso de preview do Insomnia: ao montar a URL com `{{ base_url }}/{{ resource }}`, o cliente mostra a URL resolvida (ex: `http://localhost:3333/users`) em tempo real. Isso permite:

- Verificar antes de enviar que a composição está correta
- Identificar variáveis não resolvidas (aparecem em vermelho)
- Debugar problemas de configuração de ambiente

## Fluxo típico de trabalho

1. Desenvolve a rota na API (ex: POST `/users`)
2. Cria a request correspondente no Insomnia dentro da pasta do recurso
3. Envia a request e valida a resposta
4. Itera: ajusta código, re-envia, até funcionar

O Insomnia funciona como o "console do backend" — é onde você valida que suas rotas estão respondendo corretamente antes de conectar com o frontend.