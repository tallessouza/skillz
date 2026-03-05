# Deep Explanation: Calculo de Hash para Subresource Integrity

## O que e Subresource Integrity (SRI)

SRI e um mecanismo de seguranca do browser que permite verificar se um recurso externo (script, stylesheet) nao foi adulterado. Quando voce inclui o atributo `integrity` num script tag, o browser:

1. Baixa o arquivo da URL
2. Calcula o hash do conteudo recebido
3. Compara com o hash declarado no atributo `integrity`
4. Se nao bater, **bloqueia a execucao** do script

## Por que HTTPS e pre-requisito

O instrutor enfatiza: "se voce for carregar script de uma fonte externa, sempre use uma transmissao segura, HTTPS sempre." Sem HTTPS, um atacante pode interceptar a conexao (MITM) e modificar tanto o script quanto o HTML que contem o hash, anulando a protecao.

## O processo de hashing

O fluxo e simples e o instrutor demonstra que e identico em qualquer linguagem:

1. **Ler o conteudo** do arquivo (bytes)
2. **Passar pelo algoritmo** de hash (SHA-256, SHA-384 ou SHA-512)
3. **O resultado e binario** — "caracteres estranhos, coisa ilegivel" como o instrutor mostra
4. **Converter para base64** — formato legivel que vai no atributo integrity
5. **Prefixar com o nome do algoritmo** — `sha256-`, `sha384-` ou `sha512-`

O instrutor demonstra que os tres metodos (terminal, Python, Node) produzem o **mesmo resultado**, provando que o processo e deterministico e independente de linguagem.

## Algoritmos suportados

Conforme a spec de Subresource Integrity (referenciada pelo MDN):
- **SHA-256** — 256 bits, mais rapido
- **SHA-384** — 384 bits, equilibrio (mais comum em CDNs)
- **SHA-512** — 512 bits, mais seguro

Todos sao da familia SHA-2. Nao sao aceitos MD5, SHA-1, ou outros.

## Insight do instrutor: simplicidade

O instrutor repete varias vezes que o processo e "simples", "simplesinho" — sao apenas 5 linhas em qualquer linguagem. A barreira para adotar SRI e baixa, nao ha desculpa para nao usar quando carregando scripts de CDN.

## Quando o hash quebra

Se voce atualiza a versao de uma biblioteca CDN (ex: React 18.2 → 18.3), o conteudo do arquivo muda e o hash antigo nao bate mais. O browser bloqueia o script. Solucao: recalcular o hash com o novo arquivo.