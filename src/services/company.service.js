const repository = require('../repositories/company.repository');
const AppError = require('../utils/appError');  
const {getPagination,getPaginationMeta,} = require('../utils/pagination');
const {buildCompanyWhere} = require('../utils/queryBuilders');
const {createauditlog} = require('../helpers/auditService');
const {createWorkBookBuffer } = require('../helpers/excelService');


exports.createCompany = async (req ) => {

    const body = req.body;
    const company = await repository.create(body);
    await createAuditLog({
        userId: req.user.id,
        action: 'CREATE',
        entity: 'COMPANY',
        entityId: company.id,
        method: req.method,
        route: req.originalUrl,
        ipaddress: req.context.ipAddress,
        userAgent: req.context.userAgent,
        changes: body
    })
        
    return company;
}

exports.getCompanies = async (query) => {
    const { page, limit, skip } = getPagination(query);
    const where = buildCompanyWhere(query);
    const { rows, count } = await repository.findAndCountAll({ where, limit, offset: skip });
    const paginationMeta = getPaginationMeta(count, page, limit);
    return { success: true, data: rows, meta: paginationMeta }; 
  
}

exports.getCompanyById = async (id) => {
    const company = await repository.findById(id);
    if (!company) {
        throw new AppError('Company not found', 404);
    }
    return company;
}

exports.updateCompany = async (id, body) => {
    const company = await repository.update(id, body);
    if (!company) {
        throw new AppError('Company not found', 404);
    }
    return company;
}  

exports.deleteCompany = async (id) => {
    const company = await repository.softdelete(id);
    if (!company) {
        throw new AppError('Company not found', 404);
    }
    return company;
}

exports.exportCompaniesToExcel = async (query) => {
    const where = buildCompanyWhere(query);
    const companies = await repository.findAll({ where });
    const excelBuffer = await createWorkBookBuffer(companies, ['id', 'title', 'author', 'isbn', 'totalCopies'], 'Companies');
    return excelBuffer;
}