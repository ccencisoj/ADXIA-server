# Crear un pedido

**URL**: `/api/order`

**Metodo**: `POST`

**Autenticación requerida**: YES

**Permisos requeridos**: Ninguno

Se debe proporcionar las siguientes entradas: clientId

## Respuesta exitosa
```http
POST http://localhost:4000/api/order
Content-Type: application/json

{
  "clientId": "997879c8-fdac-4544-a7de-68755840d979"
}
```

## Respuesta mala

Debe ingresar un clientId valido. La siguiente petición arrojara un error:

```http
POST http://localhost:4000/api/order
Content-Type: application/json

{
  "clientId": "1234"
}
```
