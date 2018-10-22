package com.lk.dbutil;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.Statement;

import com.mysql.jdbc.PreparedStatement;
/*poi导出需要使用*/
public class DbUtil
{
	// 数据库地址
	private static String dbUrl = "jdbc:mysql://127.0.0.1:3306/KFOMC?characterEncoding=utf8&useSSL=false";
	// 用户名
	private static String dbUserName = "root";
	// 密码
	private static String dbPassword = "kaizi21.zjy";
	// 驱动名称
	private static String jdbcName = "com.mysql.jdbc.Driver";

	/**
	 * 获取数据库连接
	 * 
	 * @return
	 * @throws Exception
	 */
	public Connection getCon() throws Exception
	{
		Class.forName(jdbcName);
		Connection con = DriverManager.getConnection(dbUrl, dbUserName, dbPassword);
		return con;
	}

	/**
	 * 关闭连接
	 * 
	 * @param con
	 * @throws Exception
	 */
	public void close(Statement stmt, Connection con) throws Exception
	{
		if (stmt != null)
		{
			stmt.close();
			if (con != null)
			{
				con.close();
			}
		}
	}

	/**
	 * 关闭连接
	 * 
	 * @param con
	 * @throws Exception
	 */
	public void close(PreparedStatement pstmt, Connection con) throws Exception
	{
		if (pstmt != null)
		{
			pstmt.close();
			if (con != null)
			{
				con.close();
			}
		}
	}

}
