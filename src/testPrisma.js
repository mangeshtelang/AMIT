const prisma = require('./config/prisma');

async function testDB() {
    try {
        await prisma.$connect();
        console.log('Connected to the database successfully!');
    }
    catch (error) {
        console.error('Error connecting to the database:', error);
    }
    finally {
        await prisma.$disconnect();
    }
}

testDB();
