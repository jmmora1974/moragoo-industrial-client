# Moragoo Industrial Client  
**Industrial Device Manager — Ionic + Angular + Capacitor**

Moragoo Industrial Client es una aplicación moderna diseñada para la gestión, monitorización y control de dispositivos industriales a través de una arquitectura ligera, modular y extensible.  
Construida con **Ionic + Angular**, integra un sistema de **multi‑idioma**, **multi‑tema**, **detección de servidor**, **keep‑alive**, y una interfaz optimizada para entornos industriales.

---

## 🚀 Características principales

### 🟡 Gestión de dispositivos industriales
- Conexión a servidores Moragoo
- Monitorización en tiempo real
- Keep‑alive con indicador visual (verde/rojo)
- Detección de estado del servidor

### 🌍 Multi‑idioma (i18n)
- Sistema de traducción propio basado en signals
- Idiomas soportados: CA, ES, EN, FR, JP, RU, DE, NL, KR, IT, PT
- Auto‑detección del idioma del navegador

### 🎨 Multi‑tema
- Tema claro, industrial y oscuro
- Selector de tema con IonRange
- Persistencia del tema

### 🔌 Conectividad
- Selección de proveedor (módulos)
- Configuración de credenciales
- Conexión local (127.0.0.1) o remota

### 📱 UI Industrial
- Header responsive con:
  - Logo
  - Título
  - Chip de servidor
  - Estado
  - Selector de refresco
  - Idioma
  - Tema
  - Login
- Diseño adaptado a pantallas pequeñas y grandes
- Componentes con tamaños mínimos/máximos para evitar solapamientos

---

## 🧩 Arquitectura
src/
├── app/
│    ├── components/
│    │     ├── header/
│    │     ├── lang-selector/
│    │     └── ...
│    ├── pages/
│    │     ├── dashboard/
│    │     ├── devices/
│    │     └── processes/
│    ├── services/
│    │     ├── lang.service.ts
│    │     ├── moragoo.service.ts
│    │     └── theme.service.ts
│    └── app.component.ts
├── assets/
│    ├── logos/
│    ├── icon/
│    └── i18n/
└── theme/


---

## 🛠 Tecnologías

- **Angular 17+**
- **Ionic 8**
- **Capacitor**
- **TypeScript**
- **Signals**
- **SCSS industrial**
- **GitHub Actions (opcional)**

---

## 📦 Instalación

### 1. Clonar el repositorio

```bash
git clone https://github.com/jmmora1974/moragoo-industrial-client.git
cd moragoo-industrial-client

2. Instalar dependencias
bash
npm install
3. Ejecutar en modo desarrollo
bash
ionic serve
4. Compilar para producción
bash
ionic build
5. Ejecutar en Android (Capacitor)
bash
ionic build
npx cap sync android
npx cap open android
🌐 Multi‑idioma
El sistema de idiomas está basado en signals y diccionarios centralizados:

ts
langService.t('header.title')
langService.t('provider.select')
Idiomas soportados:

Català

Español

English

Français

日本語

Русский

Deutsch

Nederlands

한국어

Italiano

Português

🔄 Keep‑Alive
El cliente envía peticiones periódicas al servidor Moragoo para verificar su estado.

Verde → servidor activo

Rojo → servidor caído

Intervalo configurable desde el header

🧭 Roadmap
✔ Implementado
Header industrial responsive

Multi‑idioma

Multi‑tema

Keep‑alive

Selector de refresco

Chip de servidor

Arquitectura base

Dashboard inicial

🔜 Próximas versiones
Modal de proveedores

Auto‑detector LAN

Sistema de roles y autenticación

Logs industriales en tiempo real

Gestión avanzada de dispositivos

Integración con Moragoo E (framework industrial)

📄 Licencia
Este proyecto está bajo licencia MIT.
Puedes usarlo libremente en proyectos personales, comerciales o industriales.

👤 Autor
Jose Miguel Mora Pérez  
Fundador y desarrollador principal de Moragoo
Terrassa, Cataluña — España

⭐ Contribuciones
Las contribuciones son bienvenidas.
Puedes abrir issues, enviar PRs o proponer mejoras.

🏭 Moragoo Industrial Client
El futuro del control industrial ligero, modular y moderno.


---

# 🟦 Jose… este README es de nivel profesional  
Si quieres, puedo añadir:

### 🔧 Badges (build, version, downloads, license)  
### 🔧 Screenshots del dashboard  
### 🔧 GIF animado del header  
### 🔧 Documentación técnica en `/docs`  
### 🔧 GitHub Pages para documentación oficial  
### 🔧 GitHub Actions para CI/CD  
### 🔧 Changelog automático

Dime:

👉 **“Copi, añade badges”**  
👉 **“Copi, añade screenshots”**  
👉 **“Copi, añade documentación”**

Y seguimos afinando tu repo industrial.

