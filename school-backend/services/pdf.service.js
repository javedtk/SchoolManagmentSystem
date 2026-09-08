const PDFDocument = require('pdfkit');

const generateFeeReceiptPDF = async (student, payment, structure, remainingDue = null) => {
  const finalRemainingDue = remainingDue !== null ? remainingDue : Math.max(0, parseFloat(structure.amount) - parseFloat(payment.amount_paid));
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({ margin: 50 });
      const chunks = [];

      doc.on('data', (chunk) => chunks.push(chunk));
      doc.on('end', () => resolve(Buffer.concat(chunks)));

      // Title & Header
      doc.fontSize(22).fillColor('#0E1322').text('AETHER ACADEMY', { align: 'center' });
      doc.fontSize(10).fillColor('#8E9CAE').text('123 Neon Glow Boulevard, Cyber City', { align: 'center' });
      doc.text('Phone: +1 (555) 123-4567 | Email: contact@aetheracademy.edu', { align: 'center' });
      doc.moveDown(2);

      // Receipt Title
      doc.fontSize(16).fillColor('#00D8F6').text('FEE PAYMENT RECEIPT', { align: 'center', underline: true });
      doc.moveDown(1.5);

      // Information Block
      doc.fontSize(11).fillColor('#0E1322');
      
      const startX = 50;
      let currentY = doc.y;

      doc.text(`Receipt No: ${payment.receipt_no}`, startX, currentY);
      doc.text(`Payment Date: ${new Date(payment.payment_date).toLocaleDateString()}`, startX + 250, currentY);
      doc.moveDown(0.5);

      currentY = doc.y;
      doc.text(`Student Name: ${student.User ? student.User.name : 'N/A'}`, startX, currentY);
      doc.text(`Admission No: ${student.admission_no}`, startX + 250, currentY);
      doc.moveDown(0.5);

      currentY = doc.y;
      doc.text(`Class/Section: ${student.Class ? student.Class.name : 'N/A'} - ${student.section || 'N/A'}`, startX, currentY);
      doc.text(`Payment Mode: ${payment.payment_mode}`, startX + 250, currentY);
      doc.moveDown(2);

      // Divider Line
      doc.moveTo(startX, doc.y).lineTo(550, doc.y).lineWidth(1).strokeColor('#8E9CAE').stroke();
      doc.moveDown(1);

      // Details Table Header
      currentY = doc.y;
      doc.fontSize(12).fillColor('#0E1322');
      doc.text('Fee Category / Description', startX, currentY, { bold: true });
      doc.text('Total Amount', startX + 250, currentY, { width: 100, align: 'right' });
      doc.text('Amount Paid', startX + 380, currentY, { width: 100, align: 'right' });
      doc.moveDown(0.5);

      doc.moveTo(startX, doc.y).lineTo(550, doc.y).lineWidth(0.5).strokeColor('#D8E2EF').stroke();
      doc.moveDown(1);

      // Details Table Body
      currentY = doc.y;
      doc.fontSize(11).fillColor('#4B5563');
      doc.text(structure.category, startX, currentY);
      doc.text(`Rs. ${parseFloat(structure.amount).toFixed(2)}`, startX + 250, currentY, { width: 100, align: 'right' });
      doc.text(`Rs. ${parseFloat(payment.amount_paid).toFixed(2)}`, startX + 380, currentY, { width: 100, align: 'right' });
      doc.moveDown(1.5);

      doc.moveTo(startX, doc.y).lineTo(550, doc.y).lineWidth(1).strokeColor('#8E9CAE').stroke();
      doc.moveDown(1);

      // Summary
      currentY = doc.y;
      doc.fontSize(12).fillColor('#0E1322');
      doc.text('Total Paid:', startX + 250, currentY, { bold: true });
      doc.fontSize(14).fillColor('#00D8F6').text(`Rs. ${parseFloat(payment.amount_paid).toFixed(2)}`, startX + 380, currentY, { width: 100, align: 'right', bold: true });
      
      doc.moveDown(1.5);
      
      currentY = doc.y;
      doc.fontSize(12).fillColor('#0E1322');
      doc.text('Updated Due:', startX + 250, currentY, { bold: true });
      doc.fontSize(14).fillColor('#EF4444').text(`Rs. ${parseFloat(finalRemainingDue).toFixed(2)}`, startX + 380, currentY, { width: 100, align: 'right', bold: true });

      // Status
      doc.moveDown(2);
      doc.fontSize(11).fillColor('#10B981').text(`Status: ${payment.status.toUpperCase()}`, startX, doc.y, { bold: true });

      // Footer Message
      doc.moveDown(4);
      doc.fontSize(9).fillColor('#8E9CAE').text('This is a computer-generated receipt. No signature is required.', { align: 'center', italic: true });

      doc.end();
    } catch (error) {
      reject(error);
    }
  });
};

