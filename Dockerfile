# --- Stage 1: Builder ---
# Use uma imagem Node.js base para construir a aplicação.
# 'alpine' é uma distribuição Linux leve, ideal para imagens Docker menores.
FROM node:20-alpine AS builder

# Define o diretório de trabalho dentro do contêiner.
WORKDIR /app

# Copia os arquivos package.json e package-lock.json (se existir) primeiro.
# Isso permite que o Docker use o cache de camadas se as dependências não mudarem.
COPY package*.json ./

# Instala todas as dependências do projeto, incluindo as de desenvolvimento,
# que são necessárias para a etapa de build (ex: TypeScript, Nest CLI).
RUN npm install

# Se você estiver usando Prisma, é crucial gerar o cliente Prisma
# antes de construir a aplicação.
# Este comando deve ser executado após a instalação das dependências.
RUN npx prisma generate

# Copia o restante do código-fonte da aplicação para o diretório de trabalho.
COPY . .

# Executa o comando de build do NestJS.
# Isso compila o código TypeScript para JavaScript e o coloca na pasta 'dist'.
RUN npm run build

# --- Stage 2: Production ---
# Use uma nova imagem Node.js base, novamente 'alpine' para ser leve.
# Esta imagem será a base para o contêiner final de produção.
FROM node:20-alpine AS production

# Define o diretório de trabalho para o estágio de produção.
WORKDIR /app

# Copia apenas os arquivos compilados (da pasta 'dist') do estágio 'builder'.
COPY --from=builder /app/dist ./dist

# Copia os arquivos package.json e package-lock.json novamente.
# Isso é necessário para instalar apenas as dependências de produção no estágio final.
COPY package*.json ./

# Instala apenas as dependências de produção.
# '--omit=dev' garante que as dependências de desenvolvimento não sejam incluídas na imagem final,
# tornando-a menor e mais segura.
RUN npm install --omit=dev

# Expõe a porta em que sua aplicação NestJS irá rodar.
# A porta padrão para aplicações NestJS é 3000.
EXPOSE 3000

# Define o comando que será executado quando o contêiner for iniciado.
# 'npm run start:prod' inicia a aplicação em modo de produção.
CMD ["npm", "run", "start:prod"]