# Deep Explanation: Testando App Front-end em Producao

## O problema do cold start no Render Free Tier

O instrutor Diego Fernandes destaca um problema critico que muitos desenvolvedores enfrentam: plataformas de hosting gratuito (Render, Railway, Fly.io) desligam a aplicacao quando detectam inatividade. Quando a primeira requisicao chega, o servico precisa reiniciar toda a aplicacao, causando timeouts.

Nas palavras do instrutor: "nao existe nada de graca que seja muito bom". O plano free do Render mata o projeto quando detecta inatividade, e a primeira requisicao dispara o processo de subir toda a aplicacao novamente. Isso causa o erro `Task timed out after 10 seconds` no frontend.

Esse comportamento e identico no Railway e Fly.io em seus planos gratuitos. A unica solucao confiavel e pagar pelo menos o plano basico ($7/mes no Render).

## Erro de import do cookies-next

O erro `Cannot read property of undefined reading 'getCookie'` aconteceu porque o pacote `cookies-next` exporta funcoes como named exports, nao como default export. Quando voce faz `import cookies from 'cookies-next'`, o `cookies` vira `undefined` porque nao ha default export.

A correcao e simples: `import { getCookie } from 'cookies-next'`. O instrutor verificou a documentacao do pacote (secao "usage") e confirmou que o import correto e o named import.

Essa classe de erro e comum em producao — funciona em desenvolvimento local por causa de diferencas no bundling (Webpack/Turbopack em dev vs build otimizado em producao).

## Configuracao de DNS varia por conta

O instrutor alerta que a configuracao de DNS pode variar dependendo da sua situacao:
- Se o dominio ja aponta para Vercel: basta adicionar um registro TXT
- Se o dominio e novo: sera necessario configurar um CNAME

A plataforma (Vercel) informa exatamente o que adicionar. O certificado SSL e gerado automaticamente apos a verificacao do dominio.

## Abordagem de debugging em producao

O instrutor mostrou transparentemente todos os erros que encontrou, comentando: "estou deixando todos os erros acontecendo porque e legal ver a experiencia completa, nao so chegar aqui e dar tudo certo."

O processo de debugging seguiu esta sequencia:
1. Tentou criar conta pelo frontend → erro
2. Verificou logs do Vercel → encontrou erro de import
3. Corrigiu import, fez deploy
4. Ainda com timeout → testou API isoladamente no Postman
5. Identificou que o backend estava offline (cold start do Render)
6. Aguardou backend reiniciar → tudo funcionou

Essa abordagem de isolar camadas (frontend vs backend vs DNS) e fundamental para debugging de deploy.