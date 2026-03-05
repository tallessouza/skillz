# Deep Explanation: Boas Praticas em Pipelines CI/CD

## Por que extrair valores para secrets e variaveis?

O instrutor destaca que o problema principal nao e apenas seguranca — e tambem **organizacao e reutilizacao**. Ele classifica os valores em tres categorias:

### 1. Informacoes cardeais sensiveis
A role AWS contem o numero da conta. O instrutor chama explicitamente de "informacao cardenal sensivel" porque expoe diretamente a identidade da sua infraestrutura. Qualquer pessoa com acesso ao repositorio (se publico) ou a um leak do YAML teria o ARN completo da role.

### 2. Valores reutilizaveis
A regiao AWS e o nome do servico sao valores que "potencialmente vamos usar em varios lugares". Hardcoda-los significa que uma mudanca de regiao exige editar N arquivos YAML — exatamente o tipo de inconsistencia que gera bugs em deploy.

### 3. Distincao entre secrets e variables
O instrutor faz uma distincao clara:
- **Secrets**: valores que nao devem ser visiveis (roles, tokens, regioes) → `secrets.X`
- **Variables**: valores reutilizaveis mas nao-sensiveis (nome do servico) → `vars.X`

No GitHub, secrets sao mascaradas nos logs. Variables aparecem em texto claro. Essa distincao e importante para debugging — voce QUER ver o nome do servico nos logs, mas NAO quer ver o ARN da role.

## Coerencia entre IAC e CI/CD

O instrutor menciona que no modulo anterior (IAC com Terraform/GitHub Actions), ja foram aplicadas boas praticas de variaveis. Ele enfatiza que o pipeline de CI/CD deve seguir o mesmo padrao para "manter a coerencia com o projeto". Isso significa:

- Se o Terraform usa `var.region`, o pipeline usa `secrets.AWS_REGION`
- Se o Terraform usa `var.service_name`, o pipeline usa `vars.SERVICE_NAME`
- Drift entre IAC e CI/CD e uma fonte comum de bugs silenciosos

## Limpeza de secrets obsoletas

O instrutor demonstra deletar `DOCKERHUB_TOKEN` e `DOCKERHUB_USERNAME` porque o projeto migrou para ECR. Secrets abandonadas sao:
- Risco de seguranca (tokens ativos sem uso)
- Confusao para novos devs ("isso ainda e usado?")
- Poluicao no painel de configuracao

## Processo no GitHub

O fluxo demonstrado pelo instrutor:
1. Settings → Secrets and Variables → Actions
2. Deletar secrets obsoletas primeiro (limpeza)
3. Criar novas secrets (AWS_LOGIN_ROLE, AWS_REGION, AWS_APPRUNNER_ROLE)
4. Criar novas variables (SERVICE_NAME)
5. Atualizar o YAML do workflow para referenciar

## Convencao de nomenclatura

O instrutor enfatiza: "sempre em maiusculo, como se fosse uma constante". Isso segue a convencao universal de environment variables e facilita a distincao visual entre valores dinamicos e literais no YAML.