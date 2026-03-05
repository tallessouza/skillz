# Deep Explanation: Executando Testes Unitarios no CI

## CI vs CD — Conceitos distintos

O instrutor faz questao de separar os dois conceitos:

- **CI (Continuous Integration):** Processo de receber codigo num repositorio e fazer verificacoes/validacoes automatizadas. Foco em garantir qualidade do codigo que chega.
- **CD (Continuous Deployment/Delivery):** Processo de, ao aprovar codigo, automaticamente fazer deploy. Foco em colocar no ar.

Podem ser usados juntos ou separadamente. Neste projeto, o foco e exclusivamente CI porque existem testes automatizados (unitarios e E2E) que precisam ser validados.

## Por que CI existe

Quando varias pessoas trabalham no mesmo projeto e enviam codigo continuamente, e necessario ter fluxos automatizados que validem se o codigo novo esta conforme esperado. Ferramentas possiveis incluem:

- Code Review automatico
- Code Review manual
- SonarQube (seguranca do codigo)
- Checagem de cobertura de testes
- Linters e formatadores

GitHub Actions e a ferramenta de CI nativa do GitHub — um marketplace gigante de actions pre-configuradas (scripts que outras pessoas criaram).

## Anatomia de um workflow GitHub Actions

### Estrutura de pastas
`.github/workflows/` — cada arquivo YAML dentro e um workflow independente.

### Hierarquia
- **Workflow:** Uma esteira de comandos executada quando um evento acontece
- **Jobs:** Trabalhos dentro do workflow (podem rodar em paralelo)
- **Steps:** Passos dentro de cada job (executam sequencialmente)

### Actions vs Run
- **`uses:`** — Baixa e executa uma action pre-configurada do marketplace (ex: `actions/checkout@v4`)
- **`run:`** — Executa um comando direto no terminal da maquina

### Actions usadas no exemplo

1. **`actions/checkout`** — Baixa o codigo do repositorio para dentro da maquina virtual
2. **`actions/setup-node`** — Instala o Node.js na maquina. Aceita `node-version` e `cache` como parametros.

## npm ci vs npm install

O instrutor explica a diferenca crucial:

- `npm ci` nao faz qualquer interacao com o usuario (nao pergunta yes/no)
- `npm ci` nao atualiza versoes
- `npm ci` nao modifica o `package-lock.json`
- `npm install` pode mexer no lockfile

Em ambientes de CI, onde nao ha usuario para responder perguntas, `npm ci` e a escolha correta.

## Cache de dependencias

A action `setup-node` suporta cache automatico. Ao passar `cache: 'npm'`, o GitHub:
1. Na primeira execucao, instala tudo e cria um cache
2. Nas proximas execucoes, se as dependencias nao mudaram, reusa o cache
3. Isso economiza tempo significativo em projetos com muitas dependencias

## Identacao YAML

O instrutor alerta que em arquivos YAML a identacao e critica — sempre usar 2 espacos. Identacao incorreta causa erros silenciosos ou falhas na interpretacao do workflow.

## Feedback visual no GitHub

Apos configurar CI:
- Cada commit fica associado a um icone de check (verde = sucesso, vermelho = falha)
- Na aba Actions, cada push dispara a execucao visivel
- E possivel clicar em cada job e ver logs detalhados step-by-step
- Isso permite saber imediatamente se um push quebrou alguma coisa