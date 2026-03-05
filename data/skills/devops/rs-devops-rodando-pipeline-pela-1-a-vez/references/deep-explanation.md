# Deep Explanation: Rodando Pipeline pela 1a Vez

## Por que inline policy e nao managed policy?

O instrutor usa inline policies porque estao diretamente atreladas a role — quando a role e deletada, a policy vai junto. Para roles de automacao como o TF role, isso e mais seguro que managed policies que podem ficar orfas.

## Principio de menor privilegio incremental

O instrutor enfatiza: "a boa pratica e que seja liberado de acordo com os recursos que voce tenha." Isso significa:
- Comece com ZERO permissoes
- Adicione apenas o que o Terraform precisa AGORA (ECR + IAM)
- Quando adicionar S3, expanda a policy
- Nunca comece com `*` em tudo

A abordagem e copiar a inline policy de uma role similar (SR role) e adaptar, removendo statements desnecessarios. No caso, o Statement 3 foi removido porque nao era relevante para o TF role naquele momento.

## O problema do estado (409 - Resource Already Exists)

Quando o Terraform roda `apply` sem conhecer recursos existentes (estado vazio), ele tenta CRIAR tudo do zero. Se os recursos ja existem na AWS (criados manualmente ou por outro state), a AWS retorna 400/409.

Solucoes possiveis:
1. **terraform import** — importar recurso existente no estado
2. **Migrar estado para S3** — centralizar o state file (abordado na proxima aula)
3. **Criar em outra regiao** — funciona mas nao e solucao real (apenas demonstracao)

O instrutor menciona que mudar a regiao (ex: `us-east-1` em vez de `us-east-2`) faria os recursos serem criados porque nao existem la. Isso ilustra que recursos AWS sao regionais.

## Secrets vs Variables no GitHub Actions

O instrutor faz uma distincao clara:
- **Secrets:** Valores que NUNCA devem aparecer em logs. GitHub Actions mascara automaticamente (`***`). Usar para: ARNs, regioes (podem revelar infraestrutura), credentials.
- **Variables:** Valores que podem ser publicos. Aparecem em logs normalmente. Usar para: versoes de ferramentas, flags de configuracao.

A sintaxe difere: `secrets.NOME` vs `vars.NOME`.

## Fluxo completo da pipeline neste ponto

```
git push
  → GitHub Actions trigger
    → Assume TF role via OIDC
      → terraform init
        → terraform fmt (validacao de formato)
          → terraform plan (preview)
            → terraform apply --auto-approve
              → ERRO 409 (recursos existem, estado nao conhece)
```

O pipeline funciona ate o apply. O problema nao e de permissao (resolvido com inline policy) nem de segredos (resolvido com secrets/vars), mas de ESTADO — que sera resolvido com S3 backend.

## Autocomplete de secrets no VS Code

O instrutor menciona que o autocomplete de secrets no workflow YAML vem de uma extensao do VS Code que conecta na conta GitHub e lista secrets/variables disponiveis. Isso nao e funcionalidade nativa.