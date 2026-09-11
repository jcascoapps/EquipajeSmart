export const AIRLINES_DATA = [
  {
    id: 'ryanair',
    name: 'Ryanair',
    country: 'Irlanda',
    freeBag: { w: 40, h: 25, d: 20, weight: 'Sin límite oficial', desc: 'Bajo el asiento delantero' },
    cabinBag: { w: 55, h: 40, d: 20, weight: '10 kg', desc: 'Solo con Prioridad & 2 piezas' },
    penaltyFee: 'De 45€ a 70€ en puerta de embarque',
    tip: 'Las mochilas de 30L-40L flexibles pasan sin problema si no van a reventar.'
  },
  {
    id: 'vueling',
    name: 'Vueling',
    country: 'España',
    freeBag: { w: 40, h: 30, d: 20, weight: 'Sin límite oficial', desc: 'Bajo el asiento' },
    cabinBag: { w: 55, h: 40, d: 20, weight: '10 kg', desc: 'Con tarifas TimeFlex / Premium o contratada aparte' },
    penaltyFee: 'Hasta 60€ en puerta',
    tip: 'Vueling es estricta con trolleys rígidos en vuelos completos.'
  },
  {
    id: 'easyjet',
    name: 'EasyJet',
    country: 'Reino Unido',
    freeBag: { w: 45, h: 36, d: 20, weight: 'Hasta 15 kg', desc: 'Bajo el asiento delantero' },
    cabinBag: { w: 56, h: 45, d: 25, weight: 'Hasta 15 kg', desc: 'Con asiento Extra Legroom o suplemento' },
    penaltyFee: '58€ en puerta de embarque',
    tip: 'Su medida de bulto gratuito (45x36x20) es de las más generosas de las low-cost.'
  },
  {
    id: 'iberia',
    name: 'Iberia',
    country: 'España',
    freeBag: { w: 40, h: 30, d: 15, weight: 'Accesorio personal', desc: 'Bolso, maletín o mochila pequeña' },
    cabinBag: { w: 56, h: 40, d: 25, weight: '10 kg (hasta 14 kg en Business)', desc: 'Incluida en casi todas las tarifas estándar' },
    penaltyFee: 'Facturación obligatoria en bodega si excede',
    tip: 'Permite maleta de cabina incluida en la inmensa mayoría de sus vuelos.'
  },
  {
    id: 'aireuropa',
    name: 'Air Europa',
    country: 'España',
    freeBag: { w: 40, h: 30, d: 15, weight: 'Accesorio personal', desc: 'Bajo el asiento' },
    cabinBag: { w: 55, h: 35, d: 25, weight: '10 kg (hasta 14 kg)', desc: 'Compartimento superior' },
    penaltyFee: 'Tarifa de exceso de equipaje',
    tip: 'Ojo con el ancho de 35 cm para el trolley de cabina.'
  },
  {
    id: 'wizzair',
    name: 'Wizz Air',
    country: 'Hungría',
    freeBag: { w: 40, h: 30, d: 20, weight: 'Hasta 10 kg', desc: 'Bajo el asiento delantero' },
    cabinBag: { w: 55, h: 40, d: 23, weight: 'Hasta 10 kg', desc: 'Solo con WIZZ Priority' },
    penaltyFee: 'Hasta 55€ en puerta',
    tip: 'Muy exigentes en el medidor metálico para trolleys.'
  },
  {
    id: 'lufthansa',
    name: 'Lufthansa',
    country: 'Alemania',
    freeBag: { w: 40, h: 30, d: 10, weight: 'Accesorio personal', desc: 'Bajo el asiento' },
    cabinBag: { w: 55, h: 40, d: 23, weight: '8 kg', desc: '1 pieza en Economy, 2 en Business' },
    penaltyFee: 'Tarifa por exceso de peso/bulto',
    tip: 'El límite de peso de 8 kg para el trolley es su punto más crítico. Pesa antes de ir.'
  },
  {
    id: 'airfrance',
    name: 'Air France / KLM',
    country: 'Francia / Países Bajos',
    freeBag: { w: 40, h: 30, d: 15, weight: 'Accesorio personal', desc: 'Bajo el asiento' },
    cabinBag: { w: 55, h: 35, d: 25, weight: '12 kg combinados', desc: 'Suma de accesorio + trolley' },
    penaltyFee: 'Facturación en bodega si excede peso total',
    tip: 'Los 12 kg son la suma de la mochila y la maleta de cabina juntos.'
  },
  {
    id: 'tapportugal',
    name: 'TAP Air Portugal',
    country: 'Portugal',
    freeBag: { w: 40, h: 30, d: 15, weight: 'Hasta 2 kg', desc: 'Bajo el asiento' },
    cabinBag: { w: 55, h: 40, d: 20, weight: 'Hasta 8 kg o 10 kg según tarifa', desc: 'Compartimento superior' },
    penaltyFee: 'Cargo en puerta de embarque',
    tip: 'Cuidado con el trolley en tarifa Discount.'
  },
  {
    id: 'norwegian',
    name: 'Norwegian',
    country: 'Noruega',
    freeBag: { w: 38, h: 30, d: 20, weight: 'Hasta 10 kg', desc: 'Bajo el asiento' },
    cabinBag: { w: 55, h: 40, d: 23, weight: 'Hasta 10 kg combinados', desc: 'Con tarifa LowFare+ o suplemento' },
    penaltyFee: 'Tarifa en puerta',
    tip: 'En tarifa básica solo incluye el bolso bajo el asiento.'
  }
];

