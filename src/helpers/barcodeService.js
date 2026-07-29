const bwipjs = require('bwip-js');
const QRCode = require('qrcode');

exports.generateBarcodeBuffer = async (text) => {
  return bwipjs.toBuffer({
    bcid: 'code128',
    text: String(text),
    scale: 3,
    height: 10,
    includetext: true,
    textxalign: 'center'
  });
};

exports.generateQrBuffer = async (text) => {
  return QRCode.toBuffer(String(text), { type: 'png', width: 300, margin: 2 });
};
