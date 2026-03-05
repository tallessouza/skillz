# Code Examples: Template Hair Day

## Estrutura de arquivos do template

```
hairday/
├── index.html
└── src/
    ├── assets/
    │   ├── icon1.svg
    │   ├── icon2.svg
    │   └── ...          # Ícones SVG usados na interface
    └── styles/
        ├── index.css    # Arquivo central com @import de todos os outros
        ├── header.css
        ├── form.css
        ├── schedule.css
        └── ...          # Um CSS por componente/seção
```

## Padrão de importação CSS centralizada

```css
/* src/styles/index.css */
@import './header.css';
@import './form.css';
@import './schedule.css';
/* ... demais imports */
```

```html
<!-- index.html — único link de estilos -->
<link rel="stylesheet" href="src/styles/index.css">
```

## Comandos de setup

### Download e organização (terminal)

```bash
# Após download do ZIP
unzip hairday-template-main.zip
rm hairday-template-main.zip
mv hairday-template-main/ hairday/

# Mover para diretório de trabalho
mv hairday/ ~/projetos/js/

# Abrir no VS Code
code ~/projetos/js/hairday
```

### Via Git (alternativa)

```bash
git clone https://github.com/skillz-education/hairday-template.git hairday
cd hairday
code .
```

## Busca no VS Code

### Busca global (todos os arquivos)
- Atalho: `Ctrl+Shift+F` (Windows/Linux) ou `Cmd+Shift+F` (Mac)
- Ícone de lupa na barra lateral esquerda
- Mostra resultados agrupados por arquivo com hierarquia

### Busca no arquivo atual
- Atalho: `Ctrl+F` (Windows/Linux) ou `Cmd+F` (Mac)
- Busca apenas dentro do arquivo aberto

### Exemplo prático do instrutor
```
Busca: "noite" (com N minúsculo)
Resultado: index.html, linha X — "Noite" com N maiúsculo incorreto
Ação: corrigir diretamente clicando no resultado
```

## Interface da aplicação Hair Day

A aplicação possui:

```
┌─────────────────────────────────────┐
│           HAIR DAY                  │
├─────────────────────────────────────┤
│  📅 Data: [__/__/____]             │
│                                     │
│  Horários disponíveis:              │
│  ┌─────────┬─────────┬──────────┐  │
│  │  Manhã  │  Tarde  │  Noite   │  │
│  │  09:00  │  13:00  │  18:00   │  │
│  │  10:00  │  14:00  │  19:00   │  │
│  │  11:00  │  15:00  │  20:00   │  │
│  └─────────┴─────────┴──────────┘  │
│                                     │
│  Nome: [________________]           │
│                                     │
│  [      AGENDAR       ]            │
├─────────────────────────────────────┤
│  Agendamentos:                      │
│  ┌─────────────────────────────┐   │
│  │ Cliente X - 09:00  [🗑️]    │   │
│  │ Cliente Y - 14:00  [🗑️]    │   │
│  └─────────────────────────────┘   │
└─────────────────────────────────────┘
```

Funcionalidades a implementar com JavaScript:
1. Seleção de data no campo de calendário
2. Exibição de horários disponíveis por período
3. Seleção de horário
4. Preenchimento do nome do cliente
5. Botão "Agendar" — salvar agendamento
6. Listagem de agendamentos do dia
7. Botão de deletar — cancelar agendamento