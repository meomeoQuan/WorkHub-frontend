
  # WorkHub Web App UI

  This is a code bundle for WorkHub Web App UI. The original project is available at https://www.figma.com/design/GFub8gG8EDrbYEyL58Kgkh/WorkHub-Web-App-UI.

  ## Running the code

  Run `npm i` to install the dependencies.

  Run `npm run dev` to start the development server.
  ---------------------------------------------------------------------
Anh Huan remember read this note :

due to i add .env.local in .gitignore 
so you may dont see How API_URL work

dont worry since we had .env.example

all thing u have to do is use these command : 

touch .env.local

VITE_API_URL=http://localhost:5222

given file structure: 

WORKHUB-FRONTEND/
│
├── node_modules/
├── public/
│
├── src/
│   ├── assets/
│   ├── components/
│   │   └── ui/
│   ├── contexts/
│   ├── email-templates/
│   ├── guidelines/
│   ├── mappers/
│   ├── pages/
│   ├── styles/
│   ├── types/
│   │
│   ├── App.tsx
│   ├── main.tsx
│   ├── routes.tsx
│   ├── index.css
│   └── vite-env.d.ts   👈 IMPORTANT
│
├── .env.local          👈 LOCAL ONLY
├── .env.example       👈 PUSH TO GITHUB
├── index.html
├── package.json
├── package-lock.json
├── vite.config.ts
└── README.md



  
