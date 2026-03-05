# Deep Explanation: Gerando Token de Reset de Senha Seguro

## Por que computadores sao ruins em gerar numeros aleatorios

O instrutor enfatiza um ponto fundamental: **computadores sao maquinas deterministicas**. Eles sao projetados para se comportar sempre do mesmo jeito. Gerar algo verdadeiramente aleatorio e inerentemente contrario a natureza de um computador.

### Fontes "obvias" de aleatoriedade e por que falham

- **Relogio do sistema:** Um atacante que saiba aproximadamente quando a requisicao foi feita pode reduzir o espaco de busca do token a um range pequeno e factivel de brute force.
- **Leitura de memoria:** Dependendo de qual software rodou antes, e possivel prever o conteudo de trechos de memoria.

### A analogia das Lava Lamps da Cloudflare

A Cloudflare mantem uma parede de lava lamps no escritorio. Uma camera le os pixels dessas lampadas — liquidos fisicos interagindo com calor — e usa isso como fonte de entropia para gerar numeros aleatorios. O ponto do instrutor: "nao existe ate hoje uma tecnologia ou conceito matematico capaz de adivinhar esse numero, como existe quando voce usa Math.random."

O instrutor pondera que isso e mais uma acao de marketing do que algo estritamente necessario, mas ilustra perfeitamente a diferenca entre aleatoriedade computacional e aleatoriedade fisica.

### CSPRNG — Cryptographically Secure Pseudo Random Number Generator

A sigla CSPRNG designa bibliotecas que combinam multiplas fontes de entropia para tornar a randomizacao "mais forte". Ainda e deterministico (computador sempre e), mas o nivel de entropia e alto o suficiente para que ninguem consiga deduzir os fatores combinados.

**Dica pratica do instrutor:** busque "CSPRNG + nome da sua linguagem" para encontrar a implementacao correta.

### Por que Math.random ainda existe?

Porque `Math.random` e rapido. CSPRNG consome mais processamento. Para usos nao-criticos (delays em jogos, shuffles visuais), Math.random e perfeitamente adequado. A regra e: **seguranca e criptografia = CSPRNG; todo o resto = random normal**.

## O ataque de injecao de Host Header

### Como funciona

1. Atacante envia requisicao de reset de senha para usuarios do site
2. Injeta header `Host: hacker.com` na requisicao HTTP
3. O servidor monta a URL de reset usando `req.headers.host`
4. Email enviado ao usuario contem link apontando para `hacker.com`
5. Usuario desavisado clica no link
6. Atacante monitora access log do seu dominio e captura o token na URL
7. Atacante monta a URL real com o token capturado e reseta a senha

### Demonstracao do instrutor

O instrutor adicionou `hacker.com` apontando para localhost no arquivo de hosts, depois usou curl com `-H "Host: hacker.com"` para injetar o header. O email enviado ao usuario continha `hacker.com/new-password/{token}`. Quando o usuario clica, o server do atacante recebe o token no access log, mesmo retornando 404.

### Defesa ideal (timing attack prevention)

O instrutor destaca um ponto sutil: se voce receber um host invalido, **nao retorne erro**. Leve o mesmo tempo, retorne a mesma mensagem ("password reset email sent"), mas nao faca nada. Isso impede o atacante de saber se o ataque esta funcionando. "Voce deixa o hacker ali achando que esta conseguindo fazer o ataque."

## Por que armazenar `reset_time` e nao `expires_at`

O instrutor explica duas vantagens:

1. **Flexibilidade:** Permite mudar a janela de validade (5 min, 30 min) alterando so o codigo. Tokens ja existentes no banco se adaptam automaticamente.

2. **Janela bilateral:** Permite filtrar com limite inferior E superior. O limite superior (`reset_time <= agora`) impede que alguem que consiga injetar um `reset_time` futuro (via falha de codigo) crie um token que valha por uma semana.

## Resumo dos tres conselhos do instrutor

1. Use CSPRNG para gerar tokens
2. Token deve ter tempo de expiracao
3. URL nao pode ser montada com header HTTP host