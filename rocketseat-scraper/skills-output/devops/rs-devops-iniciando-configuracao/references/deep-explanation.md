# Deep Explanation: Pipeline CI/CD — Docker Hub → AWS ECR

## Por que migrar do Docker Hub para o ECR?

O instrutor explica que o AppRunner (servico AWS que executa a aplicacao) **nao suporta Docker Hub como provider**. Ele aceita apenas o ECR (Elastic Container Registry) da propria AWS. Portanto, a migracao nao e opcional — e requisito tecnico.

## Por que OIDC em vez de Access Tokens?

O instrutor destaca: "poderia gerar uma chave na AWS e colocar aqui? Poderia, porem como a AWS fornece outras formas de login que sao mais seguras, vamos optar por esta forma."

A abordagem OIDC (OpenID Connect):
- Cria um Identity Provider do GitHub dentro da AWS
- Nao trafega nenhum token entre GitHub e AWS
- A AWS valida a identidade do GitHub Runner diretamente
- Elimina necessidade de rotacao de secrets

Access tokens sao menos seguros porque:
- Precisam ser gerados e armazenados como secrets
- Podem vazar em logs
- Precisam de rotacao periodica
- Dao acesso conforme escopo do token (geralmente amplo demais)

## Separacao entre Credencial e Login

O instrutor enfatiza: "Uma coisa e configurar as credenciais, outra coisa e voce logar dentro do servico."

Sao dois steps distintos com responsabilidades diferentes:

1. **`configure-aws-credentials`** — estabelece a conexao autenticada com a AWS via OIDC. Configura a role que define QUAIS servicos voce pode acessar.

2. **`amazon-ecr-login`** — usa a conexao ja autenticada para fazer login especificamente no ECR. Exporta o registry URL para steps posteriores.

Analogia: e como ter um cracha (credencial) e depois passar pela catraca de um andar especifico (login no servico).

## Por que a Role e escopada?

O instrutor explica: "A gente vai criar uma role que nao vai dar acesso a sua conta inteira da AWS. Ela simplesmente vai te fornecer acesso dentro de especificos servicos."

Isso significa:
- A role criada no IAM tera policies apenas para ECR (e depois AppRunner)
- Se a pipeline for comprometida, o atacante so acessa esses servicos
- Principio do menor privilegio aplicado na pratica
- Se a role NAO incluir ECR na policy, o step de login vai falhar

## Infraestrutura como Codigo (Terraform)

O instrutor decide NAO criar recursos pela interface da AWS. Todos os recursos serao provisionados via Terraform:
- Identity Provider (OIDC)
- IAM Roles com policies escopadas
- ECR Repository

Justificativa implicita: reprodutibilidade, versionamento, e auditabilidade.

## Ordem dos Steps na Pipeline

A pipeline final tera esta sequencia:
1. Checkout
2. Yarn install
3. Testes
4. Gerar tag de versao
5. **Configure AWS Credentials** (OIDC)
6. **Login ECR**
7. **Docker Build + Push** (usando outputs do login)
8. **Deploy AppRunner** (instrucao de deploy)

O instrutor monta a "casca" (steps 5-6) sem valores reais, porque os recursos AWS ainda nao existem. Os valores serao preenchidos apos o Terraform criar a infraestrutura.

## O ID no Step de Login ECR

O instrutor adiciona `id: login-ecr` no step de login porque:
- Steps posteriores (build/push) precisam do registry URL
- GitHub Actions so permite referenciar outputs de steps que tem ID
- Acesso via `${{ steps.login-ecr.outputs.registry }}`