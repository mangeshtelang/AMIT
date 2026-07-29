const prisma = require('../config/prisma');

exports.create = async (data) => {
    return await prisma.company.create({ data });
}       

exports.findAndCountAll = async ({ where, limit, offset }) => {
    const [rows, count] = await Promise.all([
        prisma.company.findMany({ where, take: limit, skip: offset }),
        prisma.company.count({ where })
    ]);
    return { rows, count };
};

exports.findById = async (id) => {
    return await prisma.company.findUnique({ where: { id } });
}       

exports.update = async (id, data) => {
    return await prisma.company.update({ where: { id }, data });
}  

exports.softdelete = async (id) => {
    return await prisma.company.update({ where: { id }, data: { status: 'INACTIVE' } });
}   

exports.findAll = async (where) => {
    return await prisma.company.findMany({ where });
}       
