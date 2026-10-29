# PRD: Asistente Normativo para Estudiantes de Arquitectura (NormaArq)

## 1. El Problema
Durante un anteproyecto o entrega, los estudiantes de Arquitectura necesitan localizar requisitos concretos dentro de normas, leyes y reglamentos en PDF extensos. Buscar manualmente entre muchas páginas consume tiempo y dificulta encontrar y citar la fuente exacta.
Esto puede llevar a pasar por alto información o dificultar la justificación normativa de una decisión de diseño (memoria descriptiva, láminas).
El problema aparece cuando el estudiante necesita verificar un requisito puntual con rapidez y demostrar dónde lo encontró.

## 2. El Usuario
- **Usuario principal:** Estudiante de Arquitectura que formula o ajusta un proyecto académico y debe verificar un requisito antes de tomar una decisión de diseño o entregar la lámina.
- **Situación de uso:** Carga el PDF, pregunta por un requisito concreto y necesita una explicación clara con la ubicación exacta para comprobarla y citarla.

## 3. Funciones Principales (MVP)
1. **Cargar un PDF:** Cargar documento normativo, validar legibilidad (OCR/texto seleccionable) y mostrar metadatos (nombre, páginas, estado).
2. **Hacer una consulta:** Preguntas en lenguaje natural sobre requisitos arquitectónicos y urbanísticos.
3. **Responder con evidencia:** 
   - Explicación en lenguaje accesible.
   - Referencia exacta: Número de página, artículo, numeral o tabla.
   - Fragmento textual verificado (snippet de respaldo).
   - Manejo de respuestas no encontradas (sin alucinaciones).
4. **Guardar Ficha Normativa:** Guardar pregunta, explicación técnica, cita textual, referencia exacta y etiquetas de proyecto (#Escaleras, #Accesibilidad).
5. **Biblioteca / Búsqueda de Fichas:** Explorador y buscador por palabras clave, filtros por proyecto o materia, y función para copiar/exportar citas para la memoria del proyecto.

## 4. Límites y No-Alcances (Disclaimers explícitos)
- No reemplaza la revisión ni responsabilidad profesional.
- No verifica vigencia legal externa (solo analiza el PDF cargado).
- No inventa información ausente (sin inferencias no fundamentadas).
- No certifica proyectos ni gestiona licencias ante entidades oficiales.
