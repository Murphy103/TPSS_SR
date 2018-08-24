package com.tydic.lbs.util;

import java.lang.reflect.InvocationTargetException;
import java.util.List;
import java.util.Map;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import com.tydic.lbs.frame.BaseService;
import com.tydic.lbs.frame.LoadParam;
import com.tydic.lbs.service.CommonDBService;


public class CheckUtil {
	
		
	/**
	 * 校验数据源
	 * @param service_name
	 * @param dataList
	 * @param errorMsg
	 * @throws IllegalAccessException
	 * @throws IllegalArgumentException
	 * @throws InvocationTargetException
	 * @throws NoSuchMethodException
	 * @throws SecurityException
	 */
	public static void check(String service_name,String checkFlag,List<Map<String,Object>> dataList,List<String> errorMsg) throws IllegalAccessException, IllegalArgumentException, InvocationTargetException, NoSuchMethodException, SecurityException{
		//根据service_name获取校验规则
		List<Map<String, Object>> ruleList = LoadParam.ruleMap.get(service_name);
		
		//不需要校验
		if(ruleList == null || ruleList.size() <= 0){
			return;
		}
		
		CheckUtil checkUtil = new CheckUtil();
		
		//循环数据源和校验规则校验数据
		int rownum = 0;
		for(Map<String,Object> data:dataList){
			rownum++;
			for(Map<String, Object> rule:ruleList){
				boolean result = false;
				data.put("data_key", data.get(rule.get("DATA_KEY")+""));
				data.put("service_name", rule.get("CHECK_SERVICE_NAME"));
				result = (boolean)checkUtil.getClass().getMethod(rule.get("CHECK_FUNC")+"",Map.class).invoke(checkUtil,data);
			
				if(result != Boolean.parseBoolean(rule.get("RESULT_FLAG")+"")){
					if(checkFlag.equals("excel")){
						errorMsg.add("第"+rownum+"行"+rule.get("ERRORMSG")+"");
					}else{
						errorMsg.add(rule.get("ERRORMSG")+"");
					}
					
				}
			}
		}
	}
	
	/**
	 * 校验单条数据源
	 * @param service_name
	 * @param dataMap
	 * @param errorMsg
	 * @throws IllegalAccessException
	 * @throws IllegalArgumentException
	 * @throws InvocationTargetException
	 * @throws NoSuchMethodException
	 * @throws SecurityException
	 */
	public static void checkOne(String service_name,Map<String,Object> dataMap,List<String> errorMsg) throws IllegalAccessException, IllegalArgumentException, InvocationTargetException, NoSuchMethodException, SecurityException{
		//根据service_name获取校验规则
		List<Map<String, Object>> ruleList = LoadParam.ruleMap.get(service_name);
		
		//不需要校验
		if(ruleList == null || ruleList.size() <= 0){
			return;
		}
		
		CheckUtil checkUtil = new CheckUtil();
		//循环校验规则校验数据
		for(Map<String, Object> rule:ruleList){
			boolean result = false;
			dataMap.put("data_key", rule.get("DATA_KEY"));
			dataMap.put("service_name", rule.get("CHECK_SERVICE_NAME"));
			result = (boolean)checkUtil.getClass().getMethod(rule.get("CHECK_FUNC")+"",Map.class).invoke(checkUtil,dataMap);
			
			if(result != Boolean.parseBoolean(rule.get("RESULT_FLAG")+"")){
				errorMsg.add(rule.get("ERRORMSG")+"");				
			}
		}
	}
	
	/**
	 * 检查是否空字符串
	 * @param checkString
	 * @return
	 */
	public boolean isNull(Map<String,Object> data){
		String str = data.get("data_key")+"";
		if(str == null || str.length() <= 0){
			return false;
		}else{
			return true;
		}
	}
	
	/**
	 * 判断是否整数
	 * @param str
	 * @return
	 */
	public boolean isNumeric(Map<String,Object> data) {   
		String str = data.get("data_key")+"";
		if (str != null && !"".equals(str.trim())){
			return str.matches("^[0-9]*$");  
		}else{
			return false;  
		}
	  } 
	
	/**
	 * 执行SQL校验某字段是否存在
	 * @param service_name
	 * @param params
	 * @return
	 * @throws Exception
	 */
	public boolean isExists(Map<String,Object> data) throws Exception{
		String service_name = data.get("service_name")+"";
		CommonDBService imp= new CommonDBService();
		//获取记录
		List<Map<String, Object>> dataList = imp.queryDataToPage(service_name,data);
		
		if(dataList.size() <= 0){
			return false;
		}else{
			return true;
		}
	}
	/**
	 * 执行SQL校验某字段是否为手机号
	 * @param service_name
	 * @param params
	 * @return
	 * @throws Exception
	 */
	public boolean isPhoneNumber(Map<String,Object> data)throws Exception{
		String str = data.get("data_key")+"";
		String regExp = "^((13[0-9])|(15[^4])|(18[0,2,3,5-9])|(17[0-8])|(147))\\d{8}$";
		Pattern p = Pattern.compile(regExp);
		Matcher m = p.matcher(str); 
		return m.matches();
	}
}
