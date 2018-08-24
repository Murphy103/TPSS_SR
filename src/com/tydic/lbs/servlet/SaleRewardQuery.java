package com.tydic.lbs.servlet;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.PrintWriter;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.httpclient.methods.PostMethod;
import org.apache.http.HttpResponse;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.entity.StringEntity;
import org.apache.http.impl.client.DefaultHttpClient;
import org.json.JSONException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.alibaba.fastjson.JSONObject;
import com.tydic.lbs.service.CommonDBService;
import com.tydic.lbs.util.DateUtil;


public class SaleRewardQuery extends HttpServlet {
	private static final long serialVersionUID = 1L;
	private static Logger logger = LoggerFactory.getLogger(SaleRewardQuery.class);

	public static final String CHAR_ENCODING = "UTF-8";
	public static final String CONTENT_TYPE = "text/html; charset=utf-8";
	
	
	public void doGet(HttpServletRequest request, HttpServletResponse response)
			throws ServletException, IOException {
			doPost(request,response);
	}

	public void doPost(HttpServletRequest request, HttpServletResponse response)
			throws ServletException, IOException {
			String json;
			try {
				json = saleRewardQuery(request,response);
				request.setAttribute("json", json);
				PrintWriter out = response.getWriter();
				out.println(json);
				out.flush();
				out.close();
				
			} catch (Exception e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}
			
	}
	

