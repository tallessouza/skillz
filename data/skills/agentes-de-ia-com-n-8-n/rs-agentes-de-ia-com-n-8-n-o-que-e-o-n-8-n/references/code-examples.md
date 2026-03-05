# Code Examples: O que e o N8N

## Nota sobre esta aula

Esta e uma aula conceitual/introdutoria. Nao ha codigo executavel apresentado pelo instrutor. Os exemplos abaixo sao representacoes visuais dos workflows descritos.

## Workflow 1: Formulario → Agente IA → Slack

```
[Formulario] → [Agente de IA] → [Slack]
   (entrada)    (processamento)    (saida)
```

**Descricao do instrutor:** Usuario preenche formulario, as respostas vao automaticamente para um agente de IA que faz analise, e o resultado e enviado para um canal do Slack.

**Conceitos envolvidos:**
- Trigger: formulario recebe resposta (webhook ou polling)
- Processamento: node de IA (ex: OpenAI, Claude) analisa o conteudo
- Output: integracao com API do Slack para enviar mensagem

## Workflow 2: Cadastro → Codigo → Sistema

```
[Novo cadastro] → [Bloco de codigo] → [Pre-processamento] → [Sistema de origem]
    (entrada)      (extracao)          (transformacao)         (saida)
```

**Descricao do instrutor:** Um novo item cadastrado no sistema passa por um bloco de codigo que extrai informacoes, faz pre-processamento, junta os dados novamente e devolve ao sistema.

**Conceitos envolvidos:**
- Trigger: novo item criado (webhook ou polling)
- Code node: JavaScript/Python dentro do n8n para transformacao
- Merge: juncao de dados de multiplos caminhos
- Output: chamada API de volta ao sistema de origem

## Modelo mental visual

```
Sistema A ←→ [  N8N  ] ←→ Sistema B
                 ↕
             Sistema C

N8N = camada de integracao central
Qualquer N conecta com qualquer N
```