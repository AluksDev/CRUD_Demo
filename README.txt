Proyecto: Sistema de Gestión de Productos, Clientes, Pedidos y Zonas
Este proyecto es una aplicación web desarrollada en JavaScript que permite gestionar productos, clientes, pedidos y zonas de distribución. Toda la información se guarda de forma local en el navegador utilizando localStorage.

Funcionalidades principales
Gestión de Productos

Crear, eliminar y actualizar productos (nombre, precio, stock).

Listado dinámico de productos con su información detallada.

Gestión de Clientes

Registrar nuevos clientes asociados a una zona.

Mostrar clientes disponibles para nuevos pedidos.

Gestión de Pedidos

Crear pedidos seleccionando cliente y productos.

Cálculo automático del precio total del pedido, aplicando la tarifa de la zona.

Actualización automática del stock tras realizar un pedido.

Visualización de pedidos recientes y estado (pendiente o enviado).

Gestión de Zonas

Crear nuevas zonas de entrega, asignándoles un porcentaje de tarifa.

Análisis de ingresos generados por cada zona.

Datos Simulados (Mock Data)

Funcionalidad para cargar datos de prueba rápidamente (productos, clientes, zonas y pedidos).

Estadísticas y Reportes

Resumen de pedidos totales, pendientes, enviados y facturación general.

Tabla de productos más vendidos.

Tabla de ingresos generados por zona.

Estructura Técnica
Programación Orientada a Objetos
Implementación de las clases Product, Client, Order, Zone y CollectionManager para estructurar la información.

Persistencia de Datos
Uso de localStorage para guardar las colecciones, permitiendo que los datos se conserven entre sesiones del navegador.

Interfaz Dinámica
La información se muestra y actualiza en tablas HTML mediante manipulación del DOM con JavaScript puro.

Librerías externas
Se utiliza Lodash para funciones de ordenamiento y búsqueda más eficientes (_.find, _.orderBy).

Notas adicionales
El programa incluye funciones auxiliares para la generación aleatoria de datos como precios, fechas y cantidades.

El diseño incluye ventanas flotantes (modales) para añadir productos, clientes y realizar actualizaciones.