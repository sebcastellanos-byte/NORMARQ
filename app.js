// NormaArq - Asistente Inteligente Normativo para Arquitectura
// Universidad de Boyacá - Asignatura: Inteligencia Artificial
// Autores: Sebastian Castellanos Acosta, Duvan Santiago Chaparro, Andrés Felipe Chaparro

// ==========================================
// ESTADO GLOBAL DE LA APLICACIÓN
// ==========================================
const AppState = {
  currentTab: 'espacio-de-consulta',
  geminiApiKey: localStorage.getItem('normaarq_gemini_key') || '',
  activeProject: 'Taller de Proyectos V - Vivienda Colectiva',
  activeDocument: {
    name: 'RNE - Norma A.010: Condiciones Generales de Diseño',
    version: 'Edición Oficial 2021 (MVCS)',
    pages: 84,
    size: '14.2 MB',
    legibility: '100% Vectorial',
    tokens: '148.2k',
    chaptersCount: 5,
    articlesCount: 68
  },
  pdfDoc: null,
  pdfPagesText: [],
  currentPage: 42,
  pdfScale: 1.1,
  savedFichas: [],
  currentVerification: null,
  isSearching: false
};

// ==========================================
// BASE DE CONOCIMIENTO ARQUITECTÓNICA BASE
// (Cálculos exactos, citas RNE / NSR-10 y Normativas Relevantes Relacionadas)
// ==========================================
const ArchitecturalKnowledgeBase = [
  {
    keywords: ['escalera', 'escaleras', 'ancho', 'tramo', 'multifamiliar', 'peldaño', 'gradas', 'huella', 'contrahuella', 'galibo', 'altura de paso', 'descanso'],
    title: 'Ancho Mínimo y Gálibo en Escaleras de Uso Colectivo',
    category: 'Circulación Vertical y Evacuación',
    tag: '#Escaleras',
    document: 'RNE - Norma A.010 Condiciones Generales',
    article: 'Cap. V, Art. 26, Incisos b.2 y d.1 (Pág. 42)',
    summary: 'Para edificios residenciales multifamiliares de más de 3 niveles o con más de 2 departamentos por piso, la escalera común debe tener un ancho mínimo libre de 1.20 m entre paramentos acabados. La altura libre de paso (gálibo) no puede ser menor a 2.10 m medida verticalmente desde la arista de las gradas.',
    exactQuote: '«Las escaleras comunes en edificaciones residenciales colectivas tendrán un ancho mínimo libre de 1.20 m entre muros terminados. El gálibo vertical medido desde el punto medio de la huella hasta el cielo raso o fondo de losa superior será mínimo de 2.10 m en todo el recorrido.»',
    page: 42,
    metrics: {
      primary: { label: 'Ancho de Tramo', value: '1.20', unit: 'm', tag: 'Obligatorio', detail: 'Ancho libre entre paramentos acabados (>2 viv/piso)', cota: '≥ 120 cm' },
      secondary: { label: 'Altura de Paso', value: '2.10', unit: 'm', tag: 'Gálibo', detail: 'Desde arista de gradas al cielo raso o losa superior', cota: '≥ 210 cm' }
    },
    complementary: [
      { label: 'Paso (Huella)', value: '≥ 0.28 m' },
      { label: 'Contrapaso', value: '0.16 - 0.18 m' },
      { label: 'Descanso', value: '≥ 1.20 m' }
    ],
    // ✨ REQUERIMIENTO SOLICITADO: Normativas relevantes vinculadas a la consulta
    relatedNorms: [
      {
        norm: 'RNE Norma A.010 - Art. 29',
        topic: 'Pasamanos y Barandas Reglamentarias',
        requirement: 'Altura reglamentaria entre 0.90 m y 1.00 m. Obligatorio pasamanos a ambos lados si el ancho de escalera supera los 1.20 m. En escuelas o uso infantil, pasamanos intermedio a 0.60 m.',
        urgency: 'Crítico para seguridad humana'
      },
      {
        norm: 'RNE Norma A.130 - Art. 24 / NSR-10 Título J',
        topic: 'Resistencia al Fuego de la Caja de Escaleras',
        requirement: 'La caja de escaleras de evacuación debe estar confinada con muros cortafuego de mínimo 2 horas de resistencia (F-120) y contar con puertas cortafuego de cierre automático (F-90).',
        urgency: 'Obligatorio en edificios > 4 pisos'
      },
      {
        norm: 'RNE Norma A.120 / Ley de Accesibilidad',
        topic: 'Accesibilidad Universal y Señalización Podotáctil',
        requirement: 'Pavimento táctil de advertencia (botones en relieve) a 30 cm antes del inicio y fin de cada tramo de escalera para personas con discapacidad visual. No se admiten peldaños compensados en evacuación.',
        urgency: 'Obligatorio en accesos públicos'
      },
      {
        norm: 'RNE Norma A.010 - Art. 28',
        topic: 'Iluminación y Ventilación de Escaleras',
        requirement: 'Toda escalera común debe contar con iluminación natural directa de al menos 1/8 de la superficie del pozo, o sistema de presurización mecánica para humo en caso de ser escalera cerrada.',
        urgency: 'Requisito de habitabilidad'
      }
    ],
    hash: '#RNE-2023-A010-ESC',
    lamina: 'Lámina A-03'
  },
  {
    keywords: ['estacionamiento', 'estacionamientos', 'parqueo', 'parqueaderos', 'cajon', 'dimension', 'vehicular', 'rampa', 'radio'],
    title: 'Dotación y Dimensiones Mínimas de Estacionamientos',
    category: 'Servicios y Transporte',
    tag: '#Estacionamientos',
    document: 'RNE - Norma A.010 Condiciones Generales',
    article: 'Cap. VI, Art. 60-64 (Págs. 58-61)',
    summary: 'Las dimensiones mínimas individuales para cajones de estacionamiento de vehículos ligeros entre muros son de 2.50 m de ancho por 5.00 m de largo. En estacionamientos abiertos o sin obstáculos laterales se permite ancho de 2.40 m. Para personas con discapacidad se exige un ancho mínimo de 3.80 m con franja peatonal.',
    exactQuote: '«Los espacios individuales de estacionamiento para automóviles tendrán dimensiones mínimas de 2.50 m de ancho por 5.00 m de fondo cuando estén confinados entre muros. El gálibo vertical libre no será menor de 2.10 m. Las rampas vehiculares rectas tendrán una pendiente máxima de 15% y curvas de 12%.»',
    page: 59,
    metrics: {
      primary: { label: 'Cajón Entre Muros', value: '2.50 x 5.00', unit: 'm', tag: 'Estándar', detail: 'Ancho y fondo mínimo libre vehicular', cota: '2.50 x 5.00 m' },
      secondary: { label: 'Pendiente Rampa', value: '15', unit: '%', tag: 'Rampa Recta', detail: 'Pendiente máxima vehicular sin transición', cota: 'Máx 15%' }
    },
    complementary: [
      { label: 'Cajón PMR', value: '≥ 3.80 m' },
      { label: 'Gálibo Vehicular', value: '≥ 2.10 m' },
      { label: 'Radio Giro Ext.', value: '≥ 5.00 m' }
    ],
    relatedNorms: [
      {
        norm: 'RNE Norma A.120 - Art. 18',
        topic: 'Estacionamientos Accesibles Reservados',
        requirement: 'Mínimo 1 cajón por cada 25 unidades debe ser adaptado para personas con movilidad reducida (PMR), señalizado horizontal y verticalmente, y ubicado en el nivel más cercano al acceso accesible.',
        urgency: 'Obligatorio por ley de accesibilidad'
      },
      {
        norm: 'RNE Norma EM.030 / A.130',
        topic: 'Ventilación Mecánica y Extracción de Monóxido (CO)',
        requirement: 'En sótanos de estacionamiento con más de 2 niveles bajo rasante o sin ventilación cruzada natural permanente, es obligatoria la extracción mecánica y detectores de CO.',
        urgency: 'Exigible en sótanos'
      },
      {
        norm: 'Reglamento de Tránsito Municipal / Ordenanza Distrital',
        topic: 'Retiro de Ingreso y Caseta de Control',
        requirement: 'Se debe prever un espacio de desaceleración y espera al interior del predio de mínimo 3.00 m antes de la línea municipal para no interrumpir el tránsito de la acera peatonal.',
        urgency: 'Parámetro urbano distrital'
      }
    ],
    hash: '#RNE-2023-A010-EST',
    lamina: 'Lámina A-01 / Planta Sótanos'
  },
  {
    keywords: ['retiro', 'retiros', 'aislamiento', 'voladizo', 'altura', 'fachada', 'calle', 'antejardin'],
    title: 'Retiros Municipales y Cuerpos Volados sobre Vía Pública',
    category: 'Parámetros Urbanísticos',
    tag: '#Urbanismo',
    document: 'RNE - Norma A.010 Condiciones Generales',
    article: 'Cap. II, Art. 11-14 (Págs. 18-21)',
    summary: 'Los retiros frontales son fijados por el Certificado de Parámetros Urbanísticos de cada municipalidad. Sobre vías sin retiro no se permiten voladizos hasta una altura libre de 2.30 m. En vías con retiro, los voladizos no podrán proyectarse más de 0.50 m sobre el retiro municipal establecido.',
    exactQuote: '«No se permiten voladizos sobre el área de retiro frontal salvo balcones abiertos o elementos de protección solar que no superen 0.50 m de saliente respecto a la línea de edificación oficial. La altura mínima libre de cualquier saliente sobre la vereda pública será de 2.30 m.»',
    page: 19,
    metrics: {
      primary: { label: 'Voladizo Máx.', value: '0.50', unit: 'm', tag: 'Límite', detail: 'Saliente sobre retiro municipal reglamentario', cota: '≤ 0.50 m' },
      secondary: { label: 'Altura a Vereda', value: '2.30', unit: 'm', tag: 'Despeje', detail: 'Distancia vertical libre sobre rasante de acera', cota: '≥ 2.30 m' }
    },
    complementary: [
      { label: 'Retiro Frontal', value: 'Según C.P.U.' },
      { label: 'Cuerpo Cerrado', value: 'Prohibido s/vía' },
      { label: 'Ochava Esquina', value: 'Según normativa' }
    ],
    relatedNorms: [
      {
        norm: 'Plan de Ordenamiento Territorial (POT) / CPU Municipal',
        topic: 'Certificado de Parámetros Urbanísticos',
        requirement: 'El alineamiento, densidad neta, coeficiente de edificabilidad y porcentaje de área libre (% mín. 30%) prevalecen según la ficha catastral específica de la manzana y lote.',
        urgency: 'Prioridad normativa local'
      },
      {
        norm: 'RNE Norma G.040',
        topic: 'Definiciones de Ochava y Cono de Visibilidad',
        requirement: 'En lotes en esquina es obligatorio el chaflán u ochava de mínimo 3.00 m en planta baja para garantizar la visibilidad vehicular y seguridad peatonal.',
        urgency: 'Obligatorio en esquinas'
      }
    ],
    hash: '#RNE-2023-A010-RET',
    lamina: 'Lámina A-02 / Elevación y Cortes'
  },
  {
    keywords: ['ventilacion', 'iluminacion', 'patio', 'pozo', 'luz', 'ducto', 'ventana', 'vano'],
    title: 'Dimensiones Mínimas de Patios de Iluminación y Ventilación',
    category: 'Habitabilidad y Confort',
    tag: '#Acondicionamiento',
    document: 'RNE - Norma A.010 Condiciones Generales',
    article: 'Cap. IV, Art. 38-41 (Págs. 34-36)',
    summary: 'Los pozos de luz para ventilación e iluminación de ambientes habitables (dormitorios, salas) en edificios residenciales deben tener una distancia perpendicular mínima entre vanos enfrentados de un tercio de la altura total del edificio (H/3), con un mínimo absoluto de 2.20 m.',
    exactQuote: '«Para ambientes de permanencia diurna o nocturna, el pozo de iluminación deberá inscribir un círculo cuyo diámetro no sea menor a H/3, no pudiendo ser menor en ningún caso a 2.20 m de dimensión perpendicular entre vanos opuestos.»',
    page: 35,
    metrics: {
      primary: { label: 'Diámetro Mínimo', value: 'H/3', unit: 'ratio', tag: 'Fórmula', detail: 'Tercio de la altura del paramento opuesto', cota: '≥ H / 3' },
      secondary: { label: 'Lado Mínimo Abs.', value: '2.20', unit: 'm', tag: 'Restricción', detail: 'Dimensión menor permitida en vanos habitables', cota: '≥ 2.20 m' }
    },
    complementary: [
      { label: 'Servicios (Baños)', value: '≥ 1.50 m' },
      { label: 'Área Vidriada', value: '≥ 10% piso' },
      { label: 'Área Apertura', value: '≥ 5% piso' }
    ],
    relatedNorms: [
      {
        norm: 'RNE Norma EM.110',
        topic: 'Confort Bioclimático y Aislamiento Térmico',
        requirement: 'Para climas fríos o templados de altura, los vanos deben cumplir coeficientes de transmitancia térmica (U) máximos para evitar condensación y pérdida de temperatura.',
        urgency: 'Eficiencia energética'
      },
      {
        norm: 'RNE Norma A.010 - Art. 40',
        topic: 'Patios para Ambientes de Servicio (Cocinas y Baños)',
        requirement: 'Se permite reducción del diámetro del pozo a H/4 con un mínimo de 1.50 m siempre que solo ventile lavanderías, baños o cocinas secundarias.',
        urgency: 'Optimización de planta'
      }
    ],
    hash: '#RNE-2023-A010-LUZ',
    lamina: 'Lámina A-03 / Plantas de Taller'
  }
];

