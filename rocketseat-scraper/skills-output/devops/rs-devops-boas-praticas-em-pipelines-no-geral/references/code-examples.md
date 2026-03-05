# Code Examples: Boas Praticas em Pipelines CI/CD

## Exemplo completo: antes da refatoracao

```yaml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Configure AWS Credentials
        uses: aws-actions/configure-aws-credentials@v4
        with:
          role-to-assume: arn:aws:iam::123456789012:role/github-actions-role
          aws-region: us-east-2

      - name: Login to ECR
        uses: aws-actions/amazon-ecr-login@v2

      - name: Build and Push
        run: |
          docker build -t rocketseat-api .
          docker tag rocketseat-api:latest 123456789012.dkr.ecr.us-east-2.amazonaws.com/rocketseat-api:latest
          docker push 123456789012.dkr.ecr.us-east-2.amazonaws.com/rocketseat-api:latest

      - name: Deploy to App Runner
        run: |
          aws apprunner create-service \
            --service-name rocketseat-api \
            --source-configuration '{"AuthenticationConfiguration":{"AccessRoleArn":"arn:aws:iam::123456789012:role/apprunner-role"}}'
```

## Exemplo completo: apos refatoracao

```yaml
name: Deploy

on:
  push:
    branches: [main]

env:
  AWS_LOGIN_ROLE: ${{ secrets.AWS_LOGIN_ROLE }}
  AWS_REGION: ${{ secrets.AWS_REGION }}
  AWS_APPRUNNER_ROLE: ${{ secrets.AWS_APPRUNNER_ROLE }}
  SERVICE_NAME: ${{ vars.SERVICE_NAME }}

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Configure AWS Credentials
        uses: aws-actions/configure-aws-credentials@v4
        with:
          role-to-assume: ${{ env.AWS_LOGIN_ROLE }}
          aws-region: ${{ env.AWS_REGION }}

      - name: Login to ECR
        uses: aws-actions/amazon-ecr-login@v2

      - name: Build and Push
        run: |
          docker build -t ${{ env.SERVICE_NAME }} .
          docker tag ${{ env.SERVICE_NAME }}:latest ${{ secrets.AWS_ACCOUNT_ID }}.dkr.ecr.${{ env.AWS_REGION }}.amazonaws.com/${{ env.SERVICE_NAME }}:latest
          docker push ${{ secrets.AWS_ACCOUNT_ID }}.dkr.ecr.${{ env.AWS_REGION }}.amazonaws.com/${{ env.SERVICE_NAME }}:latest

      - name: Deploy to App Runner
        run: |
          aws apprunner create-service \
            --service-name ${{ env.SERVICE_NAME }} \
            --source-configuration '{"AuthenticationConfiguration":{"AccessRoleArn":"${{ env.AWS_APPRUNNER_ROLE }}"}}'
```

## Configuracao no GitHub: passo a passo

### Criando secrets

```
Repository → Settings → Secrets and variables → Actions → Secrets tab

New repository secret:
  Name: AWS_LOGIN_ROLE
  Value: arn:aws:iam::123456789012:role/github-actions-role

New repository secret:
  Name: AWS_REGION
  Value: us-east-2

New repository secret:
  Name: AWS_APPRUNNER_ROLE
  Value: arn:aws:iam::123456789012:role/apprunner-ecr-role
```

### Criando variables

```
Repository → Settings → Secrets and variables → Actions → Variables tab

New repository variable:
  Name: SERVICE_NAME
  Value: rocketseat-api
```

### Deletando secrets obsoletas

```
Repository → Settings → Secrets and variables → Actions → Secrets tab

Delete: DOCKERHUB_TOKEN    (migrou para ECR)
Delete: DOCKERHUB_USERNAME (migrou para ECR)
Keep:   GH_TOKEN           (usado pelo semantic-release)
```

## Classificacao de valores: tabela de referencia

| Valor | Tipo | Nome | Justificativa |
|-------|------|------|---------------|
| ARN de role de login | Secret | `AWS_LOGIN_ROLE` | Contem account ID |
| Regiao AWS | Secret | `AWS_REGION` | Expoe infraestrutura |
| ARN de role do App Runner | Secret | `AWS_APPRUNNER_ROLE` | Contem account ID |
| Nome do servico | Variable | `SERVICE_NAME` | Nao-sensivel, util ver nos logs |
| Token do GitHub | Secret | `GH_TOKEN` | Credencial de acesso |
| Account ID AWS | Secret | `AWS_ACCOUNT_ID` | Identificador sensivel |