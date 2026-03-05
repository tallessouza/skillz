# Code Examples: Seguranca para Programadores Web

## Nota sobre esta aula

Esta e a aula de boas-vindas do curso. O instrutor nao escreve codigo nesta aula especifica — ele menciona que escreve codigo em todas as DEMAIS aulas. Porem, a partir do framework apresentado, podemos mapear os tipos de exemplos que serao cobertos nos quatro modulos.

## Mapa de exemplos por modulo

### Modulo 1: Autenticacao e HTTP

Exemplos esperados envolvendo:
```http
# Headers de seguranca HTTP
Strict-Transport-Security: max-age=31536000; includeSubDomains
Content-Security-Policy: default-src 'self'
X-Content-Type-Options: nosniff
X-Frame-Options: DENY
```

### Modulo 2: Frontend

Exemplos esperados envolvendo:
```javascript
// XSS prevention
const userInput = document.getElementById('input').value
// ERRADO: innerHTML com input do usuario
element.innerHTML = userInput
// CORRETO: textContent sanitiza automaticamente
element.textContent = userInput
```

### Modulo 3: Backend

Exemplos esperados envolvendo:
```python
# SQL Injection prevention
# ERRADO: concatenacao direta
query = f"SELECT * FROM users WHERE id = {user_id}"

# CORRETO: parametros preparados
query = "SELECT * FROM users WHERE id = %s"
cursor.execute(query, (user_id,))
```

### Modulo 4: Assessment

Exemplos esperados envolvendo ferramentas open source para:
- Scan de dependencias vulneraveis
- Analise estatica de seguranca (SAST)
- Teste de headers HTTP

## Linguagens usadas no curso

O instrutor explicitamente menciona exemplos em:
- Python
- JavaScript (client e Node.js)
- PHP
- Ruby

Reforco: a linguagem e irrelevante — o conceito de seguranca e o mesmo em todas.