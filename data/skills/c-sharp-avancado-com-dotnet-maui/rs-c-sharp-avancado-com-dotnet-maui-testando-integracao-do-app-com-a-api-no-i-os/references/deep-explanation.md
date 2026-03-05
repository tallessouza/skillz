# Deep Explanation: Execucao de Multiplos Projetos (.NET MAUI + API)

## Por que executar multiplos projetos simultaneamente?

Ao desenvolver um app .NET MAUI que consome uma API backend, voce precisa de ambos rodando ao mesmo tempo para testar a integracao. Sem isso, voce teria que iniciar manualmente cada projeto em terminais separados, o que e propenso a erros e ineficiente.

## Rider vs Visual Studio — Diferencas no MultiLaunch

O instrutor (Ellison) destaca que o Rider e "mais espertinho" nessa funcionalidade:

- **Rider** mostra apenas projetos que podem ser executados (filtra automaticamente bibliotecas de classe, por exemplo)
- **Rider** oferece controle granular de quando cada projeto inicia: imediatamente, apos o anterior iniciar, apos o anterior terminar, ou apos uma porta especifica abrir
- **Visual Studio** tem a mesma funcionalidade basica (Multiple Startup Projects), mas segundo o instrutor, as opcoes avancadas de ordenacao "estao mais escondidas" ou nao existem da mesma forma

## O "inseto" do Debug

O instrutor faz uma observacao bem-humorada sobre o icone de debug no Rider parecer um inseto (bug). Isso faz sentido historico — "debugging" vem literalmente de remover insetos (bugs) de circuitos. O checkbox com o inseto no MultiLaunch permite executar um projeto especifico sem debug, util quando voce quer breakpoints apenas no app mas nao na API.

## Estrategia cross-machine: Mac + Windows

Uma abordagem pratica demonstrada na aula:

1. **API roda no Windows** — onde o banco de dados ja esta configurado, Swagger funcionando
2. **App roda no Mac** — porque simuladores iOS so funcionam no macOS
3. **Conexao via tunel publico** — a URL publica aponta para o Windows

O instrutor explica que faz isso para "nao ficar poluindo o Mac" com banco de dados e infraestrutura de backend. E uma decisao pragmatica de ambiente de desenvolvimento.

## Seguranca de URLs de tunel

O instrutor comenta que commitar a URL do tunel no repositorio "nao tem problema nenhum" porque:
- Aponta para uma maquina local
- O tunel pode ser deletado a qualquer momento
- Ao criar um novo tunel, a URL sera diferente
- E apenas ambiente local, "esta sobre controle"

## Falta de feedback visual — divida tecnica identificada

Durante o teste, o instrutor nota que ao criar uma conta, o app nao mostra nenhum feedback visual (loading, sucesso, erro). Ele reconhece isso como algo que precisa ser corrigido — um "pente fino" necessario. Isso ilustra o fluxo real de desenvolvimento: primeiro faca funcionar (integracao), depois melhore a experiencia (UX).

## Validacao da integracao

O instrutor valida o sucesso da integracao de duas formas:
1. **Comportamental**: o app nao crashou, voltou para a tela anterior normalmente
2. **Dados**: mostra o print do banco de dados com o registro "Charlie" recem-criado, junto com os registros anteriores feitos no teste Android

Isso reforca a importancia de validar tanto o "caminho feliz" no app quanto a persistencia real dos dados no backend.