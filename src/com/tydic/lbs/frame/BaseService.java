/*
 * @author xiangsl   
 * @date 2015年7月9日 下午12:44:00 
 * @Description: 此处添加文件描述……
 */
package com.tydic.lbs.frame;

import java.util.Enumeration;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;

import org.jasig.cas.client.util.AuthVo;
import org.jasig.cas.client.util.SessionUtil;

import com.alibaba.fastjson.JSON;
import com.tydic.lbs.entity.Empee;

/**
 * 
 * @Package com.tydic.nodm.frame
 * @ClassName BaseService.java
 * @author xiangsl
 * @date 2015年7月9日 下午12:45:57
 * @Description: 所有服务类的公用类……
 * @version V1.0
 */
public abstract class BaseService {
	/**
	 * 
	 * Description:将json转成map对象……
	 * 
	 * @param request
	 * @return
	 */
	public Map dataToMap(HttpServletRequest request) {
		String json = request.getParameter("data");
		//String json = "{\"prodInst\":[{\"ACC_NBR\":\"110\",\"OWNER_CUST_ID\":\"\u9ed8\u8ba4\u5ba2\u6237\u540d\",\"ACCOUNT_ID\":\"\",\"PROD_INST_ID\":\"\"}],\"prodInstAttr\":[{\"2001\":\"\",\"2003\":\"\",\"2002\":\"\",\"5001\":\"\",\"5002\":\"\",\"5003\":\"\",\"4002\":\"\",\"4001\":\"\",\"payment_mode_cd\":\"\u9884\u4ed8\u8d39\",\"3001\":\"\u7f3a\u7701\"}]}";
		Map map = null;
		try {
			map = (Map) JSON.parseObject(json, Map.class);
		} catch (Exception e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		return map;
	}
	
	/**
	 * 获取sqlcode
	 * @param request
	 * @return
	 */
	public String getSqlCode(HttpServletRequest request) {
		if(request.getParameter("data")!=null){
			Map map=dataToMap(request);
			return String.valueOf(map.get("sqlcode"));
			
		}else{
			return request.getParameter("sqlcode");
		}
			
	}
	
	
	/**
	 * 参数转换String[]
	 * @param request
	 * @return
	 */
	public String[] dataToArr(HttpServletRequest request) {
		int paramCount=0;
		String[] params;
		if(request.getParameter("data")!=null){
 			Map map=dataToMap(request);
 			 
			for (int i=0;i<=30;i++) {  
				if(map.get("sV"+i) !=null){
					paramCount++;
	 			}
			  
			}
			params=new String[paramCount];
			for (int i=1;i<=paramCount;i++) {  
				params[i-1]=String.valueOf(map.get("sV"+i));
			}
 		}else{
 			
 			for (int i=0;i<=30;i++) {  
				if(request.getParameter("sV"+i) !=null){
					paramCount++;
	 			}
			  
			} 
 			params=new String[paramCount];
 			for (int i=1;i<=paramCount;i++) {  
 				params[i-1]=request.getParameter("sV"+i);
 			}
			
 		}
		
 		return  params;
	}
	
	/**
	 * 参数转换String[]
	 * @param request
	 * @return
	 */
	public Map dataToMap_new(HttpServletRequest request) {
		Map params = new HashMap();
		Enumeration enu=request.getParameterNames();  
		while(enu.hasMoreElements()){  
			String paraName=(String)enu.nextElement();  
			System.out.println(paraName+": "+request.getParameter(paraName));  
			
			if(paraName.equals("params")){
				Map paramMap = this.jsonStrToMap(request.getParameter(paraName));
				params.putAll(paramMap);
			}else{
				params.put(paraName, request.getParameter(paraName));
			}
			
		}
		
 		return  params;
	}
	
	public Map dataToMap_old(HttpServletRequest request) {
		Map params = new HashMap();
		Enumeration enu=request.getParameterNames();  
		while(enu.hasMoreElements()){  
			String paraName=(String)enu.nextElement();  
			System.out.println(paraName+": "+request.getParameter(paraName));  
			params.put(paraName, request.getParameter(paraName));
		}
		
		Empee e = getEmpee(request);
		if(e != null){
			params.put("staff_id", e.getEmpee_id());
			params.put("staff_code", e.getEmpee_acct());
			params.put("staff_latn_id", e.getLatn_id());
		}else{
			params.put("staff_id", 3303105);
			params.put("staff_code", 2);
			params.put("staff_latn_id", 888);
		}
 		return  params;
		
	}
	
	/**
	 * 获取用户id
	 * @return
	 */
	private Empee getEmpee(HttpServletRequest request)
	{
	      Empee empee = (Empee) request.getSession().getAttribute(
			"empee");
			return empee;
	}

	/**
	 * 
	 * Description:此处添加方法作用……
	 * 
	 * @param request
	 * @return
	 */
	public List<Map> dataToListMap(HttpServletRequest request) {
		String json = request.getParameter("data");
		return null;
	}
	/**
	 * Description:取员工公用信息……
	 * 
	 * @param request
	 * @return
	 */
	public AuthVo getAuthInfo(HttpServletRequest request) {
		AuthVo authVo = (AuthVo) SessionUtil.getSessionUserInfo(request);
		return authVo;
//		return new AuthVo();
	}
	/**
	 * 
	 * Description:取员工用户id……
	 * @param request
	 * @return
	 */
	public String getSystemUserId(HttpServletRequest request) {
		AuthVo authVo = (AuthVo) SessionUtil.getSessionUserInfo(request);
		return authVo.getSystemUserId();
	}
	
	/**
	 * json字符串转数组
	 * @param jsonStr
	 * @return
	 * @author crast
	 * @date 20170718
	 */
	@SuppressWarnings({ "rawtypes", "unchecked" })
	public  Map<String,Object>jsonStrToMap(String jsonStr){
		Map map=(Map) JSON.parseObject(jsonStr, Map.class);
		return map;
	}
	
	/**
	 * 从map中取参数
	 * @param map
	 * @return
	 * @author crast
	 * @date 20170718
	 */
	@SuppressWarnings("rawtypes")
	public String[] getParams(Map map){
		int paramCount=0;
		String[] params;
		for (int i=0;i<=30;i++) {  
			if(map.get("sV"+i) !=null){
				paramCount++;
 			}
		  
		}
		params=new String[paramCount];
		for (int i=1;i<=paramCount;i++) {  
			params[i-1]=String.valueOf(map.get("sV"+i));
		}
		return params;
	}
	
	/**
	 * 从map中取参数
	 * @param map
	 * @return
	 * @author crast
	 * @date 20170718
	 */
	@SuppressWarnings("rawtypes")
	public Map<String,Object> getMapParams(Map map){
		Map<String,Object> returnMap=new HashMap<String,Object>();
		for (int i=0;i<=30;i++) {  
			if(map.get("sV"+i) !=null){
				returnMap.put("sV"+i, map.get("sV"+i));
 			}
		  
		}
		
		return returnMap;
	}
}
