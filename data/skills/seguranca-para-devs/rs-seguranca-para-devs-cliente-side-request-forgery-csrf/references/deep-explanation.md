# Deep Explanation: Client-Side Request Forgery (CSRF)

## O que e Request Forgery do lado do cliente

Request Forgery nao acontece apenas no servidor. Quando o codigo do cliente (ou codigo server-side que gera HTML) monta URLs dinamicamente a partir de input do usuario, um atacante pode manipular esse input para forjar requisicoes em nome de um usuario legitimo.

O conceito central: **o cliente e territorio do hacker**. Qualquer valor que venha da query string, hash da URL, ou input do usuario pode ser manipulado. Se esse valor e usado para construir um destino (action de formulario, href de link, URL de fetch), o atacante controla para onde a requisicao vai.

## O mecanismo do ataque

O ataque funciona em 3 passos:

1. **Identificacao**: O atacante descobre que uma pagina usa um parametro dinamico para montar o action de um formulario (ex: `?env=gamma` gera `action="/gamma"`)
2. **Crafting**: O atacante cria uma URL maliciosa onde o parametro contem um caminho que leva a outra acao (ex: `?env=test/delete`)
3. **Inducao**: O atacante envia essa URL para um usuario legitimo (por email, chat, etc.), induzindo-o a acessar e submeter o formulario

O usuario pensa que esta fazendo uma acao inofensiva (salvar configuracoes), mas na verdade esta executando uma acao destrutiva (deletar um ambiente).

## Por que o padrao REST mal implementado agrava o problema

No exemplo da aula, o instrutor destacou que o padrao REST foi "quebrado": ao inves de usar o metodo HTTP DELETE, foi usado POST para `/env/delete`. Isso e relevante porque:

- Se fosse usado DELETE, o formulario HTML padrao nao conseguiria enviar (formularios so suportam GET e POST)
- A rota POST para delete cria uma superficie de ataque maior
- O path-based routing para acoes (`/resource/delete`) e mais vulneravel que action-based (`DELETE /resource`)

## As 4 defesas em ordem de preferencia

O instrutor enfatizou que essas mesmas 4 defesas se aplicam a **todos** os cenarios de URL dinamica — server-side request forgery, client-side request forgery, e invalid redirects:

### 1. Nao usar destino dinamico (melhor opcao)
Coloque o identificador do recurso em um campo hidden do formulario, nao no action. O action e fixo: `/env`. O nome do ambiente viaja no body da requisicao.

### 2. Dicionario de destinos
Busque no banco de dados se o valor existe. Se `?env=test/delete` nao existe como ambiente, rejeite. Isso funciona como validacao implicita.

### 3. Whitelist
Mantenha uma lista explicita de valores aceitos. Util quando o conjunto de destinos e finito e conhecido.

### 4. Validacao com regex (ultima opcao)
Use expressao regular para garantir que o valor contem apenas caracteres seguros: `/^\w+$/`. E a opcao mais fragil porque regex pode ter edge cases, mas e melhor que nenhuma validacao.

## Caso real: Facebook

O instrutor compartilhou um caso real do programa de bug bounty do Facebook:

- A pagina `profile.php` usava o hash da URL para determinar qual acao executar
- O JavaScript fazia um POST para `/ajax/profile/{hash_value}`
- Normalmente: `profile.php#profile.log` → POST para `/ajax/profile/log`
- Ataque: `profile.php#/update_status?status=hello` → POST que atualizava o status do usuario
- Qualquer pessoa que clicasse no link teria seu status do Facebook alterado
- Isso poderia ser usado para spam em massa

## Principio unificador

A licao mais importante e que **server-side request forgery, client-side request forgery, e invalid redirects compartilham exatamente o mesmo vetor de ataque e as mesmas defesas**. Sempre que uma URL e montada dinamicamente — seja no servidor com Express, no cliente com fetch/XMLHttpRequest, em actions de formularios, em hrefs de links, ou em hashes de SPA — as mesmas 4 defesas se aplicam na mesma ordem de preferencia.