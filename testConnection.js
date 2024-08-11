// testConnection.js
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function testConnection() {
  try {
    // Run a simple query to test the connection
    const result = await prisma.$queryRaw`SELECT 1`;
    console.log('Database connection successful:', result);
  } catch (error) {
    console.error('Error connecting to the database:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testConnection();
