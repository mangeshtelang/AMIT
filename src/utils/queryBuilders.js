exports.buildBookWhere = (query) => {
  const where = { isDeleted: false };

  if (query.search) {
    where.OR = [
      { title: { contains: query.search } },
      { author: { contains: query.search } },
      { isbn: { contains: query.search } },
      { shelfNumber: { contains: query.search } },
      { barcodeValue: { contains: query.search } },
      { category: { name: { contains: query.search } } },
      { publisher: { name: { contains: query.search } } }
    ];
  }

  if (query.author) where.author = { contains: query.author };
  if (query.title) where.title = { contains: query.title };
  if (query.isbn) where.isbn = { contains: query.isbn };
  if (query.categoryId) where.categoryId = Number(query.categoryId);
  if (query.publisherId) where.publisherId = Number(query.publisherId);
  if (query.availableOnly === 'true') where.availableCopies = { gt: 0 };

  return where;
};

exports.buildStudentWhere = (query) => {
  const where = { isDeleted: false };

  if (query.search) {
    where.OR = [
      { fullName: { contains: query.search } },
      { rollNumber: { contains: query.search } },
      { className: { contains: query.search } },
      { email: { contains: query.search } },
      { phone: { contains: query.search } }
    ];
  }

  if (query.className) where.className = query.className;
  if (query.section) where.section = query.section;

  return where;
};

exports.buildAllocationWhere = (query) => {
  const where = {};
  if (query.status) where.status = query.status;
  if (query.fineStatus) where.fineStatus = query.fineStatus;
  if (query.overdue === 'true') {
    where.status = 'ISSUED';
    where.dueDate = { lt: new Date() };
  }
  if (query.studentId) where.studentId = Number(query.studentId);
  if (query.bookId) where.bookId = Number(query.bookId);
  if (query.search) {
    where.OR = [
      { book: { title: { contains: query.search } } },
      { book: { isbn: { contains: query.search } } },
      { student: { fullName: { contains: query.search } } },
      { student: { rollNumber: { contains: query.search } } }
    ];
  }
  return where;
};
