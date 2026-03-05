# Code Examples: Continuous Delivery

## Pipeline completa CI + CD (GitHub Actions)

```yaml
name: CI/CD Pipeline

on:
  push:
    branches: [main]

jobs:
  # ===== CI =====
  ci:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Install dependencies
        run: npm ci
      - name: Run tests
        run: npm test
      - name: Build
        run: npm run build
      - name: Upload artifact
        uses: actions/upload-artifact@v4
        with:
          name: build
          path: dist/

  # ===== CD - Staging =====
  deploy-staging:
    needs: ci
    runs-on: ubuntu-latest
    environment: staging
    steps:
      - name: Download artifact
        uses: actions/download-artifact@v4
        with:
          name: build
      - name: Deploy to staging
        run: ./scripts/deploy.sh staging

  # ===== CD - Smoke Test =====
  smoke-test:
    needs: deploy-staging
    runs-on: ubuntu-latest
    steps:
      - name: Run smoke tests
        run: |
          curl -f https://staging.example.com/health || exit 1
          npm run test:smoke -- --env staging

  # ===== CD - Production =====
  deploy-production:
    needs: smoke-test
    runs-on: ubuntu-latest
    environment: production  # Gate manual configurado no GitHub
    steps:
      - name: Download artifact
        uses: actions/download-artifact@v4
        with:
          name: build
      - name: Deploy to production
        run: ./scripts/deploy.sh production
```

## Pipeline com Canary Deployment

```yaml
  deploy-canary:
    needs: smoke-test
    runs-on: ubuntu-latest
    environment: production
    steps:
      - name: Deploy canary (10% traffic)
        run: |
          kubectl set image deployment/app app=myapp:${{ github.sha }}
          kubectl annotate deployment/app traffic-weight=10

      - name: Monitor canary (5 min)
        run: |
          sleep 300
          ERROR_RATE=$(curl -s https://metrics.example.com/error-rate)
          if [ $(echo "$ERROR_RATE > 5" | bc) -eq 1 ]; then
            echo "Error rate too high: $ERROR_RATE%"
            kubectl rollout undo deployment/app
            exit 1
          fi

      - name: Promote to 100%
        run: kubectl annotate deployment/app traffic-weight=100
```

## Pipeline Terraform (Infraestrutura)

```yaml
name: Infrastructure Pipeline

on:
  push:
    branches: [main]
    paths: ['infra/**']

jobs:
  # CI = plan (validacao)
  plan:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Terraform Init
        run: terraform init
        working-directory: infra/
      - name: Terraform Plan
        run: terraform plan -out=tfplan
        working-directory: infra/
      - name: Upload plan
        uses: actions/upload-artifact@v4
        with:
          name: tfplan
          path: infra/tfplan

  # CD = apply (entrega de valor)
  apply:
    needs: plan
    runs-on: ubuntu-latest
    environment: production  # Aprovacao manual
    steps:
      - uses: actions/checkout@v4
      - name: Download plan
        uses: actions/download-artifact@v4
        with:
          name: tfplan
          path: infra/
      - name: Terraform Apply
        run: terraform apply tfplan
        working-directory: infra/
```

## Rollback automatizado pos-deploy

```yaml
  post-deploy-validation:
    needs: deploy-production
    runs-on: ubuntu-latest
    steps:
      - name: Health check
        id: health
        continue-on-error: true
        run: |
          for i in {1..5}; do
            HTTP_STATUS=$(curl -s -o /dev/null -w "%{http_code}" https://app.example.com/health)
            if [ "$HTTP_STATUS" != "200" ]; then
              echo "Health check failed: $HTTP_STATUS"
              exit 1
            fi
            sleep 10
          done

      - name: Rollback if failed
        if: steps.health.outcome == 'failure'
        run: |
          echo "Smoke test failed, triggering rollback"
          kubectl rollout undo deployment/app
          # Ou: deploy da versao anterior
          # ./scripts/deploy.sh production --version $PREVIOUS_VERSION
```

## Ambientes espelhados — docker-compose para staging

```yaml
# docker-compose.staging.yml
# Mesmas ferramentas que producao, escala menor
version: '3.8'
services:
  app:
    image: myapp:${VERSION}
    replicas: 1  # Producao teria 3+
    environment:
      - NODE_ENV=staging
      - DATABASE_URL=${STAGING_DB_URL}

  db:
    image: postgres:15  # Mesma versao que producao
    volumes:
      - staging-data:/var/lib/postgresql/data
```

## Exemplo de gate manual (aprovacao de deploy)

```yaml
# No GitHub Actions, configurar Environment com reviewers
# Settings > Environments > production > Required reviewers

deploy-production:
  environment:
    name: production
    url: https://app.example.com
  # GitHub vai pausar aqui ate alguem aprovar
  # Isso e o "manual" que o instrutor menciona
  # O fluxo de implantacao em si e automatizado
```