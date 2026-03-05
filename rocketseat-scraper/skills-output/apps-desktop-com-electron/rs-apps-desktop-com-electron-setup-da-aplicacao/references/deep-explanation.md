# Deep Explanation: Setup de Aplicacao Electron

## Por que Electron Vite e nao o template padrao?

O template padrao do Electron (do quick start da documentacao oficial) vem extremamente cru:
- O renderer e apenas um arquivo HTML puro, sem framework, sem bundler, sem compiler
- Sem suporte a TypeScript em nenhum dos processos (main, preload, renderer)
- Se quiser React, Vue ou qualquer framework, precisa configurar tudo do zero

O Electron Vite resolve isso trazendo Vite como bundler, com suporte a React, Vue, Svelte e Solid, TypeScript pronto, e Hot Reloading funcionando.

## Electron Vite vs Electron App (do Dalton)

O instrutor menciona dois templates:

1. **Electron Vite** — template mais "cru", menos opiniao. Ideal para primeiro projeto porque voce aprende como as coisas funcionam sem magia
2. **Electron App** (por Dalton, da Rocketseat) — usa Electron Vite por baixo, mas adiciona opiniao em estrutura de pastas e comunicacao entre processos. Mais parecido com um framework. Melhor para segundo/terceiro projeto

A escolha do curso e Electron Vite justamente para construir do zero e entender os fundamentos.

## Os 3 processos do Electron

- **Main** — o backend, roda em Node.js. Cria janelas, acessa sistema de arquivos, APIs nativas
- **Renderer** — o frontend, roda como uma pagina web (React neste caso). E o que o usuario ve
- **Preload** — ponte de comunicacao entre main e renderer. Necessario porque o renderer roda em sandbox e nao tem acesso direto ao Node.js

## Como o conteudo e carregado na janela

A `BrowserWindow` do Electron e literalmente um browser. Voce pode:
- Carregar um `localhost:3000` (desenvolvimento)
- Carregar um arquivo HTML local (producao/build)
- Carregar qualquer URL da web (ex: abrir `rocketseat.com.br` dentro da janela)

Isso demonstra que Electron e essencialmente uma aplicacao web com acesso nativo ao SO.

## Certificado digital e Electron Updater

O Electron Updater permite auto-update (como o VS Code faz — "tem nova versao, quer atualizar?"). Porem requer certificado digital:
- **Custo:** pago, geralmente anual
- **Por plataforma:** Windows e Mac cobram separadamente
- **Windows:** certificados vendidos por empresas terceirizadas autorizadas, preco variavel
- **Mac:** Apple cobra diretamente (como para apps mobile)
- **Linux:** nao requer certificado

Sem certificado, a aplicacao funciona normalmente, mas o usuario recebe aviso "desenvolvedor nao conhecido" na instalacao.

**Alternativa sem certificado:** ao iniciar o app, chamar a API do GitHub para verificar a ultima versao lancada, comparar com a versao atual, e se diferente, redirecionar o usuario para baixar manualmente.

## Comportamento por plataforma

### macOS (Darwin)
- Fechar todas as janelas NAO fecha a aplicacao (fica no dock)
- Clicar no icone do dock recria a janela (`activate` event)

### Windows e Linux
- Fechar todas as janelas fecha a aplicacao completamente (`window-all-closed` → `app.quit()`)

## Hot Reload no processo main

Por padrao, mudancas no processo main nao recarregam automaticamente. O instrutor mostra que e preciso adicionar `--watch` ao script dev:

```json
{
  "scripts": {
    "dev": "electron-vite dev --watch"
  }
}
```

Com `--watch`, ao salvar mudancas no main (ex: alterar largura da janela), o Electron mata a aplicacao e reinicia automaticamente.

## Limpeza do projeto

O instrutor remove do template para manter o projeto limpo:
- `.editorconfig`, `.eslintrc`, `.prettierrc` — prefere configuracoes mais simples
- Pasta `components` e `assets` do renderer — comeca do zero
- Importacao de CSS no main — nao necessaria no inicio
- Muda `export default` para named export no App.tsx