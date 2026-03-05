# Deep Explanation: Docker Ignore

## Analogia central do instrutor

O `.dockerignore` funciona **exatamente como o `.gitignore`**. Assim como o `.gitignore` define quais arquivos o Git deve ignorar ao enviar para o GitHub, o `.dockerignore` define quais arquivos devem ser ignorados ao enviar para dentro do container Docker.

A analogia e direta:
- `.gitignore` → GitHub nao recebe esses arquivos
- `.dockerignore` → Container nao recebe esses arquivos

## Por que cada arquivo e ignorado

### `node_modules/`
Assim como no `.gitignore`, a pasta `node_modules` e "facilmente recriada" — basta rodar `npm install`. No contexto Docker, o `Dockerfile` ja contem um comando para instalar dependencias, entao levar a pasta local seria:
- Desperdicio de espaço (pode ter centenas de MB)
- Risco de incompatibilidade (binarios compilados para o OS local vs Linux do container)
- Lentidao no build (copiar muitos arquivos pequenos e lento)

### `dist/`
O proprio `Dockerfile` ja define um comando para gerar a pasta `dist` dentro da imagem. Enviar a `dist` local seria redundante — ela sera sobrescrita pelo build interno.

### `Dockerfile`
O arquivo de configuracao do Docker nao precisa existir dentro do container. Ele e usado apenas para **construir** a imagem, nao para **executar** a aplicacao.

### `.git/`
O historico Git e irrelevante para a execucao da aplicacao. Pode adicionar dezenas ou centenas de MB desnecessarios ao container.

### `.dockerignore`
O proprio arquivo de ignore nao precisa ir para dentro do container.

### `.gitignore`
Arquivo de configuracao do Git, irrelevante para o runtime da aplicacao.

## Principio geral

**Se um arquivo nao e necessario para a aplicacao rodar em producao, ele deve estar no `.dockerignore`.** Isso resulta em:
- Imagens menores
- Builds mais rapidos
- Menos superficie de ataque (seguranca)
- Menos chance de vazamento de informacoes sensiveis

## Edge cases

- **Case sensitivity importa**: `Dockerfile` deve ser escrito exatamente como o nome do arquivo real (com D maiusculo)
- **Posicao do arquivo**: O `.dockerignore` deve estar na raiz do projeto, ao lado do `Dockerfile`
- **Sintaxe**: Cada entrada em uma linha separada, sem virgulas ou separadores