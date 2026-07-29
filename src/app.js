const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const compression = require('compression');
const hpp = require('hpp');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const swaggerUi = require('swagger-ui-express');

const requestContext = require('./middlewares/requestContext');
const errorHandler = require('./middlewares/errorHandler');
const swaggerSpec = require('./docs/swagger');
// const authRoutes = require('./routes/authRoutes');
const companyRoutes = require('./routes/company.routes');
// const studentRoutes = require('./routes/studentRoutes');
// const allocationRoutes = require('./routes/allocationRoutes');
// const dashboardRoutes = require('./routes/dashboardRoutes');
// const auditRoutes = require('./routes/auditRoutes');
// const permissionRoutes = require('./routes/permissionRoutes');
// const categoryRoutes = require('./routes/categoryRoutes');
// const publisherRoutes = require('./routes/publisherRoutes');

const app = express();
if (String(process.env.TRUST_PROXY) === 'true') app.set('trust proxy', 1);

app.use(helmet());
app.use(cors({ origin: process.env.CORS_ORIGIN?.split(',') || '*', credentials: true }));
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(compression());
app.use(hpp());
app.use(requestContext);

if (process.env.NODE_ENV !== 'production') app.use(morgan('dev'));

app.use('/api', rateLimit({ windowMs: 15 * 60 * 1000, max: 300 }));
app.get('/', (req, res) => res.json({ success: true, message: 'Library Management API Phase 3 running.' }));
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
// app.use('/api/auth', authRoutes);
app.use('/api/companies', companyRoutes);
// app.use('/api/students', studentRoutes);
// app.use('/api/allocations', allocationRoutes);
// app.use('/api/dashboard', dashboardRoutes);
// app.use('/api/audit-logs', auditRoutes);
// app.use('/api/permissions', permissionRoutes);
// app.use('/api/categories', categoryRoutes);
// app.use('/api/publishers', publisherRoutes);

app.use((req, res) => res.status(404).json({ success: false, message: 'Route not found.' }));
app.use(errorHandler);
module.exports = app;
