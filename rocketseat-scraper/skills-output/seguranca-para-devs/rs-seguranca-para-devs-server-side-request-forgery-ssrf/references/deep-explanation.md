# Deep Explanation: Server-Side Request Forgery (SSRF)

## O que e SSRF

SSRF ocorre quando o servidor faz uma requisicao HTTP construida com dados controlados pelo usuario sem validacao. O atacante "fabrica" uma requisicao server-side — o servidor vira proxy involuntario do atacante.

## Cenario real explicado pelo instrutor

O cenario parte de um site autenticado que oferece acesso via token para parceiros (crawlers que indexam conteudo). Um endpoint `/analyze` recebe uma URL como parametro e faz `requests.get(url + "?token=" + secret)`.

### Vetor de ataque 1: Vazamento de token

O atacante substitui a URL legitima por `http://hacker.com`. O servidor faz a requisicao para o servidor do hacker, enviando o token secreto na query string. O hacker le o token nos logs do Apache ou salva via script.

**Insight do instrutor:** "Ele nao precisava ler no log do Apache. Poderia fazer essa index.php salvar o token num arquivo texto." — O vazamento acontece em qualquer lugar onde o request chega.

### Vetor de ataque 2: Negacao de servico (DDoS)

O atacante aponta o request para o site de um terceiro. O servidor da vitima vira um "no" de ataque distribuido. O atacante encontra multiplos servidores vulneraveis e os faz acessar em massa o alvo.

### Vetor de ataque 3: Injecao de dados via webhook

Se o endpoint consumido e um webhook que recebe/envia dados de usuarios, o atacante recebe informacoes sensiveis no proprio servidor.

## Hierarquia de defesa (4 estrategias, em ordem de preferencia)

### 1. Evitar request dinamico
Se o objetivo e incluir conteudo local, use mecanismos nativos da linguagem (`include` em PHP, import em Python). `file_get_contents` em PHP aceita `http://` silenciosamente, transformando uma leitura de arquivo em requisicao HTTP.

### 2. Dicionario de destinos
Transforme as opcoes em um mapa ID → URL no backend. O formulario envia apenas o ID numerico. Nao ha como o atacante injetar uma URL porque o backend nunca aceita URLs como input.

**Insight do instrutor:** "Se eu inspecionar essa lista, os valores nao sao mais URLs. Sao apenas numeros. Nao tem mais nada aqui que indique para o hacker que ele pode passar alguma outra coisa."

### 3. Whitelist de destinos
Lista fixa de URLs permitidas. Qualquer URL que nao esteja na lista e rejeitada.

### 4. Validacao de formato (ultimo recurso)
Validar se a URL comeca com um prefixo esperado. **Armadilha critica:** validar sem a barra final.

## A armadilha do prefixo sem barra

O instrutor demonstrou um erro sutil mas perigoso:

```python
# ERRADO — valida "http://localhost" sem barra
url.startswith("http://localhost")
```

O atacante pode:
1. Registrar `localhost.hacker.com` → passa na validacao
2. Usar `localhost@hacker.com` → HTTP basic auth syntax, acessa hacker.com com usuario "localhost"
3. Usar `localhost:senha@hacker.com` → mesmo truque com senha

**Solucao:** Sempre validar ate a primeira barra: `http://localhost/`

**Insight do instrutor:** "Sempre coloca a primeira barra ali para voce evitar problemas, evitar que alguem possa ou usar um subdominio ou usar aquele pattern de passar uma senha ali."

## Aplicabilidade universal

O instrutor enfatiza que SSRF se aplica independente da tecnologia:
- `fetch` no Node.js
- `file_get_contents` no PHP
- `urllib` no Python
- `curl`/`libcurl` em qualquer linguagem
- `requests` no Python

"Nao importa o que voce esteja usando. Voce esta montando uma requisicao, essa requisicao vai ser montada com dados que vieram do usuario, voce precisa validar esses dados."

## Conexao com Unvalidated Redirect

O instrutor destaca que as 4 estrategias de defesa sao identicas as do Unvalidated Redirect (aula anterior): evitar dinamico, dicionario, whitelist, validar formato. A diferenca e o vetor: redirect manipula o navegador do usuario, SSRF manipula o servidor.