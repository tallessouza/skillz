# Code Examples: Tecnologias Front-end e Back-end

## HTML — Estrutura basica

```html
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <title>Minha Primeira Pagina</title>
</head>
<body>
  <h1>Bem-vindo</h1>
  <p>Este e um paragrafo de texto.</p>
  <a href="https://rocketseat.com.br">Visite a Rocketseat</a>
  <img src="foto.jpg" alt="Uma foto">
</body>
</html>
```

**O que cada parte faz:**
- `<h1>` — titulo principal (estrutura de texto)
- `<p>` — paragrafo (estrutura de texto)
- `<a>` — link (cria conexao entre paginas)
- `<img>` — imagem (midia)

## CSS — Estilizacao

```css
/* Centralizar conteudo na tela */
body {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
}

/* Texto colorido com fonte diferente */
h1 {
  color: #8257e5;
  font-family: 'Inter', sans-serif;
  text-align: center;
}
```

**Antes do CSS:** texto branco em fundo branco, alinhado a esquerda, fonte serif padrao.
**Depois do CSS:** centralizado, colorido, com fonte moderna.

## JavaScript — Interatividade

```html
<button id="meuBotao">Clique aqui</button>
<p id="mensagem" style="display: none;">Voce clicou!</p>

<script>
  // Quando clicar no botao, mostra a mensagem
  document.getElementById('meuBotao').addEventListener('click', function() {
    const mensagem = document.getElementById('mensagem');
    mensagem.style.display = 'block';
  });
</script>
```

**O que acontece:**
1. Usuario clica no botao (interacao)
2. JavaScript "escuta" o clique (evento)
3. Elemento aparece na tela (resposta visual)

## Exemplo completo: HTML + CSS + JS juntos

```html
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <title>Front-end Completo</title>
  <style>
    /* CSS — aparencia */
    body {
      font-family: 'Inter', sans-serif;
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 2rem;
      background: #121214;
      color: #e1e1e6;
    }

    button {
      background: #8257e5;
      color: white;
      border: none;
      padding: 12px 24px;
      border-radius: 8px;
      cursor: pointer;
      font-size: 16px;
    }

    .hidden { display: none; }
    .visible { display: block; }
  </style>
</head>
<body>
  <!-- HTML — estrutura -->
  <h1>Meu App</h1>
  <p>Clique no botao para ver a magica</p>
  <button id="btn">Mostrar conteudo</button>
  <div id="conteudo" class="hidden">
    <p>Este conteudo apareceu com JavaScript!</p>
  </div>

  <!-- JavaScript — interatividade -->
  <script>
    document.getElementById('btn').addEventListener('click', function() {
      const conteudo = document.getElementById('conteudo');
      const estaVisivel = conteudo.classList.contains('visible');

      if (estaVisivel) {
        conteudo.classList.remove('visible');
        conteudo.classList.add('hidden');
        this.textContent = 'Mostrar conteudo';
      } else {
        conteudo.classList.remove('hidden');
        conteudo.classList.add('visible');
        this.textContent = 'Esconder conteudo';
      }
    });
  </script>
</body>
</html>
```

## Back-end com Node.js — Exemplo conceitual

```javascript
// servidor.js — roda no computador (back-end), NAO no navegador
const http = require('http');

const usuarios = [
  { login: 'maria', senha: '123456' }
];

const servidor = http.createServer((requisicao, resposta) => {
  // Simula verificacao de login
  const { login, senha } = JSON.parse(body);
  
  const usuario = usuarios.find(u => u.login === login && u.senha === senha);
  
  if (usuario) {
    resposta.end(JSON.stringify({ sucesso: true }));
  } else {
    resposta.end(JSON.stringify({ sucesso: false, erro: 'Senha incorreta' }));
  }
});

servidor.listen(3000);
// Rodando com: node servidor.js
```

**Fluxo completo:**
1. Front-end: usuario digita login e senha
2. JavaScript envia dados para o back-end
3. Node.js recebe, consulta banco de dados
4. Verifica se senha esta correta
5. Responde ao front-end: sucesso ou erro
6. Front-end exibe resultado ao usuario

## Variacao: Quando usar cada tecnologia

```
Preciso exibir texto na pagina?          → HTML (<p>, <h1>, <span>)
Preciso exibir uma imagem?               → HTML (<img>)
Preciso criar um link?                   → HTML (<a>)
Preciso centralizar algo?                → CSS (display: flex, text-align)
Preciso mudar a cor?                     → CSS (color, background)
Preciso mudar a fonte?                   → CSS (font-family)
Preciso reagir a um clique?              → JavaScript (addEventListener)
Preciso mostrar/esconder algo?           → JavaScript (classList.toggle)
Preciso guardar dados do usuario?        → Back-end (banco de dados)
Preciso verificar senha?                 → Back-end (regra de negocio)
Preciso rodar JS fora do navegador?      → Node.js
```