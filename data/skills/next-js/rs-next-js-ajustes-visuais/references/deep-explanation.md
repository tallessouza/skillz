# Deep Explanation: Ajustes Visuais

## Por que margin direcional importa

O instrutor mostrou um caso concreto: ao usar `m-4` (margin generico), o espacamento era aplicado nos 4 lados do elemento, causando desalinhamento horizontal. Ao trocar para `mb-4` (margin bottom apenas), o elemento ficou alinhado lateralmente com os demais, mantendo apenas o espacamento vertical necessario.

A frase chave do instrutor: "Com a margem, vai aplicar em todos os quatro lados, então aqui é só embaixo, beleza? Já fica alinhado."

## Decisao de remover informacao

O instrutor demonstrou um processo de decisao interessante sobre o que manter no componente:

1. **Verificou o Figma** — o horario e paciente nao estavam no design original
2. **Questionou a premissa inicial** — "A priori eu tinha achado que fazia sentido colocar"
3. **Testou visualmente sem** — removeu e avaliou o resultado
4. **Concluiu pela remoção** — "Fica mais clean"

Esse processo e valioso: mesmo que voce ache que algo "faz sentido", se nao esta no design e nao foi especificado, remova. Adicionar informacao sem necessidade e uma forma de over-engineering visual.

## Reservar espaco para funcionalidade futura

O instrutor mencionou: "O espaço que a gente tem aqui vai ser para os botões de edição e de remoção." Ele nao criou botoes placeholder ou divs vazias com comentarios — simplesmente deixou o espaco natural do grid. Isso e a abordagem correta: nao implemente UI para funcionalidade que ainda nao existe.

## Prisma como preparacao

A configuracao do Prisma nessa aula foi minimalista e proposital:

1. Criou `lib/prisma.ts` com singleton
2. Testou a conexao com `findMany` (retornou array vazio)
3. Deixou comentado — nao integrou ainda porque nao ha dados cadastrados

O ponto importante: ele nao tentou fazer seed, nao criou dados mock, nao construiu toda a integracao. Apenas validou que a conexao funciona e seguiu em frente. Isso evita over-engineering antes de ter o formulario pronto.

## Espacamento do Figma como fonte de verdade

O instrutor consultou o Figma para determinar o espacamento exato: "32 pixels de distância". Em Tailwind, isso corresponde a `mb-8` (8 * 4px = 32px). Sempre consulte o design como fonte de verdade para valores de espacamento, nao invente valores "que parecem bons".

## OrbStack como ambiente de banco

O instrutor mencionou que precisou iniciar o "orb" (OrbStack) para que a conexao com o banco funcionasse. Isso indica que o banco de dados (provavelmente PostgreSQL) roda em container Docker gerenciado pelo OrbStack. Sem o container rodando, o Prisma nao consegue conectar — erro esperado e simples de resolver.