export const COUNTRIES_PLUGS_DATA = [
  { country: 'Reino Unido (UK)', plugs: ['G'], voltage: '230V', freq: '50Hz', needsAdapterFromES: true, notes: 'Clavija británica de 3 patillas rectangulares. ¡Imprescindible adaptador!' },
  { country: 'Estados Unidos (EE.UU.)', plugs: ['A', 'B'], voltage: '120V', freq: '60Hz', needsAdapterFromES: true, notes: 'Patillas planas. La mayoría de cargadores modernos admiten 100-240V automáticamente.' },
  { country: 'Japón', plugs: ['A', 'B'], voltage: '100V', freq: '50/60Hz', needsAdapterFromES: true, notes: 'Patillas planas tipo americano. Voltaje más bajo (100V). Comprueba que tu cargador indique 100-240V.' },
  { country: 'Tailandia', plugs: ['A', 'B', 'C', 'O'], voltage: '230V', freq: '50Hz', needsAdapterFromES: true, notes: 'Muchos hoteles admiten clavijas europeas (C), pero un adaptador universal evita sorpresas.' },
  { country: 'Australia & Nueva Zelanda', plugs: ['I'], voltage: '230V', freq: '50Hz', needsAdapterFromES: true, notes: 'Patillas planas en ángulo de V. Requiere adaptador tipo I.' },
  { country: 'México', plugs: ['A', 'B'], voltage: '127V', freq: '60Hz', needsAdapterFromES: true, notes: 'Patillas planas tipo americano.' },
  { country: 'China', plugs: ['A', 'C', 'I'], voltage: '220V', freq: '50Hz', needsAdapterFromES: true, notes: 'Utilizan tomas mixtas, pero el adaptador universal garantiza compatibilidad.' },
  { country: 'Suiza', plugs: ['C', 'J'], voltage: '230V', freq: '50Hz', needsAdapterFromES: true, notes: 'El enchufe europeo plano (tipo C) encaja, pero el europeo grueso (Schuko con toma tierra) requiere tipo J.' },
  { country: 'Italia', plugs: ['C', 'F', 'L'], voltage: '230V', freq: '50Hz', needsAdapterFromES: false, notes: 'Los enchufes europeos planos (C) entran directamente. Para Schuko de alta potencia puede requerir adaptador L.' },
  { country: 'Francia / Alemania / Portugal', plugs: ['C', 'E', 'F'], voltage: '230V', freq: '50Hz', needsAdapterFromES: false, notes: 'Mismo estándar que España. No necesitas adaptador.' },
  { country: 'Marruecos', plugs: ['C', 'E'], voltage: '220V', freq: '50Hz', needsAdapterFromES: false, notes: 'Compatible con enchufes españoles normales (Tipo C y E).' },
  { country: 'Egipto', plugs: ['C', 'F'], voltage: '220V', freq: '50Hz', needsAdapterFromES: false, notes: 'Compatible con enchufes estándar españoles.' },
  { country: 'Turquía', plugs: ['C', 'F'], voltage: '230V', freq: '50Hz', needsAdapterFromES: false, notes: 'Compatible con enchufes estándar españoles.' },
  { country: 'Argentina', plugs: ['C', 'I'], voltage: '220V', freq: '50Hz', needsAdapterFromES: true, notes: 'El estándar general es tipo I (patillas en V invertida como Australia).' },
  { country: 'Brasil', plugs: ['C', 'N'], voltage: '127V / 220V', freq: '60Hz', needsAdapterFromES: true, notes: 'Utilizan el tipo N específico de tres patillas hexagonales.' },
  { country: 'Colombia', plugs: ['A', 'B'], voltage: '110V', freq: '60Hz', needsAdapterFromES: true, notes: 'Patillas planas norteamericanas.' },
  { country: 'Perú', plugs: ['A', 'B', 'C'], voltage: '220V', freq: '60Hz', needsAdapterFromES: true, notes: 'Muchos hoteles combinan entradas A y C.' },
  { country: 'Emiratos Árabes (Dubái)', plugs: ['G'], voltage: '230V', freq: '50Hz', needsAdapterFromES: true, notes: 'Mismo enchufe británico de 3 clavijas rectangulares (Tipo G).' },
  { country: 'Singapur', plugs: ['G'], voltage: '230V', freq: '50Hz', needsAdapterFromES: true, notes: 'Enchufe británico Tipo G.' },
  { country: 'Sudáfrica', plugs: ['C', 'D', 'M', 'N'], voltage: '230V', freq: '50Hz', needsAdapterFromES: true, notes: 'Enchufe tipo M de 3 clavijas redondas grandes.' },
  { country: 'India', plugs: ['C', 'D', 'M'], voltage: '230V', freq: '50Hz', needsAdapterFromES: true, notes: 'Enchufe tipo D de 3 clavijas redondas en triángulo.' },
  { country: 'Canadá', plugs: ['A', 'B'], voltage: '120V', freq: '60Hz', needsAdapterFromES: true, notes: 'Patillas planas tipo USA.' },
  { country: 'Indonesia (Bali)', plugs: ['C', 'F'], voltage: '230V', freq: '50Hz', needsAdapterFromES: false, notes: 'Totalmente compatible con enchufes redondos europeos españoles.' },
  { country: 'Vietnam', plugs: ['A', 'C', 'G'], voltage: '220V', freq: '50Hz', needsAdapterFromES: true, notes: 'Tomas híbridas A/C en hoteles, pero el adaptador universal es recomendable.' },
  { country: 'Irlanda', plugs: ['G'], voltage: '230V', freq: '50Hz', needsAdapterFromES: true, notes: 'Enchufe británico Tipo G de 3 clavijas rectangulares.' }
];

