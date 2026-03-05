# Deep Explanation: Fonte Externa + CSP no Electron

## Por que o Electron tem CSP?

O Electron empacota codigo na maquina do usuario. Diferente de um site web servido por um servidor controlado, o codigo do Electron fica fisicamente acessivel. O CSP existe para **impedir que um usuario malicioso injete scripts ou estilos externos** na aplicacao — por exemplo, carregando scripts de sites externos para realizar acoes maliciosas.

Sem CSP, qualquer pessoa com acesso ao codigo local poderia modificar o HTML para carregar recursos de dominios arbitrarios.

## Anatomia de uma diretiva CSP

Cada diretiva e separada por **ponto e virgula**:

```
default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'
```

- `default-src` — fallback para qualquer tipo de recurso sem diretiva especifica
- `script-src` — controla de onde scripts podem ser carregados
- `style-src` — controla de onde estilos podem ser carregados
- `font-src` — controla de onde fontes podem ser carregadas
- `img-src` — controla de onde imagens podem ser carregadas

Dentro de cada diretiva, valores sao separados por **espaco**:

```
style-src 'self' 'unsafe-inline' https://fonts.googleapis.com
```

Isso permite: estilos locais (`self`), estilos inline (`unsafe-inline`), e estilos do Google Fonts.

## O fluxo de debug que o instrutor demonstrou

1. Abriu DevTools (View > Toggle Developer Tools)
2. Deu F5 — viu erro no console: `Refused to load the stylesheet... style-src`
3. Identificou que precisava adicionar `fonts.googleapis.com` em `style-src`
4. Adicionou, deu F5 — novo erro: `Refused to load the font... default-src`
5. Abriu aba Network — viu requisicao para `fonts.gstatic.com`
6. Criou diretiva `font-src` com esse dominio
7. Verificou aplicando `font-family: 'Inter'` no CSS

A mensagem de erro do CSP e extremamente util: ela diz **exatamente** qual diretiva esta bloqueando e qual era a policy configurada. O DevTools e a ferramenta principal de debug.

## Duas alternativas para font-src

O instrutor mostrou que existem duas opcoes:
1. Adicionar o dominio em `default-src` — funciona porque `default-src` e o fallback
2. Criar uma diretiva `font-src` especifica — mais seguro e explicito

A segunda opcao e preferivel porque segue o principio de menor privilegio.

## Google Fonts: dois dominios diferentes

- `fonts.googleapis.com` — serve o CSS que declara as `@font-face`
- `fonts.gstatic.com` — serve os arquivos de fonte propriamente ditos (`.woff2`, etc.)

Por isso voce precisa de **duas** diretivas: `style-src` para o primeiro e `font-src` para o segundo.