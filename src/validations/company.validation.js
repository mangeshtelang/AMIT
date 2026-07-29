const { body } = require("express-validator");

const createCompanyValidation = [
    body("legalName")
        .trim()
        .notEmpty()
        .withMessage("Legal Name is required."),

    body("displayName")
        .optional()
        .trim(),

    body("registrationNumber")
        .trim()
        .notEmpty()
        .withMessage("Registration Number is required."),

    body("taxNumber")
        .trim()
        .notEmpty()
        .withMessage("Tax Number is required."),

    body("website")
        .trim()
        .notEmpty()
        .withMessage("Website is required.")
        .isURL()
        .withMessage("Website must be a valid URL."),

    body("email")
        .trim()
        .notEmpty()
        .withMessage("Email is required.")
        .isEmail()
        .withMessage("Invalid email address."),

    body("phone")
        .trim()
        .notEmpty()
        .withMessage("Phone number is required.")
        .isLength({ min: 10, max: 15 })
        .withMessage("Phone number must be between 10 and 15 digits.")
];

const updateCompanyValidation = [
    body("legalName").optional().trim().notEmpty(),

    body("displayName").optional().trim(),

    body("registrationNumber").optional().trim().notEmpty(),

    body("taxNumber").optional().trim().notEmpty(),

    body("website")
        .optional()
        .trim()
        .isURL()
        .withMessage("Website must be a valid URL."),

    body("email")
        .optional()
        .trim()
        .isEmail()
        .withMessage("Invalid email address."),

    body("phone")
        .optional()
        .trim()
        .isLength({ min: 10, max: 15 })
];

module.exports = {
    createCompanyValidation,
    updateCompanyValidation
};