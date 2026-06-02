<div align="center">

<img src="https://img.shields.io/badge/Ionic-7-3880FF?style=for-the-badge&logo=ionic&logoColor=white"/>
<img src="https://img.shields.io/badge/Angular-17-DD0031?style=for-the-badge&logo=angular&logoColor=white"/>
<img src="https://img.shields.io/badge/Capacitor-6-119EFF?style=for-the-badge&logo=capacitor&logoColor=white"/>
<img src="https://img.shields.io/badge/TypeScript-5-3178C6?style=for-the-badge&logo=typescript&logoColor=white"/>
<img src="https://img.shields.io/badge/Android-APK-3DDC84?style=for-the-badge&logo=android&logoColor=white"/>

<br/><br/>

# 📋 EduReport

**Sistema de gestión de incidencias para centros educativos**

*Reportá problemas de infraestructura, dales seguimiento y resolvelos — desde tu celular.*

</div>

---

## 📌 ¿Qué es EduReport?

EduReport es una aplicación móvil desarrollada con **Ionic + Angular** que digitaliza el proceso de reporte y seguimiento de incidencias dentro de instituciones educativas.

Antes de esta app, los problemas se reportaban por WhatsApp, mensajes informales o papel. La información se perdía, se duplicaba y nadie sabía si el problema había sido resuelto. EduReport soluciona exactamente eso.

---

## ✨ Funcionalidades

| Módulo | Descripción |
|---|---|
| 🔐 **Autenticación** | Registro e inicio de sesión con correo institucional. Sesión persistente con Ionic Storage. |
| 📋 **Reportar Incidencia** | Formulario con categoría, ubicación, descripción, prioridad y foto adjunta. |
| 📸 **Cámara / Galería** | Captura de fotos nativa con Capacitor. Compresión automática de imágenes. |
| 📊 **Gestión de Reportes** | Listado con filtros por estado: Pendiente · En reparación · Listo. |
| 🔴 **Prioridad y Urgencia** | Clasificación Baja / Media / Urgente. Alertas automáticas para incidencias críticas. |
| 📍 **Ubicación** | Selección del espacio físico dentro de la institución (aula, laboratorio, oficina, etc.). |
| 🔔 **Notificaciones** | Alertas al crear una incidencia urgente o al cambiar el estado de un reporte. |
| ⚙️ **Gestión Técnica** | El personal de mantenimiento puede actualizar estados, agregar comentarios e historial. |
| 🚫 **Detección de Duplicados** | Aviso automático si ya existe un reporte similar en la misma ubicación. |
| 👤 **Perfil de Usuario** | Datos personales, departamento y cierre de sesión seguro. |

---

## 🛠️ Stack Tecnológico

```
Frontend    →  Ionic 7 + Angular 17 (Standalone Components)
Lenguaje    →  TypeScript 5
Nativo      →  Capacitor 6 (@capacitor/camera, @capacitor/core)
Storage     →  Ionic Storage (persistencia local)
Estilos     →  SCSS + Variables CSS de Ionic
Build       →  Android Studio → APK
```

---

## 🗂️ Estructura del Proyecto

```
src/
├── app/
│   ├── core/
│   │   ├── guards/          # Guardas de rutas (AuthGuard)
│   │   ├── models/          # Interfaces: Report, User, Notification
│   │   ├── services/
│   │   │   ├── auth.service.ts          # Autenticación y sesión
│   │   │   ├── report.service.ts        # CRUD de incidencias
│   │   │   ├── camera.service.ts        # Cámara nativa con Capacitor
│   │   │   └── notification.service.ts  # Alertas y notificaciones
│   │   └── utils/
│   ├── pages/
│   │   ├── home/            # Pantalla principal con incidencias urgentes
│   │   ├── login/           # Autenticación
│   │   ├── new-report/      # Formulario de nueva incidencia
│   │   ├── reports/         # Listado y filtros
│   │   ├── report-detail/   # Detalle, historial y gestión técnica
│   │   ├── notifications/   # Centro de alertas
│   │   ├── profile/         # Perfil del usuario
│   │   └── duplicate-warning/ # Aviso de reporte duplicado
│   └── shared/              # Componentes reutilizables
├── assets/
├── environments/
└── theme/
```

---

## 🚀 Instalación y Ejecución

### Prerrequisitos

- Node.js 18+
- Ionic CLI (`npm install -g @ionic/cli`)
- Android Studio (para generar el APK)

### 1. Clonar el repositorio

```bash
git clone https://github.com/tu-usuario/edu-report.git
cd edu-report
```

### 2. Instalar dependencias

```bash
npm install
```

### 3. Ejecutar en navegador (desarrollo)

```bash
ionic serve
```

### 4. Generar APK para Android

```bash
# Compilar la app
ionic build --prod

# Agregar plataforma Android (solo la primera vez)
ionic cap add android

# Sincronizar cambios
npx cap sync android

# Abrir en Android Studio
npx cap open android
```

En Android Studio: **Build → Build Bundle(s) / APK(s) → Build APK(s)**

El APK queda en: `android/app/build/outputs/apk/debug/app-debug.apk`

---

## 📱 Permisos Android

El archivo `AndroidManifest.xml` incluye los siguientes permisos necesarios:

```xml
<uses-permission android:name="android.permission.INTERNET" />
<uses-permission android:name="android.permission.CAMERA" />
<uses-permission android:name="android.permission.READ_EXTERNAL_STORAGE" />
<uses-permission android:name="android.permission.WRITE_EXTERNAL_STORAGE" />
```

---

## 📸 Integración de Cámara

La captura de imágenes se maneja a través de un servicio centralizado (`CameraService`) que utiliza `@capacitor/camera`:

- Detecta automáticamente si la app corre en entorno nativo o navegador
- Solicita permisos en tiempo de ejecución
- Comprime las imágenes a máximo 800px antes de guardar
- Permite elegir entre cámara o galería según el contexto

```typescript
// camera.service.ts — ejemplo simplificado
const photo = await Camera.getPhoto({
  quality: 70,
  resultType: CameraResultType.DataUrl,
  source: CameraSource.Prompt,
  correctOrientation: true
});
```

---

## 🧩 Arquitectura

EduReport sigue una arquitectura orientada a servicios:

- **Standalone Components** — cada página es un componente independiente sin módulos
- **Servicios inyectables** — lógica de negocio separada del componente
- **Guards de ruta** — protección de páginas según estado de autenticación
- **Modelos tipados** — interfaces TypeScript para `Report`, `User`, `Notification`

---

## 📄 Licencia

Este proyecto fue desarrollado con fines académicos.

---

<div align="center">
  <sub>Desarrollado con ❤️ usando Ionic · Angular · Capacitor</sub>
</div>