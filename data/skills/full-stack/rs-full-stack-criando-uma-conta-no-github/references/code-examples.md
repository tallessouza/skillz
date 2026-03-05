# Code Examples: Criando uma Conta no GitHub

## Fluxo Completo de Registro

### Tela 1: Pagina Inicial (github.com)

```
Campo: Enter your email
[seu-email@exemplo.com]
[Sign up for GitHub] (botao)
```

### Tela 2: Formulario de Registro

```
Email: seu-email@exemplo.com  (pre-preenchido)
Password: ********             (minimo de complexidade exigido)
Username: seu-username         (deve ser unico)
Email preferences: [ ] (opcional, pode desmarcar)
[Continue]
```

**Regras de senha do GitHub:**
- Minimo 8 caracteres
- Deve incluir numero ou caractere especial
- Nao pode ser senha comum/vazada

**Regras de username:**
- Apenas caracteres alfanumericos e hifens
- Nao pode comecar ou terminar com hifen
- Maximo 39 caracteres
- Deve ser unico

### Tela 3: Verificacao CAPTCHA

```
Puzzle visual — varia para cada usuario
Exemplos:
- "Aponte para onde a mao esta indicando"
- "Selecione todas as imagens com X"
Pode ter multiplas rodadas (ex: "1 de 2", "2 de 2")
[Submit]
```

### Tela 4: Verificacao de E-mail

```
"Enter the code sent to seu-email@exemplo.com"
[_ _ _ _ _ _]  (codigo de 6 digitos)
```

O codigo chega no e-mail cadastrado. Copie e cole no campo.

### Tela 5: Personalizacao (opcional)

```
How many team members? 
(*) Just me
( ) 2-5
( ) 5-10
( ) 10+

Are you a student?
(*) Yes
( ) No

[Continue]
```

Essas perguntas podem ser puladas clicando em "Skip personalization".

### Tela 6: Selecao de Plano

```
[Continue for free]     ← selecione este
[Upgrade to Pro - $X/mo]
```

### Resultado Final

Apos completar todos os passos:
- Conta criada e ativa
- Perfil acessivel em: `https://github.com/seu-username`
- Pronto para criar repositorios, fazer commits remotos, e colaborar

## Proximos Passos Apos Criar a Conta

```bash
# Configurar Git local com o mesmo email da conta GitHub
git config --global user.name "Seu Nome"
git config --global user.email "seu-email@exemplo.com"

# Verificar configuracao
git config --list
```