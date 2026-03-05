# Code Examples: O que é ser Dev

> Esta aula e conceitual — nao contem codigo. Os exemplos abaixo ilustram as areas mencionadas para dar contexto pratico.

## Front-end — Exemplo visual

```html
<!-- O que o usuario ve e interage -->
<button id="login-btn" class="btn-primary">
  Entrar
</button>

<script>
  // Front-end: interacao do usuario
  document.getElementById('login-btn')
    .addEventListener('click', () => {
      // Envia dados para o back-end
      fetch('/api/login', {
        method: 'POST',
        body: JSON.stringify({ email, password })
      })
    })
</script>
```

## Back-end — Regras de negocio

```javascript
// Back-end: logica invisivel, regras de negocio
app.post('/api/login', async (req, res) => {
  const { email, password } = req.body

  // Regra de negocio: verificar credenciais
  const user = await database.findUserByEmail(email)

  if (!user || !await verifyPassword(password, user.passwordHash)) {
    return res.status(401).json({ error: 'Credenciais invalidas' })
  }

  // Regra de negocio: gerar sessao
  const token = generateSessionToken(user.id)
  return res.json({ token })
})
```

## Full-stack — Ambos juntos

O desenvolvedor full-stack entende e trabalha em ambas as pontas:
- Cria a interface (front-end)
- Implementa a logica (back-end)
- Conecta banco de dados
- Deploy da aplicacao completa

## Areas mencionadas na aula

| Area | Exemplo pratico |
|------|----------------|
| Web | Site de e-commerce com carrinho de compras |
| Mobile | App de delivery no celular |
| Dados | Dashboard de vendas com graficos e metricas |
| IA | Chatbot que responde perguntas automaticamente |
| IoT | Ar-condicionado controlado por app Wi-Fi |
| Negocios | SaaS startup — produto tech + modelo de negocio |
| Analista | Documento de requisitos para novo sistema |