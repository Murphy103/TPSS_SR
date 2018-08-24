package com.tydic.lbs.servlet;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import com.tydic.lbs.entity.Empee;
import com.tydic.lbs.frame.BaseService;
import com.tydic.lbs.service.CommonDBService;

/**
 * Servlet implementation class TaskMonitor
 */
@Service("ruleServlet")
public class RuleServlet extends BaseService {
	private static final long serialVersionUID = 1L;
	private Logger logger = LoggerFactory.getLogger(RuleServlet.class);

	public static final String CHAR_ENCODING = "UTF-8";
	public static final String CONTENT_TYPE = "text/html; charset=utf-8";

	/**
	 * 获取用户id
	 * 
	 * @return
	 */
	@SuppressWarnings("unused")
	private String getEmpeeId(HttpServletRequest request) {
		Empee empee = (Empee) request.getSession().getAttribute("empee");

		String empeeId = "24316";
		if (empee != null)
			empeeId = empee.getEmpee_id().toString();
		logger.info("empeeId----->:" + empeeId);
		return empeeId;
	}

	
	/**
	 * 规则的新增和修改
	 * @param request
	 * @param response
	 * @param rtnMap
	 */
	public void operation(HttpServletRequest request,
			HttpServletResponse response, Map<String, Object> rtnMap) {

		try {

			CommonDBService imp = new CommonDBService();
			Map params = this.dataToMap_new(request);
			String action = params.get("action")+"";
			
			if(action.equals("add")){
				//生成销售品ID、定价计划ID、策略ID
				Map<String,Object> offerMap = imp.selectOne("GET_ACTIVITY_SEQS", new HashMap());
				Long offerID = Long.parseLong(offerMap.get("OFFER_ID")+"");
				Long pricingPlanID = Long.parseLong(offerMap.get("PRICING_PLAN_ID")+"");
				Long pricingStrategyID = Long.parseLong(offerMap.get("PRICING_STRATEGY_ID")+"");
				params.put("OFFER_ID",offerID);
				params.put("PRICING_PLAN_ID",pricingPlanID);
				params.put("PRICING_STRATEGY_ID",pricingStrategyID);
			}
			params.put("CREATE_STAFF",
					Long.parseLong(this.getEmpeeId(request)));
			params.put("UPDATE_STAFF",
					Long.parseLong(this.getEmpeeId(request)));
			
			//需要批量执行的SQL、参数、执行标志
			List<String> serviceNameList = new ArrayList<String>();
			List<Map<String, Object>> paramList = new ArrayList<Map<String, Object>>();
			Map<String,List<Map<String, Object>>> paramMap = new HashMap<String,List<Map<String, Object>>>();
			Map<String,String> operMap = new HashMap<String,String>();
			paramList.add(params);
			
			//开始组装批量执行SQL
			logger.debug("组装批量执行SQL--begin");
			
			//新增活动
			if(action.equals("add")){
				//新增销售品
				serviceNameList.add("PRICING_OFFER_INSERT");
				paramMap.put("PRICING_OFFER_INSERT", paramList);
				operMap.put("PRICING_OFFER_INSERT", "AO");
				
				//新增定价计划
				serviceNameList.add("PRICING_PLAN_INSERT");
				paramMap.put("PRICING_PLAN_INSERT", paramList);
				operMap.put("PRICING_PLAN_INSERT", "AO");
				
				//保存策略
				serviceNameList.add("PRICING_STRATEGY_INSERT");
				paramMap.put("PRICING_STRATEGY_INSERT", paramList);
				operMap.put("PRICING_STRATEGY_INSERT", "AO");
				
				//保存定价计划/策略关系
				serviceNameList.add("PRICING_PLAN_STRATEGY_RELA_INSERT");
				paramMap.put("PRICING_PLAN_STRATEGY_RELA_INSERT", paramList);
				operMap.put("PRICING_PLAN_STRATEGY_RELA_INSERT", "AO");
			}else if(action.equals("edit")){//修改活动
				//修改销售品
				serviceNameList.add("PRICING_OFFER_UPDATE");
				paramMap.put("PRICING_OFFER_UPDATE", paramList);
				operMap.put("PRICING_OFFER_UPDATE", "UO");
				
				//修改定价计划
				serviceNameList.add("PRICING_PLAN_UPDATE");
				paramMap.put("PRICING_PLAN_UPDATE", paramList);
				operMap.put("PRICING_PLAN_UPDATE", "UO");
				
				//修改策略
				serviceNameList.add("PRICING_STRATEGY_UPDATE");
				paramMap.put("PRICING_STRATEGY_UPDATE", paramList);
				operMap.put("PRICING_STRATEGY_UPDATE", "UO");
				
				//删除规则实例
				serviceNameList.add("PRICING_RULE_INSTANCE_DELETE");
				paramMap.put("PRICING_RULE_INSTANCE_DELETE", paramList);
				operMap.put("PRICING_RULE_INSTANCE_DELETE", "DO");
				
				//删除资费
				serviceNameList.add("PRICING_TARIFF_DELETE");
				paramMap.put("PRICING_TARIFF_DELETE", paramList);
				operMap.put("PRICING_TARIFF_DELETE", "DO");
				
				//删除段落条件
				serviceNameList.add("PRICING_SECTION_CONDITION_DELETE");
				paramMap.put("PRICING_SECTION_CONDITION_DELETE", paramList);
				operMap.put("PRICING_SECTION_CONDITION_DELETE", "DO");
				
				//删除段落
				serviceNameList.add("PRICING_SECTION_DELETE");
				paramMap.put("PRICING_SECTION_DELETE", paramList);
				operMap.put("PRICING_SECTION_DELETE", "DO");
				
			}
			
			
			//增加规则实例（销售品实例）
			String[] ObjectIDs = (params.get("OBJECT_ID")+"").split(",");
			List<Map<String, Object>> offerInstanceList = new ArrayList<Map<String, Object>>();
			
			for(String objectID:ObjectIDs){
				Map<String, Object> object = new HashMap();
				object.put("OFFER_ID", params.get("OFFER_ID"));
				object.put("OBJECT_TYPE", params.get("OBJECT_TYPE")+"");
				object.put("OBJECT_ID", objectID);
				
				offerInstanceList.add(object);
			}
			
			if(offerInstanceList.size() > 0){
				serviceNameList.add("PRICING_RULE_INSTANCE_INSERT");
				paramMap.put("PRICING_RULE_INSTANCE_INSERT", offerInstanceList);
				operMap.put("PRICING_RULE_INSTANCE_INSERT", "A");
			}
			
			
			//组装规则、规则条件、资费
			JSONArray ruleArray = JSONArray.parseArray(params.get("RULEINFO")+"");
			//入库规则数据
			List<Map<String, Object>> ruleParamList = new ArrayList<Map<String, Object>>();
			//入库规则条件数据
			List<Map<String, Object>> conditionParamList = new ArrayList<Map<String, Object>>();
			
			for(int i = 0;i < ruleArray.size();i++){
				
				JSONObject ruleObject = ruleArray.getJSONObject(i);
				Map<String,Object> ruleMap = new HashMap();
				ruleMap.put("RULE_NAME", ruleObject.getString("RULE_NAME"));
				ruleMap.put("CHARGE", ruleObject.getIntValue("CHARGE"));
				
				//获取段落ID、资费ID、段落条件ID
				Map<String,Object> ruleIDsMap = imp.selectOne("GET_RULE_SEQS", new HashMap());
				Long sectionID = Long.parseLong(ruleIDsMap.get("SECTION_ID")+"");
				Long tariffID = Long.parseLong(ruleIDsMap.get("TARIFF_ID")+"");
				Long sectionCondID = Long.parseLong(ruleIDsMap.get("CONDITION_ID")+"");
				
				ruleMap.put("SECTION_ID",sectionID);
				ruleMap.put("TARIFF_ID",tariffID);
				ruleMap.put("CONDITION_ID",sectionCondID);
				
				ruleMap.putAll(params);
				ruleParamList.add(ruleMap);
				
				
				//处理段落条件
				JSONArray condition = ruleObject.getJSONArray("CONDITION");
				
				if(condition != null){
					for(int j = 0;j < condition.size();j++){
						
						Map<String,Object> conditionMap = this.jsonStrToMap(condition.getString(j));
						
						//多个条件公共一个条件ID
						conditionMap.put("CONDITION_ID", sectionCondID);
						conditionParamList.add(conditionMap);
					}
				}
				
				
			}
			
			if(ruleParamList.size() > 0){
				//保存资费
				serviceNameList.add("PRICING_TARIFF_INSERT");
				paramMap.put("PRICING_TARIFF_INSERT", ruleParamList);
				operMap.put("PRICING_TARIFF_INSERT", "A");
				
				//保存段落
				serviceNameList.add("PRICING_SECTION_INSERT");
				paramMap.put("PRICING_SECTION_INSERT", ruleParamList);
				operMap.put("PRICING_SECTION_INSERT", "A");
			}
			
			//保存段落条件
			if(conditionParamList.size() > 0){
				serviceNameList.add("PRICING_SECTION_CONDITION_INSERT");
				paramMap.put("PRICING_SECTION_CONDITION_INSERT", conditionParamList);
				operMap.put("PRICING_SECTION_CONDITION_INSERT", "A");
			}
			
			logger.debug("组装批量执行SQL--end");
			//批量入库
			imp.runBatch(serviceNameList, paramMap, operMap);

			rtnMap.put("success", "success");

		} catch (Exception e) {

			e.printStackTrace();
			rtnMap.put("success", "fail");
			rtnMap.put("errormsg", e.getMessage());
		}
	}

