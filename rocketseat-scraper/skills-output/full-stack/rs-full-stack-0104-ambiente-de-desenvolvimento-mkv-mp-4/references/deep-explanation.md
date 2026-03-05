# Deep Explanation: Ambiente de Desenvolvimento Node.js

## Por que preparar o ambiente antes de tudo

O instrutor enfatiza que antes de continuar com qualquer aula pratica, o ambiente precisa estar pronto. Isso parece obvio, mas muitos problemas em cursos de programacao vem de ambientes mal configurados — versoes erradas, PATH nao configurado, permissoes incorretas.

## Ferramentas necessarias

### VS Code
Editor de codigo recomendado pelo curso. Leve, extensivel, com terminal integrado que facilita executar Node diretamente.

### Node.js
O runtime que permite executar JavaScript fora do navegador. Instalar o Node tambem instala o npm (Node Package Manager) automaticamente.

## Estrategia de instalacao

O instrutor fornece um link com passo a passo especifico por sistema operacional (Windows, macOS, Linux). A recomendacao e seguir esse guia ao inves de simplesmente baixar do site oficial, porque o guia inclui configuracoes adicionais e resolucao de problemas comuns.

### Site oficial vs guia do curso

- **Site oficial (nodejs.org):** Oferece download direto, mas sem orientacao sobre configuracao de PATH, permissoes ou version management
- **Guia do curso (Notion):** Passo a passo detalhado, feito especificamente para iniciantes, com screenshots e resolucao de problemas

## Version managers (recomendacao moderna)

Embora o curso mostre instalacao direta, a pratica moderna recomenda usar version managers:

- **nvm (Linux/macOS):** Permite ter multiplas versoes do Node e alternar entre elas
- **nvm-windows (Windows):** Equivalente para Windows
- **Vantagem:** Evita problemas de permissao e facilita atualizar ou trocar versoes por projeto

## Versao LTS vs Current

- **LTS (Long Term Support):** Versao estavel, recomendada para producao e aprendizado
- **Current:** Versao mais recente com features experimentais, pode ter breaking changes
- **Regra:** Sempre preferir LTS para cursos e projetos profissionais