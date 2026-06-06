const CFDI_NS_REGEX = /xmlns:cfdi="http:\/\/www\.sat\.gob\.mx\/cfd\/[34]"/;
const UUID_FORMAT = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

function attr(xml, name) {
  // Word boundary ensures e.g. "Fecha" doesn't match "FechaTimbrado"
  const match = xml.match(new RegExp(`\\b${name}="([^"]*)"`));
  return match ? (match[1].trim() || null) : null;
}

function extractRfc(xml, elementName) {
  // Match the opening tag of the element (may span lines) and extract Rfc from it
  const tagMatch = xml.match(new RegExp(`<(?:\\w+:)?${elementName}[^>]+>|<(?:\\w+:)?${elementName}[^/]*/>`,'s'));
  if (!tagMatch) return null;
  const rfcMatch = tagMatch[0].match(/\bRfc="([^"]+)"/);
  return rfcMatch ? rfcMatch[1].trim() : null;
}

function extractIva(xml) {
  // Prefer TotalImpuestosTrasladados on cfdi:Impuestos
  const direct = attr(xml, 'TotalImpuestosTrasladados');
  if (direct !== null) return parseFloat(direct) || 0;

  // Fallback: sum cfdi:Traslado where Impuesto="002"
  let total = 0;
  const trasladoRegex = /<(?:\w+:)?Traslado[^>]+>/gs;
  let m;
  while ((m = trasladoRegex.exec(xml)) !== null) {
    const tag = m[0];
    if (/\bImpuesto="002"/.test(tag)) {
      const imp = tag.match(/\bImporte="([^"]+)"/);
      if (imp) total += parseFloat(imp[1]) || 0;
    }
  }
  return parseFloat(total.toFixed(2));
}

function parseCFDI(xmlString) {
  if (!xmlString || typeof xmlString !== 'string') {
    throw new Error('El cuerpo de la solicitud está vacío');
  }

  const xml = xmlString.trim();

  if (!CFDI_NS_REGEX.test(xml)) {
    throw new Error('El archivo no es un CFDI válido (namespace no reconocido)');
  }

  const uuid       = attr(xml, 'UUID');
  const serie      = attr(xml, 'Serie');
  const folio      = attr(xml, 'Folio');
  const fecha      = attr(xml, 'Fecha');
  // CFDI 3.3 uses FormaPago; 4.0 adds MetodoPago at Comprobante level
  const metodoPago = attr(xml, 'FormaPago') ?? attr(xml, 'MetodoPago');
  const subtotalRaw = attr(xml, 'SubTotal');
  const totalRaw    = attr(xml, 'Total');
  const rfcEmisor   = extractRfc(xml, 'Emisor');
  const rfcReceptor = extractRfc(xml, 'Receptor');

  if (!uuid)          throw new Error('UUID no encontrado en el CFDI');
  if (!UUID_FORMAT.test(uuid)) throw new Error('UUID con formato inválido');
  if (!rfcEmisor)     throw new Error('RFC Emisor no encontrado en el CFDI');
  if (!rfcReceptor)   throw new Error('RFC Receptor no encontrado en el CFDI');
  if (!fecha)         throw new Error('Fecha no encontrada en el CFDI');
  if (subtotalRaw === null) throw new Error('SubTotal no encontrado en el CFDI');
  if (totalRaw === null)    throw new Error('Total no encontrado en el CFDI');

  const subtotal = parseFloat(parseFloat(subtotalRaw).toFixed(2));
  const total    = parseFloat(parseFloat(totalRaw).toFixed(2));
  const iva      = extractIva(xml);

  if (isNaN(subtotal)) throw new Error('SubTotal inválido en el CFDI');
  if (isNaN(total))    throw new Error('Total inválido en el CFDI');

  return {
    uuid,
    serie,
    folio,
    rfcEmisor:    rfcEmisor.toUpperCase(),
    rfcReceptor:  rfcReceptor.toUpperCase(),
    fechaEmision: new Date(fecha).toISOString(),
    metodoPago,
    subtotal,
    iva,
    total,
  };
}

export { parseCFDI };
