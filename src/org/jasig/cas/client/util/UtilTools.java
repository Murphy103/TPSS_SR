package org.jasig.cas.client.util;

import java.lang.reflect.Field;
import java.math.BigDecimal;
import java.math.RoundingMode;
import java.text.DecimalFormat;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.Date;
import java.util.regex.PatternSyntaxException;

import javax.servlet.http.HttpServletRequest;

/**
 * @note 常用日期时间、数据、字符处理
 * @author fengjie
 * 2012-08-26
 */
public class UtilTools {
	// 运算时精度
	private static final int CALCULATE_SCALE = 1;
	// 最终结果显示精度
	private static final int DISPLAY_SCALE = 2;
	
	/**
	 * 保留两位小数
	 * 
	 * @param parameter
	 * @return
	 */
	public static double getDoubleForParameter(double parameter) {
		java.text.NumberFormat  formater  =  java.text.DecimalFormat.getInstance();  
		formater.setMaximumFractionDigits(2);  
		formater.setMinimumFractionDigits(2);
		String value = formater.format(parameter);
		return Double.parseDouble(value);
	}
	
	/**
	 * 处理空字符串
	 * 
	 * @param obj
	 * @return
	 */
	public static String getStr(Object obj) {
		String str = "";
		if (obj != null) {
			str = obj.toString().trim();
		}
		return str;
	}

	/**
	 * 转化时间成字符串
	 * 
	 * @param dateTime
	 *            要转化的时间
	 * @param format
	 *            时间格式串
	 * @return 转化后的字符串
	 */
	public static String formatDateToString(Date dateTime, String format) {
		try {
			SimpleDateFormat innerFormat = new SimpleDateFormat(format);

			return innerFormat.format(dateTime);
		} catch (Exception e) {
			return "";
		}
	}

	public static String getCurrentDateTime() {
		return formatDateToString(new Date(), "yyyy-M-d HH:mm");
	}

	public static int getDay() {
		Calendar cal = Calendar.getInstance();
		cal.setTime(new Date());
		return cal.get(Calendar.DAY_OF_WEEK);
	}

	public static Date formatStringToDate(String dateStr, String formatStr) {
		String fStr = formatStr;
		if (dateStr == null || "".equals(dateStr.trim())) {
			return null;
		}
		if (fStr == null) {
			fStr = "yyyy-MM-dd";
		}
		SimpleDateFormat sdf = new SimpleDateFormat(fStr);
		try {
			return sdf.parse(dateStr);
		} catch (ParseException e) {
			return null;
		}
	}

	public static Date formatDateToDate(Date date, String formatStr) {
		if (date == null) {
			return null;
		} else {
			String str = UtilTools.formatDateToString(date, formatStr);
			return UtilTools.formatStringToDate(str, formatStr);
		}
	}
	
	public static Object trimString(Object source) {
		Class<? extends Object> sourceClass = source.getClass();
		Field[] fieldSource = sourceClass.getDeclaredFields();
		for (Field fs : fieldSource) {
			try {
				fs.setAccessible(true);
				Object o = fs.get(source);
				if (o != null && (o instanceof String)) {
					fs.set(source, ((String) o).trim());
				}
			} catch (IllegalArgumentException e) {
				return null;
			} catch (IllegalAccessException e) {
				return null;
			}
		}
		return source;
	}

	public static double getDecimalDouble(double money) {
		DecimalFormat deFormat = new DecimalFormat("0.00");
		if (money != 0) {
			return Double.parseDouble(deFormat.format(money));
		} else {
			return 0;
		}
	}

	/**
	 * 转换double值
	 * 
	 * @param info
	 * @return
	 */
	@SuppressWarnings("static-access")
	public static double getDisplayDouble(double info) {
		BigDecimal b1 = BigDecimal.ONE.valueOf(info);
		if (info != 0) {
			return b1.setScale(DISPLAY_SCALE, RoundingMode.HALF_UP).doubleValue();
		} else {
			return 0;
		}
	}
	
	/**
	 * 把科学计数转换成普通double类型,并以String显示
	 * @param info
	 * @return String
	 */
	public static String getDoubleChangeString(Object info) {
		if(null == info) {
			return "";
		}else {
			BigDecimal asd = new BigDecimal(Double.parseDouble(info.toString()) );		
			return String.valueOf(asd.setScale(2, BigDecimal.ROUND_DOWN));
		}
	}

	/**
	 * 加法
	 * 
	 * @param v1
	 * @param v2
	 * @return
	 */
	@SuppressWarnings("static-access")
	public static double add(double v1, double v2) {
		BigDecimal b1 = BigDecimal.ONE.valueOf(v1);
		BigDecimal b2 = BigDecimal.ONE.valueOf(v2);
		return b1.add(b2).setScale(CALCULATE_SCALE, RoundingMode.HALF_UP)
				.doubleValue();
	}

