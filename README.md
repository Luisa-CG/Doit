# Doit App – Ionic + Angular + Firebase (Cordova)

Doit es una aplicación móvil desarrollada con Ionic + Angular que permite a los usuarios gestionar tareas y categorizarlas visualmente. Se integra con Firebase para almacenar tareas y categorías, mientras que el estado de completado ("done") se guarda localmente. La aplicación también implementa feature flags dinámicos mediante Firebase Remote Config.

---

## 🚀 Instrucciones para compilar y ejecutar la aplicación

### 📦 Requisitos previos

- Node.js (versión LTS recomendada)
- Ionic CLI y Cordova:

```bash
npm install -g @ionic/cli cordova
```

- Java JDK 11+
- Android Studio (incluye SDK y emulador Android)
- (Solo para iOS) macOS con Xcode instalado

---

### ▶️ Ejecutar en navegador

```bash
ionic serve
```

---

### 📱 Ejecutar en Android

1. Agrega la plataforma:

```bash
ionic cordova platform add android
```

2. Compila y ejecuta en dispositivo/emulador:

```bash
ionic cordova run android
```

3. Para compilar en modo producción:

```bash
ionic cordova build android --release
```

El archivo APK generado estará en:

```
platforms/android/app/build/outputs/apk/release/app-release-unsigned.apk
```

### 🍏 Ejecutar en iOS (solo en macOS)

1. Agrega la plataforma:

```bash
ionic cordova platform add ios
```

2. Abre el proyecto en Xcode:

```bash
open platforms/ios/Doit.xcworkspace
```

3. Ejecuta en simulador o dispositivo desde Xcode.

---

## ✳️ Feature Flag – Remote Config

Se implementó una bandera remota desde Firebase Remote Config:

- Nombre: show_special_feature
- Tipo: boolean
- Uso: si el flag está activo, se muestran los filtros por categorías, de lo contrario se listaran todas las tareas.

Ejemplo en código:

```ts
await this.remoteConfig.fetchAndActivate();
this.showSpecialFeature = await this.remoteConfig.getBoolean('show_special_feature');
```

Al desactivar el flag desde Firebase, dicha sección desaparece automáticamente tras el siguiente inicio de la app.

---

## 🔄 Cambios implementados

- Migración del almacenamiento de tareas/categorías a Firebase Firestore
- Implementación de Ionic Storage para guardar el estado "done" de forma local
- Adición de Remote Config para feature flags dinámicos
- Rediseño con botones flotantes (FAB) y navegación entre páginas
- División de tareas y categorías en componentes independientes
- Menú lateral de navegación
- Filtrado de tareas por categoría
- Uso de colores personalizados por categoría
- Firma del APK

---

## 🧠 Respuestas a preguntas clave

### ¿Cuáles fueron los principales desafíos que enfrentaste al implementar las nuevas funcionalidades?

- Integrar Ionic Storage con Firebase de forma coherente y sin redundancia de datos
- Configurar gradle y firmar APKs en Windows, evitando errores por versiones y rutas

### ¿Qué técnicas de optimización de rendimiento aplicaste y por qué?

- Uso de ChangeDetectionStrategy.OnPush para minimizar detecciones innecesarias
- TrackBy en ngFor para evitar renderizados completos al cambiar elementos
- Uso de observables y async/await para evitar operaciones bloqueantes
- Reducción de escritura en storage local solo cuando cambia el estado "done"

### ¿Cómo aseguraste la calidad y mantenibilidad del código?

- Separación clara entre vistas (pages) y lógica de negocio (services)
- Uso de interfaces y tipado estricto en los modelos (Task, Category)
- Aplicación de nombres descriptivos y modularización por componente/página
