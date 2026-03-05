# Deep Explanation: Dominio e App GitHub para Deploy

## Por que dominio customizado importa

O Render gera um dominio automatico (ex: `app-name.onrender.com`), mas para uma aplicacao SaaS profissional, voce precisa de um dominio proprio. O instrutor destaca que se voce NAO tiver um dominio proprio, pode usar o gerado pelo Render — mas precisa atualizar TODAS as variaveis de ambiente para refletir esse dominio.

## A armadilha das URLs: Backend vs Frontend

O ponto mais sutil da aula e a distincao entre URLs do backend e do frontend nas variaveis de ambiente:

- **`NEXT_PUBLIC_API_URL`**: aponta para o dominio do BACKEND (onde a API roda)
- **`GITHUB_AUTH_CLIENT_REDIRECT_URI`**: aponta para o dominio do FRONTEND (onde o usuario sera redirecionado apos autenticar)

O instrutor enfatiza: "aqui nao e o do backend, ne? Entao esse aqui depois vai ser o dominio gerado la quando a gente fizer o deploy do frontend". Essa confusao e uma fonte comum de bugs em deploy.

## Fluxo do CNAME e SSL

1. Voce adiciona o dominio no Render
2. O Render fornece um valor CNAME para voce configurar no seu DNS
3. Voce cria o registro CNAME apontando seu subdominio para o valor do Render
4. O Render verifica o CNAME automaticamente
5. Apos verificacao, o Render gera um certificado SSL via Let's Encrypt
6. Somente apos o SSL estar ativo, a API funciona via HTTPS

O instrutor menciona que antigamente isso levava ate 24 horas, mas hoje e bem rapido. A dica pratica: nao fique esperando — continue com outras configuracoes e volte depois.

## GitHub OAuth App: Homepage vs Callback

- **Homepage URL**: URL do frontend, sem o path `/api`. Exemplo: `https://next-saas.skillz.dev`
- **Authorization Callback URL**: URL do frontend + `/api/auth/callback`. Esse path precisa bater exatamente com o que o codigo do frontend espera.

O instrutor mostra que no codigo do frontend o path e `/api/auth/callback`, entao em producao e a mesma coisa, so muda o dominio.

## Plano gratuito: realidade

O instrutor e direto: "plano gratuito e muito pra testar, ta, sendo bem sincero, nenhuma aplicacao que se preze que va pro ar assim em producao mesmo vai usar um plano gratuito". As metricas de CPU sequer ficam disponiveis no plano gratuito. Se a aplicacao tem proposito comercial, migre para pago o quanto antes.

## Ordem das operacoes

A sequencia importa para eficiencia:
1. Configurar CNAME primeiro (porque demora para propagar)
2. Enquanto aguarda SSL, criar o GitHub OAuth App
3. Atualizar variaveis de ambiente por ultimo (porque dispara novo deploy)
4. Verificar SSL e testar o dominio