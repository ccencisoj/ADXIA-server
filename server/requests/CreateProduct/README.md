# Crear un pedido

**URL**: `/api/product`

**Metodo**: `POST`

**Autenticación requerida**: YES

**Permisos requeridos**: Ninguno

Se debe proporcionar las siguientes entradas: name, brand, avaliableQuantity y price

## Respuesta exitosa

```http
POST http://localhost:4000/api/product
Content-Type: application/json

{
  "name": "Producto 1",
  "brand": "Nestle",
  "avaliableQuantity": 20,
  "price": 2500
}
```

## Respuesta mala

Debe ingresar un nombre con longitud mayor a 2 caracteres. La siguiente petición arroja un error:

```http
POST http://localhost:4000/api/product
Content-Type: application/json

{
  "name": "a",
  ...
}
```

Las entradas avaliableQuantity y price deben ser mayor o igual a 0. La siguiente petición arroja un error:

```http
POST http://localhost:4000/api/product
Content-Type: application/json

{
  ...
  "avaliableQuantity": -4,
  "price": -2
}
```