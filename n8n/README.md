# OpenBookDrive - Auto Responder para Gmail con n8n

Workflow automático que responde "muchas gracias" cuando alguien te envía un correo con documentos.

## Flujo

```
[Gmail] → [Leer Correos] → [Filtrar Nuevos] → [Auto Responder] → [Log]
```

## Características

- Lee correos cada 5 minutos
- Filtra correos nuevos (no responde a sí mismo)
- Detecta si hay documentos adjuntos
- Envía respuesta HTML profesional
- Registra todos los correos recibidos

## Configuración

### 1. Requisitos

- n8n corriendo (Docker o cloud)
- Cuenta de Gmail con IMAP habilitado
- Contraseña de aplicación de Gmail

### 2. Configurar Gmail

1. Ve a [myaccount.google.com](https://myaccount.google.com)
2. Seguridad → Validación en 2 pasos (debe estar activa)
3. Contraseñas de aplicaciones → Generar nueva
4. Nombre: `n8n OpenBookDrive`
5. Copia la contraseña generada

### 3. Importar en n8n

```bash
# Importar workflow
curl -X POST "http://tu-n8n:5678/rest/workflows" \
  -H "Content-Type: application/json" \
  -d @openbookdrive-autoresponder.json
```

O desde la interfaz:
1. Abre n8n → Ctrl+I (Import)
2. Selecciona el archivo JSON

### 4. Configurar Credenciales

En n8n, crea credenciales tipo "SMTP GMail":

```
Usuario: oscaromargp@gmail.com
Contraseña: tu_contraseña_de_aplicacion
```

### 5. Variables de Entorno

```bash
GMAIL_USER=oscaromargp@gmail.com
GMAIL_APP_PASSWORD=xxxx xxxx xxxx xxxx
```

## Respuesta Automática

El correo de respuesta incluye:

- Confirmación de recepción
- Asunto original
- Cantidad de archivos adjuntos
- Fecha y hora
- Diseño estilo OpenBookDrive

## Prueba

Envía un correo de prueba:

```bash
echo "Probando auto responder" | mail -s "Test OpenBookDrive" \
  -A /ruta/documento.pdf \
  oscaromargp@gmail.com
```

## Monitoreo

Verifica en n8n:
- Ejecuciones del workflow
- Logs de errores
- Historial de respuestas enviadas

## Soporte

- [GitHub Issues](https://github.com/oscaromargp/openbookdrive/issues)
- Autor: Oscar Omar Gómez Peña