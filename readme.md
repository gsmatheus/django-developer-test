# Sistema de Gerenciamento de Veículos e Motoristas

Este projeto é um sistema de gerenciamento de veículos e motoristas que utiliza o framework Django em Python. O sistema oferece funcionalidades para manter registros e acompanhar as atividades relacionadas aos veículos e motoristas, incluindo suas movimentações.

## Funcionalidades Principais 

- **Cadastro de Veículos:** Registre informações detalhadas sobre os veículos, como placa, marca, modelo e quilometragem para manutenção.

- **Cadastro de Motoristas:** Mantenha um cadastro organizado de motoristas, incluindo detalhes como nome, telefone e número da CNH.

- **Controle de Movimentações de Veículos:** Registre as movimentações dos veículos de maneira eficiente, capturando informações como data e horário de partida, destino, data e horário de retorno, quilometragem no início e final da viagem, além dos quilômetros percorridos.

## Instruções para Instalação e Execução 

### Configuração do Banco de Dados 

O sistema utiliza o banco de dados **SQLite** como padrão, especialmente para ambientes de desenvolvimento. No entanto, é importante observar que o uso do **SQLite** é mais adequado para cenários de desenvolvimento e testes devido às suas características de armazenamento local. Para ambientes de produção ou aplicações em escala, é altamente recomendável considerar a migração para bancos de dados mais robustos, como **MySQL** ou **PostgreSQL**, de acordo com suas necessidades e requisitos de desempenho.

Caso opte por utilizar um banco de dados diferente para ambientes de produção, lembre-se de configurar adequadamente as opções de conexão no arquivo **settings.py**. Isso garantirá que a aplicação esteja preparada para atender à demanda real e oferecer um desempenho estável.

### Backend (Django)

1. Clone este repositório para o seu sistema local:

```sh
git clone git@github.com:gsmatheus/django-developer-test.git
```

2. Acesse o diretório do projeto:

```sh
cd django-developer-test/backend
```

3. Crie e ative um ambiente virtual para isolar as dependências do projeto:

- **Windows**

```sh
python -m venv venv
venv\Scripts\activate
```

- **Linux**

```sh
python -m venv venv
source venv/bin/activate
```

4. Instale as dependências necessárias:

```sh
pip install -r requirements.txt
```

5. Execute as migrações do banco de dados:

```sh
python manage.py migrate
```

6. Execute o servidor:

```sh
python manage.py runserver
```

### Frontend (React.js)

O frontend do projeto é desenvolvido em **React.js** e requer o **Node.js** para ser executado. Antes de prosseguir com a instalação, certifique-se de ter o **Node.js** instalado em seu sistema. Caso não tenha, você pode baixá-lo e instalá-lo a partir do site oficial: [https://nodejs.org/](https://nodejs.org/)

Após instalar o Node.js, siga as etapas abaixo para configurar e executar o frontend:

#### Configurações do Frontend

Para o frontend, é importante configurar variáveis de ambiente para controlar diferentes aspectos da sua aplicação, como URLs de API, chaves de acesso e outras configurações específicas. O arquivo .env é um local onde você pode definir essas variáveis de ambiente de forma organizada. Aqui está como você pode configurá-lo:

Copie o arquivo `.env.example` e renomeie-o para `.env`, dentro do arquivo `.env`, você pode definir o host do backend.

1. Acesse o diretório do projeto:

```sh
cd django-developer-test/frontend
```

2. Instale as dependências do frontend:

```sh
npm install
```

3. Construa o projeto:

```sh
npm run build
```

4. Inicie o servidor de pré-visualização:

```sh
npm run preview
```

## Instalação e Execução via Docker

1. Clone o repositório

```sh
git clone git@github.com:gsmatheus/django-developer-test.git
```

2. Acesse o diretório do projeto

```sh
cd django-developer-test
```

3. Execute o docker-compose para configurar e iniciar os serviços:

```sh
docker-compose up -d
```

4. Execute as migrações do banco de dados dentro do contêiner do backend:

```sh
docker-compose run backend /usr/local/bin/python manage.py migrate
```

## Documentação das Rotas

Para obter informações detalhadas sobre as rotas disponíveis na API, você pode consultar a documentação no README.md na pasta `/backend` do projeto. Lá, você encontrará uma descrição completa de todas as rotas, seus endpoints e os detalhes de uso.

Além disso, você também pode acessar a documentação interativa da API através da rota `/swagger` quando a aplicação estiver em execução. O Swagger fornece uma interface fácil de usar para explorar as rotas, seus parâmetros e solicitações, tornando mais conveniente entender e testar a API diretamente no navegador.

Certifique-se de aproveitar essas opções para se familiarizar com a API e facilitar o processo de desenvolvimento e integração.

## Testes Automatizados

1. Acesse o diretório do backend do projeto:

```sh
cd django-developer-test/backend
```

2. Execute os testes automatizados:

```sh
python manage.py test
```

## Sugestões de Aprimoramento

- Implementar um sistema robusto de autenticação e autorização de usuários.
- Adicionar testes de interface para garantir a integridade visual e funcional do sistema.
- Aperfeiçoar a documentação da API, incluindo exemplos claros de solicitações e respostas.
- Refinar a criação de formulários, buscando uma experiência mais intuitiva.
- Fortalecer a validação dos campos dos formulários, prevenindo erros e entradas inválidas.
- Aprimorar a exibição e tratamento de mensagens de erro, melhorando a experiência do usuário.
