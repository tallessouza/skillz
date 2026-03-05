# Deep Explanation: Headers HTTP de Seguranca

## Referrer-Policy — Os 8 valores explicados

O header Referer informa ao site de destino de onde o usuario veio. Isso inclui a URL completa, o que e um problema quando a URL contem informacoes sensiveis como tokens.

### Os 8 valores em detalhe:

1. **no-referrer** — Nao envia header Referer em nenhuma situacao. Mais restritivo.

2. **no-referrer-when-downgrade** — Envia o Referer completo desde que o nivel de seguranca se mantenha ou aumente (HTTP→HTTP, HTTP→HTTPS, HTTPS→HTTPS). Nao envia quando faz downgrade (HTTPS→HTTP).

3. **origin** — Envia apenas a origem (ex: `example.com`), nunca o caminho completo (ex: `example.com/page.html`).

4. **origin-when-cross-origin** — Dentro do mesmo site, envia URL completa. Para outros sites ou em downgrade, envia apenas a origin.

5. **same-origin** — Dentro do mesmo site, envia URL completa. Para fora, nao envia nada.

6. **strict-origin** — Mesmo nivel de seguranca: envia so a origin. Em downgrade (HTTPS→HTTP): nao envia nada.

7. **strict-origin-when-cross-origin** (PADRAO dos navegadores) — Mesmo site: URL completa. Cross-origin: so origin. Downgrade: nada.

8. **unsafe-url** — Envia URL completa sempre, em todas as requisicoes. Marcado com aviso vermelho na documentacao. Existe por compatibilidade, nunca use.

### O caso classico: pagina de recuperacao de senha

A pagina de recuperacao de senha tem um token na URL. Se o usuario clica em um link no rodape (ex: "Termos de Uso"), o site de destino recebe no header Referer a URL completa incluindo o token. Solucao: `Referrer-Policy: no-referrer` nessa pagina especifica.

### Estrategia recomendada

- Padrao global: `strict-origin-when-cross-origin` (ja e o default)
- Paginas sensiveis (com tokens na URL): `no-referrer`

## HSTS — Como funciona por dentro

### O problema que HSTS resolve

Sem HSTS, um site pode ser carregado via HTTP (sem criptografia) mesmo tendo certificado HTTPS. Um atacante em posicao de man-in-the-middle pode forcar o downgrade.

### Mecanismo de cache

Quando o navegador acessa um site com o header `Strict-Transport-Security`, ele **cacheia** essa informacao. A partir dai, mesmo que o usuario digite `http://`, o navegador automaticamente redireciona para HTTPS. Se o certificado estiver invalido, o site fica **inacessivel** — nao mostra a opcao "Avancar" que normalmente aparece.

### max-age — O periodo de cache

O max-age define por quanto tempo o navegador vai lembrar que aquele site deve usar HTTPS. Se o certificado tiver problema durante esse periodo, o site fica indisponivel para aquele navegador ate:
- O certificado ser corrigido, OU
- O max-age expirar

Por isso a recomendacao de implementacao gradual:
- **15 minutos (900s)**: testar se tudo funciona
- **1 semana (604800s)**: validar em producao por alguns dias
- **1 ano (31536000s)**: configuracao final de producao

### preload — Cache compartilhado

O Chrome mantem uma lista compartilhada de sites HSTS. Quando voce inclui `preload`, o Chrome pode adicionar seu site a essa lista global. Beneficios:
- Protege usuarios na **primeira visita** (sem precisar ter acessado antes)
- Mesmo que um atacante remova o header e o certificado, o Chrome ja sabe que o site requer HTTPS
- Navegacao mais rapida (nao precisa fazer a primeira requisicao HTTP para descobrir o redirect)

## Ocultando informacoes do servidor

### Por que isso importa

O header `Server` e outros podem revelar:
- Servidor web (Apache, Nginx, IIS)
- Versao exata do servidor
- Sistema operacional
- Framework utilizado (Express, ASP.NET, etc)
- CMS (WordPress, Drupal, etc)

### O cenario de ataque

1. Vulnerabilidade e descoberta no Apache 2.4.41
2. Seu servidor devolve `Server: Apache/2.4.41 (Ubuntu)`
3. Sua equipe de infra so descobre 1 semana depois
4. Durante essa semana, qualquer atacante que inspecione seus headers sabe exatamente qual versao vulneravel voce usa

### Headers comuns que devem ser removidos

| Header | Informacao exposta |
|--------|-------------------|
| `Server: Apache/2.4.41 (Ubuntu)` | Servidor, versao, SO |
| `X-Powered-By: Express` | Framework backend |
| `X-AspNet-Version: 4.0.30319` | Versao do ASP.NET |
| `X-Generator: WordPress 6.2` | CMS e versao |

### Nota sobre o Apache

O Apache nao permite remover completamente o header `Server`, mas com `ServerTokens Prod` ele mostra apenas "Apache" sem versao nem SO. Cada servidor (Nginx, IIS, etc) tem sua propria forma de configurar isso.