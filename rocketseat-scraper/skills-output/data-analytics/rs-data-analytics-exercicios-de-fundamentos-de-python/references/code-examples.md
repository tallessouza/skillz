# Code Examples: Exercicios de Fundamentos de Python

## Setup do ambiente no Google Colab

Nao ha codigo especifico nesta aula — o foco e operacional (download, upload, execucao).

## Como abrir notebook no VS Code via terminal

```bash
# Instalar extensao Jupyter (se ainda nao tiver)
code --install-extension ms-toolsai.jupyter

# Abrir o notebook
code exercicios.ipynb
```

## Como abrir notebook no Cursor

```bash
# Abrir diretamente
cursor exercicios.ipynb
```

## Estrutura tipica de um notebook de exercicios

```python
# Celula markdown (questao):
# ## Exercicio 1
# Crie uma variavel chamada `nome` com seu nome e imprima o valor.

# Celula de codigo (resposta do aluno):
nome = "Dev"
print(nome)
```

## Executando celulas

```python
# Shift+Enter executa a celula atual e avanca para a proxima
# Ctrl+Enter executa a celula atual sem avancar

# No Colab, tambem pode clicar no botao de play ao lado da celula
```

## Verificando ambiente Python no terminal

```bash
# Verificar se Python esta instalado
python --version
# ou
python3 --version

# Verificar se Jupyter esta instalado
jupyter --version
```