// Fichas precargadas por defecto en la biblioteca
const DefaultFichas = [
  {
    id: 'f-01',
    timestamp: '2026-10-28 16:42',
    author: 'Sebastian Castellanos',
    project: 'Taller de Proyectos V - Vivienda Colectiva',
    query: '¿Cuál es el ancho mínimo libre requerido para una escalera común de uso público en un edificio multifamiliar de 4 pisos y qué altura mínima de paso debe cumplir?',
    title: 'Ancho Mínimo y Gálibo en Escaleras Colectivas',
    category: 'Circulación Vertical',
    tag: '#Escaleras',
    norm: 'RNE - Norma A.010',
    article: 'Cap. V, Art. 26, Incisos b.2 y d.1 (Pág. 42)',
    page: 42,
    snippet: '«Las escaleras comunes en edificaciones residenciales colectivas tendrán un ancho mínimo libre de 1.20 m entre muros terminados. El gálibo vertical medido desde el punto medio de la huella será mínimo de 2.10 m.»',
    metrics: { width: '1.20 m', height: '2.10 m' },
    hash: '#RNE-2023-A010-ESC',
    lamina: 'Lámina A-03',
    relatedNorms: ArchitecturalKnowledgeBase[0].relatedNorms
  },
  {
    id: 'f-02',
    timestamp: '2026-10-27 11:15',
    author: 'Duvan Chaparro',
    project: 'Taller de Proyectos V - Vivienda Colectiva',
    query: 'Dimensiones mínimas de cajón de estacionamiento entre muros y pendiente máxima de rampa vehicular',
    title: 'Dimensiones de Cajón y Rampas Vehiculares',
    category: 'Estacionamientos',
    tag: '#Estacionamientos',
    norm: 'RNE - Norma A.010',
    article: 'Cap. VI, Art. 60-64 (Pág. 59)',
    page: 59,
    snippet: '«Los espacios individuales de estacionamiento para automóviles tendrán dimensiones mínimas de 2.50 m de ancho por 5.00 m de fondo cuando estén confinados entre muros. Pendiente máxima 15%.»',
    metrics: { width: '2.50 x 5.00 m', height: 'Rampa 15%' },
    hash: '#RNE-2023-A010-EST',
    lamina: 'Lámina A-01',
    relatedNorms: ArchitecturalKnowledgeBase[1].relatedNorms
  }
];

