# Deep Explanation: Criando API com Express

## Por que extrair a porta em uma constante UPPER_CASE?

O instrutor enfatiza um padrao comum na industria: constantes de configuracao (portas, limites, timeouts) sao escritas em UPPER_CASE para diferenciar visualmente de variaveis logicas do programa. Isso nao e apenas estetica — e um sinal semantico para qualquer pessoa lendo o codigo de que aquele valor:

1. **E um parametro de configuracao** — pode mudar entre ambientes
2. **Nao muda durante a execucao** — e definido uma vez e reutilizado
3. **Pode ser referenciado em multiplos lugares** — a constante evita duplicacao

### O problema da duplicacao

Se voce escreve `app.listen(3333)` e depois `console.log("running on port 3333")`, mudar a porta exige editar dois lugares. Com a constante PORT, voce edita em um unico ponto e o valor reflete em todos os usos.

O instrutor demonstra isso ao usar PORT tanto no `listen()` quanto no template literal do `console.log`.

## Inicializacao do Express

`const app = express()` — o instrutor explica que ao chamar `express()`, voce esta inicializando o framework e colocando todos os recursos disponiveis dentro da constante `app`. A partir desse ponto, `app.get`, `app.post`, `app.listen` e todos os outros metodos ficam acessiveis.

## Callback no listen

O segundo parametro do `app.listen()` e uma funcao de callback que executa assim que o servidor comeca a ouvir na porta especificada. O instrutor usa uma arrow function que executa `console.log` com template literal interpolando a porta.

Isso serve como feedback visual no terminal — ao rodar o projeto, voce ve imediatamente se o servidor subiu e em qual porta, sem precisar adivinhar ou verificar manualmente.

## Padrao UPPER_CASE na industria

O instrutor menciona explicitamente: "e bem comum voce encontrar programadores e programadoras usando caixa alta quando e um parametro ou uma constante de configuracao". Exemplos comuns:

- `PORT` — porta do servidor
- `DATABASE_URL` — string de conexao
- `MAX_RETRIES` — limite de tentativas
- `API_BASE_URL` — URL base de API externa