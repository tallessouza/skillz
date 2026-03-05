# Deep Explanation: Instalacao do Node.js e NPM

## Por que LTS?

O instrutor enfatiza a escolha da versao LTS (Long Term Support) como prioridade. A razao e estabilidade: versoes LTS recebem correcoes de seguranca por mais tempo e sao testadas com frameworks como Angular. Versoes "Current" podem ter features novas mas tambem bugs nao descobertos.

## NPM vem junto

Um ponto que o instrutor destaca e que o NPM (Node Package Manager) e instalado automaticamente com o Node. Durante o wizard de instalacao, existe um item "npm package manager" que ja vem marcado. Isso elimina a necessidade de instalar o NPM separadamente — dois pacotes essenciais em uma unica instalacao.

## O problema do terminal aberto

O instrutor menciona duas vezes a necessidade de fechar terminais apos a instalacao. Isso acontece porque:

1. Quando o Node e instalado, ele adiciona seu diretorio ao PATH do sistema
2. Terminais que ja estavam abertos carregaram o PATH antigo (sem Node)
3. Apenas terminais abertos APOS a instalacao terao o PATH atualizado

Se fechar o terminal nao resolver, reiniciar a maquina forca o sistema operacional a recarregar todas as variaveis de ambiente.

## Versoes compativeis Node ↔ NPM

O instrutor mostra que Node 22.15.0 vem com NPM 10.9.2. Essas versoes sao pareadas — cada versao major do Node traz uma versao especifica do NPM. Nao e necessario (nem recomendado) atualizar o NPM separadamente a menos que haja um motivo especifico.

## Versao especifica vs LTS

O site do Node oferece duas opcoes:
- **Pagina principal**: botao direto para LTS (mais simples)
- **Menu Download**: dropdown com todas as versoes disponiveis (para quando o projeto exige versao especifica)

Para Angular, o instrutor confirma que a versao 22 funciona bem, entao a LTS da pagina principal e suficiente na maioria dos casos.