	/**
	 * 提供精确的减法运算。
	 * 
	 * @param v1
	 *            被减数
	 * @param v2
	 *            减数
	 * @return 两个参数的差
	 */
	@SuppressWarnings("static-access")
	public static double sub(double v1, double v2) {
		BigDecimal b1 = BigDecimal.ONE.valueOf(v1);
		BigDecimal b2 = BigDecimal.ONE.valueOf(v2);
		return b1.subtract(b2).setScale(CALCULATE_SCALE, RoundingMode.HALF_UP).doubleValue();

	}

	/**
	 * 
	 * 提供精确的乘法运算。
	 * 
	 * @param v1
	 *            被乘数
	 * 
	 * @param v2
	 *            乘数
	 * 
	 * @return 两个参数的积
	 * 
	 */
	@SuppressWarnings("static-access")
	public static double mul(double v1, double v2) {
		BigDecimal b1 = BigDecimal.ONE.valueOf(v1);
		BigDecimal b2 = BigDecimal.ONE.valueOf(v2);
		return b1.multiply(b2).setScale(CALCULATE_SCALE, RoundingMode.HALF_UP).doubleValue();

	}

	/**
	 * 
	 * 提供（相对）精确的除法运算，当发生除不尽的情况时，精确到
	 * 
	 * 小数点以后4位，以后的数字全舍。
	 * 
	 * @param v1
	 *            被除数
	 * 
	 * @param v2
	 *            除数
	 * 
	 * @return 两个参数的商
	 * 
	 */
	public static double div(double v1, double v2) {
		return div(v1, v2, CALCULATE_SCALE);
	}

	/**
	 * 
	 * 提供（相对）精确的除法运算。当发生除不尽的情况时，由scale参数指
	 * 
	 * 定精度，以后的数字全舍
	 * 
	 * @param v1
	 *            被除数
	 * 
	 * @param v2
	 *            除数
	 * 
	 * @param scale
	 *            表示表示需要精确到小数点以后几位。
	 * 
	 * @return 两个参数的商
	 * 
	 */
	@SuppressWarnings("static-access")
	public static double div(double v1, double v2, int scale) {
		if (scale < 0) {
			throw new IllegalArgumentException("精度必须为正整数或零");
		}
		BigDecimal b = BigDecimal.ONE.valueOf(v1);
		BigDecimal one = BigDecimal.ONE.valueOf(v2);
		return b.divide(one, scale, BigDecimal.ROUND_DOWN).doubleValue();
	}

	/**
	 * 还原字符串 存入数据库
	 * 
	 * @param toBack
	 *            要还原的字符串
	 * @return
	 */
	public static String backString(String toBack) {

		if (toBack != null) {
			return toBack.replaceAll("&gt", ">").replaceAll("&lt", "<")
					.replaceAll("&quot;", "\"");
		} else {
			return toBack;
		}
	}
	
	/**
	 * 抹零 去除小数点后面的数据
	 * 
	 * @param d
	 * @return
	 */
	@SuppressWarnings("static-access")
	public static double getValue(Double d, boolean toZero) {
		if (toZero) {
			return BigDecimal.ONE.valueOf(d).setScale(0, RoundingMode.FLOOR).intValue();
		} else {
			return BigDecimal.ONE.valueOf(d).setScale(CALCULATE_SCALE, RoundingMode.HALF_UP).doubleValue();
		}
	}

	/**
	 * 获取Double 如果double为null转化为0
	 * 
	 * @param args
	 */
	public static double getDoubleValue(Double number) {
		if (number == null) {
			return 0;
		} else {
			return number;
		}
	}

	public static double formatDouble(Double d) {
		if (d == null) {
			return 0;
		}
		BigDecimal b = new BigDecimal(d);
		return b.setScale(2, BigDecimal.ROUND_HALF_UP).doubleValue();
	}

	/**
	 * 获取项目的工程名 格式: /xxx
	 * 
	 * @param request
	 * @return
	 */
	public static String getPath(HttpServletRequest request) {
		return request.getContextPath();
	}