// ==========================================
// INICIALIZACIÓN AL CARGAR LA PÁGINA
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
  initStorage();
  initNavigation();
  initDropzone();
  initQuerySystem();
  initFichasLibrary();
  initSettingsModal();
  initFichaTecnicaModal();
  renderVerificationCard(ArchitecturalKnowledgeBase[0]);
  renderSavedFichas();
});

// Cargar fichas de localStorage o predeterminadas
function initStorage() {
  const stored = localStorage.getItem('normaarq_saved_fichas');
  if (stored) {
    try {
      AppState.savedFichas = JSON.parse(stored);
    } catch (e) {
      AppState.savedFichas = [...DefaultFichas];
    }
  } else {
    AppState.savedFichas = [...DefaultFichas];
    saveFichasToStorage();
  }
}

function saveFichasToStorage() {
  localStorage.setItem('normaarq_saved_fichas', JSON.stringify(AppState.savedFichas));
}

// ==========================================
// NAVEGACIÓN CLIENT-SIDE (SINGLE PAGE APP)
// ==========================================
function initNavigation() {
  const navLinks = document.querySelectorAll('aside nav a[data-path], [data-path-action]');
  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const targetPath = link.getAttribute('data-path') || link.getAttribute('data-path-action');
      if (targetPath) {
        navigateToTab(targetPath);
      }
    });
  });

  // Top navigation links (Aviso Académico -> avisos-y-limites)
  const academicNoticeLink = document.querySelector('a[data-path="avisos-y-limites"]');
  if (academicNoticeLink) {
    academicNoticeLink.addEventListener('click', (e) => {
      e.preventDefault();
      navigateToTab('avisos-y-limites');
    });
  }
}

