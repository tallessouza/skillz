# Deep Explanation: Gerenciamento Seguro de Sessoes

## O que sao sessoes server-side

Sessoes server-side sao usadas em aplicacoes multi-page (MVC): Laravel, Django, Ruby on Rails, PHP puro. O servidor mantem um storage com dicionarios de dados por usuario, identificados por um ID. Esse ID vai num cookie para o navegador — o cookie de sessao.

Isso e diferente de SPAs (React, Vue, Angular) que tipicamente usam JWT em cookies ou local storage e fazem requisicoes com fetch.

## Por que nunca implementar sessoes do zero

O instrutor enfatiza: "Dá trabalho fazer isso ficar seguro, dá trabalho cuidar da session pra garantir que isso é seguro." Comunidades como PHP, Laravel, Django investem anos de trabalho coletivo na seguranca das sessoes. Reimplementar e reinventar a roda com alto risco de falhas de seguranca.

## O cookie vaza informacao da plataforma

O nome padrao `PHPSESSID` revela que o backend usa PHP. Isso da ao atacante informacao gratuita para direcionar exploits especificos. Renomear para algo generico como `SESSIONID` remove esse vetor de informacao.

## Entropia do Session ID — a matematica

O instrutor apresenta numeros concretos:
- Atacante com 1000 requisicoes/segundo
- Site com 10.000 usuarios ativos
- Session ID de 32 bits de entropia: **~7 minutos** para brute force
- Session ID de 64 bits de entropia: **585 anos** para brute force

O ID deve ser gerado por um CSPRNG (Cryptographically Secure Pseudo-Random Number Generator). O PHP faz isso nativamente — nao reinvente.

## Como sessoes sao armazenadas no PHP

No Ubuntu, sessoes ficam em `/var/lib/php/sessions/`. Cada sessao e um arquivo no disco com formato serializado do PHP, sem criptografia. O instrutor observa: "Se tivesse criptografia, a chave pra decriptografar ia ter que tá nesse servidor de qualquer maneira." Portanto, a seguranca do servidor e fundamental.

## Demonstracao do roubo de sessao

O instrutor demonstrou copiando o cookie de sessao do Chrome para o Firefox. Ao colar o session ID de uma sessao no outro navegador, o Firefox "virou" o Chrome — compartilhando a mesma sessao, mesmos dados, mesmo contador. Isso prova que se o cookie vazar, a sessao e completamente comprometida.

## Por que httpOnly e critico

Se httpOnly nao esta setado, JavaScript pode ler o cookie via `document.cookie`. Um atacante que consiga script injection pode:
1. Ler o cookie de sessao
2. Enviar para si mesmo
3. Assumir a sessao do usuario

Com httpOnly, `document.cookie` retorna vazio para o cookie de sessao.

## O ataque de Session Fixation (detalhado)

O instrutor demonstrou dois cenarios:

### Cenario 1 (menor gravidade):
Atacante injeta script que seta `document.cookie = "SESSIONID=id_do_hacker"`. O usuario entra no site e usa a sessao do hacker. Resultado: usuario usa uma "conta laranja" — nao tao grave.

### Cenario 2 (grave — session fixation):
1. Atacante injeta script que seta um session ID conhecido (ex: `123456`)
2. Atacante envia link para vitima (ex: pagina de politica de privacidade com script injection)
3. Vitima acessa, recebe o session ID fixado
4. Vitima faz login e usa o site normalmente
5. Atacante substitui seu proprio cookie pelo ID conhecido (`123456`)
6. Atacante assume completamente a sessao logada da vitima

### Mitigacao: Strict Mode

Sem strict mode, o PHP aceita qualquer session ID enviado no cookie e cria um arquivo de sessao para ele. Com strict mode habilitado (`session.use_strict_mode = 1`), o PHP **rejeita session IDs que nao existem no servidor** e gera um novo ID automaticamente. Isso mitiga completamente o ataque de session fixation.

## SameSite explicado

- **Lax** (padrao dos navegadores): cookie enviado em navegacao por link (GET), mas nao em requisicoes cross-origin (POST/fetch)
- **Strict**: cookie nunca enviado quando a origem e diferente do site. Nem clicando em link. Ideal para bancos e apps financeiros
- **None**: cookie enviado em qualquer requisicao, inclusive cross-origin. Perigoso — permite fetch logado de outro site se CORS estiver habilitado

O instrutor usa o exemplo de bancos: "Nenhum banco funciona assim [com lax]. Nenhum aplicativo de banco vai querer que você faça link para dentro da área logada."