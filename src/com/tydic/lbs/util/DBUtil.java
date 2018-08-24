package com.tydic.lbs.util;

import java.sql.Connection;
import java.sql.SQLException;

import javax.sql.DataSource;

public class DBUtil {
	private static String DB_BEAN_NAME="dataSource";
	private static DataSource dataSource=null;
	public synchronized static  Connection getConnection() throws SQLException{
		if(dataSource==null){
			dataSource=(DataSource)SpringBeanUtil.getBean(DB_BEAN_NAME);
		} 
		 Connection con=dataSource.getConnection();
		 //防止其他应用程序修改自动提交的属性
		 con.setAutoCommit(true);
		 return con;
	}
	public static String getDB_BEAN_NAME() {
		return DB_BEAN_NAME;
	}

	public static void setDB_BEAN_NAME(String db_bean_name) {
		DB_BEAN_NAME = db_bean_name;
	}
	
}
