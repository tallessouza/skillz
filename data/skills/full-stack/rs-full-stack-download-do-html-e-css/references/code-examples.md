# Code Examples: Setup de Projeto Template

## Estrutura HTML do template

```html
<!DOCTYPE html>
<html lang="pt-br">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <link rel="stylesheet" href="style.css">
  <title>Convert</title>
</head>
<body>
  <!-- Logo -->
  <header>
    <img src="img/logo.svg" alt="Logo Convert">
  </header>

  <!-- Formulario principal -->
  <main>
    <form>
      <label for="amount">Valor</label>
      <input type="text" id="amount" placeholder="Digite o valor">

      <label for="currency">Moeda</label>
      <select id="currency">
        <option value="USD">Dólar americano</option>
        <option value="EUR">Euro</option>
        <option value="GBP">Libra esterlina</option>
      </select>

      <button type="submit">Converter para Reais</button>
    </form>
  </main>

  <!-- Footer oculto — aparece via JavaScript -->
  <footer>
    <p>Resultado da conversão aparece aqui</p>
  </footer>
</body>
</html>
```

## CSS do footer (oculto por padrao)

```css
footer {
  display: none; /* Sera alterado para block/flex via JavaScript */
}
```

## Estrutura de pastas do template

```
convert/
├── img/
│   ├── background.png    # Imagem de fundo
│   ├── logo.svg          # Logo do projeto
│   ├── icon-dollar.svg   # Icone dolar
│   ├── icon-euro.svg     # Icone euro
│   └── icon-pound.svg    # Icone libra
├── style.css             # Todos os estilos
└── index.html            # Pagina principal
```

## Comandos para setup

```bash
# Download via CLI (alternativa ao botao do GitHub)
wget https://github.com/skillz-education/convert-template/archive/refs/heads/main.zip
unzip main.zip
rm main.zip
mv convert-template-main convert

# Abrir no VSCode
code convert/
```

## Instalacao do Live Server via CLI

```bash
# Se preferir instalar extensoes via terminal
code --install-extension ritwickdey.LiveServer
```

## Verificacao rapida pos-setup

```bash
# Confirmar que todos os arquivos existem
ls convert/
# Esperado: img/  index.html  style.css

ls convert/img/
# Esperado: background.png  logo.svg  icon-dollar.svg  icon-euro.svg  icon-pound.svg
```