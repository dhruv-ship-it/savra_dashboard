const mysql = require('mysql2/promise');
require('dotenv').config();

async function setup() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    ssl: {
      rejectUnauthorized: false,
      require: true
    }
  });

  console.log("Connected to Railway DB");

  await connection.execute(`
    CREATE TABLE IF NOT EXISTS teachers (
      id VARCHAR(10) PRIMARY KEY,
      name VARCHAR(100) NOT NULL
    )
  `);

  await connection.execute(`
    CREATE TABLE IF NOT EXISTS activities (
      id INT AUTO_INCREMENT PRIMARY KEY,
      teacher_id VARCHAR(10) NOT NULL,
      grade INT NOT NULL,
      subject VARCHAR(100) NOT NULL,
      activity_type ENUM('Lesson Plan', 'Quiz', 'Question Paper') NOT NULL,
      created_at DATETIME NOT NULL,
      FOREIGN KEY (teacher_id) REFERENCES teachers(id) ON DELETE CASCADE,
      UNIQUE (teacher_id, grade, subject, activity_type, created_at)
    )
  `);

  console.log("Tables created successfully");

  await connection.end();
}

setup().catch(console.error);
