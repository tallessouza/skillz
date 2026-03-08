# Deep Explanation: Promovendo Build de Preview para Produção

## Por que existem três caminhos

A Vercel oferece flexibilidade porque equipes têm fluxos diferentes. O instrutor mostra três opções propositalmente:

1. **Painel da Vercel** — O caminho mais rápido. Nos três pontinhos do deployment de preview, existe a opção "Promote to Production". Útil quando você quer promover sem alterar o Git (hotfix visual, teste rápido). Porém, a main no Git fica desatualizada em relação à produção.

2. **GitHub Pull Request** — O GitHub detecta automaticamente quando uma nova branch é criada e exibe um banner com "Compare & pull request". Clicando ali, ele guia o processo de criação da PR. Ideal para equipes que precisam de code review antes do merge.

3. **Git CLI** — O instrutor escolhe este caminho porque dá controle total e transparência sobre o que está acontecendo. Cada comando é explícito e o histórico fica limpo.

## O fluxo Git explicado passo a passo

### git checkout main

Quando você troca para a main, o código local muda imediatamente. O instrutor destaca isso: "veja que até o código aqui mudou porque a nossa branch main desconhece aquela feature". Isso é importante para entender que branches são isoladas — a main não sabe da feature até o merge.

### git pull origin main

O instrutor executa isso mesmo sabendo que "não vai ter nada novo vindo de lá pra cá". A razão é preventiva: em equipes, outro desenvolvedor pode ter feito push na main enquanto você trabalhava na feature. Sem o pull, o merge pode gerar conflitos desnecessários ou, pior, o push pode ser rejeitado.

### git merge feat/nome-da-feature

Este é o momento em que as mudanças da feature entram na main. O instrutor observa: "veja que agora o código apareceu aqui dentro da nossa main". O merge cria um commit especial (merge commit) que registra a junção das duas branches.

### git log --oneline

O instrutor usa a flag `--oneline` para visualização compacta. Ele mostra que o histórico conta a "história" do projeto:
- v1 inicial
- Mudança de estilo do botão (na main)
- Merge da main com a feature branch

Para sair do log, usa `:q` (comando do pager `less`).

### git push origin main

Ao fazer push na main, a Vercel detecta automaticamente e gera uma nova build. Como é a branch principal, a Vercel entende que deve ser uma build de **produção** (não preview). O instrutor confirma: "ele já identificou a nova mudança, gerou uma nova build, já gerou em produção".

## Como a Vercel decide entre Preview e Production

A regra é simples:
- **Push na main** (ou branch configurada como production) → Build de **Production**
- **Push em qualquer outra branch** → Build de **Preview**

Por isso, quando o merge vai para a main e é feito push, a Vercel automaticamente promove para produção.

## O GitHub detecta branches automaticamente

Quando você faz push de uma nova branch, o GitHub exibe um banner no repositório: "nome-da-branch had recent pushes — Compare & pull request". Isso facilita criar PRs sem precisar navegar manualmente. O instrutor menciona isso como alternativa ao fluxo CLI.

## Verificação em produção

O instrutor finaliza testando a feature (animação de shake feedback) diretamente na URL de produção. Ele diferencia claramente:
- Build de preview (localhost durante desenvolvimento)
- Build de produção (URL final da Vercel)

Isso reforça que o deploy não é só "subir código" — é verificar que funciona no ambiente real.