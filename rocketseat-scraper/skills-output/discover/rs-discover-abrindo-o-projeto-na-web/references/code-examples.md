# Code Examples: Abrindo o Projeto na Web

## Comparacao visual: file:// vs http://

### Abrindo com dois cliques (ERRADO para desenvolvimento)

```
Explorador de arquivos → dois cliques em index.html

URL no browser:
file:///Users/seu-nome/projetos/meu-site/index.html
      ^^^^
      Protocolo file — sem servidor
```

### Abrindo com Live Server (CORRETO)

```
VS Code → botao direito em index.html → Open with Live Server

URL no browser:
http://127.0.0.1:5500/index.html
^^^^   ^^^^^^^^^  ^^^^ ^^^^^^^^^^
|      |          |    Arquivo servido
|      |          Porta (comodo da casa)
|      IP local (endereco da casa = sua maquina)
Protocolo HTTP (regras de transferencia)
```

## Instalando Live Server no VS Code

```
1. Abrir VS Code
2. Ctrl+Shift+X (abrir extensoes)
3. Buscar "Live Server"
4. Instalar a extensao de Ritwick Dey
5. Reiniciar VS Code se necessario
```

## Estrutura minima de projeto para testar

```html
<!-- index.html -->
<!DOCTYPE html>
<html lang="pt-br">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Meu Projeto</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>
    <h1>Hello World</h1>
</body>
</html>
```

```css
/* style.css */
h1 {
    color: blue;
}
```

## Portas comuns para referencia

```
Porta 80    → HTTP padrao (implicita, nao aparece na URL)
Porta 443   → HTTPS padrao (implicita, nao aparece na URL)
Porta 5500  → Live Server (VS Code)
Porta 3000  → React (create-react-app), Next.js
Porta 5173  → Vite
Porta 8080  → Servidores genericos, Vue CLI
```

## Troubleshooting comum

### Live Server nao aparece no menu de contexto
```
- Verificar se a extensao esta instalada e habilitada
- Verificar se abriu uma PASTA no VS Code (nao um arquivo solto)
- Reiniciar VS Code
```

### Porta 5500 ja em uso
```
- Fechar outra instancia do Live Server
- Ou alterar porta: Settings → Live Server → Port → mudar para 5501
```

### Pagina nao atualiza automaticamente
```
- Verificar se salvou o arquivo (Ctrl+S)
- Verificar console do browser para erros
- Fechar e reabrir Live Server
```

## Equivalente sem VS Code (terminal)

```bash
# Se precisar de um servidor HTTP simples sem VS Code:

# Python 3
python3 -m http.server 5500

# Node.js (com npx)
npx serve -p 5500

# Ambos servem a pasta atual em http://localhost:5500
```