# Code Examples: Linguagem de Programacao

## Exemplo 1: Desbloqueio do celular (condicional IF/ELSE)

Exemplo original do instrutor em JavaScript:

```javascript
// SE o que o usuario digitou for igual a senha cadastrada
if (input === password) {
  // Desbloqueia o telefone
  unlockPhone()
} else {
  // Mostra mensagem pedindo para tentar de novo
  showMessage("Try again")
}
```

### Decompondo cada elemento:

| Termo no codigo | Significado |
|----------------|-------------|
| `if` | SE (condicional — avalia se algo e verdadeiro) |
| `else` | SE NAO (caminho alternativo quando a condicao e falsa) |
| `input` | Entrada — o que o usuario digitou |
| `password` | Senha — o valor que o celular ja conhece |
| `===` | Comparacao de igualdade (e igual a?) |
| `unlockPhone()` | Funcao que desbloqueia o telefone |
| `showMessage()` | Funcao que mostra mensagem ao usuario |
| `"Try again"` | Texto: "Tente de novo" |

### Variacao: Login em um site

```javascript
if (emailDigitado === emailCadastrado && senhaDigitada === senhaCadastrada) {
  redirecionarParaDashboard()
} else {
  mostrarErro("Email ou senha incorretos")
}
```

### Variacao: Verificacao de idade

```javascript
if (idade >= 18) {
  permitirAcesso()
} else {
  mostrarMensagem("Voce precisa ter 18 anos ou mais")
}
```

## Exemplo 2: Input e Output

### Mouse
```
Input:  usuario move o mouse fisicamente
Output: cursor se move na tela
```

### Teclado
```
Input:  usuario pressiona teclas
Output: caracteres aparecem na tela OU sao armazenados
```

### Aplicacao web
```
Input:  usuario clica no botao "Enviar"
Output: formulario e processado e mensagem de confirmacao aparece
```

## Exemplo 3: Linguagem binaria (conceitual)

```
Humano escreve:     if (input === password)
                           ↓
Computador traduz:  01001001 01000110 00100000 ...
                           ↓
Hardware executa:   Circuitos ligam/desligam em sequencia
                           ↓
Resultado:          Telefone desbloqueia (ou nao)
```

## Exemplo 4: Mesma logica em diferentes linguagens

### JavaScript
```javascript
if (input === password) {
  unlockPhone()
} else {
  showMessage("Try again")
}
```

### Python
```python
if input == password:
    unlock_phone()
else:
    show_message("Try again")
```

### C#
```csharp
if (input == password) {
    UnlockPhone();
} else {
    ShowMessage("Try again");
}
```

Todas fazem a mesma coisa — a logica e identica, apenas a sintaxe (maneira de escrever) muda. Chaves, parenteses, ponto-e-virgula, indentacao — cada linguagem tem suas regras.