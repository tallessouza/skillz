# Deep Explanation: Metodologias de Dados

## Por que metodologias importam

A instrutora abre com uma provocacao: "toda analise de dados e igual? Voce pega o dado, joga num Google Colab, aplica umas bibliotecas e acabou?" A resposta e nao. Existem formas diferentes de trabalhar um dado e agregar valor a ele. A lista apresentada (CRISP-DM, Lean Analytics, DataOps, AB Testing) nao e exaustiva — pode ser necessario combinar duas metodologias ou fazer algo completamente diferente.

## CRISP-DM em profundidade

### Natureza da metodologia
CRISP-DM e um ciclo de etapas — nao e linear. E utilizada em analises mais pontuais que tem como objetivo responder UMA pergunta de negocio. Nao serve para criar dashboards com indicadores comuns para observacao de stakeholders. E um processo fechado para responder uma pergunta.

### Iteracao entre fases
Um ponto crucial: as fases de compreensao de negocio e compreensao de dados sao iterativas. Voce compreende o negocio, vai ver os dados, descobre que nao tem todos os dados que pensava, volta no negocio para ver o que mais pode pegar. Essa ida e volta e natural e esperada.

### Exemplo pratico: Churn
- Compreensao de negocio: "Por que o churn subiu?" → conversar com vendas, financeiro, marketing
- Compreensao de dados: Preciso de dados de churn, mas tambem de campanhas de marketing para ver se trouxe leads que nao eram aderentes ao ICP (Ideal Customer Profile)
- Preparacao: limpeza e normalizacao
- Modelagem: aplicar estatistica/ML, possivelmente criar modelo preditivo
- Avaliacao: validar com stakeholders
- Deploy: automatizar o modelo preditivo para que funcione nos proximos meses sem refazer a analise manualmente

### Deploy de modelo
A instrutora explica: voce fez uma analise de churn e desenvolveu um modelo preditivo. Voce quer que aquele trabalho seja perene e utilizado mais vezes. Entao voce faz o deploy — a automacao do modelo para que continue funcionando independente de voce estar refazendo aquela analise todo mes.

## Lean Analytics

### Filosofia
Vem da mesma linha do livro "Startup Enxuta" — fazer e testar o mais rapido possivel para diminuir o tempo de desenvolvimento. Enquanto CRISP-DM e detalhado e demorado, Lean Analytics e rapido.

### Exemplo Netflix
As thumbnails da Netflix sao criadas especificamente para cada usuario. Se voce gosta de romance, a thumbnail mostra elementos romanticos. Se gosta de terror, mostra elementos de terror. Netflix testa constantemente quais thumbnails fazem voce clicar. Isso e Lean Analytics em acao.

### Outras aplicacoes
- E-commerce: metricas de carrinho abandonado, conversoes
- Uber: ajuste dinamico de pricing de corridas

## DataOps

### Origem
Vem de DevOps. Focado em automacao e gestao eficiente do ciclo de vida de dados. Mais comum ser responsabilidade de engenheiros ou cientistas de dados.

### Governanca de dados
A instrutora da um exemplo concreto: quando um dado entra em uma tabela, nao necessariamente vem "bonitinho". Criam colunas que ninguem sabe o que sao. Informacoes que ninguem sabe o que significam. Isso e falta de governanca — DataOps se propoe a cuidar disso.

### Componentes
- CI/CD de dados
- Automacao de coleta, processamento e analise
- Monitoramento continuo e governanca (integridade, LGPD)

## AB Testing

### Heranca de UX
Veio de profissionais de UX que trocam sutilmente cores de sites para ver quais aumentam taxa de engajamento/clique. E uma ciencia delicada.

### Dados nao pertencem so a analistas
A instrutora enfatiza: "dados nao pertencem apenas a nos, analistas e cientistas de dados." A evolucao do uso de dados significa outros profissionais usando dados para suas decisoes.

### Processo
1. Definir hipotese
2. Criar duas ou mais versoes
3. Testar com grupo de usuarios
4. Analisar e aplicar melhor versao

### Requisito: volume B2C
Precisa de contato com publico, massa de usuarios para testar.

## Relacao entre metodologias

A instrutora faz um ponto importante no final: as outras metodologias sao "partes especificas do CRISP-DM" ou "aplicacoes um pouco diferenciadas". CRISP-DM ja cobre muito bem cada etapa de dados. DataOps e a excecao — mais focada em engenharia de dados.