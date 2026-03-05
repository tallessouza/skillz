# Deep Explanation: Diagnostico Cultural DevOps com CALMS

## Origem do CALMS

O framework CALMS surgiu do livro "The DevOps Handbook" (recomendado pelo instrutor como leitura essencial). E um acronimo de cinco letras onde cada uma representa uma dimensao da cultura DevOps: Culture, Automation, Lean, Measurement, Sharing.

## O papel do diagnostico cultural

O instrutor enfatiza que o primeiro passo para adotar DevOps nao e instalar ferramentas — e fazer um diagnostico cultural. Isso significa fazer perguntas especificas dentro da organizacao para entender onde ela esta no espectro DevOps.

A ideia central: CALMS mede a **capacidade de transformacao** da empresa. Se a empresa ja pratica DevOps, valida se esta de fato praticando. Se nao pratica, mostra o caminho.

## A analogia do deploy de madrugada

O instrutor usa um exemplo poderoso: alguem faz deploy fora do horario e a aplicacao cai. A reacao instintiva e culpar a pessoa. Mas o raciocinio DevOps e diferente:

> "Se ela conseguiu fazer o deploy, voce tem um problema de processo."

Ou seja, o time permitiu que um deploy sem aprovacao chegasse em producao. A solucao nao e punir — e criar branch policy, exigir aprovador, automatizar gates. Isso muda completamente a dinamica da equipe.

## Post-mortem como ferramenta cultural

O instrutor diferencia duas posturas pos-incidente:

1. **"Corrigimos, acabou"** — Parece eficiente no momento, mas gera ciclo de repeticao. Tempo e investido repetidamente no mesmo tipo de problema.

2. **Post-mortem estruturado** — Uma sala (reuniao) para responder:
   - O que aconteceu?
   - Por que aconteceu?
   - Quais acoes foram tomadas?
   - Quais acoes serao tomadas para evitar recorrencia?

O instrutor destaca que a ideia e **aprender com os erros**. Sem isso, a organizacao fica presa num loop de incidentes repetitivos.

## Subjetividade das solucoes

O instrutor reconhece que as solucoes sao subjetivas e dependem do contexto:
- Deploy quebrou? Talvez branch policy resolva.
- Codigo defeituoso? Talvez mais testes, testes de contrato.
- Falta de revisao? Talvez aprovador obrigatorio.

O ponto nao e ter uma receita unica, mas ter o **processo de investigacao** (post-mortem) que leva a acoes especificas.

## Conexao com modulos anteriores

O instrutor menciona que nas aulas anteriores ja se discutiu:
- DevOps como cultura (nao ferramenta)
- Exemplo de empresa com e sem DevOps
- Problemas culturais de focar em ferramentas sem cultura

Esta aula avanca para o "como implementar" usando CALMS como ferramenta de medicao.

## Referencia bibliografica

- **The DevOps Handbook** (O Manual do DevOps) — fonte do framework CALMS, recomendado pelo instrutor como leitura essencial.