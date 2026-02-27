const mysql = require('mysql2/promise');
require('dotenv').config();

async function testConnection() {
  try {
    // First try connecting without specifying database
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      port: process.env.DB_PORT,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      ssl: {
        rejectUnauthorized: false,
        require: true
      }
    });

    console.log("✅ Connected to Railway MySQL server");
    
    // List available databases
    const [databases] = await connection.execute('SHOW DATABASES');
    console.log('Available databases:', databases);
    
    await connection.end();
  } catch (error) {
    console.error('❌ Connection failed:', error.message);
  }
}

testConnection();