	/**
	 * 查询活动、段落、段落条件
	 * @param request
	 * @param response
	 * @param rtnMap
	 */
	public void detail(HttpServletRequest request,
			HttpServletResponse response, Map<String, Object> rtnMap) {

		try {

			CommonDBService imp = new CommonDBService();
			Map params = this.dataToMap_new(request);
			//查询活动
			Map<String,Object> activityMap = imp.selectOne("GET_ACTIVITY_BYID", params);
			
			if(activityMap == null){
				throw new Exception("没有活动"+params.get("ACTIVITY_NAME")+"的配置信息");
			}
			
			//将map转成JSONObject
			JSONObject activityObj = JSONObject.parseObject(JSONArray.toJSONString(activityMap));
			
			//查询活动对应的段落、资费、段落条件
			params.putAll(activityMap);
			List<Map<String, Object>> ruleList = imp.queryDataToPage(
					"GET_SECTION_BYSTRATEGEID", params);
			
			JSONObject ruleObject = new JSONObject();
			for(Map<String, Object> rule:ruleList){
				//首次添加段落
				if(ruleObject.getJSONObject(rule.get("PRICING_SECTION_ID")+"") == null){
					JSONObject sectionObject = new JSONObject();
					sectionObject.put("RULE_NAME", rule.get("RULE_NAME")+"");
					sectionObject.put("CHARGE", rule.get("CHARGE")+"");
					
					if(rule.get("LEFTFORMULA") != null){
						JSONObject conditionObject = new JSONObject();
						conditionObject.put("LEFTFORMULA", rule.get("LEFTFORMULA")+"");
						conditionObject.put("OPERATOR", rule.get("OPERATOR")+"");
						conditionObject.put("RIGHT_VALUE", rule.get("RIGHT_VALUE")+"");
						JSONArray conditionArray = new JSONArray();
						conditionArray.add(conditionObject);
						
						sectionObject.put("CONDITION",conditionArray);
					}
					
					
					ruleObject.put(rule.get("PRICING_SECTION_ID")+"",sectionObject);
				}else{
					JSONObject sectionObject = ruleObject.getJSONObject(rule.get("PRICING_SECTION_ID")+"");
					
					if(rule.get("LEFTFORMULA") != null){
						JSONObject conditionObject = new JSONObject();
						conditionObject.put("LEFTFORMULA", rule.get("LEFTFORMULA")+"");
						conditionObject.put("OPERATOR", rule.get("OPERATOR")+"");
						conditionObject.put("RIGHT_VALUE", rule.get("RIGHT_VALUE")+"");
						
						if(sectionObject.getJSONArray("CONDITION") == null){
							JSONArray conditionArray = new JSONArray();
							conditionArray.add(conditionObject);
							sectionObject.put("CONDITION",conditionArray);
						}else{
							sectionObject.getJSONArray("CONDITION").add(conditionObject);
						}
						
					}
				}
				
			}
			
			activityObj.put("RULE_INFO", ruleObject);

			rtnMap.put("success", "success");
			rtnMap.put("data", activityObj);

		} catch (Exception e) {

			e.printStackTrace();
			rtnMap.put("success", "fail");
			rtnMap.put("errormsg", e.getMessage());
		}
	}
	
	
}
