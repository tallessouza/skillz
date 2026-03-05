# Code Examples: Opcoes de Deploy Back-end

## Nota sobre esta aula

Esta aula e predominantemente conceitual — o instrutor apresenta opcoes de deploy sem mostrar codigo ou configuracao. Os exemplos praticos de deploy no Render sao cobertos nas aulas seguintes do modulo.

## Stack de deploy recomendada para o curso

```
Backend (Fastify/Node.js) → Render.com (free tier)
Banco de dados (PostgreSQL) → Neon (free tier permanente, 500MB)
Frontend (Next.js)         → Vercel (coberto em outra aula)
```

## Comparativo de setup por plataforma

### VPS Raw (EC2/Compute Engine/Hetzner)
```bash
# Voce precisa configurar tudo manualmente:
# 1. Provisionar servidor Linux
# 2. Instalar Node.js, npm, PM2 ou similar
# 3. Configurar nginx como reverse proxy
# 4. Configurar SSL com Let's Encrypt
# 5. Configurar firewall (ufw/iptables)
# 6. Configurar backup automatizado
# 7. Configurar monitoramento (Prometheus, Grafana, etc)
# 8. Configurar log aggregation
# 9. Configurar CI/CD para deploy automatico
```

### Servico Gerenciado (Render/Railway/Fly.io)
```bash
# Processo tipico:
# 1. Conectar repositorio Git
# 2. Definir build command (npm install && npm run build)
# 3. Definir start command (npm start)
# 4. Configurar variaveis de ambiente
# 5. Deploy automatico a cada push
# Backup, SSL, monitoramento basico ja inclusos
```

## Links das plataformas mencionadas

| Plataforma | URL |
|-----------|-----|
| Render | render.com |
| Railway | railway.app |
| Fly.io | fly.io |
| Neon | neon.tech |
| Amazon EC2 | aws.amazon.com/ec2 |
| Google Compute Engine | cloud.google.com/compute |
| Hetzner | hetzner.com |
| Latitude | latitude.sh |