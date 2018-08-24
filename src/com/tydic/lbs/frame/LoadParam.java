package com.tydic.lbs.frame;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import com.tydic.lbs.service.CommonDBService;


public class LoadParam {
	//校验规则
	public static Map<String,List<Map<String, Object>>> ruleMap = new HashMap<String,List<Map<String, Object>>>();
	//导入列
	public static Map<String,List<Map<String, Object>>> importMap = new HashMap<String,List<Map<String, Object>>>();
	
	public void init() throws Exception {
		CommonDBService imp= new CommonDBService();
		try{
			if(ruleMap.size() <= 0){
				//获取记录
				List<Map<String, Object>> dataList = imp.queryDataToPage("GET_PAR_VALID_RULE",new HashMap<>());
				String serviceName = "";
				for(Map<String, Object> data:dataList){
					serviceName = data.get("SERVICE_NAME")+"";
					List<Map<String, Object>> dataNew = ruleMap.get(data.get("SERVICE_NAME"));
					
					if(dataNew == null){
						dataNew = new ArrayList<Map<String, Object>>();
					}
					
					dataNew.add(data);
					ruleMap.put(serviceName, dataNew);
				}
				
				//处理只有一条记录的情况
				if(ruleMap.size() == 0 && dataList.size() > 0)
				{
					ruleMap.put(serviceName, dataList);
				}
			}
			
			if(importMap.size() <= 0){
				//获取记录
				List<Map<String, Object>> dataList = imp.queryDataToPage("GET_PAR_IMPORT_COLUMN",new HashMap<>());
				String serviceName = "";
				for(Map<String, Object> data:dataList){
					serviceName = data.get("SERVICE_NAME")+"";
					List<Map<String, Object>> dataNew = importMap.get(data.get("SERVICE_NAME"));
					
					if(dataNew == null){
						dataNew = new ArrayList<Map<String, Object>>();
					}
					
					dataNew.add(data);
					importMap.put(serviceName, dataNew);
					
				}
				
				//处理只有一条记录的情况
				if(importMap.size() == 0 && dataList.size() > 0)
				{
					importMap.put(serviceName, dataList);
				}
			}
			
		}catch(Exception e){
			e.printStackTrace();
		}
		
	}

	
}