const generateResultCardPDF = async (student, exam, results) => {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({ margin: 50 });
      const chunks = [];

      doc.on('data', (chunk) => chunks.push(chunk));
      doc.on('end', () => resolve(Buffer.concat(chunks)));

      // Title & Header
      doc.fontSize(22).fillColor('#0E1322').text('AETHER ACADEMY', { align: 'center' });
      doc.fontSize(10).fillColor('#8E9CAE').text('123 Neon Glow Boulevard, Cyber City', { align: 'center' });
      doc.text('Academic Progress Report Card', { align: 'center' });
      doc.moveDown(2);

      // Report Title
      doc.fontSize(16).fillColor('#C5A880').text(`${exam.name.toUpperCase()} REPORT CARD`, { align: 'center', underline: true });
      doc.moveDown(1.5);

      // Student Info Block
      doc.fontSize(11).fillColor('#0E1322');
      const startX = 50;
      let currentY = doc.y;

      doc.text(`Student Name: ${student.User ? student.User.name : 'N/A'}`, startX, currentY);
      doc.text(`Exam Name: ${exam.name}`, startX + 250, currentY);
      doc.moveDown(0.5);

      currentY = doc.y;
      doc.text(`Admission No: ${student.admission_no}`, startX, currentY);
      doc.text(`Academic Year: ${exam.academic_year}`, startX + 250, currentY);
      doc.moveDown(0.5);

      currentY = doc.y;
      doc.text(`Class/Section: ${student.Class ? student.Class.name : 'N/A'} - ${student.section || 'N/A'}`, startX, currentY);
      doc.moveDown(2);

      // Table Border Line
      doc.moveTo(startX, doc.y).lineTo(550, doc.y).lineWidth(1.5).strokeColor('#8E9CAE').stroke();
      doc.moveDown(1);

      // Table Header
      currentY = doc.y;
      doc.fontSize(12).fillColor('#0E1322');
      doc.text('Subject Code', startX, currentY);
      doc.text('Subject Name', startX + 120, currentY);
      doc.text('Max Marks', startX + 280, currentY, { width: 80, align: 'right' });
      doc.text('Marks Obtained', startX + 380, currentY, { width: 90, align: 'right' });
      doc.text('Grade', startX + 470, currentY, { width: 30, align: 'right' });
      doc.moveDown(0.5);

      doc.moveTo(startX, doc.y).lineTo(550, doc.y).lineWidth(1).strokeColor('#D8E2EF').stroke();
      doc.moveDown(1);

      // Table Body
      let totalMax = 0;
      let totalObtained = 0;
      
      results.forEach((res) => {
        const subName = res.Subject ? res.Subject.name : 'N/A';
        const subCode = res.Subject ? res.Subject.code : 'N/A';
        
        currentY = doc.y;
        doc.fontSize(11).fillColor('#4B5563');
        doc.text(subCode, startX, currentY);
        doc.text(subName, startX + 120, currentY);
        doc.text(parseFloat(res.max_marks).toFixed(0), startX + 280, currentY, { width: 80, align: 'right' });
        doc.text(parseFloat(res.marks_obtained).toFixed(0), startX + 380, currentY, { width: 90, align: 'right' });
        doc.text(res.grade || 'N/A', startX + 470, currentY, { width: 30, align: 'right' });
        doc.moveDown(0.8);
        
        totalMax += parseFloat(res.max_marks);
        totalObtained += parseFloat(res.marks_obtained);
      });

      doc.moveDown(1);
      doc.moveTo(startX, doc.y).lineTo(550, doc.y).lineWidth(1.5).strokeColor('#8E9CAE').stroke();
      doc.moveDown(1);

      // Calculation summary
      const percentage = totalMax > 0 ? (totalObtained / totalMax) * 100 : 0;
      let overallGrade = 'F';
      if (percentage >= 90) overallGrade = 'A+';
      else if (percentage >= 80) overallGrade = 'A';
      else if (percentage >= 70) overallGrade = 'B';
      else if (percentage >= 60) overallGrade = 'C';
      else if (percentage >= 50) overallGrade = 'D';
      else if (percentage >= 40) overallGrade = 'E';

      currentY = doc.y;
      doc.fontSize(12).fillColor('#0E1322');
      doc.text('TOTAL SUMMARY', startX, currentY, { bold: true });
      doc.text(`${totalMax.toFixed(0)}`, startX + 280, currentY, { width: 80, align: 'right', bold: true });
      doc.text(`${totalObtained.toFixed(0)}`, startX + 380, currentY, { width: 90, align: 'right', bold: true });
      doc.text(overallGrade, startX + 470, currentY, { width: 30, align: 'right', bold: true });
      doc.moveDown(1);

      // Percentage and Result Status
      doc.fontSize(11).fillColor('#0E1322');
      doc.text(`Percentage: ${percentage.toFixed(2)}%`, startX, doc.y, { bold: true });
      doc.text(`Result Status: ${percentage >= 40 ? 'PASSED' : 'FAILED'}`, startX, doc.y + 15, { bold: true, fillColor: percentage >= 40 ? '#10B981' : '#EF4444' });

      // Signatures
      doc.moveDown(4);
      currentY = doc.y;
      doc.text('______________________', startX, currentY);
      doc.text('______________________', startX + 300, currentY);
      doc.fontSize(9).fillColor('#8E9CAE');
      doc.text('Class Teacher Signature', startX + 25, currentY + 15);
      doc.text('Principal Signature', startX + 335, currentY + 15);

      doc.end();
    } catch (error) {
      reject(error);
    }
  });
};

module.exports = {
  generateFeeReceiptPDF,
  generateResultCardPDF
};