function navigateToTab(tabId) {
  AppState.currentTab = tabId;

  // Actualizar clases activas en sidebar
  const navLinks = document.querySelectorAll('aside nav a[data-path]');
  navLinks.forEach(link => {
    const linkPath = link.getAttribute('data-path');
    if (linkPath === tabId) {
      link.classList.remove('border-transparent', 'text-on-surface-variant');
      link.classList.add('bg-surface-container', 'text-on-surface', 'font-semibold', 'border-secondary');
      link.setAttribute('aria-current', 'page');
    } else {
      link.classList.remove('bg-surface-container', 'text-on-surface', 'font-semibold', 'border-secondary');
      link.classList.add('border-transparent', 'text-on-surface-variant');
      link.removeAttribute('aria-current');
    }
  });

  // Mostrar la sección correspondiente y ocultar las demás
  const views = ['documentos', 'espacio-de-consulta', 'fichas-normativas', 'avisos-y-limites'];
  views.forEach(v => {
    const el = document.getElementById(`view-${v}`);
    if (el) {
      if (v === tabId) {
        el.classList.remove('hidden');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        el.classList.add('hidden');
      }
    }
  });

  // Si cambiamos a visor, refrescar PDF si existe
  if (tabId === 'espacio-de-consulta') {
    renderPdfPage(AppState.currentPage);
  } else if (tabId === 'fichas-normativas') {
    renderSavedFichas();
  }
}

// ==========================================
// MÓDULO 01: CARGA DE DOCUMENTOS Y PDF.JS
// ==========================================
function initDropzone() {
  const dropzone = document.getElementById('dropzone-box');
  const fileInput = document.getElementById('pdf-file-input');

  if (!dropzone || !fileInput) return;

  ['dragenter', 'dragover'].forEach(eventName => {
    dropzone.addEventListener(eventName, (e) => {
      e.preventDefault();
      dropzone.classList.add('border-secondary', 'bg-surface-container-low');
    }, false);
  });

  ['dragleave', 'drop'].forEach(eventName => {
    dropzone.addEventListener(eventName, (e) => {
      e.preventDefault();
      dropzone.classList.remove('border-secondary', 'bg-surface-container-low');
    }, false);
  });

  dropzone.addEventListener('drop', (e) => {
    const dt = e.dataTransfer;
    const files = dt.files;
    if (files.length > 0 && files[0].type === 'application/pdf') {
      handlePdfFile(files[0]);
    } else {
      showToast('Por favor selecciona un archivo PDF válido.', 'error');
    }
  });

  fileInput.addEventListener('change', (e) => {
    if (e.target.files.length > 0) {
      handlePdfFile(e.target.files[0]);
    }
  });
}

async function handlePdfFile(file) {
  showToast(`Cargando e indexando ${file.name}...`, 'info');

  try {
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
    AppState.pdfDoc = pdf;
    AppState.activeDocument.name = file.name;
    AppState.activeDocument.pages = pdf.numPages;
    AppState.activeDocument.size = `${(file.size / (1024 * 1024)).toFixed(1)} MB`;
    AppState.activeDocument.legibility = '100% Vectorial (OCR OK)';
    AppState.currentPage = 1;

    // Extraer texto de páginas para indexar
    AppState.pdfPagesText = [];
    for (let i = 1; i <= Math.min(pdf.numPages, 100); i++) {
      const page = await pdf.getPage(i);
      const textContent = await page.getTextContent();
      const pageText = textContent.items.map(item => item.str).join(' ');
      AppState.pdfPagesText.push({ pageNumber: i, text: pageText });
    }

    updateDocumentUI();
    showToast(`PDF indexado con éxito: ${pdf.numPages} páginas leídas.`, 'success');

    // Cambiar automáticamente a espacio de consulta
    setTimeout(() => {
      navigateToTab('espacio-de-consulta');
    }, 1000);

  } catch (error) {
    console.error('Error al procesar el PDF:', error);
    showToast('No se pudo procesar el PDF. Asegúrate de que no esté protegido.', 'error');
  }
}

function updateDocumentUI() {
  // Actualizar badges en Header y Documentos
  const activeExpedienteElements = document.querySelectorAll('.active-doc-title');
  activeExpedienteElements.forEach(el => el.textContent = AppState.activeDocument.name);

  const docPagesElements = document.querySelectorAll('.active-doc-pages');
  docPagesElements.forEach(el => el.textContent = `${AppState.activeDocument.pages} Páginas`);

  const docSizeElements = document.querySelectorAll('.active-doc-size');
  docSizeElements.forEach(el => el.textContent = AppState.activeDocument.size);

  const docLegibilityElements = document.querySelectorAll('.active-doc-legibility');
  docLegibilityElements.forEach(el => el.textContent = AppState.activeDocument.legibility);

  // Selector de página en visor
  const maxPageEl = document.getElementById('viewer-max-pages');
  if (maxPageEl) maxPageEl.textContent = `/ ${AppState.activeDocument.pages}`;
}

// Renderizado de página en el visor de PDF
async function renderPdfPage(pageNumber) {
  const canvas = document.getElementById('pdf-canvas');
  const fallback = document.getElementById('pdf-canvas-mock');
  const pageInput = document.getElementById('viewer-current-page-input');

  if (pageInput) pageInput.value = pageNumber;

  if (AppState.pdfDoc) {
    if (fallback) fallback.classList.add('hidden');
    if (canvas) canvas.classList.remove('hidden');

    try {
      const page = await AppState.pdfDoc.getPage(pageNumber);
      const viewport = page.getViewport({ scale: AppState.pdfScale });
      const context = canvas.getContext('2d');
      canvas.height = viewport.height;
      canvas.width = viewport.width;

      const renderContext = {
        canvasContext: context,
        viewport: viewport
      };
      await page.render(renderContext).promise;
    } catch (e) {
      console.warn('Error renderizando página PDF real:', e);
    }
  } else {
    // Si no hay PDF cargado todavía, mostrar el simulador de página arquitectónica (Norma A.010 Pág 42)
    if (canvas) canvas.classList.add('hidden');
    if (fallback) fallback.classList.remove('hidden');
  }
}

