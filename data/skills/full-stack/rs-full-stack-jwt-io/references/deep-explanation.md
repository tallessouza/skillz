# Deep Explanation: JWT.io Playground

## Estrutura visual do JWT

O jwt.io divide o token em tres partes visuais com cores distintas:

1. **Header (vermelho)** — Define o algoritmo (`alg`) e tipo (`typ`). Trocar o algoritmo no dropdown altera imediatamente o token codificado. Isso demonstra que o header NAO e criptografado — apenas encodado em Base64URL.

2. **Payload (roxo)** — Contem os claims (dados). Qualquer alteracao aqui regenera o hash. O instrutor demonstra substituindo o payload padrao por `{"user_id": "123456"}`, mostrando que o token muda instantaneamente.

3. **Signature (azul)** — Combina header + payload + secret. O site valida em tempo real se a assinatura e consistente.

## A importancia do secret forte

O jwt.io tem um indicador visual de forca do secret. O instrutor mostra que ao digitar "rodrigo" como secret, o site marca como fraco. Conforme adiciona mais caracteres, a mensagem de aviso desaparece.

**Por que isso importa:** O secret e a unica barreira entre um atacante e a capacidade de forjar tokens validos. Um secret fraco pode ser quebrado por forca bruta.

### Recomendacoes de secret:
- Minimo 256 bits de entropia para HS256
- Nunca usar palavras do dicionario
- Nunca usar dados pessoais (nomes, datas)
- Usar geradores criptograficos (`openssl rand -base64 32`)

## Processo bidirecional

O playground funciona nos dois sentidos:
- **Encode:** Editar header/payload/secret → gera token codificado
- **Decode:** Colar token codificado → mostra header/payload + valida assinatura

Isso e util para:
- Debugar tokens recebidos de APIs
- Verificar se o backend esta gerando tokens corretos
- Testar diferentes combinacoes de claims antes de implementar

## Algoritmos disponiveis

O dropdown do jwt.io oferece multiplos algoritmos. Os mais comuns:

| Algoritmo | Tipo | Uso |
|-----------|------|-----|
| HS256 | Simetrico (shared secret) | APIs simples, monolitos |
| RS256 | Assimetrico (public/private key) | Microservicos, OAuth |
| ES256 | Assimetrico (elliptic curve) | Performance + seguranca |

O instrutor demonstra trocando entre algoritmos e mostrando como o conteudo codificado muda completamente — mesmo com o mesmo payload.

## Limitacoes do jwt.io

- NAO valida claims temporais (exp, iat, nbf) — apenas mostra os valores
- NAO simula fluxos completos de autenticacao
- NAO deve ser usado com tokens de producao (dados sensiveis expostos no browser)
- A validacao de assinatura e apenas para demonstracao — em producao usar bibliotecas server-side