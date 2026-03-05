# Deep Explanation: Exportando Requisicoes do Insomnia

## Por que exportar requisicoes?

O instrutor destaca um ponto pratico importante: **com o tempo, voce esquece como montou as requisicoes**. O arquivo exportado funciona como documentacao viva da API — nao para ser lido como JSON puro, mas para ser reimportado no Insomnia quando necessario.

### Analogia do instrutor

Pense no export do Insomnia como um "save game" — voce salva o estado atual de todas as suas requisicoes e pode restaurar esse estado a qualquer momento, em qualquer maquina.

## O que o arquivo contem

O JSON exportado contem:
- Todas as requisicoes (URLs, metodos, headers, bodies)
- Organizacao em pastas/colecoes
- Variaveis de ambiente (se incluidas)
- Configuracoes de autenticacao

**O instrutor enfatiza:** "voce nao vai usar esse arquivo para ler isso aqui nao" — o JSON e para o Insomnia consumir, nao para leitura humana.

## Pratica recomendada pelo instrutor

Salvar o arquivo exportado junto com o projeto no repositorio Git. Isso garante que:
1. Qualquer pessoa que clone o projeto tem acesso as requisicoes
2. Voce mesmo consegue recuperar as requisicoes no futuro
3. Funciona como documentacao complementar da API

## Fluxo completo demonstrado na aula

1. Colecao criada no Insomnia com todas as rotas da API do restaurante
2. Export da colecao completa (todas marcadas)
3. Salvamento como `requests_insomnia.json` na pasta do projeto
4. Demonstracao de delete + reimport para provar que funciona
5. Validacao de que todas as requisicoes voltaram intactas

## Convencao de nomenclatura

O instrutor usou `Requests_Insomnia` como nome do arquivo, removendo a data automatica que o Insomnia adiciona. A convencao sugerida e manter um nome limpo e descritivo.

## Quando re-exportar

- Apos adicionar novas rotas a API
- Apos modificar bodies ou headers significativamente
- Antes de compartilhar o projeto com alguem