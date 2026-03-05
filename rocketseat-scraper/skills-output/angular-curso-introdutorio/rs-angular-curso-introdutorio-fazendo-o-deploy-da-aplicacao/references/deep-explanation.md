# Deep Explanation: Deploy Angular no Netlify

## Por que o /browser no publish path?

O Angular, a partir de versoes mais recentes, gera a build dentro de uma subpasta `browser` em `dist/{projeto}/browser`. O instrutor descobriu isso durante a aula ao rodar o build e perceber que a pasta criada tinha essa estrutura adicional. Se voce apontar o publish apenas para `dist/{projeto}`, o Netlify nao encontra o `index.html` e o deploy falha silenciosamente ou mostra pagina em branco.

A forma correta de confirmar e abrir o `angular.json` e verificar o campo `outputPath`. No caso da aula, o valor era `dist/gerador-certificado`, mas os arquivos efetivos ficavam em `dist/gerador-certificado/browser`.

## Por que o redirect catch-all?

Angular e uma Single Page Application (SPA). Todas as rotas sao gerenciadas pelo router do Angular no client-side. Quando o usuario acessa diretamente uma rota como `/certificados`, o servidor Netlify tenta encontrar um arquivo fisico nesse caminho — que nao existe. O redirect `/* → /index.html` com status 200 faz o Netlify sempre servir o `index.html`, permitindo que o Angular router resolva a rota corretamente.

Sem esse redirect, qualquer refresh de pagina ou acesso direto a uma rota que nao seja `/` resulta em erro 404.

## Warnings de budget no build

O Angular tem configuracoes de budget no `angular.json` que limitam o tamanho do bundle. Durante a aula, o build gerou warnings de budget mas nao impediu a build. Existem dois niveis:
- **warning**: alerta mas completa o build
- **error**: impede o build completamente

Se o budget estiver configurado como error e o bundle ultrapassar o limite, o deploy vai falhar. Nesse caso, otimize o bundle (lazy loading, tree shaking) ou ajuste os limites no `angular.json`.

## Fluxo completo Netlify + GitHub

1. Netlify se conecta ao repositorio GitHub
2. A cada push na branch configurada (geralmente `main` ou `master`), Netlify automaticamente dispara um novo deploy
3. Netlify le o `netlify.toml` para saber qual comando rodar e onde estao os arquivos
4. Apos build bem-sucedida, os arquivos do publish directory sao publicados no CDN do Netlify
5. Um dominio `.netlify.app` e gerado automaticamente (customizavel)

## Configuracao do Netlify via UI vs arquivo

O instrutor optou por criar o `netlify.toml` no repositorio, o que e a pratica recomendada porque:
- Configuracao versionada junto com o codigo
- Reproduzivel — qualquer pessoa que clone o repo ja tem a config
- O Netlify detecta automaticamente e preenche os campos na UI

A alternativa seria configurar tudo pela UI do Netlify, mas isso nao fica versionado e e perdido se voce recriar o site.