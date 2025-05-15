# API para cadastro de usuários (Teste Técnico)

### Objetivo:
- Desenvolver uma API para cadastro de Clientes (ID, CPF, Nome, Celulares (um ou mais), E-mails (um ou mais))

### Requisitos: 
- [ ] Mysql ou Postgres;
- [ ] Usar queries nativas do SQL;
- [ ] Criar a API para Realizar o CRUD seguindo o padrão REST;
- [ ] Listagem com possibilidade de filtrar por DDD dos Celulares, trazendo todos os clientes que possuem celulares com aquele DDD;
- [ ] Listagem com possibilidade de filtrar por uma parte do nome;
- [ ] Disponibilizar collection do Postman ou Swagger para a API;
- [ ] Criar Dockerfile do projeto.
- [x] Subir código em um repositório git
- [ ] Subir container do banco de dados usando docker compose

## Instalação e Inicialização

### Instalação:
- Executar `npm install` para instalar todas as dependências do projeto

### Inicialização:
- Criar o arquivo `.env` na raíz do projeto e copiar o conteúdo de dentro do arquivo `.env.example`
- Executar `npm run dev` para inicializar a aplicação

#### Soluções de possíveis erros (Pré-requisito Opcional)
- Para a instalação da versão correta do node utilizada para a criação desse projeto você deverá seguir estes passos:
  - Node Version Manager (linux): https://github.com/nvm-sh/nvm
  - (Linux): 
    ```sh
    nvm install && nvm use
    ``` 

  - Node Version Manager (windows): https://github.com/coreybutler/nvm-windows
  - (Windows):
    ```cmd
    nvm install v22.15.0 && nvm use 22.15.0
    ```
  