	/**
	 * 翼销售奖励查询接口
	 * 
	 * @return
	 * @throws IOException 
	 * @throws JSONException 
	 */
	public  String  saleRewardQuery(HttpServletRequest request, HttpServletResponse response) throws Exception {
	/*屏蔽白名单校验
		String reqIp = request.getRemoteAddr();  //获取请求IP
		logger.info("获取到的请求IP为:"+reqIp);
		
		//查询 白名单Ip
		String whiteListIp = "";
		CommonDBService imp1 = new CommonDBService(); 
		List<Map<String,Object>> whiteListIps = imp1.queryData("SELECT_WHITE_LIST_IP", new HashMap()); 
		if(whiteListIps.size()>0){
			for(int m=0;m<whiteListIps.size();m++){
				whiteListIp +=whiteListIps.get(m).get("IP")+",";
			}
		}
		logger.info("白名单whiteListIp:"+whiteListIp);
	*/
		// 读取输入
		String inputText = readRequestString(request);
		logger.info("请求报文:"+inputText);
		
		//支持xml和json格式,转换为map
	/*	Map<String, Object> map=XmlUtils.Dom2Map(inputText);
		if(map==null){
			map=JSONUtil.parseJSON2Map(inputText);
		}*/
		
		
		org.json. JSONObject jsonObject = new org.json.JSONObject(inputText); 
		org.json. JSONObject tcpcont = jsonObject.getJSONObject("TcpCont");
		org.json. JSONObject svccont = jsonObject.getJSONObject("SvcCont") ;
		
			String transationId= tcpcont.getString("TransactionID") ;
			String RspTime= tcpcont.getString("ReqTime") ;
			String SrcSysID= tcpcont.getString("SrcSysID") ;
			String saleStaff= svccont.getString("saleStaff") ;
			String acctNbr= svccont.getString("acctNbr") ;
			String saleOrder= svccont.getString("saleOrder") ;
			String startDate= svccont.getString("startDate") ;
			String endDate= svccont.getString("endDate") ;
		
		
		//获取输入参数
		//String transationId = (String) map.get("TransactionID");
		String rspTime = DateUtil.getNowTime();
		
	/*	String saleStaff = ObjectIsNull.check((String) map.get("saleStaff"))?"":(String) map.get("saleStaff");
		String acctNbr = ObjectIsNull.check((String) map.get("acctNbr"))?"":(String) map.get("acctNbr");
		String saleOrder = ObjectIsNull.check((String) map.get("saleOrder"))?"":(String) map.get("saleOrder");
		String startDate = ObjectIsNull.check((String) map.get("startDate"))?"":(String) map.get("startDate");
		String endDate = ObjectIsNull.check((String) map.get("endDate"))?"":(String) map.get("endDate");*/
		
		logger.info("获取的输入参数有:transationId:"+transationId+",saleStaff:"+saleStaff+",acctNbr:"+acctNbr
				+",saleOrder:"+saleOrder+",startDate:"+startDate+",endDate:"+endDate);
	    JSONObject jsonHead = new JSONObject(); 
		String jsonBody = "";
		String rtnString = "";//报文的返回
		
	/*	屏蔽白名单校验
		//请求IP非白名单IP,返回调用失败
		if(!whiteListIp.contains(reqIp)){ 
			 jsonHead.put("TransactionID",transationId);
			 jsonHead.put("RspCode", "1");
			 jsonHead.put("RspDesc", "请求IP未授权访问");
			 jsonHead.put("RspTime",rspTime);
			 
			 rtnString = "{"+
						"\"TcpCont\": "+ jsonHead.toString() +"  "
		    		   +"}";
			 
			 logger.info("返回报文****************:"+rtnString);
			 return rtnString;
		 }
		*/
		////促销工号为空,返回调用失败
		if(("".equals(saleStaff))){
				 jsonHead.put("TransactionID",transationId);
				 jsonHead.put("RspCode", "1");
				 jsonHead.put("RspDesc", "获取促销工号为空");
				 jsonHead.put("RspTime",rspTime);
					rtnString = "{"+
								"\"TcpCont\":" + jsonHead.toString() +""
				    		+"}";
					
					logger.info("返回报文****************:"+rtnString);
				 return rtnString;
		}
		
	 //if((!(acctNbr=="")) ||(!(saleOrder=="")) ||(!(startDate=="")&&(!(endDate==""))) ){
		 
	 if(!"".equals(acctNbr)||!"".equals(saleOrder)|| (!"".equals(startDate)&&!"".equals(endDate))){
		 
		 CommonDBService imp = new CommonDBService(); 
		 Map<String,Object> params = new HashMap<String,Object>();
		 params.put("saleStaff", saleStaff);
		 params.put("acctNbr", acctNbr);
		 params.put("saleOrder", saleOrder);
		 params.put("startDate", startDate);
		 params.put("endDate", endDate);
		 List<Map<String, Object>>  results = imp.queryData("SALE_REWARD_QUERY_TO_YXS", params);
		 for(int i=0;i<results.size();i++){
			 Map<String, Object> result =  results.get(i);
			 
			 String ORDER_ID=result.get("ORDER_ID")==null? "": result.get("ORDER_ID").toString();
			 String CHARGE=result.get("CHARGE")==null? "": result.get("CHARGE").toString();
			 String ACC_NBR=result.get("ACC_NBR")==null? "": result.get("ACC_NBR").toString();
			 String COMPLETE_DATE=result.get("COMPLETE_DATE")==null? "": result.get("COMPLETE_DATE").toString();
			 String STAFF_ID=result.get("STAFF_ID")==null? "": result.get("STAFF_ID").toString();
			 String SEND_STATE=result.get("SEND_STATE")==null? "": result.get("SEND_STATE").toString();
		
			 
			 jsonBody +="{" 
				 		+"\"saleOrder\":\"" +ORDER_ID+"\","
				 		+"\"charge\":\"" +CHARGE+"\","
				 		+"\"acctNbr\":\"" + ACC_NBR+"\","
				 		+"\"completeDate\":\"" + COMPLETE_DATE+"\","
				 		+"\"saleStaff\":\"" + STAFF_ID+"\","
				 		+"\"state\":\"" + SEND_STATE+"\"}"; 
			if(i<results.size()-1){ 
				 jsonBody +=",";
			}
		}
					 
	 }else{
		 jsonHead.put("TransactionID",transationId);
		 jsonHead.put("RspCode", "1");
		 jsonHead.put("RspDesc", "设备号/订单号/起始结束时间,三个参数不能同时为空");
		 jsonHead.put("RspTime",rspTime);
		 
		  rtnString = "{"+
					"\"TcpCont\":" + jsonHead.toString() +""
	    		+"}";
		  logger.info("返回报文****************:"+rtnString);
		 return rtnString;
	 }
	 
	 
	 jsonHead.put("TransactionID",transationId);
	 jsonHead.put("RspCode", "0");
	 jsonHead.put("RspDesc", "");
	 jsonHead.put("RspTime",rspTime);
	 
	  rtnString="{"+
		"\"TcpCont\":" + jsonHead.toString() +","
		+ "\"SvcCont\": ["+jsonBody+"]"
	    +"}";
			
	   logger.info("返回报文****************:"+rtnString);
		return rtnString;

	}


