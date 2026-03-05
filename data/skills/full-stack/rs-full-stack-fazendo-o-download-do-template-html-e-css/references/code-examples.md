# Code Examples: Setup de Projeto a partir de Template GitHub

## Estrutura do template Refund

```
refund-template/
├── index.html          # Estrutura completa da aplicacao
├── styles.css          # Todas as regras CSS
└── assets/
    ├── logo.svg        # Logo da aplicacao (header)
    ├── food.svg        # Icone categoria alimentacao
    ├── service.svg     # Icone categoria servico
    ├── transport.svg   # Icone categoria transporte
    └── accommodation.svg  # Icone categoria acomodacao
```

## Fluxo completo: do GitHub ao navegador

### Via GitHub Template

```bash
# 1. Apos criar repo via "Use this template"
git clone https://github.com/seu-usuario/refund.git

# 2. Abrir no VSCode
cd refund
code .

# 3. No VSCode: botao direito em index.html → Open with Live Server
```

### Via Download ZIP

```bash
# 1. Apos download
cd ~/Downloads

# 2. Descompactar
unzip refund-template-main.zip

# 3. Limpar
rm refund-template-main.zip

# 4. Renomear
mv refund-template-main refund

# 5. Mover para pasta de projetos
mv refund ~/projetos/

# 6. Abrir no VSCode
code ~/projetos/refund
```

## Funcionalidades visuais do template

### Formulario de entrada

O HTML ja contem:
- Input de texto para nome da despesa (ex: "Almoco")
- Select com categorias (Alimentacao, Transporte, Acomodacao, Servico)
- Input de valor monetario (sera formatado via JS)
- Botao "Adicionar"

### Lista de despesas

Cada item na lista exibe:
- Imagem SVG correspondente a categoria
- Nome da despesa
- Categoria selecionada
- Valor formatado
- Botao X para remover

### Rodape/resumo

- Quantidade de itens na lista
- Valor total de todas as despesas

## Configuracao do Live Server (settings.json do VSCode)

```json
{
  "liveServer.settings.port": 5500,
  "liveServer.settings.doNotShowInfoMsg": true,
  "liveServer.settings.doNotVerifyTags": true
}
```

## Verificacao rapida

```bash
# Confirmar que todos os arquivos existem
ls -la ~/projetos/refund/
# Deve mostrar: index.html, styles.css, assets/

ls -la ~/projetos/refund/assets/
# Deve mostrar: logo.svg, food.svg, service.svg, transport.svg, accommodation.svg
```