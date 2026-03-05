# Code Examples: Entrega Contínua de Valor

Esta aula e puramente conceitual — nao contem exemplos de codigo. Os exemplos abaixo ilustram os conceitos discutidos em cenarios praticos.

## Modelo antigo vs modelo CI/CD

### Deploy manual (o que o instrutor critica)

```bash
# Time de infra recebe o binario e faz deploy manual
ssh deploy@production-server
cd /opt/app
# Para a aplicacao
systemctl stop myapp
# Copia o novo binario (recebido por email, Slack, ou pasta compartilhada)
cp /tmp/myapp-v2.3.jar /opt/app/myapp.jar
# Reinicia
systemctl start myapp
# Reza para funcionar
curl http://localhost:8080/health
```

Problemas:
- Binario errado pode ser copiado
- Sem rollback automatico
- Sem visibilidade pro time de dev
- "Na minha maquina funciona" quando falha

### Pipeline CI/CD (o que o modulo vai ensinar)

```yaml
# Exemplo conceitual de pipeline (sera detalhado nas proximas aulas)
# CI: Integra o codigo
ci:
  trigger: push to main
  steps:
    - checkout
    - install dependencies
    - run tests
    - build artifact
    - store artifact

# CD: Entrega o que foi integrado
cd:
  trigger: ci success
  steps:
    - pull artifact
    - deploy to staging
    - run smoke tests
    - deploy to production
    - health check
    - notify team
```

## Fluxo de feedback: antigo vs continuo

### Antigo (ciclo longo)
```
Semana 1: Dev implementa feature
Semana 2: Dev termina, passa pra infra
Semana 3: Infra tenta deploy, falha, volta pra dev
Semana 4: Dev corrige, passa de novo
Semana 5: Deploy funciona
Semana 6: Cliente reporta bug
Semana 7-8: Ciclo se repete para correcao
```

### Continuo (ciclo curto)
```
Dia 1: Dev implementa feature
Dia 1: Pipeline CI roda testes automaticamente
Dia 1: Pipeline CD faz deploy em staging
Dia 1: Smoke tests passam, deploy em producao
Dia 2: Feedback do cliente
Dia 2: Dev corrige e pipeline faz deploy da correcao
```

## Pipeline de infraestrutura (mencionada pelo instrutor)

```
Repositorio de infra (Terraform) → Pipeline roda → Recurso criado no cloud provider
```

```hcl
# Conceito: o que era feito manualmente no modulo anterior
# agora sera trigado por uma pipeline
resource "aws_instance" "app_server" {
  ami           = "ami-xxx"
  instance_type = "t3.micro"
  # ...
}

# Em vez de rodar `terraform apply` localmente,
# a pipeline faz isso automaticamente quando o codigo e mergeado
```

## Os dois vieses do modulo

O instrutor deixa claro que o modulo cobre ambos:

1. **Pipeline de aplicacao**: codigo → build → test → deploy em servidor
2. **Pipeline de infraestrutura**: IaC → pipeline → recursos criados no cloud

Ambos seguem o mesmo principio: automatizar para entregar valor de forma continua.