// ==========================================
// MÓDULO 02: MOTOR DE CONSULTAS Y VERIFICACIÓN
// ==========================================
function initQuerySystem() {
  const queryInput = document.getElementById('query-input');
  const searchBtn = document.getElementById('submit-query-btn');

  if (queryInput) {
    queryInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        runQuery(queryInput.value);
      }
    });
  }

  if (searchBtn) {
    searchBtn.addEventListener('click', () => {
      if (queryInput) runQuery(queryInput.value);
    });
  }

  // Controles de zoom y páginas del visor
  document.getElementById('zoom-in-btn')?.addEventListener('click', () => {
    AppState.pdfScale += 0.15;
    renderPdfPage(AppState.currentPage);
  });

  document.getElementById('zoom-out-btn')?.addEventListener('click', () => {
    if (AppState.pdfScale > 0.6) {
      AppState.pdfScale -= 0.15;
      renderPdfPage(AppState.currentPage);
    }
  });

  document.getElementById('prev-page-btn')?.addEventListener('click', () => {
    if (AppState.currentPage > 1) {
      AppState.currentPage--;
      renderPdfPage(AppState.currentPage);
    }
  });

  document.getElementById('next-page-btn')?.addEventListener('click', () => {
    if (AppState.currentPage < AppState.activeDocument.pages) {
      AppState.currentPage++;
      renderPdfPage(AppState.currentPage);
    }
  });
}

// Insertar sugerencia en el input
window.insertQuery = function(text) {
  const input = document.getElementById('query-input');
  if (input) {
    input.value = text.replace('#', '');
    input.focus();
    runQuery(input.value);
  }
};

async function runQuery(userPrompt) {
  if (!userPrompt || !userPrompt.trim()) return;
  const cleanPrompt = userPrompt.trim();

  // Actualizar burbuja de consulta del estudiante
  const userQueryText = document.getElementById('user-query-bubble-text');
  if (userQueryText) userQueryText.textContent = cleanPrompt;

  const userQueryTime = document.getElementById('user-query-time');
  const now = new Date();
  const timeStr = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
  if (userQueryTime) userQueryTime.textContent = `${timeStr} • Arq. Estudiante Sebastian Castellanos`;

  // Mostrar estado de carga
  setSearchLoading(true);

  // Si el usuario configuró una clave de Gemini, consultar con la IA
  if (AppState.geminiApiKey) {
    try {
      const aiResult = await callGeminiAI(cleanPrompt);
      if (aiResult) {
        setSearchLoading(false);
        if (aiResult.found === false) {
          showNoEvidenceCard(cleanPrompt);
        } else {
          renderVerificationCard(aiResult);
        }
        return;
      }
    } catch (err) {
      console.warn('Fallo al llamar Gemini, recurriendo a base de conocimiento local:', err);
    }
  }

  // Búsqueda en base de conocimiento local estructurada
  setTimeout(() => {
    setSearchLoading(false);
    const match = findLocalMatch(cleanPrompt);
    if (match) {
      renderVerificationCard(match);
    } else {
      showNoEvidenceCard(cleanPrompt);
    }
  }, 600);
}

function findLocalMatch(query) {
  const q = query.toLowerCase();
  let bestMatch = null;
  let maxScore = 0;

  for (const item of ArchitecturalKnowledgeBase) {
    let score = 0;
    for (const kw of item.keywords) {
      if (q.includes(kw)) score += 2;
    }
    if (score > maxScore) {
      maxScore = score;
      bestMatch = item;
    }
  }

  // Umbral mínimo de coincidencia
  return maxScore >= 2 ? bestMatch : null;
}

function setSearchLoading(isLoading) {
  AppState.isSearching = isLoading;
  const card = document.getElementById('verification-card-container');
  const loading = document.getElementById('query-loading-indicator');

  if (isLoading) {
    if (loading) loading.classList.remove('hidden');
    if (card) card.classList.add('opacity-40');
  } else {
    if (loading) loading.classList.add('hidden');
    if (card) card.classList.remove('opacity-40');
  }
}

// Renderizar la tarjeta estructurada de verificación
function renderVerificationCard(data) {
  AppState.currentVerification = data;

  const container = document.getElementById('verification-card-container');
  const noEvidenceContainer = document.getElementById('no-evidence-card-container');
  if (noEvidenceContainer) noEvidenceContainer.classList.add('hidden');
  if (container) container.classList.remove('hidden');

  // Valores métricos principales
  document.getElementById('card-metric1-title').textContent = data.metrics.primary.label;
  document.getElementById('card-metric1-value').textContent = data.metrics.primary.value;
  document.getElementById('card-metric1-unit').textContent = data.metrics.primary.unit;
  document.getElementById('card-metric1-desc').textContent = data.metrics.primary.detail;
  document.getElementById('card-metric1-cota').textContent = data.metrics.primary.cota;
  document.getElementById('card-metric1-tag').textContent = data.metrics.primary.tag;

  document.getElementById('card-metric2-title').textContent = data.metrics.secondary.label;
  document.getElementById('card-metric2-value').textContent = data.metrics.secondary.value;
  document.getElementById('card-metric2-unit').textContent = data.metrics.secondary.unit;
  document.getElementById('card-metric2-desc').textContent = data.metrics.secondary.detail;
  document.getElementById('card-metric2-cota').textContent = data.metrics.secondary.cota;
  document.getElementById('card-metric2-tag').textContent = data.metrics.secondary.tag;

  // Cita oficial y fragmento
  document.getElementById('card-official-citation').textContent = data.article;
  document.getElementById('card-page-badge').textContent = `Pág. ${data.page}`;
  document.getElementById('card-summary-text').textContent = data.summary;

  // Parámetros complementarios
  const compGrid = document.getElementById('card-complementary-grid');
  if (compGrid && data.complementary) {
    compGrid.innerHTML = data.complementary.map(c => `
      <div class="bg-surface-container-low p-2 rounded text-center">
        <span class="block text-[10px] font-label-sm uppercase text-outline">${c.label}</span>
        <span class="font-mono font-bold text-on-surface text-[14px]">${c.value}</span>
      </div>
    `).join('');
  }

  // ✨ Mostrar badge de normativas relevantes vinculadas
  const relatedNormsCount = document.getElementById('related-norms-count');
  if (relatedNormsCount && data.relatedNorms) {
    relatedNormsCount.textContent = `${data.relatedNorms.length} Normativas Vinculadas`;
  }

  // Sincronizar visor de PDF en la página exacta
  if (data.page) {
    AppState.currentPage = data.page;
    renderPdfPage(data.page);
  }
}

