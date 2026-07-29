const prisma = require("../src/config/prisma");

const companies = require("./seeds/company.seed");
const employees = require("./seeds/employee.seed");
const roles = require("./seeds/userRole.seed");
const permissions = require("./seeds/rolePermission.seed");
const mappings = require("./seeds/userRoleMapping.seed");

const userProfileSeed = require("./seeds/userProfile.seed");



async function main() {

    await prisma.company.createMany({
        data: companies,
        skipDuplicates: true
    });

    await prisma.employee.createMany({
        data: employees,
        skipDuplicates: true
    });

    await prisma.userRole.createMany({
        data: roles,
        skipDuplicates: true
    });

    await prisma.rolePermission.createMany({
        data: permissions,
        skipDuplicates: true
    });

    const users = await userProfileSeed();

    await prisma.userProfile.createMany({
        data: users,
        skipDuplicates: true
    });

    await prisma.userRoleMapping.createMany({
        data: mappings,
        skipDuplicates: true
    });

       console.log("Database Seeded Successfully");
}

main()
.catch(console.error)
.finally(async () => {
    await prisma.$disconnect();
});