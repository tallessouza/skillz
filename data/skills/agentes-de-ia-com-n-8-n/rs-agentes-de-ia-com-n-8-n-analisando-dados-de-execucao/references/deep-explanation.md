# Deep Explanation: Analisando Dados de Execução no n8n

## Dois ambientes, duas URLs

O conceito central da aula é a separação entre **ambiente de desenvolvimento** (editor visual) e **ambiente de produção** (automação ativa). O instrutor enfatiza que o editor é "a visão de desenvolvimento" — é onde você constrói e debugga.

Cada webhook no n8n gera duas URLs:
- **Test URL** — envia dados para o editor, permite visualização imediata
- **Production URL** — executa a automação de verdade, mas os dados NÃO aparecem no editor

Essa distinção é crucial porque iniciantes frequentemente enviam dados pela Production URL e ficam confusos quando "nada acontece" no editor. Na verdade executou, mas a visualização só está disponível na aba Executions.

## Aba Executions como centro de diagnóstico

O instrutor mostra que a aba Executions é onde todas as execuções ficam registradas — tanto de teste quanto de produção. Ao clicar em uma execução:

1. Você vê o workflow com indicação visual (nós verdes = sucesso)
2. Clique duplo no nó revela a configuração e os dados recebidos
3. Os dados são organizados em seções: **headers**, **parameters**, **query**, **body**

### Anatomia do payload de webhook

- **Headers** — metadados da requisição (content-type, user-agent, etc.) — "olha quantos campinhos específicos"
- **Parameters** — parâmetros de rota (se configurados no path)
- **Query** — variáveis de query string (usado em requisições GET)
- **Body** — corpo da requisição (usado em requisições POST)

O instrutor faz a distinção explícita: "se eu tivesse mandado uma requisição GET, muito provavelmente a gente teria dentro dessa variável query todas as variáveis". Como o exemplo usa POST, os dados (campo "moeda" com valor "USD") chegam no body.

## Copy to Editor — o atalho de ouro

A funcionalidade mais prática da aula: **Copy to Editor**. O instrutor descreve o cenário real:

> "Pode acontecer um erro. Eu falo assim, caramba, aconteceu um erro com um dado específico que eu não tenho por aqui. É só eu importar esse dado para o ambiente de desenvolvimento e conseguir fazer a manutenção."

O fluxo é:
1. Algo deu errado em produção com dados específicos
2. Vá na aba Executions
3. Encontre a execução problemática
4. Clique "Copy to Editor"
5. Os dados reais são carregados no editor
6. Agora você pode adicionar nós, modificar lógica e testar com aqueles dados exatos

Isso elimina a necessidade de recriar payloads manualmente e garante que você debugga com os dados reais que causaram o problema.

## Webhook como porta de entrada

O instrutor posiciona o webhook como fundamental para agentes de IA ("nosso exemplo do WebHook é muito importante para trabalhar com agentes de IA"), mas generaliza: dados podem vir de formulários, sistemas, APIs. O webhook é o nó de entrada que recebe dados externos, e tudo que foi ensinado sobre inspeção de dados se aplica a qualquer fonte.