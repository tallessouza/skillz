# Deep Explanation: Testando Build de Preview

## Por que testar preview builds

O conceito central e: **nunca promova para producao sem validar em preview primeiro**. A Vercel gera automaticamente uma build de preview para cada push em branches que nao sao a principal. Isso cria um ambiente isolado onde voce pode testar exatamente o que vai para producao.

## Anatomia de uma preview build no dashboard

Quando voce acessa uma preview build na Vercel, o dashboard apresenta varias informacoes conectadas ao Git:

### Links do Git

1. **Branch link** — clicando nele, voce cai direto na branch no GitHub. Util para revisar o codigo completo da branch.

2. **Diff link** — mostra o que mudou entre essa build e a anterior. O instrutor destaca: "Voce pode usar essa opcao quando quer entender o que essa build esta trazendo de diferenca em relacao a anterior, o que ela esta implementando." Isso e essencial para code review visual.

3. **Commit link** — associado ao commit especifico. Diferente do link da branch (que sempre aponta para o ultimo commit), esse link e fixo para aquele commit.

## Duas formas de acessar a preview

O instrutor explica que existem dois tipos de URL de preview:

### URL baseada na branch
- Sempre aponta para o **ultimo commit** da branch
- Se voce fizer mais pushes, essa URL automaticamente reflete o commit mais recente
- Util para testar "o estado atual da branch"

### URL baseada no commit
- Fixa para um commit especifico
- Mesmo que novos commits sejam adicionados, essa URL nao muda
- Util para testar/comparar versoes especificas

## Preview vs Producao — a diferenca fundamental

O ponto mais importante da aula: **a URL de preview e diferente da URL de producao**. O instrutor enfatiza que "isso que a gente esta executando aqui agora e uma visualizacao, e um teste."

A build de producao tem a URL principal (dominio configurado). A preview usa URLs temporarias geradas pela Vercel. Na build de producao, voce ve a opcao de URL principal no dashboard. Na preview, essa opcao nao existe — apenas URLs temporarias associadas ao commit ou branch.

## Fluxo pratico de validacao

O instrutor demonstra o fluxo completo:

1. Acessar o dashboard da Vercel
2. Localizar a preview build
3. Revisar o diff para entender o que mudou
4. Clicar em "Visitar" ou na URL do commit para abrir a preview
5. Testar as funcionalidades implementadas (no exemplo, ele testa um feedback de validacao — "colocar uma letra errada" para confirmar que a validacao funciona)

## Multiplos caminhos para o mesmo lugar

O instrutor destaca que existem varias formas de chegar na mesma preview: pelo link da branch, pelo link do commit, pelo botao "Visitar". "Sao varias formas de voce chegar no mesmo lugar." Isso e importante para nao se confundir — todos levam a mesma build, so que por caminhos diferentes no dashboard.