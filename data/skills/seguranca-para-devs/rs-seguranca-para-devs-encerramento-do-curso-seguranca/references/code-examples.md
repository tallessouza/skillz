# Code Examples: Estrategia de Adocao Incremental de Seguranca

## Exemplo de plano incremental de seguranca

Este skill nao contem codigo tecnico — e um skill de estrategia e priorizacao. Os exemplos abaixo mostram como aplicar a mentalidade incremental na pratica.

### Semana 1: Headers de seguranca (rapido, alto impacto)

```typescript
// Express.js — adicionar helmet como primeiro passo
import helmet from 'helmet'

app.use(helmet())
```

Uma linha. Ja melhora significativamente a postura de seguranca da aplicacao.

### Semana 2: Validacao de input

```typescript
// Adicionar zod para validar inputs de API
import { z } from 'zod'

const createUserSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  name: z.string().min(2).max(100),
})

app.post('/users', (req, res) => {
  const result = createUserSchema.safeParse(req.body)
  if (!result.success) {
    return res.status(400).json({ errors: result.error.issues })
  }
  // proceder com dados validados
})
```

### Semana 3: Rate limiting

```typescript
import rateLimit from 'express-rate-limit'

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 5, // 5 tentativas
  message: 'Muitas tentativas de login. Tente novamente em 15 minutos.',
})

app.post('/login', loginLimiter, loginHandler)
```

### Template: Checklist de priorizacao para equipe

```markdown
# Checklist de Seguranca — [Nome do Projeto]

## Prioridade Critica (fazer primeiro)
- [ ] Autenticacao segura (bcrypt/argon2 para senhas)
- [ ] Autorizacao por rota/recurso
- [ ] Protecao contra SQL injection (queries parametrizadas)

## Prioridade Alta (segunda rodada)
- [ ] Validacao de todos os inputs de usuario
- [ ] Protecao contra XSS (sanitizacao de output)
- [ ] HTTPS em todos os ambientes

## Prioridade Media (terceira rodada)
- [ ] Headers de seguranca (helmet/equivalente)
- [ ] CORS configurado corretamente
- [ ] Rate limiting em endpoints sensiveis

## Prioridade Baixa (melhoria continua)
- [ ] CSP (Content Security Policy) refinada
- [ ] Logging de eventos de seguranca
- [ ] Monitoramento de dependencias vulneraveis
```

### Template: Documento para compartilhar com a equipe

```markdown
# O que aprendi sobre seguranca — [Seu Nome]

## Resumo
Concluí o treinamento de seguranca para devs. Aqui estao as tecnicas
que quero implementar no nosso projeto, em ordem de prioridade.

## Proximos passos
1. **Esta semana:** [tecnica escolhida]
2. **Proximo sprint:** [segunda tecnica]
3. **Este mes:** [terceira tecnica]

## Como a equipe pode ajudar
- Code review com foco em [area especifica]
- Adotar [pratica] como padrao do time
```