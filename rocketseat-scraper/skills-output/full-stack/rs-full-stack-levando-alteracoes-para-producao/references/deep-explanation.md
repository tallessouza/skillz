# Deep Explanation: Levando Alterações para Produção

## O modelo mental do deploy contínuo com Vercel

A Vercel funciona como um **observador da branch main**. Ela não precisa ser acionada manualmente — o simples ato de fazer `git push` na branch configurada como produção dispara todo o pipeline automaticamente.

### Como a Vercel detecta mudanças

Quando você conecta um repositório GitHub à Vercel no setup inicial, ela registra um **webhook** no repositório. Esse webhook notifica a Vercel toda vez que um push acontece. A Vercel então:

1. Recebe a notificação do GitHub
2. Verifica se o push foi na branch configurada como produção (geralmente `main`)
3. Se sim, clona o repositório e executa o build
4. Se o build passa, promove automaticamente para produção

### O conceito de "versão" na Vercel

Cada deploy é uma **versão imutável** do projeto. A Vercel mantém um histórico de todas as versões. A tag "Current" indica qual versão está servindo o tráfego de produção. Se algo der errado, você pode fazer rollback para qualquer versão anterior diretamente pelo dashboard, sem precisar de `git revert`.

### Por que a flag `-u` no primeiro push

O comando `git push -u origin main` faz duas coisas:
1. Envia os commits para o remote `origin` na branch `main`
2. Configura o **upstream tracking** — ou seja, o Git memoriza que a branch local `main` está conectada à branch remota `origin/main`

Após isso, basta digitar `git push` sem argumentos. O Git já sabe para onde enviar.

### Build Logs como ferramenta de diagnóstico

O instrutor destaca que no dashboard da Vercel, dentro de cada deployment, existe a opção **Build Logs**. Isso é equivalente a rodar `npm run build` no seu terminal — mostra todo o output do processo de build, incluindo warnings e erros. Se o deploy falhar, esse é o primeiro lugar para investigar.

### A analogia: local vs produção

O instrutor usa uma comparação visual direta para tornar o conceito tangível:
- **Local:** botão laranja (versão de desenvolvimento)
- **Produção:** botão roxo (versão publicada)

Ao fazer o push, as duas versões se sincronizam. Essa mesma lógica se aplica a qualquer tipo de alteração — features, bugfixes, mudanças visuais. O fluxo é sempre: alterar → testar local → commit → push → verificar produção.

### O ciclo completo

```
Código alterado localmente
  → git add .
  → git commit -m "mensagem descritiva"
  → git push
  → Vercel webhook detecta push na main
  → Vercel executa npm run build
  → Build passa → nova versão em produção
  → Verificar URL de produção com hard refresh
```

Esse é o ciclo fundamental de **deploy contínuo** (CD). Não há etapas manuais na Vercel após o setup inicial — tudo é automatizado pelo push na branch main.

### Rollback e segurança

A versão anterior permanece disponível enquanto o novo build está sendo executado. Se o build falhar, a produção não é afetada — continua servindo a última versão bem-sucedida. Isso dá segurança para fazer push com frequência.