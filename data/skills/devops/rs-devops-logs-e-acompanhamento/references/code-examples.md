# Code Examples: Logs e Acompanhamento

## Exemplo completo do ci.yml com espera e check

```yaml
name: CI/CD Pipeline

on:
  push:
    branches: [main]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v4

      - name: Run tests
        run: npm test

      - name: Configure AWS credentials
        uses: aws-actions/configure-aws-credentials@v4
        with:
          aws-access-key-id: ${{ secrets.AWS_ACCESS_KEY_ID }}
          aws-secret-access-key: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
          aws-region: us-east-1

      - name: Login to ECR
        id: login-ecr
        uses: aws-actions/amazon-ecr-login@v2

      - name: Build Docker Image
        run: |
          docker build -t ${{ steps.login-ecr.outputs.registry }}/skillz-api:${{ github.sha }} .

      - name: Push Docker Image
        run: |
          docker push ${{ steps.login-ecr.outputs.registry }}/skillz-api:${{ github.sha }}

      - name: Tag as latest
        run: |
          docker tag \
            ${{ steps.login-ecr.outputs.registry }}/skillz-api:${{ github.sha }} \
            ${{ steps.login-ecr.outputs.registry }}/skillz-api:latest

      - name: Push latest tag
        run: |
          docker push ${{ steps.login-ecr.outputs.registry }}/skillz-api:latest

      - name: Deploy to AppRunner
        id: deployAppRunner
        uses: awslabs/amazon-app-runner-deploy@main
        with:
          service: skillz-api
          image: ${{ steps.login-ecr.outputs.registry }}/skillz-api:${{ github.sha }}
          access-role-arn: ${{ secrets.APPRUNNER_ROLE_ARN }}
          region: us-east-1
          waitForServiceStabilitySeconds: 180

      - name: AppRunner Check
        run: |
          echo "AppRunner running at: ${{ steps.deployAppRunner.outputs.service-url }}"
```

## Versao otimizada com --all-tags (licao de casa)

```yaml
      - name: Build and tag Docker Image
        env:
          ECR_REGISTRY: ${{ steps.login-ecr.outputs.registry }}
          IMAGE_NAME: skillz-api
        run: |
          docker build \
            -t $ECR_REGISTRY/$IMAGE_NAME:${{ github.sha }} \
            -t $ECR_REGISTRY/$IMAGE_NAME:latest \
            .

      - name: Push all tags
        env:
          ECR_REGISTRY: ${{ steps.login-ecr.outputs.registry }}
          IMAGE_NAME: skillz-api
        run: |
          docker push --all-tags $ECR_REGISTRY/$IMAGE_NAME
```

Nesta versao:
- `docker build` recebe multiplas flags `-t` para criar ambas as tags de uma vez
- `docker push --all-tags` envia todas as tags em um unico comando
- Reduz de 4 comandos (build, push, tag, push) para 2 (build, push)

## Atualizando teste ao mudar resposta da aplicacao

Ao alterar a resposta do servico (ex: "Hello World" para "Ola, Skillz City"), o teste automatizado tambem deve ser atualizado:

```typescript
// src/app.service.ts
@Injectable()
export class AppService {
  getHello(): string {
    return 'Olá, Skillz City';
  }
}
```

```typescript
// src/app.controller.spec.ts
describe('AppController', () => {
  it('should return greeting', () => {
    expect(appController.getHello()).toBe('Olá, Skillz City');
  });
});
```

Se o teste nao for atualizado, o pipeline quebrara na etapa de testes — impedindo o deploy.