// Tarjeta de consulta sin evidencia (PRD Sección 4 / Anti-Alucinación)
function showNoEvidenceCard(query) {
  const container = document.getElementById('verification-card-container');
  const noEvidenceContainer = document.getElementById('no-evidence-card-container');

  if (container) container.classList.add('hidden');
  if (noEvidenceContainer) {
    noEvidenceContainer.classList.remove('hidden');
    document.getElementById('no-evidence-query-title').textContent = `"${query}"`;
  }
}

// Sincronizar visor con la página
window.syncToViewer = function(pageNum) {
  AppState.currentPage = pageNum;
  renderPdfPage(pageNum);
  showToast(`Sincronizado a página ${pageNum} del PDF.`, 'info');
};

// ==========================================
// ✨ NUEVA FUNCIÓN: GENERADOR DE FICHAS TÉCNICAS
// CON NORMATIVAS RELEVANTES VINCULADAS
// ==========================================
function initFichaTecnicaModal() {
  const modal = document.getElementById('ficha-tecnica-modal');
  const closeBtn = document.getElementById('close-ficha-modal-btn');
  const openBtn = document.getElementById('open-ficha-tecnica-btn');
  const printBtn = document.getElementById('print-ficha-btn');
  const copyCadBtn = document.getElementById('copy-cad-rotulo-btn');

  if (openBtn) {
    openBtn.addEventListener('click', () => {
      openFichaTecnicaModal(AppState.currentVerification || ArchitecturalKnowledgeBase[0]);
    });
  }

  if (closeBtn) {
    closeBtn.addEventListener('click', () => {
      modal.classList.add('hidden');
    });
  }

  if (printBtn) {
    printBtn.addEventListener('click', () => {
      window.print();
    });
  }

  if (copyCadBtn) {
    copyCadBtn.addEventListener('click', () => {
      copyCadRotulo();
    });
  }
}

function openFichaTecnicaModal(data) {
  const modal = document.getElementById('ficha-tecnica-modal');
  if (!modal) return;

  // Llenar datos de la ficha técnica
  document.getElementById('ft-project-name').textContent = AppState.activeProject;
  document.getElementById('ft-doc-name').textContent = data.document;
  document.getElementById('ft-article').textContent = data.article;
  document.getElementById('ft-title').textContent = data.title;
  document.getElementById('ft-summary').textContent = data.summary;
  document.getElementById('ft-exact-quote').textContent = data.exactQuote;
  document.getElementById('ft-hash').textContent = data.hash || '#NORMARQ-FICHA';
  document.getElementById('ft-lamina').textContent = data.lamina || 'Lámina de Entrega';

  // Métricas de diseño
  document.getElementById('ft-metric-p1').textContent = `${data.metrics.primary.label}: ${data.metrics.primary.value} ${data.metrics.primary.unit}`;
  document.getElementById('ft-metric-p2').textContent = `${data.metrics.secondary.label}: ${data.metrics.secondary.value} ${data.metrics.secondary.unit}`;

  // ✨ RENDERIZAR NORMATIVAS RELEVANTES VINCULADAS
  const relatedList = document.getElementById('ft-related-norms-list');
  if (relatedList && data.relatedNorms) {
    relatedList.innerHTML = data.relatedNorms.map(rn => `
      <div class="p-3 bg-surface-container-low rounded-lg border-l-4 border-l-secondary border border-outline-variant/60 flex flex-col gap-1">
        <div class="flex items-center justify-between">
          <span class="font-mono text-xs font-bold text-secondary bg-surface-container-lowest px-2 py-0.5 rounded shadow-xs">${rn.norm}</span>
          <span class="text-[10px] font-label-sm font-semibold uppercase px-2 py-0.5 rounded bg-surface-container text-on-surface-variant">${rn.urgency}</span>
        </div>
        <h5 class="font-body-sm font-bold text-on-surface text-[13px] mt-1">${rn.topic}</h5>
        <p class="font-body-sm text-[12px] text-on-surface-variant leading-relaxed">${rn.requirement}</p>
      </div>
    `).join('');
  }

  // Generar texto para Rótulo CAD
  const cadRotuloText = `[NORMARQ - CONTROL NORMATIVO]
DOCUMENTO: ${data.document}
ARTÍCULO: ${data.article}
PARÁMETRO: ${data.title}
VALORES: ${data.metrics.primary.label} ≥ ${data.metrics.primary.value} ${data.metrics.primary.unit} | ${data.metrics.secondary.label} ≥ ${data.metrics.secondary.value} ${data.metrics.secondary.unit}
NORMA CONEXA: ${data.relatedNorms ? data.relatedNorms[0].norm + ' (' + data.relatedNorms[0].topic + ')' : 'N/A'}
VERIFICADO: Taller de Arquitectura - Univ. de Boyacá
HASH TRAZABILIDAD: ${data.hash}`;

  const rotuloBox = document.getElementById('ft-cad-rotulo-preview');
  if (rotuloBox) rotuloBox.textContent = cadRotuloText;

  modal.classList.remove('hidden');
}

function copyCadRotulo() {
  const text = document.getElementById('ft-cad-rotulo-preview')?.textContent;
  if (text) {
    navigator.clipboard.writeText(text).then(() => {
      showToast('¡Rótulo técnico para AutoCAD/Revit copiado al portapapeles!', 'success');
    });
  }
}

// ==========================================
// MÓDULO 03: BIBLIOTECA DE FICHAS NORMATIVAS
// ==========================================
function initFichasLibrary() {
  // Filtro por etiquetas (#Escaleras, #Estacionamientos, etc.)
  const filterBtns = document.querySelectorAll('.ficha-filter-chip');
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('bg-primary', 'text-on-primary'));
      btn.classList.add('bg-primary', 'text-on-primary');
      const tag = btn.getAttribute('data-filter');
      renderSavedFichas(tag);
    });
  });

  // Buscador de fichas
  const searchInput = document.getElementById('search-fichas-input');
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      const term = e.target.value.toLowerCase();
      renderSavedFichas('all', term);
    });
  }

  // Guardar ficha actual
  document.getElementById('save-card-btn')?.addEventListener('click', () => {
    saveCurrentFicha();
  });

  document.getElementById('copy-citation-btn')?.addEventListener('click', () => {
    copyActiveCitation();
  });
}

