# Inventario de Repuestos de Motos

Un sistema web moderno para gestionar el inventario de repuestos de motocicletas, construido con Next.js, TypeScript y Tailwind CSS.

## 🏍️ Características

- **Gestión completa de inventario**: CRUD (Crear, Leer, Actualizar, Eliminar) para repuestos
- **Interfaz de taller moderna**: Diseño oscuro tipo taller mecánico
- **Búsqueda y filtrado**: Busca por nombre, SKU, marca o categoría
- **Alertas de stock bajo**: Notificaciones visuales para repuestos con stock < 5
- **Estadísticas en tiempo real**: Total de repuestos, stock bajo y valor del inventario
- **Almacenamiento local**: Usa LocalStorage para persistencia de datos
- **Diseño responsive**: Funciona en desktop y móviles

## 📋 Modelo de Datos

Cada repuesto contiene:
- **ID**: Identificador único
- **Nombre**: Descripción del repuesto
- **SKU**: Código de producto
- **Marca de Moto**: Honda, Yamaha, Suzuki, etc.
- **Categoría**: Motor, Frenos, Suspensión, etc.
- **Stock**: Cantidad disponible
- **Precio**: Precio unitario

## 🚀 Tecnologías

- **Next.js 14**: Framework React con App Router
- **TypeScript**: Tipado estático
- **Tailwind CSS**: Framework de CSS utility-first
- **Lucide React**: Iconos modernos
- **Supabase**: Base de datos PostgreSQL y API REST
- **PostgreSQL**: Base de datos relacional robusta

## 📦 Instalación

### 1. Configurar Supabase

1. Crea una cuenta en [Supabase](https://supabase.com)
2. Crea un nuevo proyecto
3. Ve a **Settings > Database** y crea la tabla `repuestos`:

```sql
CREATE TABLE repuestos (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  sku VARCHAR(100) NOT NULL UNIQUE,
  motorcycle_brand VARCHAR(100) NOT NULL,
  category VARCHAR(100) NOT NULL,
  stock INTEGER NOT NULL DEFAULT 0,
  price DECIMAL(10,2) NOT NULL DEFAULT 0.00,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Crear índices para mejor rendimiento
CREATE INDEX idx_repuestos_sku ON repuestos(sku);
CREATE INDEX idx_repuestos_category ON repuestos(category);
CREATE INDEX idx_repuestos_brand ON repuestos(motorcycle_brand);
CREATE INDEX idx_repuestos_name ON repuestos(name);

-- Habilitar Row Level Security (RLS)
ALTER TABLE repuestos ENABLE ROW LEVEL SECURITY;

-- Crear política para permitir todas las operaciones (ajustar según necesidades)
CREATE POLICY "Enable all operations for all users" ON repuestos
  FOR ALL USING (true) WITH CHECK (true);
```

4. Obtén tus credenciales en **Settings > API**:
   - Project URL
   - anon public key

### 2. Configurar Variables de Entorno

1. Copia el archivo de ejemplo:
```bash
cp .env.example .env.local
```

2. Edita `.env.local` con tus credenciales de Supabase:
```env
NEXT_PUBLIC_SUPABASE_URL=tu_url_de_proyecto_supabase
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_clave_anon_de_supabase
```

### 3. Instalar y Ejecutar

1. Instala las dependencias:
```bash
npm install
```

2. Inicia el servidor de desarrollo:
```bash
npm run dev
```

3. Abre [http://localhost:3000](http://localhost:3000) en tu navegador.

## 🛠️ Uso

### Agregar un repuesto
1. Haz clic en "Nuevo Repuesto" en la esquina superior derecha
2. Completa todos los campos del formulario
3. Haz clic en "Guardar"

### Editar un repuesto
1. Haz clic en el ícono de editar (✏️) en la tarjeta del repuesto
2. Modifica los campos necesarios
3. Haz clic en "Guardar"

### Eliminar un repuesto
1. Haz clic en el ícono de eliminar (🗑️) en la tarjeta del repuesto
2. Confirma la eliminación

### Buscar repuestos
- Usa la barra de búsqueda para filtrar por nombre, SKU, marca o categoría
- Usa el selector de categorías para filtrar por tipo específico

## 📁 Estructura del Proyecto

```
moto-inv/
├── src/
│   ├── app/                 # App Router de Next.js
│   │   ├── globals.css      # Estilos globales
│   │   ├── layout.tsx       # Layout principal
│   │   └── page.tsx         # Página principal
│   ├── components/          # Componentes React
│   │   ├── PartCard.tsx     # Tarjeta de repuesto
│   │   └── PartModal.tsx    # Modal para crear/editar
│   ├── lib/                 # Utilidades
│   │   └── storage.ts       # Servicio LocalStorage
│   └── types/               # Tipos TypeScript
│       └── index.ts         # Definiciones de tipos
├── public/                  # Archivos estáticos
├── package.json            # Dependencias y scripts
├── tailwind.config.js      # Configuración de Tailwind
├── tsconfig.json           # Configuración de TypeScript
└── README.md               # Este archivo
```

## 🎨 Diseño

El proyecto utiliza una paleta de colores oscura inspirada en talleres mecánicos:
- **Fondo**: Gris oscuro (#1f2937)
- **Acentos**: Naranja (#f97316) para elementos interactivos
- **Texto**: Gris claro y blanco para buena legibilidad
- **Alertas**: Naranja para stock bajo, verde para precios

## 🔧 Scripts Disponibles

- `npm run dev` - Inicia servidor de desarrollo
- `npm run build` - Construye versión de producción
- `npm run start` - Inicia servidor de producción
- `npm run lint` - Ejecuta ESLint

## 📝 Notas

- Los datos se almacenan en Supabase (PostgreSQL)
- La aplicación se conecta a una base de datos real
- Los datos persisten entre dispositivos y sesiones
- Se requiere conexión a internet para funcionar
- La base de datos es escalable y segura

## 🚀 Despliegue

Puedes desplegar esta aplicación en cualquier plataforma que soporte Next.js:
- Vercel (recomendado)
- Netlify
- Railway
- DigitalOcean App Platform

## 📄 Licencia

MIT License - puedes usar este proyecto para fines comerciales o personales.
