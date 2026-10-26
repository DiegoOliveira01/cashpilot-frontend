# 💰 Cash Pilot — Frontend

> Interface web para gerenciamento de finanças pessoais, construída com Angular 17 e Tailwind CSS, com integração ao **bot do Telegram** do Cash Pilot.

[![Angular](https://img.shields.io/badge/Angular-17-red?style=flat-square&logo=angular)](https://angular.io/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3-blue?style=flat-square&logo=tailwindcss)](https://tailwindcss.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Vercel](https://img.shields.io/badge/Deploy-Vercel-black?style=flat-square&logo=vercel)](https://cashpilot-frontend.vercel.app)

---

## 🔗 Links

| | |
|---|---|
| 🌐 **Demo ao vivo** | [cashpilot-frontend.vercel.app](https://cashpilot-frontend.vercel.app) |
| ⚙️ **Repositório Backend** | [github.com/DiegoOliveira01/cashpilot-backend](https://github.com/DiegoOliveira01/cashpilot-backend) |
| 🤖 **Bot do Telegram** | [@CopilotoCashBot](https://t.me/CopilotoCashBot) (conecte pelo dashboard) |
| 📄 **Swagger / Documentação da API** | [cashpilot-backend-production.up.railway.app/swagger-ui/index.html](https://cashpilot-backend-production.up.railway.app/swagger-ui/index.html) |
| 💼 **LinkedIn** | [linkedin.com/in/diego-oliveira-da-fonte](https://www.linkedin.com/in/diego-oliveira-da-fonte-2395b0223/) |
| 🗂️ **Portfólio** | [diegooliveira01.github.io](https://diegooliveira01.github.io) |

---

## 📸 Screenshots

| Login | Dashboard |
|---|---|
| ![Login](https://github.com/DiegoOliveira01/cashpilot-frontend/blob/4a322a2b99b6d1e3461e17c52b8b0ae7e386a6ae/Readme_img_login.png) | ![Dashboard](https://github.com/DiegoOliveira01/cashpilot-frontend/blob/4a322a2b99b6d1e3461e17c52b8b0ae7e386a6ae/Readme_img_dashboard.png) |

| Nova Transação | Editar Transação |
|---|---|
| ![Nova Transação](https://github.com/DiegoOliveira01/cashpilot-frontend/blob/4a322a2b99b6d1e3461e17c52b8b0ae7e386a6ae/Readme_img_transaction_add.png) | ![Editar Transação](https://github.com/DiegoOliveira01/cashpilot-frontend/blob/4a322a2b99b6d1e3461e17c52b8b0ae7e386a6ae/Readme_img_transaction_edit.png) |


Prints da integração com o Telegram: adicione as imagens em docs/ e descomente.

| Conectar Telegram (link e QR Code) | Bot no Telegram |
|---|---|
| ![Conectar](https://github.com/DiegoOliveira01/cashpilot-frontend/blob/503be2614822c898694ff6bb7b061dca84644df7/Readme_img_modal.png) | ![Bot](https://github.com/DiegoOliveira01/cashpilot-frontend/blob/503be2614822c898694ff6bb7b061dca84644df7/Readme_img_bot.png) |


---

## 🚀 Funcionalidades

- ✅ Tela de login e cadastro de usuário
- ✅ Autenticação com **JWT** — token armazenado no localStorage
- ✅ Dashboard com resumo financeiro (receitas, despesas e saldo)
- ✅ Navegação por mês e listagem de transações com indicador visual por tipo
- ✅ Criar, editar e excluir transações
- ✅ **Conectar ao Telegram** pelo dashboard, com link e **QR Code** (para quem acessa pelo computador)
- ✅ Botão com estado: mostra **Telegram conectado ✓** quando a conta já está vinculada
- ✅ A janela de conexão **fecha sozinha** quando o usuário conclui a conexão no Telegram
- ✅ Feedback visual com **toast notifications**
- ✅ Tratamento global de erros HTTP com **interceptor**
- ✅ Redirecionamento automático ao expirar sessão
- ✅ Interface responsiva com **Tailwind CSS**
- ✅ Tema escuro

---

## 🤖 Integração com o Telegram

O dashboard tem o componente `TelegramConnectComponent`, que conecta a conta do usuário ao bot:

```
Clique em "Conectar Telegram"
      ↓
POST /telegram/link-code (com o JWT) → código de uso único (10 min) + link do bot
      ↓
Modal com o botão "Abrir no Telegram" e um QR Code (no computador, escaneie com o celular)
      ↓
O usuário toca em "Iniciar" no bot
      ↓
O front consulta GET /telegram/status a cada 3 s (por até ~10 min)
      ↓
Conectado: a janela fecha, o botão vira "Telegram conectado ✓" e aparece um toast
```

Detalhes:

- **QR Code gerado no navegador** (biblioteca `qrcode`): o código de uso único não é enviado a nenhum serviço externo. Se a geração falhar, o modal continua funcionando só com o botão.
- **Estado do botão** vem de `GET /telegram/status`. Se a chamada falhar, o botão continua como "Conectar Telegram", sem quebrar a tela.
- Com a conta conectada, o modal mostra os comandos do bot, um atalho para abrir o chat e a opção de conectar outra conta do Telegram.
- Os lançamentos feitos pelo bot aparecem no dashboard ao recarregar a página.

> O uso do bot e as regras de interpretação (comandos, texto livre e IA opcional) estão documentados no [repositório do backend](https://github.com/DiegoOliveira01/cashpilot-backend).

---

## 🛠️ Tecnologias

| Tecnologia | Uso |
|---|---|
| Angular 17 | Framework principal |
| TypeScript 5 | Linguagem principal |
| Tailwind CSS 3 | Estilização |
| Angular Signals | Gerenciamento de estado reativo |
| RxJS | Programação reativa, HTTP e polling do status do Telegram |
| Angular Router | Navegação entre páginas |
| HttpClient | Comunicação com a API |
| qrcode | Geração do QR Code de conexão com o Telegram |
| Vercel | Deploy em nuvem |

---

## 🏗️ Arquitetura

```
src/app/
│
├── core/
│   ├── guards/
│   │   └── auth.guard.ts           # Protege rotas autenticadas
│   │
│   ├── interceptors/
│   │   ├── auth.interceptor.ts     # Adiciona token JWT em todas as requisições
│   │   └── error.interceptor.ts    # Trata erros HTTP globalmente
│   │
│   └── services/
│       ├── auth.ts                 # Login, registro, logout
│       ├── transaction.ts          # CRUD de transações
│       ├── telegram.ts             # Código de vínculo e status da conexão
│       └── notification.service.ts # Toast notifications
│
├── features/
│   ├── auth/
│   │   └── pages/
│   │       ├── login/              # Tela de login
│   │       └── register/           # Tela de cadastro
│   │
│   ├── dashboard/                  # Dashboard principal
│   │
│   └── transactions/
│       └── pages/
│           ├── create-transaction/
│           └── edit-transaction/
│
└── shared/
    └── components/
        ├── header/                 # Navegação principal
        ├── toast/                  # Notificações visuais
        └── telegram-connect/       # Botão, modal, QR Code e polling do Telegram
```

---

## 🔐 Fluxo de Autenticação

```
Usuário faz login
      ↓
Token JWT salvo no localStorage
      ↓
Auth Interceptor adiciona token em todas as requisições
Authorization: Bearer <token>
      ↓
Token expirado? → Error Interceptor redireciona para /login
Token válido?  → Requisição processada normalmente
```

---

## 📡 Integração com a API

O frontend consome a API REST do backend hospedada no Railway. A URL base é configurada via `environment`:

**Desenvolvimento:**
```typescript
// src/environments/environment.ts
export const environment = {
  production: false,
  apiUrl: 'http://localhost:8080'
};
```

**Produção:**
```typescript
// src/environments/environment.prod.ts
export const environment = {
  production: true,
  apiUrl: 'https://cashpilot-backend-production.up.railway.app'
};
```

---

## ⚙️ Como rodar localmente

### Pré-requisitos

- Node.js 18+
- Angular CLI 17+ (ou use `npx ng`)
- Backend rodando localmente ou apontando para o Railway

### Passo a passo

**1. Clone o repositório**
```bash
git clone https://github.com/DiegoOliveira01/cashpilot-frontend.git
cd cashpilot-frontend
```

**2. Instale as dependências**
```bash
npm install
```

**3. Configure o ambiente**

Em `src/environments/environment.ts`, aponte `apiUrl` para o backend local (`http://localhost:8080`) ou para o de produção:

```typescript
apiUrl: 'https://cashpilot-backend-production.up.railway.app'
```

O `localhost:4200` já está liberado no CORS do backend.

**4. Rode a aplicação**
```bash
ng serve
```

Acesse em `http://localhost:4200`

> Para testar a conexão com o Telegram, o backend precisa estar com o bot configurado (webhook registrado). Veja o README do backend.

---

## 🌐 Deploy

O frontend está hospedado no **Vercel** com deploy automático a cada push na branch `main`.

**URL:** [cashpilot-frontend.vercel.app](https://cashpilot-frontend.vercel.app)

---

## 👨‍💻 Autor

**Diego Oliveira**

[![LinkedIn](https://img.shields.io/badge/LinkedIn-Diego_Oliveira-blue?style=flat-square&logo=linkedin)](https://www.linkedin.com/in/diego-oliveira-da-fonte-2395b0223/)
[![Portfolio](https://img.shields.io/badge/Portfólio-diegooliveira01.github.io-gray?style=flat-square&logo=github)](https://diegooliveira01.github.io)