	/**
	 * 请求消息读取
	 * 
	 * @param request
	 * @return
	 */
	private String readRequestString(HttpServletRequest request) {
		StringBuffer json = new StringBuffer();
		String line = null;
		try {
			BufferedReader reader = request.getReader();
			while ((line = reader.readLine()) != null) {
				json.append(line);
			}
		} catch (Exception e) {
			logger.error(e.toString());
		}
		return json.toString();
	}
	

	
	
	/**
	 * 参数转换String[]
	 * @param request
	 * @return
	 *//*
	public Map dataToMap(HttpServletRequest request) {
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

	*//**
	 * json字符串转数组
	 * @param jsonStr
	 * @return
	 * @author crast
	 * @date 20170718
	 *//*
	@SuppressWarnings({ "rawtypes", "unchecked" })
	public  Map<String,Object>jsonStrToMap(String jsonStr){
		Map map=(Map) JSON.parseObject(jsonStr, Map.class);
		return map;
	}
*/
	

	public static void main(String args[]) throws IOException{
/*		String jsonString ="{"+ "\"TcpCont\": {" 
				+"\"TransactionID\":\"" + "345a2ca1-0db9-4240-ac20-be2b45c8835f"+"\""+","
				+"\"ReqTime\":\"" + "20160110112345"+"\""+","
				+"\"SrcSysID\":\"" + "CRM"+"\""+
				"},"
				+"\"SvcCont\": {"
				+"\"saleStaff\":\"" + "XXXX"+","
				+"\"acctNbr\":\"" + "18912345678"+"\""+","
				+"\"saleOrder\":\"" + "20170800001"+"\""+","
				+"\"startDate\":\"" + "2017-08-01"+"\""+"}}";
	logger.info(jsonString);*/
	 DefaultHttpClient httpclient = new DefaultHttpClient();
     String minusServiceUrl="http://192.3.5.64:8080/TPSS_SR/servlet/SaleRewardQuery";
     System.out.println("the  minusServiceUrl= "+minusServiceUrl);
     HttpPost httppostfwkj = new HttpPost(minusServiceUrl);
     PostMethod method = new PostMethod(minusServiceUrl);
       JSONObject bsvcCont = new JSONObject();  
       bsvcCont.put("TransactionID", "345a2ca1-0db9-4240-ac20-be2b45c8835f");
       bsvcCont.put("ReqTime", "20160110112345"); 
       bsvcCont.put("SrcSysID", "CRM");
       
    
       JSONObject btcpCont = new JSONObject();  
       btcpCont.put("saleStaff", "XXXX");
       btcpCont.put("acctNbr", "18912345678"); 
       btcpCont.put("saleOrder", "20170800001");
       btcpCont.put("startDate", "2017-08-01");
       btcpCont.put("endDate", "2017-08-16"); 
       
       JSONObject json = new JSONObject();
		 json.put("TcpCont", bsvcCont);
		 json.put("SvcCont",bsvcCont );
		 
		  JSONObject rootJson = new JSONObject();
		  rootJson.put("ContractRoot", json);
		
		  logger.info("json报文为=****"+rootJson);
     
		  StringEntity entity = new StringEntity(rootJson.toString(),"UTF-8");//解决中文乱码问题    
        entity.setContentEncoding("UTF-8");    
        entity.setContentType("application/json");    
        httppostfwkj.setEntity(entity);    
     
          logger.info("开始调用服务");
		   HttpResponse  responseFwkj = httpclient.execute(httppostfwkj);
	}
	
	}

