# 💰 Cash Pilot — Frontend

> Interface web para gerenciamento de finanças pessoais, construída com Angular 17 e Tailwind CSS.

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

---

## 🚀 Funcionalidades

- ✅ Tela de login e cadastro de usuário
- ✅ Autenticação com **JWT** — token armazenado no localStorage
- ✅ Dashboard com resumo financeiro (receitas, despesas e saldo)
- ✅ Listagem de transações com indicador visual por tipo
- ✅ Criar, editar e excluir transações
- ✅ Feedback visual com **toast notifications**
- ✅ Tratamento global de erros HTTP com **interceptor**
- ✅ Redirecionamento automático ao expirar sessão
- ✅ Interface responsiva com **Tailwind CSS**
- ✅ Tema escuro

---

## 🛠️ Tecnologias

| Tecnologia | Uso |
|---|---|
| Angular 17 | Framework principal |
| TypeScript 5 | Linguagem principal |
| Tailwind CSS 3 | Estilização |
| Angular Signals | Gerenciamento de estado reativo |
| RxJS | Programação reativa e HTTP |
| Angular Router | Navegação entre páginas |
| HttpClient | Comunicação com a API |
| Vercel | Deploy em nuvem |

---

## 🏗️ Arquitetura

```
src/app/
│
├── core/
│   ├── services/
│   │   ├── auth.service.ts        # Login, registro, logout
│   │   ├── transaction.service.ts # CRUD de transações
│   │   └── notification.service.ts # Toast notifications
│   │
│   ├── interceptors/
│   │   ├── auth.interceptor.ts    # Adiciona token JWT em todas as requisições
│   │   └── error.interceptor.ts   # Trata erros HTTP globalmente
│   │
│   └── guards/
│       └── auth.guard.ts          # Protege rotas autenticadas
│
├── features/
│   ├── auth/
│   │   └── pages/
│   │       ├── login/             # Tela de login
│   │       └── register/          # Tela de cadastro
│   │
│   └── transactions/
│       └── pages/
│           ├── dashboard/         # Dashboard principal
│           ├── create-transaction/
│           └── edit-transaction/
│
└── shared/
    └── components/
        ├── header/                # Navegação principal
        └── toast/                 # Notificações visuais
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
- Angular CLI 17+
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

O arquivo `src/environments/environment.ts` já aponta para `http://localhost:8080` por padrão. Se quiser usar o backend em produção, altere para:

```typescript
apiUrl: 'https://cashpilot-backend-production.up.railway.app'
```

**4. Rode a aplicação**
```bash
ng serve
```

Acesse em `http://localhost:4200`

---

## 🌐 Deploy

O frontend está hospedado no **Vercel** com deploy automático a cada push na branch `main`.

**URL:** [cashpilot-frontend.vercel.app](https://cashpilot-frontend.vercel.app)

---

## 👨‍💻 Autor

**Diego Oliveira**

[![LinkedIn](https://img.shields.io/badge/LinkedIn-Diego_Oliveira-blue?style=flat-square&logo=linkedin)](https://www.linkedin.com/in/diego-oliveira-da-fonte-2395b0223/)
[![Portfolio](https://img.shields.io/badge/Portfólio-diegooliveira01.github.io-gray?style=flat-square&logo=github)](https://diegooliveira01.github.io)