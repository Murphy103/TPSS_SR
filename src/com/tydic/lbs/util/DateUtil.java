package com.tydic.lbs.util;

import java.util.Date;
import java.text.SimpleDateFormat;

public class DateUtil {
	public static String getNowTime() { 
		SimpleDateFormat df = new SimpleDateFormat("yyyyMMddHHmmss");//设置日期格式
		return df.format(new Date());// new Date()为获取当前系统时间
	}
}