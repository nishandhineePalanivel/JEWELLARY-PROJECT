const PDFDocument = require('pdfkit');

function generateInvoicePdf(order, res) {
  const doc = new PDFDocument({ margin: 50, size: 'A4' });

  // Stream PDF response directly to HTTP response
  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader(
    'Content-Disposition',
    `attachment; filename=Invoice_${order.order_number || order.id}.pdf`
  );

  doc.pipe(res);

  // Colors
  const darkGold = '#B8860B';
  const charnavy = '#1A202C';
  const lightGray = '#EDF2F7';
  const textDark = '#2D3748';

  // --- HEADER ---
  doc
    .fillColor(darkGold)
    .fontSize(24)
    .font('Helvetica-Bold')
    .text('NEELA JEWELLERY', 50, 40)
    .fontSize(10)
    .font('Helvetica')
    .fillColor(textDark)
    .text('Luxury Fine Jewellery & Artisanal Gold', 50, 68)
    .text('Support: care@neelajewellery.com | +91 (800) 555-NEELA', 50, 82);

  doc
    .fillColor(charnavy)
    .fontSize(20)
    .font('Helvetica-Bold')
    .text('TAX INVOICE', 400, 40, { align: 'right' })
    .fontSize(9)
    .font('Helvetica')
    .fillColor(textDark)
    .text(`Invoice No: INV-${order.order_number}`, 400, 68, { align: 'right' })
    .text(`Date: ${new Date(order.created_at || Date.now()).toLocaleDateString('en-IN')}`, 400, 82, { align: 'right' });

  doc.moveTo(50, 105).lineTo(545, 105).strokeColor(darkGold).lineWidth(1.5).stroke();

  // --- CUSTOMER & ORDER INFORMATION ---
  let y = 120;
  const address = typeof order.address_json === 'string' ? JSON.parse(order.address_json) : (order.address_json || {});

  doc
    .fontSize(11)
    .font('Helvetica-Bold')
    .fillColor(charnavy)
    .text('Billed & Shipped To:', 50, y);

  doc
    .fontSize(10)
    .font('Helvetica')
    .fillColor(textDark)
    .text(address.full_name || 'Valued Customer', 50, y + 16)
    .text(`${address.address_line1 || ''}${address.address_line2 ? ', ' + address.address_line2 : ''}`, 50, y + 30)
    .text(`${address.city || ''}, ${address.state || ''} - ${address.pincode || ''}`, 50, y + 44)
    .text(`Phone: ${address.phone || 'N/A'}`, 50, y + 58);

  doc
    .fontSize(11)
    .font('Helvetica-Bold')
    .fillColor(charnavy)
    .text('Order Details:', 350, y);

  doc
    .fontSize(10)
    .font('Helvetica')
    .fillColor(textDark)
    .text(`Order ID: ${order.order_number}`, 350, y + 16)
    .text(`Payment Method: ${order.payment_method}`, 350, y + 30)
    .text(`Payment Status: ${order.payment_status}`, 350, y + 44)
    .text(`Order Status: ${order.order_status}`, 350, y + 58);

  // --- ITEMS TABLE HEADER ---
  y = 210;
  doc
    .rect(50, y, 495, 22)
    .fill(lightGray);

  doc
    .fillColor(charnavy)
    .font('Helvetica-Bold')
    .fontSize(9)
    .text('ITEM DESCRIPTION', 60, y + 6)
    .text('QTY', 300, y + 6, { width: 40, align: 'center' })
    .text('UNIT PRICE', 350, y + 6, { width: 90, align: 'right' })
    .text('TOTAL', 450, y + 6, { width: 85, align: 'right' });

  y += 28;
  doc.font('Helvetica').fontSize(9).fillColor(textDark);

  const items = order.items || [];
  items.forEach((item) => {
    const itemTotal = Number(item.price) * Number(item.quantity);
    doc
      .text(item.product_name || item.name || 'Jewellery Item', 60, y, { width: 230 })
      .text(String(item.quantity || 1), 300, y, { width: 40, align: 'center' })
      .text(`₹${Number(item.price).toLocaleString('en-IN')}`, 350, y, { width: 90, align: 'right' })
      .text(`₹${itemTotal.toLocaleString('en-IN')}`, 450, y, { width: 85, align: 'right' });

    y += 20;
    doc.moveTo(50, y - 5).lineTo(545, y - 5).strokeColor('#E2E8F0').lineWidth(0.5).stroke();
  });

  // --- SUMMARY TOTALS ---
  y += 15;
  const rightX = 350;
  const valueX = 450;

  doc.font('Helvetica').fontSize(9);
  
  doc.text('Subtotal:', rightX, y, { width: 90, align: 'right' });
  doc.text(`₹${Number(order.subtotal || 0).toLocaleString('en-IN')}`, valueX, y, { width: 85, align: 'right' });
  y += 16;

  if (Number(order.discount) > 0) {
    doc.text('Discount:', rightX, y, { width: 90, align: 'right' });
    doc.text(`- ₹${Number(order.discount).toLocaleString('en-IN')}`, valueX, y, { width: 85, align: 'right' });
    y += 16;
  }

  doc.text('GST (3% Gold Jewellery Tax):', rightX, y, { width: 90, align: 'right' });
  doc.text(`₹${Number(order.gst || 0).toLocaleString('en-IN')}`, valueX, y, { width: 85, align: 'right' });
  y += 16;

  doc.text('Shipping & Insurance:', rightX, y, { width: 90, align: 'right' });
  doc.text(Number(order.shipping) === 0 ? 'FREE' : `₹${Number(order.shipping).toLocaleString('en-IN')}`, valueX, y, { width: 85, align: 'right' });
  y += 20;

  doc.rect(rightX - 10, y - 5, 205, 26).fill(lightGray);

  doc
    .font('Helvetica-Bold')
    .fontSize(11)
    .fillColor(darkGold)
    .text('Grand Total:', rightX, y + 2, { width: 90, align: 'right' })
    .text(`₹${Number(order.total_amount || 0).toLocaleString('en-IN')}`, valueX, y + 2, { width: 85, align: 'right' });

  // --- FOOTER & CERTIFICATE ---
  doc
    .fontSize(8)
    .font('Helvetica-Oblique')
    .fillColor('#718096')
    .text('Thank you for choosing Neela Jewellery. Every piece includes our Hallmark Purity & Lifetime Authenticity Guarantee.', 50, 740, { align: 'center' })
    .text('Neela Jewellery Pvt. Ltd. | CIN: U36911KA2026PTC123456 | GSTIN: 29AAAAA0000A1Z5', 50, 755, { align: 'center' });

  doc.end();
}

module.exports = { generateInvoicePdf };
