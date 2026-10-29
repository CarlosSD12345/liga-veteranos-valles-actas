const fs = require('fs');
const path = require('path');

const target = path.join(__dirname, '..', 'data', 'acta-template.json');

try {
  const file = fs.readFileSync(target, 'utf8');
  const json = JSON.parse(file);
  if (!json.partido || !json.resultado || !json.convocados) {
    throw new Error('La plantilla no tiene la estructura mínima esperada.');
  }
  console.log('✅ Plantilla válida');
} catch (error) {
  console.error('❌ Error de validación:', error.message);
  process.exit(1);
}