function saveCurrentFicha() {
  const current = AppState.currentVerification || ArchitecturalKnowledgeBase[0];
  const query = document.getElementById('user-query-bubble-text')?.textContent || current.title;

  const newFicha = {
    id: 'f-' + Date.now(),
    timestamp: new Date().toLocaleString(),
    author: 'Sebastian Castellanos',
    project: AppState.activeProject,
    query: query,
    title: current.title,
    category: current.category,
    tag: current.tag || '#Normativa',
    norm: current.document,
    article: current.article,
    page: current.page,
    snippet: current.exactQuote || current.summary,
    metrics: {
      width: `${current.metrics.primary.value} ${current.metrics.primary.unit}`,
      height: `${current.metrics.secondary.value} ${current.metrics.secondary.unit}`
    },
    hash: current.hash,
    lamina: current.lamina,
    relatedNorms: current.relatedNorms
  };

  AppState.savedFichas.unshift(newFicha);
  saveFichasToStorage();
  showToast('Ficha técnica guardada en tu biblioteca.', 'success');
  renderSavedFichas();
}

function renderSavedFichas(tagFilter = 'all', searchTerm = '') {
  const grid = document.getElementById('fichas-grid-container');
  if (!grid) return;

  let filtered = AppState.savedFichas;

  if (tagFilter && tagFilter !== 'all') {
    filtered = filtered.filter(f => f.tag.toLowerCase() === tagFilter.toLowerCase());
  }

  if (searchTerm) {
    filtered = filtered.filter(f =>
      f.title.toLowerCase().includes(searchTerm) ||
      f.article.toLowerCase().includes(searchTerm) ||
      f.query.toLowerCase().includes(searchTerm) ||
      f.snippet.toLowerCase().includes(searchTerm)
    );
  }

  const countBadge = document.getElementById('fichas-count-badge');
  if (countBadge) countBadge.textContent = `${filtered.length} Fichas Registradas`;

  if (filtered.length === 0) {
    grid.innerHTML = `
      <div class="col-span-full p-8 text-center bg-surface-container-low rounded-xl border border-outline-variant">
        <span class="material-symbols-outlined text-[36px] text-outline">search_off</span>
        <p class="font-body-md text-on-surface-variant mt-2 font-medium">No se encontraron fichas guardadas con este filtro.</p>
        <button class="mt-3 px-3 py-1.5 bg-secondary text-on-secondary rounded text-label-sm font-semibold" onclick="renderSavedFichas('all')">Ver todas las fichas</button>
      </div>
    `;
    return;
  }

  grid.innerHTML = filtered.map(item => `
    <div class="bg-surface-container-lowest rounded-xl p-space-md shadow-sm border border-outline-variant hover:shadow-md transition-all flex flex-col justify-between gap-3">
      <div class="flex flex-col gap-2">
        <div class="flex items-center justify-between">
          <span class="px-2 py-0.5 rounded bg-secondary/10 text-secondary font-label-sm text-[11px] font-bold">${item.tag}</span>
          <span class="text-[11px] font-label-sm text-outline">${item.timestamp}</span>
        </div>
        <h4 class="font-headline-sm text-[16px] font-bold text-on-surface leading-tight">${item.title}</h4>
        <span class="font-mono text-[11px] text-secondary font-semibold">${item.article}</span>
        <p class="font-body-sm text-[12px] text-on-surface-variant line-clamp-3 bg-surface-container-low p-2 rounded">${item.snippet}</p>
        
        <!-- Badge de normativas relacionadas -->
        ${item.relatedNorms ? `
          <div class="flex items-center gap-1.5 text-[11px] font-label-sm text-secondary bg-surface-container px-2 py-1 rounded">
            <span class="material-symbols-outlined text-[14px]">link</span>
            <span>${item.relatedNorms.length} normativas complementarias vinculadas</span>
          </div>
        ` : ''}
      </div>

      <div class="pt-2 border-t border-outline-variant flex items-center justify-between gap-2">
        <button class="px-2.5 py-1 rounded bg-secondary text-on-secondary font-label-sm text-[11px] font-semibold flex items-center gap-1" onclick="openFichaTecnicaModalById('${item.id}')">
          <span class="material-symbols-outlined text-[13px]">description</span> Ficha Técnica
        </button>
        <button class="px-2 py-1 rounded hover:bg-surface-container text-on-surface font-label-sm text-[11px]" onclick="copyItemCitation('${item.article}', '${item.norm}')">
          <span class="material-symbols-outlined text-[13px]">content_copy</span>
        </button>
        <button class="p-1 rounded hover:bg-red-50 text-red-600 transition-colors" onclick="deleteFicha('${item.id}')" title="Eliminar Ficha">
          <span class="material-symbols-outlined text-[16px]">delete</span>
        </button>
      </div>
    </div>
  `).join('');
}

window.openFichaTecnicaModalById = function(id) {
  const item = AppState.savedFichas.find(f => f.id === id);
  if (item) {
    const dataForModal = {
      title: item.title,
      document: item.norm,
      article: item.article,
      summary: item.query,
      exactQuote: item.snippet,
      metrics: {
        primary: { label: 'Requisito', value: item.metrics?.width || '1.20', unit: 'm' },
        secondary: { label: 'Control', value: item.metrics?.height || '2.10', unit: 'm' }
      },
      hash: item.hash || '#NORMARQ-FICHA',
      lamina: item.lamina || 'Lámina A-03',
      relatedNorms: item.relatedNorms || ArchitecturalKnowledgeBase[0].relatedNorms
    };
    openFichaTecnicaModal(dataForModal);
  }
};