	/**
	 * 获取工程的绝对URL 格式：http://localost:8888/xxxx/
	 * 
	 * @param request
	 * @return
	 */
	public static String getBasePath(HttpServletRequest request) {
		String path = request.getContextPath();
		return request.getScheme() + "://" + request.getServerName() + ":" + request.getServerPort() + path + "/";
	}
//	
//	/**
//	 * 只允许为数字和字母
//	 * 
//	 * @param str
//	 * @return
//	 * @throws PatternSyntaxException
//	 */
//	public static boolean strFilterOne(String str) throws PatternSyntaxException    {      
//        // 只允许字母和数字        
//        // String    regEx   =   "[^a-zA-Z0-9]"; 
//		Pattern p = Pattern.compile("^[a-zA-Z0-9]+$");  
//		
//		Matcher m = p.matcher(str==null?"":str);      
//		return m.find() ;   
//	}    
//	
//	/**
//	 * 只允许为中文字符、数字、字母
//	 * 
//	 * @param str
//	 * @return
//	 * @throws PatternSyntaxException
//	 */
//	public static boolean strFilterTWO(String str) throws PatternSyntaxException    {      
//        // 只允许字母和数字        
//        // String    regEx   =   "[^a-zA-Z0-9]";                      
//		Pattern p = Pattern.compile("^[\u4e00-\u9fa5a\\w]+$");
//		
//		Matcher m = p.matcher(str==null?"":str);
//		return m.find() ;
//	}  
//	
//	/**
//	 * 只允许为数字、字母、规定的特殊字符
//	 * 
//	 * @param str
//	 * @return
//	 * @throws PatternSyntaxException
//	 */
//	public static boolean strFilterTHREE(String str) throws  PatternSyntaxException    {      
//        // 只允许字母和数字        
//        // String    regEx   =   "[^a-zA-Z0-9]";                      
//		Pattern p = Pattern.compile("^[a-zA-Z0-9`~!@#$%^&*()+=|{}':;',\\[\\].-<>/?~！@#￥%……&*（）——+|{}【】‘；：”“’。，、？]+$");  
//		
//		Matcher m = p.matcher(str==null?"":str);
//		return m.find(); 
//	}  
	
//	/**
//	 * 只允许为中文、数字、字母
//	 * 
//	 * @param str
//	 * @return
//	 * @throws PatternSyntaxException
//	 */
//	public static boolean strFilterHOUR(String str) throws  PatternSyntaxException    {      
//		String regEx="^[\u4e00-\u9fa5a\\w]+$";
//		
//		Pattern p = Pattern.compile(regEx);
//		Matcher m = p.matcher(str);
//		return m.find();
//	}    
//	
//	/**
//	 * 只允许为中文、数字、字母、规定的特殊字符
//	 * 
//	 * @param str
//	 * @return
//	 * @throws PatternSyntaxException
//	 */
//	public static boolean strFilterFive(String str) throws  PatternSyntaxException    {      
//		String regEx="^[\u4e00-\u9fa5a\\w`~!@#$%^&*()+=|{}':;',-\\[\\].<>/?~！@#￥%……&*（）——+|{}【】‘；：”“’。，、？]+$";
//		
//		Pattern p = Pattern.compile(regEx);
//		Matcher m = p.matcher(str);
//		return m.find();
//	}     
	
	/**
	 * 只允许为中文、数字、字母、规定的特殊字符
	 * 
	 * @param str
	 * @return
	 * @throws PatternSyntaxException
	 */
	public static boolean strFilterSix(String str) throws  PatternSyntaxException    {      
		if(str == null || "".equals(str.trim()) ) {
			return true;
		}
		if(str.indexOf("<") != -1 || str.indexOf(">") != -1 || str.indexOf("\"") != -1) {
			return false;
		}
		return true;
	}
	
	/**
	 *  替换字符串函数
	 *  String strSource - 源字符串
	 *  String strFrom   - 要替换的子串
	 *  String strTo     - 替换为的字符串
	 */
	public static String replace(String strSource, String strFrom, String strTo) {
		// 如果要替换的子串为空，则直接返回源串
		if(strFrom == null || strFrom.equals("")) {
			return strSource;
		}
		String strDest = "";
		// 要替换的子串长度
		int intFromLen = strFrom.length();
		int intPos;
		// 循环替换字符串
		while((intPos = strSource.indexOf(strFrom)) != -1) {
			// 获取匹配字符串的左边子串
			strDest = strDest + strSource.substring(0,intPos);
			// 加上替换后的子串
			strDest = strDest + strTo;
			// 修改源串为匹配子串后的子串
			strSource = strSource.substring(intPos + intFromLen);
		}
		// 加上没有匹配的子串
		strDest = strDest + strSource;
		// 返回
		return strDest;
	}

	/**
	 * 处理把空字符或者空对象转换成空对象
	 * @param obj
	 * @return
	 */
	public static Object getDataToObjectByNULL(Object obj) {
		if(null == obj || "".equals(obj.toString()) ) {
			return null;
		} else {
			return obj;
		}
	}
	
	/**
	 * 处理把空字符或者空对象转换成空对象
	 * @param obj
	 * @return
	 */
	public static String getDataToStringByNULL(Object obj) {
		if(null == obj || "".equals(obj.toString()) ) {
			return null;
		} else {
			return obj.toString();
		}
	}
	
	/**
	 * 处理把空字符或者空对象转换成空对象
	 * @param obj
	 * @return
	 */
	public static String objectToString(Object obj) {
		return null == obj ? "" : obj.toString().toString();
	}
	
    public static boolean isNotEmpty(String string) {
        return !isEmpty(string);
    }
	
    public static boolean isEmpty(String string) {
        return null == string || string.length() == 0;
    }

}