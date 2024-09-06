const mysql = require('mysql2/promise');
require('dotenv').config();

const dbConfig = {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
  };

// 创建连接池
const pool = mysql.createPool(dbConfig);

// 写入数据
async function writeData(table, data) {
  const keys = Object.keys(data);
  const values = Object.values(data);
  const placeholders = keys.map(() => '?').join(',');
  
  const sql = `INSERT INTO ${table} (${keys.join(',')}) VALUES (${placeholders})`;
  
  try {
    const [result] = await pool.execute(sql, values);
    return result.insertId;
  } catch (error) {
    console.error('写入数据错误:', error);
    throw error;
  }
}

// 读取数据
async function readData(table, condition = '') {
  const sql = `SELECT * FROM ${table} ${condition}`;
  
  try {
    const [rows] = await pool.query(sql);
    return rows;
  } catch (error) {
    console.error('读取数据错误:', error);
    throw error;
  }
}

// 更新数据
async function updateData(table, data, condition) {
    const setClause = Object.entries(data)
      .map(([key, value]) => `${key} = ?`)
      .join(', ');
    const values = Object.values(data);
    
    const sql = `UPDATE ${table} SET ${setClause} WHERE ${condition}`;
    
    try {
      const [result] = await pool.execute(sql, values);
      return result;
    } catch (error) {
      console.error('更新数据错误:', error);
      throw error;
    }
  }

module.exports = { writeData, readData, updateData };
