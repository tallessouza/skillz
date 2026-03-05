# Deep Explanation: Utilizando o Insomnia

## Por que nao testar pelo navegador?

O instrutor destaca o problema central: ao testar APIs pelo navegador, se voce quiser voltar amanha para continuar, teria que montar tudo de novo. O navegador nao salva as requisicoes que voce fez, nao permite configurar metodos HTTP diferentes de GET facilmente, e nao organiza nada.

O Insomnia resolve isso sendo uma "area de trabalho persistente" para requisicoes HTTP. Tudo que voce configura fica salvo e organizado.

## Modelo mental: Workspace → Collection → Request

O instrutor apresenta uma hierarquia clara de tres niveis:

1. **Workspace** — como uma area de trabalho. Voce pode ter um pessoal, um para empresa, um para cada cliente. E o nivel mais alto de organizacao.

2. **Collection** — agrupa requisicoes relacionadas. Normalmente uma colecao por API ou por grupo logico de endpoints.

3. **Request** — uma requisicao HTTP individual. Tem nome, metodo, URL, parametros e mostra a resposta.

## Os 3 paineis do Insomnia

O instrutor explica que a interface tem basicamente tres partes:

- **Esquerda:** lista de requisicoes (fica salvo, voce nao perde)
- **Centro:** configuracao da requisicao selecionada (URL, metodo, parametros, body)
- **Direita:** resposta (response) — onde voce ve o que a API retornou

Essa separacao request/response e fundamental: do lado esquerdo/centro voce monta o que vai enviar, do lado direito voce ve o que voltou.

## Parametros e metodos HTTP

O instrutor menciona que:
- **GET** e para obter alguma coisa da API
- **Parametros** servem para passar informacao para a API (filtros, IDs, etc.)
- Esses conceitos serao aprofundados nas proximas aulas

Ele nao se aprofunda aqui porque o foco da aula e a ferramenta, nao os conceitos HTTP.

## Funcionalidades mencionadas mas nao detalhadas

- **Duplicar colecao** — via menu de tres pontinhos
- **Importar/Exportar** — o instrutor diz que vai usar mais a frente (util para compartilhar colecoes com o time)
- **Ajuste de paineis** — arrastar as linhas divisorias para ajustar largura

## Fluxo pratico demonstrado

1. Renomeou workspace para "Rocket City"
2. Criou colecao "Minha Primeira API"
3. Criou requisicao HTTP, renomeou para "Obter Mensagem"
4. No terminal, rodou `npm run dev` para subir o servidor na porta 3333
5. No Insomnia, colocou `http://localhost:3333` e clicou Send
6. Resposta apareceu no painel direito: "Minha primeira API"