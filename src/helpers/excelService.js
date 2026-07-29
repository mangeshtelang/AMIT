const ExcelJS = require('exceljs');

exports.createWorkbookBuffer = async ({ sheetName, columns, rows }) => {
  const workbook = new ExcelJS.Workbook();
  workbook.creator = 'OpenAI';
  workbook.created = new Date();
  const sheet = workbook.addWorksheet(sheetName);
  sheet.columns = columns;
  rows.forEach((row) => sheet.addRow(row));
  sheet.getRow(1).font = { bold: true };
  sheet.views = [{ state: 'frozen', ySplit: 1 }];
  sheet.columns.forEach((column) => {
    column.width = Math.max(column.header.length + 4, column.width || 15);
  });
  return workbook.xlsx.writeBuffer();
};
