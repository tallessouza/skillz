# Deep Explanation: Nomenclatura de Variáveis

## Por que nomenclatura é a primeira regra do Clean Code

O instrutor (Diego Fernandes, Rocketseat) posiciona nomenclatura como o ponto de entrada do Clean Code porque é a mudança de maior impacto com menor custo. Não requer refatoração arquitetural, não muda lógica — apenas renomeia. Mas o efeito na legibilidade é transformador.

## O insight central: Clean Code não é difícil quando o código é pequeno

O instrutor faz uma observação crucial que muitos desenvolvedores ignoram: todo código parece legível quando tem 5 linhas. O problema aparece quando cresce. A variável `filtered` parece óbvia num arquivo de 10 linhas, mas quando está exportada e usada em outro arquivo, ninguém sabe o que `filtered` significa.

Isso significa que a regra de nomenclatura não é sobre o código de HOJE — é sobre o código de AMANHÃ. Nomeie como se o código fosse crescer, porque ele vai.

## Os três níveis de problema

### Nível 1: Diminutivos (`u`, `d`, `btn`)
O mais básico. Comum em iniciantes. O argumento é "economizar digitação". O contra-argumento: você digita uma vez, lê mil vezes. E `u` é impossível de buscar no codebase com grep/find.

### Nível 2: Nomes genéricos (`data`, `response`, `filtered`, `list`)
Mais insidioso porque parece profissional. `data` parece um nome razoável. Mas `data` descreve a ESTRUTURA (é um dado), não o CONTEÚDO (são usuários, pedidos, faturas). Quando a função cresce e começa a ter manipulações, mappings, validações — `data` se torna completamente opaco.

O instrutor dá um argumento específico contra o uso de `data` para facilitar copy-paste entre funções: "Se eu deixo `data`, é mais fácil replicar essa função para `getCompanies`". Ele reconhece o argumento e o refuta: a facilidade de copiar não compensa a perda de semântica quando a função cresce.

### Nível 3: Nomes que descrevem estrutura, não conteúdo
`userArray`, `dateList`, `responseObject` — esses nomes adicionam informação sobre o tipo (que já está no sistema de tipos do TypeScript) mas não sobre o que o dado SIGNIFICA no domínio do negócio.

## O exercício do código real: antes e depois

O instrutor usa um exemplo real de um projeto do Ignite (sistema de agendamento) para demonstrar o poder da nomenclatura. O exercício é brilhante pedagogicamente:

1. Primeiro mostra o código com nomes ruins e pede ao aluno para entender o que faz
2. Depois mostra o MESMO código com nomes melhores

As mudanças específicas:
- `date` → `compareYearAndMonth` — revela a INTENÇÃO (comparar datas), não o tipo
- `interval` → `availableWeekdays` — revela o DOMÍNIO (dias disponíveis)
- Variável sem nome claro → `blockedWeekdays` — revela o OPOSTO do anterior
- `response` → `blockedDatesResponse` — revela o que a query retorna
- `data` → `blockedDates` — revela o conteúdo final

O resultado: sem saber NADA sobre o sistema, o leitor consegue deduzir que é um sistema de agendamento/calendário que verifica disponibilidade de usuários.

## A filosofia: tamanho do nome ≠ qualidade do código

O instrutor combate diretamente o mito de que nomes curtos = código melhor. Ele argumenta que "Clean Code não tem nada a ver com o tamanho do código. Muitas das vezes, um código maior é mais limpo, mais legível do que um código menor."

Isso é contra-intuitivo para muitos desenvolvedores que associam concisão com qualidade. A métrica correta não é quantidade de caracteres — é clareza de intenção.

## Público-alvo e posicionamento

O instrutor reconhece explicitamente que o curso atende desde iniciantes até experientes, e faz um convite importante: "vão ter muitas coisas que eu vou falar aqui que talvez você acha que já sabe, mas talvez eu te mostre de uma maneira diferente." Isso posiciona o valor não na informação em si (que pode ser conhecida), mas na PERSPECTIVA e na forma de aplicar.