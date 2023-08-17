# API de Controle de Veículos e Motoristas

A API de Controle de Veículos e Motoristas oferece uma variedade de endpoints para gerenciar e rastrear informações sobre veículos, motoristas e suas movimentações. Abaixo estão listadas as principais rotas disponíveis:

## Veículos

### Criar Veículo

Endpoint: `POST /api/vehicle/create`

Crie um novo veículo com as seguintes informações:

```json
{
  "plate": "ABC-1234",
  "model": "Fiat Uno",
  "brand": "Fiat",
  "oil_change_km": 100
}
```

### Atualizar Veículo

Endpoint: `PUT /api/vehicle/:id/update`

Atualize as informações de um veículo específico, substituindo `:id` pelo ID do veículo desejado. Exemplo de corpo da requisição:

```json
{
  "plate": "ABC-1234",
  "model": "Fiat Uno",
  "brand": "Fiat",
  "oil_change_km": 100
}
```

### Excluir Veículo

Endpoint: `DELETE /api/vehicle/:id/delete`

Exclua um veículo pelo seu ID.

### Buscar Veículos

Endpoint: `GET /api/vehicle`

Busque veículos com opções de paginação e ordenação.

### Buscar Todos os Veículos

Endpoint: `GET /api/vehicle/all`

Busque todos os veículos.

## Motoristas

### Criar Motorista

Endpoint: `POST /api/driver/create`

Crie um novo motorista com as seguintes informações:

```json
{
  "name": "Matheus",
  "phone": "(11) 99899-9999",
  "license_number": "56464234423"
}
```

### Atualizar Motorista

Endpoint: `PUT /api/driver/:id/update`

Atualize as informações de um motorista específico, substituindo `:id` pelo ID do motorista desejado. Exemplo de corpo da requisição:

```json
{
  "name": "Matheus",
  "phone": "(11) 99899-9999",
  "license_number": "56464234423"
}
```

### Excluir Motorista

Endpoint: `DELETE /api/driver/:id/delete`

Exclua um motorista pelo seu ID.

### Buscar Motoristas

Endpoint: `GET /api/driver`

Busque motoristas com opções de paginação e ordenação.

### Buscar Todos os Motoristas

Endpoint: `GET /api/driver/all`

Busque todos os motoristas.

## Movimentações de Veículos

### Criar Movimentação

Endpoint: `POST /api/control/create`

Crie uma nova movimentação de veículo com as seguintes informações:

```json
{
  "vehicle": 2,
  "driver": 2,
  "departure_date": "2023-08-11",
  "departure_time": "10:30:00.000000",
  "return_date": "2023-08-11",
  "return_time": "12:30:00.000000",
  "return_km": "250",
  "departure_km": "150",
  "destination": "São Paulo"
}
```

### Atualizar Movimentação

Endpoint: `PUT /api/control/:id/update`

Atualize as informações de uma movimentação específica, substituindo `:id` pelo ID da movimentação desejada. Exemplo de corpo da requisição:

```json
{
  "vehicle": 2,
  "driver": 2,
  "departure_date": "2023-08-11",
  "departure_time": "10:30:00.000000",
  "return_date": "2023-08-11",
  "return_time": "12:30:00.000000",
  "return_km": "250",
  "departure_km": "150",
  "destination": "São Paulo"
}
```

### Excluir Movimentação

Endpoint: `DELETE /api/control/:id/delete`

Exclua uma movimentação pelo seu ID.

### Buscar Movimentações

Endpoint: `GET /api/control`

Busque movimentações com opções de paginação e ordenação.

### Buscar Movimentações de um Veículo

Endpoint: `GET /api/control/vehicle/:id`

Busque todas as movimentações de um veículo pelo seu ID.

### Total de Quilômetros Percorridos

Endpoint: `GET /api/control/:id/total_km`

Calcule o total de quilômetros percorridos em uma movimentação específica.

# Observações
Lembre-se de substituir localhost:8000 pelo host e porta do seu servidor, caso seja diferente.
