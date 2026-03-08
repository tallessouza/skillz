# Deep Explanation: Conectando React com API Node.js

## Filosofia da integracao frontend-backend

O ponto central desta licao e que **o frontend nao se importa com a tecnologia do backend**. A API pode ser Node.js, Python, Java, Go — desde que o contrato de comunicacao seja JSON via HTTP, o frontend conecta da mesma forma. Essa e a essencia do REST: desacoplamento entre client e server.

## Documentacao de APIs — Por que e o primeiro passo

O instrutor enfatiza que **antes de escrever qualquer codigo de integracao, voce deve consultar a documentacao da API**. Ele demonstra isso ao vivo:

1. Abre a documentacao publica do GitHub (`https://docs.github.com/en/rest`)
2. Encontra o endpoint `GET /repos/{owner}/{repo}`
3. Testa diretamente no navegador (porque GET funciona no browser)
4. Verifica o retorno JSON

A analogia implícita: **a documentacao e o manual de instrucoes**. Voce nao monta um movel sem ler o manual. Da mesma forma, nao implemente uma integracao sem ler a documentacao da API.

Quando a API nao tem documentacao formal (como no projeto do curso), o instrutor mostra o codigo do backend diretamente — identificando rotas, parametros esperados e retornos. Na pratica profissional, APIs bem construidas terao Swagger/OpenAPI, mas saber ler o codigo fonte e uma habilidade valiosa.

## Fluxo completo da aplicacao

O projeto implementado cobre o ciclo completo de uma aplicacao corporativa:

### 1. Autenticacao
- **Cadastro** com validacoes (campos obrigatorios, senha minima de 6 digitos, confirmacao de senha)
- **Login** com redirecionamento automatico
- **Logout** com limpeza de contexto e retorno a tela inicial
- **Contexto** React gerencia o estado do usuario logado globalmente

### 2. Rotas protegidas por perfil
- Rotas de **autenticacao** (publicas): `/sign-in`, `/sign-up`
- Rotas de **employee** (colaborador): acesso a criar solicitacoes
- Rotas de **manager** (administrador): acesso ao dashboard com listagem

### 3. CRUD com validacao
- Criar solicitacao com categoria, descricao, valor e upload de comprovante
- Validacoes de formulario impedem envio sem dados obrigatorios
- Feedback visual ao usuario (mensagens de erro, confirmacao de sucesso)

### 4. Paginacao e busca
- Paginacao controlada por parametros `page` e `perPage`
- Busca por nome filtra resultados via query parameter
- O backend controla os dados retornados — o frontend apenas envia os parametros

### 5. Upload de arquivos
- Input `type="file"` para selecionar comprovante
- Envio via `FormData` (nao JSON)
- Visualizacao do arquivo em nova aba

### 6. Detalhes e navegacao
- Mesma pagina reutilizada para visualizar detalhes (recuperando ID da URL)
- Navegacao entre listagem e detalhes
- Botao de voltar retorna ao estado anterior

## Insight sobre APIs publicas

O instrutor demonstra que voce pode testar APIs diretamente no navegador para metodos GET. Isso e util para:
- Validar rapidamente se um endpoint esta funcionando
- Entender a estrutura do retorno JSON
- Debugar problemas de conexao

Para outros metodos (POST, PUT, DELETE), use ferramentas como Insomnia ou Postman.

## O projeto como portfolio

O instrutor enfatiza que este projeto e **completo o suficiente para portfolio** porque cobre:
- Autenticacao com multiplos perfis
- CRUD completo
- Upload de arquivos
- Paginacao e busca
- Validacoes frontend
- Integracao com API real