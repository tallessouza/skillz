# Code Examples: Configurando o Ambiente Angular

## Verificacao do ambiente

```bash
# Checar se Node.js esta instalado e qual versao
node -v
# Exemplo de saida: v20.11.0

# Checar versao do NPM
npm -v
# Exemplo de saida: 10.2.4

# Checar se Angular CLI global esta instalado
ng version
# Mostra versao do Angular CLI e informacoes do ambiente
```

## Instalacao do Angular CLI global

```bash
# Instalar a versao mais recente globalmente
npm install -g @angular/cli

# Instalar uma versao especifica globalmente
npm install -g @angular/cli@17

# Atualizar para a ultima versao
npm update -g @angular/cli

# Desinstalar
npm uninstall -g @angular/cli
```

## Criando aplicacoes — CLI global

```bash
# Criar nova aplicacao com CLI global
ng new minha-app

# Criar com opcoes especificas
ng new minha-app --style=scss --routing=true

# Navegar e executar
cd minha-app
ng serve
```

## Criando aplicacoes — npx (dinamico)

```bash
# Criar com a ultima versao disponivel (sem instalar globalmente)
npx @angular/cli new minha-app

# Criar com versao especifica do Angular
npx @angular/cli@17 new minha-app-v17
npx @angular/cli@16 new minha-app-v16
npx @angular/cli@15 new minha-app-v15

# Util para manter projetos em versoes diferentes simultaneamente
```

## Cenario: multiplos projetos em versoes diferentes

```bash
# Projeto legado em Angular 15
npx @angular/cli@15 new projeto-legado
cd projeto-legado
npm start

# Projeto novo em Angular 17
cd ..
npx @angular/cli@17 new projeto-novo
cd projeto-novo
npm start

# Ambos coexistem sem conflito porque cada um tem
# suas proprias dependencias em node_modules/
```

## Troubleshooting comum

```bash
# "ng: command not found" apos instalar global
# Verificar onde npm instala globais:
npm config get prefix
# Adicionar esse path/bin ao PATH do sistema

# Verificar se npx esta disponivel (npm 5.2+)
npx --version

# Limpar cache do npm se instalacao falhar
npm cache clean --force
```