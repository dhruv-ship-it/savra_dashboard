const mysql = require('mysql2/promise');
require('dotenv').config();

async function insertData() {
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

  // Insert teachers
  await connection.execute(`
    INSERT INTO teachers (id, name) VALUES
    ('T001', 'Anita Sharma'),
    ('T002', 'Rahul Verma'),
    ('T003', 'Pooja Mehta'),
    ('T004', 'Vikas Nair'),
    ('T005', 'Neha Kapoor')
  `);

  console.log("✅ Teachers inserted");

  // Insert activities
  await connection.execute(`
    INSERT INTO activities (teacher_id, grade, subject, activity_type, created_at) VALUES
    ('T004',10,'Social Studies','Quiz','2026-02-12 19:07:41'),
    ('T003',7,'English','Question Paper','2026-02-13 15:31:51'),
    ('T004',10,'Social Studies','Lesson Plan','2026-02-11 19:15:55'),
    ('T001',7,'Mathematics','Lesson Plan','2026-02-17 20:35:33'),
    ('T004',9,'Social Studies','Question Paper','2026-02-15 16:51:32'),
    ('T003',6,'English','Quiz','2026-02-14 15:22:29'),
    ('T005',10,'Mathematics','Quiz','2026-02-12 12:26:22'),
    ('T002',9,'Science','Quiz','2026-02-17 09:21:32'),
    ('T002',9,'Science','Question Paper','2026-02-12 11:38:24'),
    ('T003',6,'English','Question Paper','2026-02-17 19:07:47'),
    ('T005',10,'Mathematics','Lesson Plan','2026-02-11 17:53:57'),
    ('T001',8,'Mathematics','Question Paper','2026-02-16 11:26:52'),
    ('T003',7,'English','Lesson Plan','2026-02-16 15:41:50'),
    ('T005',10,'Mathematics','Question Paper','2026-02-11 17:54:16'),
    ('T001',8,'Mathematics','Lesson Plan','2026-02-17 19:19:56'),
    ('T004',9,'Social Studies','Quiz','2026-02-16 19:12:33'),
    ('T001',8,'Mathematics','Question Paper','2026-02-13 09:16:06'),
    ('T003',6,'English','Quiz','2026-02-15 11:36:03'),
    ('T004',9,'Social Studies','Lesson Plan','2026-02-11 13:06:29'),
    ('T005',10,'Mathematics','Quiz','2026-02-15 13:31:42'),
    ('T001',8,'Mathematics','Question Paper','2026-02-16 11:44:31'),
    ('T001',8,'Mathematics','Lesson Plan','2026-02-18 18:45:43'),
    ('T005',10,'Mathematics','Question Paper','2026-02-12 19:19:44'),
    ('T002',8,'Science','Quiz','2026-02-14 13:57:07'),
    ('T002',8,'Science','Question Paper','2026-02-12 18:01:59'),
    ('T001',7,'Mathematics','Question Paper','2026-02-14 10:36:09'),
    ('T001',8,'Mathematics','Lesson Plan','2026-02-18 16:32:47'),
    ('T004',10,'Social Studies','Quiz','2026-02-15 15:59:00'),
    ('T002',8,'Science','Lesson Plan','2026-02-15 13:31:36'),
    ('T004',9,'Social Studies','Lesson Plan','2026-02-15 16:32:23'),
    ('T003',6,'English','Question Paper','2026-02-18 09:12:05'),
    ('T005',9,'Mathematics','Lesson Plan','2026-02-18 16:26:04'),
    ('T005',9,'Mathematics','Lesson Plan','2026-02-16 17:14:47'),
    ('T003',6,'English','Question Paper','2026-02-12 17:47:58'),
    ('T005',10,'Mathematics','Quiz','2026-02-18 14:05:20')
  `);

  console.log("✅ Activities inserted");

  // Verify data
  const [teacherCount] = await connection.execute('SELECT COUNT(*) as count FROM teachers');
  const [activityCount] = await connection.execute('SELECT COUNT(*) as count FROM activities');
  
  console.log(`📊 Summary: ${teacherCount[0].count} teachers, ${activityCount[0].count} activities`);

  await connection.end();
}

insertData().catch(console.error);
