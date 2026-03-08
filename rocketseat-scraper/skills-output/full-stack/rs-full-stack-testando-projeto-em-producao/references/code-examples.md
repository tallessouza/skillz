# Code Examples: Testando Projeto em Produção

## Verificar commit local antes de comparar com dashboard

```bash
# Ver último commit com hash completo
git log -1

# Ver último commit resumido (hash curto + mensagem)
git log --oneline -1

# Exemplo de saída:
# a1b2c3d feat: implementa funcionalidade de jogo
```

Compare o hash e a mensagem com o que aparece no dashboard da Vercel.

## Verificar histórico de commits

```bash
# Listar últimos 5 commits
git log --oneline -5

# Verificar branch atual
git branch --show-current
# Saída esperada: main
```

## Verificar se o push foi feito

```bash
# Comparar branch local com remota
git status

# Se aparecer "Your branch is ahead of 'origin/main' by X commits"
# significa que o push ainda não foi feito
git push origin main
```

## Testar URL de produção via terminal

```bash
# Verificar se a URL responde
curl -I https://seu-projeto.vercel.app

# Resposta esperada:
# HTTP/2 200
# content-type: text/html
# ...
```

## Verificar em diferentes viewports (DevTools)

No navegador, acesse a URL de produção e:

1. Abra DevTools (`F12` ou `Ctrl+Shift+I`)
2. Ative o modo responsivo (`Ctrl+Shift+M`)
3. Teste nos presets: iPhone SE, iPad, Desktop

## Checklist automatizável

```bash
#!/bin/bash
# verify-deploy.sh

URL="https://seu-projeto.vercel.app"

echo "Verificando deploy em $URL..."

# Verificar se responde
STATUS=$(curl -s -o /dev/null -w "%{http_code}" "$URL")
if [ "$STATUS" = "200" ]; then
  echo "✓ URL responde com status 200"
else
  echo "✗ URL retornou status $STATUS"
fi

# Verificar commit local
echo ""
echo "Último commit local:"
git log --oneline -1

echo ""
echo "Compare com o dashboard da Vercel."
```

## Estrutura do dashboard da Vercel

```
Dashboard do Projeto
├── Preview (thumbnail da aplicação)
├── Deployment
│   ├── Status: Ready / Building / Error
│   ├── Branch: main
│   ├── Commit: a1b2c3d "feat: implementa jogo"
│   └── Created: 2 minutes ago
├── Domains
│   └── seu-projeto.vercel.app
└── Visit → abre a URL de produção
```