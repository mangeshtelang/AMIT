const bcrypt = require("bcryptjs");

module.exports = async () => {

const passwordHash = await bcrypt.hash("Admin@123",10);

return [
{
    id: "usr-001",
    employeeId: "emp-001",
    username: "admin",
    passwordHash,
    status: "ACTIVE",
    createdBy: "SYSTEM",
    updatedBy: "SYSTEM"
}
];

};