# API para cadastro de usuários (Teste Técnico)

### Objetivo:
- Desenvolver uma API para cadastro de Clientes (ID, CPF, Nome, Celulares (um ou mais), E-mails (um ou mais))

### Requisitos: 
- [x] Mysql ou Postgres;
- [x] Usar queries nativas do SQL;
- [x] Criar a API para Realizar o CRUD seguindo o padrão REST;
- [x] Listagem com possibilidade de filtrar por DDD dos Celulares, trazendo todos os clientes que possuem celulares com aquele DDD;
- [x] Listagem com possibilidade de filtrar por uma parte do nome;
- [x] Disponibilizar collection do Postman ou Swagger para a API;
- [x] Criar Dockerfile do projeto.
- [x] Subir código em um repositório git
- [x] Subir container do banco de dados usando docker compose

## Instalação e Inicialização

### Método 1: Usando Docker (Recomendado)
- Executar o comando `docker-compose up -d`
- Acessar a API em `http://localhost:3000/api`
- Acessar a documentação Swagger em `http://localhost:3000/api-docs`

### Método 2: Instalação Manual
- Executar `npm install` para instalar todas as dependências do projeto
- Criar o arquivo `.env` na raíz do projeto e copiar o conteúdo de dentro do arquivo `.env.example`
- Executar o comando `docker-compose up -d` para subir apenas o banco de dados
- Executar o comando `npm run migrate` para migrar as tabelas de dados
- Executar `npm run dev` para inicializar a aplicação em modo de desenvolvimento
- Executar `npm start` para inicializar a aplicação em modo de produção

## Rotas da API

### Clientes
- **POST** `/api/customers/create` - Criar um novo cliente
- **GET** `/api/customers` - Listar todos os clientes
  - Parâmetros de consulta:
    - `ddd` - Filtrar por DDD do telefone
    - `name` - Filtrar por parte do nome
- **GET** `/api/customers/get/:id` - Buscar um cliente por ID
- **PUT** `/api/customers/update/:id` - Atualizar um cliente
- **DELETE** `/api/customers/delete/:id` - Excluir um cliente

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
    nvm install v22.15.0 && ./win-node.bat
    ```
#### Arquivo `win-node.bat`

- Este arquivo foi criado para facilitar a alteração de versões do node através do nvm
```cmd
@echo off
for /f "delims=" %%v in (.nvmrc) do (
    nvm use %%v
)
```

- **@echo off:** desliga a exibição dos comandos executados
- **for /f:** lê o conteúdo do arquivo
- **"delims=":** pega o conteúdo da linha completa e não dívide em 2 ou mais em caso de tabulação ou espaço
- **%%v in (.nvmrc):** isola o conteúdo do arquivo `.nvmrc`dentro da variável `%%v`
- **do ( nvm use %%v )**: vai fazer a execução do comando combinando `nvm use` com o conteúdo(versão do node) dentro da .nvmrc 
