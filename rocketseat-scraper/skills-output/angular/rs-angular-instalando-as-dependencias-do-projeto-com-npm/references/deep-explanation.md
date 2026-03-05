# Deep Explanation: Instalando Dependencias com NPM

## Por que node_modules nao vai para o repositorio

A pasta node_modules e extremamente pesada — pode ter centenas de megabytes. Subir para o GitHub seria inviavel e desnecessario, porque o `package.json` e `package-lock.json` ja descrevem exatamente quais dependencias e versoes o projeto precisa. Qualquer pessoa que clonar o projeto pode regenerar a node_modules identica com `npm install`.

## O papel do package-lock.json

O `package.json` lista as dependencias com ranges de versao (ex: `^17.0.0`). O `package-lock.json` trava as versoes exatas que foram instaladas. Quando voce roda `npm install`, o npm usa o lock file para garantir que todos no time tenham exatamente as mesmas versoes.

## Por que deletar node_modules pelo File Explorer

O instrutor enfatiza um ponto pratico importante: a node_modules contem milhares de arquivos e pastas aninhadas. O VS Code tenta indexar e monitorar mudancas no filesystem. Quando voce tenta deletar pelo VS Code:

1. O VS Code pode nao ter permissao para deletar todos os arquivos
2. O Windows pode bloquear a delecao porque algum processo (terminal, watcher, ng serve) esta usando arquivos dentro da pasta
3. A operacao pode travar ou falhar silenciosamente

A solucao do instrutor: **fechar absolutamente tudo** (VS Code, terminais, servidor de desenvolvimento) e deletar pelo File Explorer do sistema operacional.

## ng serve vs npm run start

- `ng serve` — funciona apenas se o Angular CLI esta instalado globalmente (`npm install -g @angular/cli`)
- `npm run start` — executa o script `start` do package.json, que tipicamente chama `ng serve` usando o Angular CLI local do projeto (dentro de node_modules)

Ambos fazem a mesma coisa no final. A diferenca e qual instalacao do Angular CLI e usada.

## Quando voce vai precisar deletar node_modules

O instrutor menciona que em algum momento da carreira voce vai precisar fazer isso. Os cenarios mais comuns:

- Atualizacao de dependencias causou conflito
- Mudanca de branch com dependencias diferentes
- Corrupcao da node_modules (raro, mas acontece)
- Limpeza antes de investigar um bug de build