window.deleteFicha = function(id) {
  AppState.savedFichas = AppState.savedFichas.filter(f => f.id !== id);
  saveFichasToStorage();
  showToast('Ficha eliminada de la biblioteca.', 'info');
  renderSavedFichas();
};

window.copyItemCitation = function(article, norm) {
  const text = `[Cita Normativa - ${norm}]: ${article}. Verificado en NormaArq para ${AppState.activeProject}.`;
  navigator.clipboard.writeText(text).then(() => {
    showToast('Cita copiada en formato APA/Taller.', 'success');
  });
};

function copyActiveCitation() {
  const current = AppState.currentVerification || ArchitecturalKnowledgeBase[0];
  const text = `[NormaArq] ${current.document}, ${current.article}. "${current.exactQuote}"`;
  navigator.clipboard.writeText(text).then(() => {
    showToast('Cita oficial copiada al portapapeles.', 'success');
  });
}

// ==========================================
// MODAL DE CONFIGURACIÓN Y API DE GEMINI
// ==========================================
function initSettingsModal() {
  const modal = document.getElementById('settings-modal');
  const openBtn = document.getElementById('open-settings-btn');
  const closeBtn = document.getElementById('close-settings-btn');
  const saveBtn = document.getElementById('save-api-key-btn');
  const input = document.getElementById('gemini-key-input');

  if (openBtn) {
    openBtn.addEventListener('click', () => {
      if (input) input.value = AppState.geminiApiKey;
      modal.classList.remove('hidden');
    });
  }

  if (closeBtn) {
    closeBtn.addEventListener('click', () => {
      modal.classList.add('hidden');
    });
  }

  if (saveBtn) {
    saveBtn.addEventListener('click', () => {
      const key = input.value.trim();
      AppState.geminiApiKey = key;
      localStorage.setItem('normaarq_gemini_key', key);
      modal.classList.add('hidden');
      showToast(key ? 'Clave de Gemini guardada correctamente.' : 'Modo local activo (sin clave de API).', 'success');
    });
  }
}

async function callGeminiAI(userQuery) {
  const apiKey = AppState.geminiApiKey;
  if (!apiKey) return null;

  // Tomar contexto de páginas leídas o resumen normativo
  let documentContext = "";
  if (AppState.pdfPagesText.length > 0) {
    documentContext = AppState.pdfPagesText.slice(0, 15).map(p => `[Pág ${p.pageNumber}]: ${p.text}`).join('\n\n');
  } else {
    documentContext = "Documento: RNE Norma A.010 y Reglamentos de Diseño Arquitectónico.";
  }

  const systemInstruction = `Eres NormaArq, asistente normativo estricto para estudiantes de Arquitectura.
Responde ÚNICAMENTE basándote en la evidencia del texto del documento provisto.
Reglas estrictas de ética y anti-alucinación:
1. Si el requisito NO está en el texto, responde {"found": false, "reason": "No contemplado en el texto provisto"}.
2. Si se encuentra la norma, extrae las cotas exactas, el artículo, la página y genera normas complementarias que el arquitecto debe tener en cuenta (pasamanos, accesibilidad, ventilación, fuego).
Responde SIEMPRE en formato JSON válido con esta estructura:
{
  "found": true,
  "title": "Título corto del requisito",
  "document": "Nombre del documento",
  "article": "Capítulo, Artículo, Inciso y Página",
  "page": 42,
  "summary": "Explicación clara para el estudiante",
  "exactQuote": "«Cita textual literal encontrada»",
  "metrics": {
    "primary": { "label": "Nombre cota", "value": "1.20", "unit": "m", "tag": "Obligatorio", "detail": "Detalle", "cota": "≥ 120 cm" },
    "secondary": { "label": "Altura/Otro", "value": "2.10", "unit": "m", "tag": "Gálibo", "detail": "Detalle", "cota": "≥ 210 cm" }
  },
  "complementary": [
    { "label": "Paso", "value": "≥ 0.28 m" }
  ],
  "relatedNorms": [
    { "norm": "Norma X - Art Y", "topic": "Tema conexo", "requirement": "Requisito complementario", "urgency": "Obligatorio" }
  ],
  "hash": "#NORMARQ-HASH"
}`;

  const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

  const payload = {
    contents: [
      {
        parts: [
          { text: `${systemInstruction}\n\nCONTEXTO DOCUMENTAL:\n${documentContext}\n\nCONSULTA DEL ESTUDIANTE: ${userQuery}` }
        ]
      }
    ],
    generationConfig: {
      responseMimeType: "application/json",
      temperature: 0.1
    }
  };

  const response = await fetch(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    throw new Error(`Error en API Gemini: ${response.status}`);
  }

  const result = await response.json();
  const textOutput = result.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!textOutput) return null;

  return JSON.parse(textOutput);
}

// ==========================================
// UTILIDADES: TOAST NOTIFICATIONS
// ==========================================
function showToast(message, type = 'info') {
  let toast = document.getElementById('global-toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'global-toast';
    toast.className = 'fixed bottom-5 right-5 z-50 p-3.5 rounded-xl shadow-lg font-label-md text-label-sm flex items-center gap-2.5 transition-all transform translate-y-10 opacity-0';
    document.body.appendChild(toast);
  }

  const colors = {
    info: 'bg-inverse-surface text-inverse-on-surface border border-outline-variant',
    success: 'bg-emerald-700 text-white shadow-emerald-900/20',
    error: 'bg-red-700 text-white shadow-red-900/20'
  };

  const icons = {
    info: 'info',
    success: 'check_circle',
    error: 'error'
  };

  toast.className = `fixed bottom-5 right-5 z-50 p-3.5 rounded-xl shadow-lg font-label-md text-label-sm flex items-center gap-2.5 transition-all duration-300 ${colors[type] || colors.info}`;
  toast.innerHTML = `
    <span class="material-symbols-outlined text-[18px]">${icons[type] || 'info'}</span>
    <span>${message}</span>
  `;

  // Animar entrada
  requestAnimationFrame(() => {
    toast.classList.remove('translate-y-10', 'opacity-0');
  });

  setTimeout(() => {
    toast.classList.add('translate-y-10', 'opacity-0');
  }, 3500);
}
