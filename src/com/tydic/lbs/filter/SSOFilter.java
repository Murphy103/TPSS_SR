package com.tydic.lbs.filter;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import javax.servlet.FilterConfig;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import net.sf.json.JSONArray;

import org.apache.log4j.Logger;

import com.tydic.bp.sso.client.filter.SSOAbstractFilter;
import com.tydic.lbs.entity.Empee;
import com.tydic.lbs.util.StringCommon;


/**
 * 用户登录过滤器
 * @author zhupengfei
 *
 */
public class SSOFilter extends SSOAbstractFilter{
    /**
     * log4j对象
     */
    private static Logger logger = Logger.getLogger(SSOFilter.class);

    @Override
    protected void initClient(FilterConfig filterConfig) {
    	System.out.println("=================initClint -------");
    }
    @Override
    protected void loadAuthInfo(HttpServletRequest paramHttpServletRequest, HttpServletResponse paramHttpServletResponse, Map<String, Object> authInfo) {
    	//STEP1 设置当前员工信息
    	Empee empee = new Empee();
    	com.alibaba.fastjson.JSONObject userMap = (com.alibaba.fastjson.JSONObject) authInfo.get("userMap");
    	//String sadas = userMap.get("EMPEE_NAME").toString();
		empee.setEmpee_id(Long.parseLong(userMap.get("EMPEE_ID").toString()));
		empee.setEmpee_acct(userMap.get("EMPEE_ACCT").toString());
		empee.setEmpee_code(userMap.get("EMPEE_ACCT").toString());
		empee.setEmpee_name(userMap.get("EMPEE_NAME").toString());
		empee.setEmpee_pwd(userMap.get("EMPEE_PWD").toString());
		empee.setEmpee_level(Long.parseLong(userMap.get("EMPEE_LEVEL").toString()));
		empee.setLatn_id(Long.parseLong(StringCommon.isNull(userMap.get("LATN_ID").toString())?"888":userMap.get("LATN_ID").toString()));
		empee.setIp_address(paramHttpServletRequest.getRemoteAddr());
		empee.setState("1");//判断是否已经失效
		HttpServletResponse res = (HttpServletResponse) paramHttpServletResponse;
		res.setHeader("P3P","CP=CAO PSA OUR");
		paramHttpServletResponse.setHeader("Access-Control-Allow-Origin","*");
		
		logger.debug("00000000000000000000上海店奖从sso获取的用户信息为:"+empee.getEmpee_id()+","+empee.getEmpee_acct()+","+empee.getEmpee_code()+","+
				empee.getEmpee_name()+","+empee.getEmpee_pwd());

		//STEP2 设置权限
		JSONArray jsonarray =  JSONArray.fromObject(authInfo.get("userPrivilege").toString());
		List privilegeList = new ArrayList();
		for (int i = 0; i < jsonarray.size(); i++) {
		      net.sf.json.JSONObject obj = jsonarray.getJSONObject(i);
		      privilegeList.add(obj.getString("PRIVILEGE_CODE"));
		}
		paramHttpServletRequest.getSession().setAttribute("empee", empee);
		paramHttpServletRequest.getSession().setAttribute("username",empee.getEmpee_acct());
		
		//STEP3 从代理商员工表中加载网点信息，判断是否为网点
//		CommonService service = new CommonService("");
	    String[] params={empee.getEmpee_id().toString()};
		List<String[]> dataList=new ArrayList<String[]>();
		try {
//			dataList = service.getSqlList("GETAGENTINFOSBYAGTID", empee.getEmpee_id().toString(), params);//TODO 语句待修改
		    if(dataList !=null && dataList.size()>0){
		    	empee.setAgent_cd(dataList.get(0)[0].toString());
		    	empee.setAgent_name(dataList.get(0)[1].toString());
		    	empee.setAgent_id(dataList.get(0)[2].toString());
		    	
		    	// 营业区域属性、酬金渠道属性
		    	empee.setLoc_id(dataList.get(0)[3].toString());
		    	empee.setLoc_name(dataList.get(0)[4].toString());
		    	empee.setChannel_id(dataList.get(0)[5].toString());
		    	empee.setChannel_name(dataList.get(0)[6].toString());
		    	empee.setAgent_latn_id(dataList.get(0)[7].toString());
		    }
		} catch (Exception e) {
			e.printStackTrace();
		}
    }
    
}
