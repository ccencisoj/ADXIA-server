# Agregar producto a pedido

**URL**: `/api/order/product`

**Metodo**: `POST`

**Autenticación requerida**: Si

**Permisos requeridos**: Ninguno

Se debe proporcionar el id del producto y el id de la orden.

## Respuesta exitosa

Para un id de producto 997879c8-fdac-4544-a7de-68755840d979 y un id de pedido 997879c8-fdac-4544-a7de-68755840d979

```http
POST http://localhost:4000/api/order/product?orderId=997879c8-fdac-4544-a7de-68755840d979&&productId=997879c8-fdac-4544-a7de-68755840d979
```

## Respuesta mala

Debe ingresar un id valido. La siguiente petición arrojara un error:

```http
POST http://localhost:4000/api/order/product?orderId=1111&&productId=2222
```

Debe ingresar el id de la order y del producto. La siguiente petición arrojara un error:

```http
POST http://localhost:4000/api/order/product?orderId=1111
```
