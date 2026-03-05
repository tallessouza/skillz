# Deep Explanation: Content-Type e X-Content-Type-Options

## Por que Content-Type com charset importa

O instrutor demonstra um ataque historico real baseado em UTF-7. Um arquivo de texto aparentemente inofensivo contem caracteres encoded em UTF-7 que, quando interpretados nesse charset, se tornam um `<script>` valido com JavaScript executavel.

O ataque funcionava assim:
1. Atacante sobe um comentario ou arquivo com conteudo encoded em UTF-7
2. Filtros de HTML nao reconhecem como `<script>` porque os bytes sao diferentes
3. Se o servidor nao envia charset no Content-Type, o navegador pode ser induzido a interpretar como UTF-7
4. O script e executado — XSS bem-sucedido

Esse ataque especifico nao funciona mais porque navegadores removeram suporte a UTF-7 (caiu em desuso). Mas o principio permanece: sem charset explicito, futuros encodings ou edge cases podem ser explorados.

**Demonstracao do instrutor:**
```python
# Arquivo parece texto ilegivel em UTF-8
# Mas lido como UTF-7, revela JavaScript
print(open('UTF-7.txt', encoding='utf-7').read())
# Output: <script>alert('XSS')</script>
```

## Arquivos Polyglot — O problema real

O conceito mais poderoso da aula: um UNICO arquivo pode ser valido simultaneamente como:
- HTML (renderiza pagina)
- JPEG (exibe imagem)
- PDF (abre como documento)
- ZIP (contem arquivos extraiveis)

O instrutor demonstra isso ao vivo:
1. Um arquivo `index.html` que tambem e uma imagem JPEG valida
2. O mesmo arquivo copiado como `.jpeg` — abre como imagem, com fragmentos JPEG visiveis
3. Copiado como `.pdf` — abre como PDF valido contendo a imagem
4. Copiado como `.zip` — faz `unzip` e extrai `main.jpg` e `main.pdf`

**Por que isso importa para devs:**
- Sistemas de upload que verificam "e uma imagem?" podem responder "sim" para um arquivo que TAMBEM e um executavel
- Se o servidor serve esse arquivo sem Content-Type correto, o navegador pode interpreta-lo de maneiras inesperadas
- A defesa completa envolve validacao no upload (aula futura) + Content-Type correto ao servir

## MIME Sniffing — O comportamento perigoso do navegador

Sem `X-Content-Type-Options: nosniff`, o navegador faz "MIME sniffing": tenta adivinhar o tipo do arquivo pelo contexto em que e carregado, ignorando o Content-Type declarado.

**Demonstracao do instrutor:**
1. Cria um `test.txt` contendo JavaScript puro
2. No `index.html`, inclui `<script src="test.txt"></script>`
3. Sem nosniff: o navegador EXECUTA o JavaScript do .txt porque o contexto (`<script>`) sugere que e JavaScript
4. Com nosniff: o navegador RECUSA executar, exibindo no console: "Refused to execute script because its MIME type ('text/plain') is not executable, and strict MIME type checking is enabled"

**Cenario de ataque real:**
1. CMS permite upload de .txt (documento valido)
2. Atacante sobe .txt contendo JavaScript
3. Atacante explora outra vulnerabilidade para injetar `<script src="/uploads/malicious.txt">`
4. Sem nosniff: JavaScript executa = XSS
5. Com nosniff: navegador bloqueia = ataque falha

## Estrategia recomendada pelo instrutor

"Deixa habilitado para todas as rotas, que e um jeito mais seguro. Se tiver um dia que voce precisar de algo diferente, voce vai remover o header naquela rota, naquela requisicao."

Ou seja: **nosniff e opt-out, nao opt-in.** Default seguro, excecao justificada.