const express = require('express');
const controller = require('../controller/company.controller');
const validateRequest = require('../middlewares/validateRequest');
const { protect, checkPermission } = require('../middlewares/authMiddleware');
const { createCompanyValidation,
    updateCompanyValidation } = require('../validations/company.validation');
const router = express.Router();
router.use(protect);
router.get('/export/excel', checkPermission('Company', 'READ'), controller.exportCompaniesExcel);
router.post('/', checkPermission('Company', 'CREATE'), createCompanyValidation, validateRequest, controller.createCompany);
router.get('/', checkPermission('Company', 'READ'), controller.getCompanies);
router.get('/:id', checkPermission('Company', 'READ'), controller.getCompanyById);
router.put('/:id', checkPermission('Company', 'UPDATE'), updateCompanyValidation, validateRequest, controller.updateCompany);
router.delete('/:id', checkPermission('Company', 'DELETE'), controller.deleteCompany);
module.exports = router;