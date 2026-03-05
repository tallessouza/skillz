# Deep Explanation: Editor de Código — VSCode

## Por que três edições?

O instrutor (Mike) explica que o VSCode tem três formas de uso, cada uma com um propósito claro. A lógica central é **separar ambientes por risco**.

### Stable: O cavalo de batalha

A versão Stable é o que o instrutor usa para trabalho real no dia a dia. É a recomendação principal e o que deve ser a primeira instalação de qualquer desenvolvedor. Não há surpresas — as atualizações passam por ciclos de teste antes de chegar ao usuário.

### Insiders: O laboratório

O conceito-chave que o instrutor destaca é o **"Get Latest Release Each Day"** — todos os dias uma nova versão. Isso significa acesso antecipado a funcionalidades, mas também risco de instabilidade.

O instrutor faz uma pergunta retórica importante: "Então por que você usa ele pras aulas?" E a resposta é o recurso **Side by Side Install**. O Insiders pode coexistir com o Stable sem interferência. Isso permite:

- Usar um editor "limpo" e leve para aulas
- Fazer ajustes específicos para demonstrações
- Não poluir o ambiente de trabalho profissional

**Analogia implícita:** É como ter um carro do dia a dia (Stable) e um carro de teste (Insiders). Se o de teste quebrar, seu trabalho não para.

### Web (vscode.dev): A mobilidade

O instrutor enfatiza o cenário: "tá em viagem, tá em um outro computador, tá num colega, tá no seu tio, na sua tia." O ponto é que vscode.dev elimina a dependência de instalação.

Porém, o instrutor faz um alerta importante: **sempre salvar no Git**. Como o vscode.dev opera no browser, os arquivos são efêmeros se não forem persistidos. O editor acessa o sistema de arquivos local da máquina via browser APIs, mas isso não substitui versionamento.

## Ordem de prioridade (do instrutor)

1. **Stable** — use este para trabalho profissional
2. **Insiders** — apenas se quiser experimentar novidades (side by side)
3. **Web** — quando não puder instalar nada

## Trade-offs resumidos

| Edição | Vantagem | Risco |
|--------|----------|-------|
| Stable | Confiável, testado | Funcionalidades chegam depois |
| Insiders | Novidades diárias, leve para aulas | Pode ter bugs, atualizações diárias podem incomodar |
| Web | Zero setup, funciona em qualquer máquina | Depende de internet, arquivos precisam ser salvos no Git |