package com.tydic.lbs.util;

import java.util.Date;
import java.util.List;

/**
 * lulin
 */

public class ObjectIsNull {

	public static boolean check(Object obj){
		if(obj==null) return true;
		/*String*/
		if(obj instanceof String){
			return checkString((String)obj);
		}
		/*Integer*/
		if(obj instanceof Integer){
			return checkInteger((Integer)obj);
		}
		/*Long*/
		if(obj instanceof Long){
			return checkLong((Long)obj);
		}
		/*Double*/
		if(obj instanceof Double){
			return checkDouble((Double)obj);
		}
		/*Date*/
		if(obj instanceof Date){
			return checkDate((Date)obj);
		}
		/*List*/
		if(obj instanceof List){
			return checkList((List)obj);
		}
		/*String[]*/
		if(obj instanceof String[]){
			return checkDate((String[])obj);
		}
		
		return true;
	}

	private static boolean checkDate(Date date) {
		if(date == null ){
			return true;
		}
		return false;
	}

	private static boolean checkDate(String[] strings) {
		if(strings.length<=0)
			return true;
		return false;
	}

	private static boolean checkDouble(Double double1) {
		if( double1.doubleValue()==0){
			return true;
		}
		return false;
	}

	private static boolean checkInteger(Integer integer) {
		if( integer.intValue()==0 || integer.intValue()==-1 ){
			return true;
		}
		return false;
	}

	private static boolean checkList(List list) {
		if( list.size()<=0)
			return true;
		return false;
	}

	private static boolean checkLong(Long long1) {
		if( long1.longValue()==0 || long1.longValue()==-1L ){
			return true;
		}
		return false;
	}

	private static boolean checkString(String string) {
		if( string.trim().length()<=0 || "null".equalsIgnoreCase(string)){
			return true;
		}
		return false;
	}
}
