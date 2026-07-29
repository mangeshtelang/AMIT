const asyncHandler = require('../middlewares/asyncHandler');
const companyService = require("../services/company.service");


exports.createCompany = asyncHandler(async (req, res) => {
    const company = await companyService.createCompany(req.body);

    res.status(201).json({
        success: true,
        message: "Company created successfully.",
        data: company
    });
});

exports.getCompanies = asyncHandler(async (req, res) => {
    const companies = await companyService.getCompanies(req.query);  // Pass query parameters for filtering, sorting, and pagination

    res.status(200).json({
        success: true,
        message: "Companies retrieved successfully.",
        data: companies
    });
});

exports.getCompanyById = asyncHandler(async (req, res) => {
    const company = await companyService.getCompanyById(req.params.id); 
    res.status(200).json({
        success: true,
        message: "Company retrieved successfully.",
        data: company
    });
});

exports.updateCompany = asyncHandler(async(req,res)=>{
   const company = await companyService.updateCompany(req.params.id, req.body);
   res.status(200).json({
    success: true,
    message: "Company updated successfully.",
    data: company
   });
});

exports.deleteCompany = asyncHandler(async(req,res)=>{
    await companyService.deleteCompany(req.params.id);
    res.status(200).json({
        success: true,
        message: "Company deleted successfully."
    });
});

exports.exportCompaniesExcel = asyncHandler(async (req, res) => {
    const excelBuffer = await companyService.exportCompaniesToExcel(req.query); // Pass query parameters for filtering, sorting, and pagination
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', 'attachment; filename=companies.xlsx');
    res.status(200).send(excelBuffer);
});
