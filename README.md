- **Joao Cosme al78351**

**Como Abrir o Projeto no Android Studio**

Requisitos:
- Android Studio instalado
- Node.js e npm instalados
- Capacitor configurado

Instalar dependências
No terminal, navegue até a pasta do projeto e execute:

    npm install

Gerar o build do frontend

    npm run build

Sincronizar com Capacitor

    npx cap sync android

Abrir no Android Studio

    npx cap open android

Requisito de Emulador

Para testes adequados, é necessário criar um dispositivo/emulador customizado com as seguintes especificações:
- Phone/Tablet
- Tamanho: 8 polegadas
- Resolução: 1280 x 800 px

Executar o App
No Android Studio:
- Selecione um emulador com as dimensões acima
- Clique em Run para iniciar o app
