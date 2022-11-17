# Eliminar producto desde pedido

**URL**: `/api/order/product`

**Metodo**: `DELETE`

**Autenticación requerida**: Si

**Permisos requeridos**: Ninguno

Se debe proporcionar las siguientes entradas: orderId y productId

## Respuesta exitosa

```http
DELETE http://localhost:4000/api/order/product?orderId=997879c8-fdac-4544-a7de-68755840d979&&productId=997879c8-fdac-4544-a7de-68755840d979
```

## Respuesta mala

Las entradas orderId y productId deben ser validas. La siguiente petición arrojara un error:

```http
DELETE http://localhost:4000/api/order/product?orderId=1234&&productId=1234
```
