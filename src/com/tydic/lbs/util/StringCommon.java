package com.tydic.lbs.util;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.Date;
import java.util.GregorianCalendar;
import java.util.Random;
import java.util.regex.Matcher;
import java.util.regex.Pattern;


public class StringCommon {
	/**
	 * 如果字符串为null返回true
	 * @param str
	 * @return
	 */
	public static boolean isNull(String str){
		if(str==null||str.equals("")||str.equalsIgnoreCase("null")){
			return true;
		}else{
			return false;
		}
	}
	
	/**
	 * 如果第一位是小数点，则在前面加0返回
	 * 
	 * @date May 10, 2010
	 * @param value  
	 * @return
	 */
	public static String getdecimalWithZero(String value) {
		//如果第一位是小数点，则在前面加0返回
		if(value.startsWith(".")) {
			
			return "0" + value;
		}
		
		return value;
	}
	
	/**
	 * 取得指定日期的上个月
	 * 
	 * @date May 10, 2010
	 * @param thisMonth YYYYMM  
	 * @return YYYYMM
	 */
	public static String getLastMonth(String thisMonth) {
		 
		 if(thisMonth.length()==6) {
			 int year = Integer.valueOf(thisMonth.substring(0,4));
			 int month = Integer.valueOf(thisMonth.substring(4));
			 if(month<=12 && month >=2) {
				 if(month<=10) {
					 return String.valueOf(year) +"0"+String.valueOf(month-1);
				 }
				 return String.valueOf(year) +String.valueOf(month-1);
				 
			 } else {
				 return  String.valueOf(year-1) +"12";
			 }
		 }
		 
		 return thisMonth;
	 }
	
	/**
	 * 取得指定日期的天数
	 * 
	 * @date May 10, 2010
	 * @param thisMonth YYYYMM  
	 * @return day
	 */
	public static String geMonthDay(String thisMonth) {
		  
		
		 if(thisMonth.length()==6) {
			 SimpleDateFormat format = new SimpleDateFormat("yyyyMMdd");
			 Calendar calendar = new GregorianCalendar();
			 Date date;
			 int day=30;
			try {
				date = format.parse(thisMonth+"01");
				
			    calendar.setTime(date);
			    day =calendar.getActualMaximum(Calendar.DAY_OF_MONTH);
			} catch (ParseException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}
		      
		      return String.valueOf(day);
			 
		 }
		  
		 return "30";
	 }
	/**
	 * 如果字符串为null返回空
	 * @param str
	 * @return
	 */
	public static String trimNull(String str){
		if(str==null||str.equalsIgnoreCase("null")){
			return "";
		}else{
			return str.trim();
		}
	}
	
	/**
	 * 是否为整数
	 * @param str
	 * @return
	 */
	public static boolean isInt(String str){
		if(str==null||str.equals("")||str.equalsIgnoreCase("null")){
			return false;
		}else{
			return str.matches("^\\+?\\-?[\\d]+$");
		}
	}
	
	/**
	 * 是否为整数
	 * @param str
	 * @return
	 */
	public static boolean isNumber(String str) {
		if(str==null||str.equals("")||str.equalsIgnoreCase("null")){
			return false;
		}else{
	       return str.matches("(^\\+?\\-?[\\d]+[.]?[\\d]+$)||(^\\+?\\-?[\\d]+$)");
		}
	  }
	/**
	 * 百分数
	 * @param str
	 * @return
	 */
	public static boolean isPercent(String str) {
		if(str==null||str.equals("")||str.equalsIgnoreCase("null")){
			return false;
		}else{
	       return str.matches("^\\+?\\-?\\d+\\.?\\d*\\%?$");
		}
	  }
	
	 public static int getChineseNum(String context){    ///统计context中是汉字的个数
	        int lenOfChinese=0;
	        Pattern p = Pattern.compile("[\u4e00-\u9fa5]");    //汉字的Unicode编码范围
	        Matcher m = p.matcher(context);
	        while(m.find()){
	            lenOfChinese++;
	        }
	        return lenOfChinese;
	 }
	 
	 /**
		 * java生成随机数字和字母组合
		 * 
		 * @param length
		 *            [生成随机数的长度]
		 * @return
		 */
		public static String getRamCharAndNumr(int length) {
			String val = "";
			Random random = new Random();
			for (int i = 0; i < length; i++) {
				// 输出字母还是数字
				String charOrNum = random.nextInt(2) % 2 == 0 ? "char" : "num";
				// 字符串
				if ("char".equalsIgnoreCase(charOrNum)) {
					// 取得大写字母还是小写字母
					int choice = random.nextInt(2) % 2 == 0 ? 65 : 97;
					val += (char) (choice + random.nextInt(26));
				} else if ("num".equalsIgnoreCase(charOrNum)) { // 数字
					val += String.valueOf(random.nextInt(10));
				}
			}
			return val;
		}

	 
}