export const PACKING_CHECKLIST_DATA = {
  weekend: {
    id: 'weekend',
    title: 'Escapada de Fin de Semana (2-3 Días)',
    desc: 'Equipaje ultraligero: solo mochila de cabina gratuita bajo el asiento.',
    sections: [
      {
        name: '📄 Documentación & Seguridad',
        items: ['DNI o Pasaporte en vigor', 'Tarjetas de embarque en móvil / wallet', 'Tarjeta sanitaria europea o seguro', 'Copia digital en la nube']
      },
      {
        name: '👕 Ropa y Calzado',
        items: ['3 mudas de ropa interior', '3 camisetas / partes de arriba', '1 pantalón extra ligero', 'Pijama o ropa de dormir', 'Calzado cómodo puesto']
      },
      {
        name: '🧴 Aseo & Líquidos (<100ml)',
        items: ['Cepillo y pasta de dientes mini', 'Desodorante de viaje', 'Bote 100ml champú / gel', 'Bolsa transparente hermética 1L']
      },
      {
        name: '⚡ Tecnología Clave',
        items: ['Cargador de móvil y cable', 'Batería externa Powerbank (en mano)', 'Auriculares para el vuelo']
      }
    ]
  },
  vacation: {
    id: 'vacation',
    title: 'Vacaciones de 1 a 2 Semanas',
    desc: 'Maleta de cabina de 10 kg + bulto personal con técnica 5-4-3-2-1.',
    sections: [
      {
        name: '📄 Documentación & Dinero',
        items: ['Pasaporte con vigencia > 6 meses', 'Tarjetas sin comisiones (Revolut, N26)', 'Seguro médico internacional', 'Reservas de hoteles y vuelos offline']
      },
      {
        name: '🧳 Ropa en Cubos de Compresión',
        items: ['6-7 mudas interiores', '5 camisetas combinables', '3 pantalones / bermudas', '1 chaqueta o jersey ligero', '2 pares de calzado (1 puesto, 1 en maleta)', 'Toalla de microfibra de secado rápido']
      },
      {
        name: '🧴 Neceser Homologado',
        items: ['Kit de botellas de silicona 100ml', 'Protector solar de viaje', 'Cortauñas y pinzas sin punta', 'Pequeño botiquín con analgésicos y tiritas']
      },
      {
        name: '⚡ Tecnología & Confort',
        items: ['Adaptador universal con salidas USB-C', 'Báscula digital para el regreso', 'Almohada ergonómica de cuello', 'Tapones de oído para el avión y hotel', 'Lector de libros Kindle / Tablet']
      }
    ]
  },
  nomad: {
    id: 'nomad',
    title: 'Nómada Digital / Viaje de Negocios',
    desc: 'Movilidad total y oficina remota en equipaje de mano.',
    sections: [
      {
        name: '💻 Oficina Portátil',
        items: ['Portátil y cargador USB-C GaN', 'Ratón inalámbrico y alfombrilla mini', 'Organizador de cables de doble capa', 'Disco SSD externo o pendrive', 'Powerbank de 20.000 mAh']
      },
      {
        name: '👔 Vestimenta Smart-Casual',
        items: ['Camisas o polos que no se arrugan', 'Pantalones chinos versátiles', 'Plancha de vapor vertical compacta', 'Zapatos cómodos elegantes']
      },
      {
        name: '🛡️ Seguridad & Rastreo',
        items: ['AirTag o localizador GPS en la mochila', 'Candado TSA con combinación', 'Mochila antirrobo con cremalleras ocultas']
      }
    ]
  }
};
