package com.tydic.lbs.servlet;

import java.io.IOException;
import java.io.OutputStream;
import java.lang.reflect.InvocationTargetException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import jxl.Workbook;
import jxl.write.Label;
import jxl.write.WritableSheet;
import jxl.write.WritableWorkbook;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import com.google.gson.Gson;
import com.google.gson.JsonArray;
import com.google.gson.JsonElement;
import com.google.gson.JsonParser;
import com.tydic.lbs.entity.Empee;
import com.tydic.lbs.frame.BaseService;
import com.tydic.lbs.service.CommonDBService;
import com.tydic.lbs.util.CheckUtil;

/**
 * Servlet implementation class TaskMonitor
 */
@Service("commonServlet")
public class CommonServlet extends BaseService {
	@SuppressWarnings("unused")
	private static final long serialVersionUID = 1L;
	private Logger logger = LoggerFactory.getLogger(CommonServlet.class);

	public static final String CHAR_ENCODING = "UTF-8";
	public static final String CONTENT_TYPE = "text/html; charset=utf-8";

	/**
	 * 获取用户id
	 * 
	 * @return
	 */
	private String getEmpeeId(HttpServletRequest request) {
		Empee empee = null;
		String empeeId = "";
		if(null !=request.getSession().getAttribute("empee")){
			empee = (Empee) request.getSession().getAttribute("empee");
			empeeId = empee.getEmpee_id().toString();
		}else{
			empeeId = "24316";
		}

		logger.info("empeeId----->:" + empeeId);
		return empeeId;
	}
	
	private Empee getEmpee(HttpServletRequest request) {
		Empee empee = null;
		if(null !=request.getSession().getAttribute("empee")){
			empee = (Empee) request.getSession().getAttribute("empee");
		}
		if(null==empee){
			empee=new Empee();
			empee.setLatn_id(888L);
		}
		logger.debug("111111111111111111111111上海店奖web获取的用户信息为:"+empee.getEmpee_id()+","+empee.getEmpee_acct()+","+empee.getEmpee_code()+","+
				empee.getEmpee_name()+","+empee.getEmpee_pwd());
		return empee;
		
	}

	/**
	 * 分页一览数据获取(供miniui使用)
	 * 
	 * @throws IOException
	 */
	@SuppressWarnings({ "rawtypes", "unchecked" })
	public void gridValue_rows(HttpServletRequest request,
			HttpServletResponse response, Map<String, Object> rtnMap) {

		try {
			Empee empee = this.getEmpee(request);
			CommonDBService imp = new CommonDBService();
			Map params = this.dataToMap_new(request);
			params.put("latn_id", empee.getLatn_id());
			params.put("EMPEE_ID", getEmpeeId(request));
			// 获取分页参数
			String serviceName = params.get("service_name") + "";
			// 获取记录
			List<Map<String, Object>> dataList = imp.queryDataToPage(
					serviceName, params);
			// 获取记录数
			long count = imp.getCount(serviceName + "_C", params);
			rtnMap.put("success", "success");
			rtnMap.put("total", count);
			rtnMap.put("data", dataList);

		} catch (Exception e) {

			e.printStackTrace();
			rtnMap.put("success", "fail");
			rtnMap.put("errormsg", e.getMessage());
		}
	}

	/**
	 * 非分页一览数据获取(供miniui使用)
	 * 
	 * @throws IOException
	 */
	public void gridValue(HttpServletRequest request,
			HttpServletResponse response, Map<String, Object> rtnMap) {

		try {

			CommonDBService imp = new CommonDBService();
			Map params = this.dataToMap_new(request);
			// 获取查询参数
			String serviceName = params.get("service_name") + "";
			// 获取记录
			List<Map<String, Object>> dataList = imp.queryDataToPage(
					serviceName, params);

			rtnMap.put("success", "success");
			rtnMap.put("data", dataList);
			rtnMap.put("list_flag", "list");

		} catch (Exception e) {

			e.printStackTrace();
			rtnMap.put("success", "fail");
			rtnMap.put("errormsg", e.getMessage());
		}
	}

	/**
	 * 没有业务检查的增删改操作
	 * 
	 * @throws IOException
	 */
	@SuppressWarnings({ "rawtypes", "unchecked" })
	public void operation(HttpServletRequest request,
			HttpServletResponse response, Map<String, Object> rtnMap) {

		try {
			Boolean check=true;
			CommonDBService imp = new CommonDBService();
			Map params = this.dataToMap_new(request);
			// 获取servicename
			String serviceName = params.get("service_name") + "";
			// 获取操作标识
			String operFlag = params.get("oper_flag") + "";
			if("U".equals(operFlag)){
				if(!Boolean.valueOf(params.get("check_flag")+"")){
					check=false;
				}
			}
			if(check){
				List<String> errorMsgs = new ArrayList<String>();
				CheckUtil.checkOne(serviceName, params, errorMsgs);
				if (errorMsgs.size() > 0) {
					logger.error("serviceName 校验未通过!");
					String errorTip = "";
					for (String errorMsg : errorMsgs) {
						errorTip += errorMsg + "</br>";
					}
					rtnMap.put("success", "fail");
					rtnMap.put("errormsg", errorTip);

					return;
				} 
			}
			

			if (operFlag.equals("A")) {
				params.put("CREATE_STAFF",
						Long.parseLong(this.getEmpeeId(request)));
					imp.insert(serviceName, params);
			} else if (operFlag.equals("U")) {
				params.put("UPDATE_STAFF",
						Long.parseLong(this.getEmpeeId(request)));
				imp.update(serviceName, params);
			} else if (operFlag.equals("D")) {
				params.put("UPDATE_STAFF",
						Long.parseLong(this.getEmpeeId(request)));

				imp.delete(serviceName, params);

			} else {
				throw new Exception("操作标识oper_flag传值不对");
			}

			rtnMap.put("success", "success");

		} catch (Exception e) {

			e.printStackTrace();
			rtnMap.put("success", "fail");
			rtnMap.put("errormsg", e.getMessage());
		}
	}

	/**
	 * 导出excel
	 * 
	 * @param request
	 * @param response
	 * @throws Exception
	 */
	public void exportExcel(HttpServletRequest request,
			HttpServletResponse response, Map<String, Object> rtnMap)
			throws Exception {
		CommonDBService imp = new CommonDBService();
		Map params = this.dataToMap_new(request);

		OutputStream out = response.getOutputStream();
		// 输出excel文件名
		String fname = params.get("file_name") + "";
		// 获取查询参数
		String serviceName = params.get("service_name") + "";
		response.reset();// 清空输出流

		if (fname.equals("")) {
			fname = "grid";
		}
		response.setCharacterEncoding("UTF-8");// 设置相应内容的编码格式
		fname = java.net.URLEncoder.encode(fname, "UTF-8");
		response.setHeader("Content-Disposition", "attachment;filename="
				+ new String(fname.getBytes("UTF-8"), "GBK") + ".xls");
		response.setContentType("application/ms-excel");// 定义输出类型
		
		params.put("EMPEE_ID", getEmpeeId(request));

		// 获取导出记录
		List<Map<String, Object>> dataList = imp.queryDataToPage(serviceName,
				params);
		// 获取导出列
		params.put("service_code", serviceName);
		
		List<Map<String, Object>> columnList = imp.queryDataToPage(
				"REWARD_QUERY_FIELDS", params);

		try {
			// 创建Excel工作薄
			WritableWorkbook workbook = Workbook.createWorkbook(out);
			// 添加第一个工作表并设置第一个Sheet的名字
			WritableSheet sheet = workbook.createSheet("grid1", 0);
			Label label;
			// 写出列名
			for (int i = 0; i < columnList.size(); i++) {
				Map<String, Object> hm = columnList.get(i);
				label = new Label(i, 0, hm.get("COL_NAME") + "");
				sheet.addCell(label);
				sheet.setColumnView(i,
						Integer.parseInt(hm.get("COL_LEN") + "") / 10); // 设置列的宽度
			}
			// 写出数据
			for (int i = 0; i < dataList.size(); i++) {
				HashMap hm1 = (HashMap) dataList.get(i);

				for (int j = 0; j < columnList.size(); j++) {
					Map<String, Object> hm = columnList.get(j);
					String key = hm.get("COL_CODE") + "";
					String value = String.valueOf(hm1.get(key));
					label = new Label(j, i + 1, value);
					sheet.addCell(label);
				}
			}

			// 写入数据
			workbook.write();
			// 关闭文件
			workbook.close();
			out.close();

			rtnMap.put("success", "success");

		} catch (Exception e) {
			e.printStackTrace();
			rtnMap.put("success", "fail");
			rtnMap.put("errormsg", e.getMessage());
		}
	}

	/**
	 * 下拉选
	 * 
	 * @param request
	 * @param response
	 * @param rtnMap
	 * @return
	 * @author crast
	 * @date 20170718
	 */
	@SuppressWarnings({ "rawtypes", "unchecked" })
	public Map<String, Object> combList(HttpServletRequest request,
			HttpServletResponse response, Map<String, Object> rtnMap) {
		Map params = this.dataToMap_old(request);
		String jsonStr = params.get("params") + "";
		Map mapParams = this.jsonStrToMap(jsonStr);
		String serviceName = mapParams.get("sqlcode") + "";
		CommonDBService imp = new CommonDBService();
		List<Map<String, String>> arr = new ArrayList<Map<String, String>>();
		try {
			List<Map<String, Object>> dataList = imp.getSqlList(serviceName,
					mapParams);
			if (dataList != null && dataList.size() > 0) {
				for (int j = 0; j < dataList.size(); j++) {
					Map<String, Object> map = dataList.get(j);
					Map<String, String> mapNew = new HashMap<String, String>();
					Object keyOb = map.get("ID");
					Object valueOb = map.get("NAME");

					mapNew.put("id", keyOb.toString());
					mapNew.put("text", valueOb.toString());

					arr.add(mapNew);
				}

			}
		} catch (Exception e) {
			e.printStackTrace();
		}

		rtnMap.put("data", arr);
		return rtnMap;
	}
	/**
	 * 获取下拉树数据
	 * 
	 * @param request
	 * @param response
	 * @param rtnMap
	 * @author szw
	 * */
	@SuppressWarnings({ "rawtypes", "unchecked" })
	public void  getTreeSelect(HttpServletRequest request,
			HttpServletResponse response, Map<String, Object> rtnMap) {

		try {

			CommonDBService imp = new CommonDBService();
			Map params = this.dataToMap_new(request);
			//定义父节点id text的List
			List<Map<String, Object>> parentlist = new ArrayList();
			// 获取查询参数
			String serviceName = params.get("service_name") + "";
			params.put("STAFF_ID", Long.parseLong(this.getEmpeeId(request)));
			// 获取记录
			List<Map<String, Object>> dataList = imp.queryDataToPage(
					serviceName, params);
//			System.out.println("datalist:------"+dataList);
			List<Map<String, Object>> resultlist = new ArrayList<Map<String, Object>>();
			//对返回的结果进行改变成树结构操作
			for (Map<String, Object> map : dataList) {
				
				if("0".equals(map.get("PID"))){ //如果是根节点
					Map tempmap = new HashMap<>();
					tempmap.put("id",map.get("ID"));
					tempmap.put("text",map.get("TEXT"));
					resultlist.add(tempmap);
				}

				
				if("1".equals(map.get("PID"))){
					Map tempmap = new HashMap<>();
					tempmap.put("id",map.get("ID"));
					tempmap.put("text",map.get("TEXT"));
					tempmap.put("pid", "1");
					parentlist.add(tempmap);
				}
			}
//			System.out.println("parentlist:-------"+parentlist);
			for(int i = 0;i<parentlist.size();i++){
				resultlist.add(parentlist.get(i));
				for (Map<String, Object> map : dataList) {
					if(map.get("PID").equals(parentlist.get(i).get("id"))){
						Map tempmap = new HashMap<>();
						tempmap.put("id",map.get("ID"));
						tempmap.put("text",map.get("TEXT"));
						tempmap.put("pid", map.get("PID"));
						resultlist.add(tempmap);
					}
				}
			}
//			System.out.println("resultlist:-------"+resultlist);
			rtnMap.put("success", "success");
			rtnMap.put("data", resultlist);
			rtnMap.put("list_flag", "list");

		} catch (Exception e) {

			e.printStackTrace();
			rtnMap.put("success", "fail");
			rtnMap.put("errormsg", e.getMessage());
		}
	}
	/**
	 * 获取控件数据
	 * 查询
	 * @param request
	 * @param response
	 * @param rtnMap
	 * */
	public void selectValueForInput(HttpServletRequest request, HttpServletResponse response, Map<String, Object> rtnMap){
		try{
	 	 	  
			CommonDBService imp= new CommonDBService();
			String key = request.getParameter("key");
			String serviceName = request.getParameter("service_name");
			System.out.println("key="+key+",service_name="+serviceName);
			Map<String, Object> params = new HashMap<String, Object>();
			params.put("key", key);
			List<Map<String, Object>> dataList = imp.queryDataToPage(serviceName, params);
			List<Map<String,Object>> rtnList = new ArrayList<Map<String,Object>>();
			if(dataList != null && dataList.size() >0 ){
				for (Map<String, Object> data : dataList) {
					Map<String, Object> result = new HashMap<String, Object>();
					result.put("id", data.get("ID"));
					result.put("text", data.get("TEXT"));
					rtnList.add(result);
				}
				
			}
			rtnMap.put("list_flag", "list");
			rtnMap.put("data", rtnList);
	 		
		} catch (Exception e) {
			
			e.printStackTrace();
		}
	}
	/**
	 * 获取后台数据
	 * 一般查询
	 * @param request
	 * @param response
	 * @param rtnMap
	 * @author szw
	 * */
	public void queryData(HttpServletRequest request,
			HttpServletResponse response, Map<String, Object> rtnMap) {

		try {
			String str = request.getParameter("data");
			Gson gson = new Gson();
			Map<String, Object> params = new HashMap<String, Object>();
			params = gson.fromJson(str, params.getClass());
			CommonDBService imp = new CommonDBService();
			// 获取查询参数
			String serviceName = params.get("service_name") + "";
			// 获取记录
			List<Map<String, Object>> dataList = imp.queryDataToPage(
					serviceName, params);

			rtnMap.put("success", "success");
			rtnMap.put("data", dataList);
			rtnMap.put("list_flag", "list");

		} catch (Exception e) {

			e.printStackTrace();
			rtnMap.put("success", "fail");
			rtnMap.put("errormsg", e.getMessage());
		}
	}
	/**
	 * 一般新增数据
	 * @param request
	 * @param response
	 * @param rtnMap
	 * @return
	 * @author szw
	 */
	public void commonInsertdata(HttpServletRequest request, HttpServletResponse response, Map<String, Object> rtnMap) {
		String str = request.getParameter("data");
		Gson gson = new Gson();
		Map<String, Object> params = new HashMap<String, Object>();
		params = gson.fromJson(str, params.getClass());
		String serviceName = params.get("service_name")+"";
		CommonDBService imp= new CommonDBService(); 
		params.put("CREATE_STAFF", Long.parseLong(this.getEmpeeId(request)));
		try {
			String result  = imp.insertData(serviceName, params);
			rtnMap.put("data", "保存成功！");
			rtnMap.put("success", true);
		} catch (Exception e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
			rtnMap.put("data", "保存失败！");
			rtnMap.put("success", false);
		}
	}
	
	/**
	 * 一般更新数据
	 * @param request
	 * @param response
	 * @param rtnMap
	 * @return
	 * @author szw
	 */
	public void commonUpdatedata(HttpServletRequest request, HttpServletResponse response, Map<String, Object> rtnMap) {
		String str = request.getParameter("data");
		Gson gson = new Gson();
		Map<String, Object> params = new HashMap<String, Object>();
		params = gson.fromJson(str, params.getClass());
		String serviceName = params.get("service_name")+"";
		CommonDBService imp= new CommonDBService(); 
		params.put("UPDATE_STAFF", Long.parseLong(this.getEmpeeId(request)));
		try {
			String result  = imp.updateData(serviceName, params);
			rtnMap.put("data", "保存成功！");
			rtnMap.put("success", true);
		} catch (Exception e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
			rtnMap.put("data", "保存失败！");
			rtnMap.put("success", false);
		}
	}
	/**
	 * 一般删除数据
	 * @param request
	 * @param response
	 * @param rtnMap
	 * @return
	 * @author szw
	 */
	public void commonDeleteData(HttpServletRequest request, HttpServletResponse response, Map<String, Object> rtnMap) {
		String str = request.getParameter("data");
		Gson gson = new Gson();
		Map<String, Object> params = new HashMap<String, Object>();
		params = gson.fromJson(str, params.getClass());
		String serviceName = params.get("service_name")+"";
		CommonDBService imp= new CommonDBService(); 
		params.put("UPDATE_STAFF", Long.parseLong(this.getEmpeeId(request)));
		try {
			System.out.println(params);
			String result  = imp.deleteData(serviceName, params);
			rtnMap.put("data", "删除成功！");
			rtnMap.put("success", true);
		} catch (Exception e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
			rtnMap.put("data", "删除失败！");
			rtnMap.put("success", false);
		}
	}
	/**
	 * 新增数据
	 * 
	 * @param request
	 * @param response
	 * @param rtnMap
	 * @return
	 * @author crast
	 * @date 20170718
	 */
	@SuppressWarnings({ "unchecked", "rawtypes" })
	public void insertData(HttpServletRequest request,
			HttpServletResponse response, Map<String, Object> rtnMap) {
		List<String> errorMsg = new ArrayList<String>();
		Map<String, Object> map = this.dataToMap_old(request);
		String serviceName = map.get("sqlCode") + "";
		String jsonStr = map.get("params") + "";
		Map params = this.jsonStrToMap(jsonStr);
		String checkServiceName = "";
		checkServiceName = map.get("checkServiceName") + "";
		try {
			if(!"".equals(checkServiceName) && null !=checkServiceName && !"null".equals(checkServiceName)){
				List<Map<String, Object>> list = new ArrayList<Map<String, Object>>();
				list.add(params);
				CheckUtil.check(checkServiceName, "", list, errorMsg);
				if (errorMsg.size() > 0) {
					rtnMap.put("success", "fail");
					System.out.println(errorMsg.get(0));
					if(checkServiceName.equals("PAY_QUOTA")){
						rtnMap.put("errormsg", errorMsg.get(0).replace("*", ""+params.get("PAY_ACCT_NAME")));
					}else{
						rtnMap.put("errormsg", errorMsg.get(0));
					}
					
					return;
				}
			}
			
		} catch (IllegalAccessException e) {
			e.printStackTrace();
		} catch (IllegalArgumentException e) {
			e.printStackTrace();
		} catch (InvocationTargetException e) {
			e.printStackTrace();
		} catch (NoSuchMethodException e) {
			e.printStackTrace();
		} catch (SecurityException e) {
			e.printStackTrace();
		}
		params.putAll(map);
		CommonDBService imp = new CommonDBService();
		try {
			imp.insertData(serviceName, params);
			rtnMap.put("success", "success");
		} catch (Exception e) {
			e.printStackTrace();
			rtnMap.put("success", "fail");
			rtnMap.put("errormsg", "新增失败");
		}

	}

	/**
	 * 包含事务的批量处理
	 * 
	 * @param request
	 * @param response
	 * @param rtnMap
	 * @author crast
	 * @date 20170727
	 */
	@SuppressWarnings({ "unchecked", "unused" })
	public void dealData(HttpServletRequest request,
			HttpServletResponse response, Map<String, Object> rtnMap) {
		List<String> serviceNameList = new ArrayList<String>();
		Map<String, List<Map<String, Object>>> paramsList = new HashMap<String, List<Map<String, Object>>>();
		Map<String, String> operMap = new HashMap<String, String>();
		Map<String, Object> map = this.dataToMap_new(request);
		List<String> errorMsg = new ArrayList<String>();
		String serviceName = map.get("sqlCode") + "";
		String[] serviceNameArr = serviceName.split(",");
		for (int i = 0; i < serviceNameArr.length; i++) {
			String checkServiceName = "";
			String dealFlag = "";
			List<Map<String, Object>> list = new ArrayList<Map<String, Object>>();

			if (null != map.get(serviceNameArr[i])) {
				String serviceN = serviceNameArr[i];
				String json = map.get(serviceNameArr[i]).toString();
				if (json.startsWith("{")) {
					Map<String, Object> map1 = this.jsonStrToMap(json
							.toString());
					if (null != map1.get("check_service_name")) {
						checkServiceName = map1.get("check_service_name") + "";
					}
					if (null != map1.get("deal_flag")) {
						dealFlag = map1.get("deal_flag") + "";
					}
					list.add(map1);
				} else if (json.startsWith("[")) {
					JsonParser parser = new JsonParser();
					JsonArray jarray = parser.parse(json.toString())
							.getAsJsonArray();
					for (int j = 0; j < jarray.size(); j++) {
						JsonElement jsonElement = jarray.get(j);
						if (null != jsonElement) {
							Map<String, Object> map2 = this
									.jsonStrToMap(jsonElement.toString());
							if (null != map2.get("check_service_name")) {
								checkServiceName = map2
										.get("check_service_name") + "";
							}
							if (null != map2.get("deal_flag")) {
								dealFlag = map2.get("deal_flag") + "";
							}
							list.add(map2);
						}
					}
				}
			}

			if (list.size() > 0) {
				if (dealFlag.equals("DA")) {
					serviceNameList.add(serviceNameArr[i]);
					paramsList.put(serviceNameArr[i], list);
					operMap.put(serviceNameArr[i], "DO");

					String newServiceName = serviceNameArr[i].substring(0,
							serviceNameArr[i].length() - 1);
					serviceNameList.add(newServiceName);
					paramsList.put(newServiceName, list);
					operMap.put(newServiceName, "A");
				} else {
					serviceNameList.add(serviceNameArr[i]);
					paramsList.put(serviceNameArr[i], list);
					if("U".equals(dealFlag)){
						operMap.put(serviceNameArr[i], "UO");
					}else if("D".equals(dealFlag)){
						operMap.put(serviceNameArr[i], "DO");
					}else{
						operMap.put(serviceNameArr[i], dealFlag);
					}
				}

			}
			if (!"".equals(checkServiceName) && null !=checkServiceName && !"null".equals(checkServiceName)) {
				try {
					CheckUtil.check(checkServiceName, "", list, errorMsg);
					if (errorMsg.size() > 0) {
						rtnMap.put("success", "fail");
						System.out.println(errorMsg.get(0));
						rtnMap.put("errormsg", errorMsg.get(0));
						return;
					}
				} catch (IllegalAccessException e) {
					e.printStackTrace();
				} catch (IllegalArgumentException e) {
					e.printStackTrace();
				} catch (InvocationTargetException e) {
					e.printStackTrace();
				} catch (NoSuchMethodException e) {
					e.printStackTrace();
				} catch (SecurityException e) {
					e.printStackTrace();
				}

			}
		}

		CommonDBService imp = new CommonDBService();
		try {
			imp.runBatch(serviceNameList, paramsList, operMap);
			rtnMap.put("success", "success");
		} catch (Exception e) {
			e.printStackTrace();
			rtnMap.put("success", "fail");
			rtnMap.put("errormsg", "操作失败!");
			// rtnMap.put("errormsg",e.getMessage()) ;
		}

	}

	/**
	 * 修改数据
	 * 
	 * @param request
	 * @param response
	 * @param rtnMap
	 * @return
	 * @author crast
	 * @date 20170719
	 */
	@SuppressWarnings({ "unchecked", "rawtypes" })
	public void updateData(HttpServletRequest request,
			HttpServletResponse response, Map<String, Object> rtnMap) {
		List<String> errorMsg = new ArrayList<String>();
		Map<String, Object> map = this.dataToMap_old(request);
		String serviceName = map.get("sqlCode") + "";
		String jsonStr = map.get("params") + "";
		Map params = this.jsonStrToMap(jsonStr);
		String checkServiceName = "";
		checkServiceName = map.get("checkServiceName") + "";
		try {
			if(!"".equals(checkServiceName) && null !=checkServiceName && !"null".equals(checkServiceName)){
				List<Map<String, Object>> list = new ArrayList<Map<String, Object>>();
				list.add(params);
				CheckUtil.check(checkServiceName, "", list, errorMsg);
				if (errorMsg.size() > 0) {
					rtnMap.put("success", "fail");
					System.out.println(errorMsg.get(0));
					if(checkServiceName.equals("PAY_QUOTA")){
						rtnMap.put("errormsg", errorMsg.get(0).replace("*", ""+params.get("PAY_ACCT_NAME")));
					}else{
						rtnMap.put("errormsg", errorMsg.get(0));
					}
					
					return;
				}
			}
			
		} catch (IllegalAccessException e) {
			e.printStackTrace();
		} catch (IllegalArgumentException e) {
			e.printStackTrace();
		} catch (InvocationTargetException e) {
			e.printStackTrace();
		} catch (NoSuchMethodException e) {
			e.printStackTrace();
		} catch (SecurityException e) {
			e.printStackTrace();
		}
		params.putAll(map);
		CommonDBService imp = new CommonDBService();
		try {
			imp.updateData(serviceName, params);
			rtnMap.put("success", "success");
		} catch (Exception e) {
			e.printStackTrace();
			rtnMap.put("success", "fail");
			rtnMap.put("errormsg", "修改失败");
//			rtnMap.put("errormsg", e.getMessage());
		}

	}

	/**
	 * 删除数据
	 * 
	 * @param request
	 * @param response
	 * @param rtnMap
	 * @return
	 * @author crast
	 * @date 20170719
	 */
	@SuppressWarnings({ "unchecked" })
	public void deleteData(HttpServletRequest request,
			HttpServletResponse response, Map<String, Object> rtnMap) {
		Map<String, Object> map = this.dataToMap_old(request);
		String serviceName = map.get("sqlCode") + "";
		String flag = map.get("flag") + "";
		String jsonStr = map.get("params") + "";// [{"EVENT_TYPE_ID":12},{"EVENT_TYPE_ID":999}][12,900]
		Map<String, Object> params = new HashMap<String, Object>();
		String ids = jsonStr.substring(1, jsonStr.length() - 1);
		params.put("ID", ids);
		CommonDBService imp = new CommonDBService();
		long count = 0;
		try {
			if ("EVENT_CHECK".equals(flag)) {// 如果是事件，判断是否被引用
				count = imp.getCount("DEL_EVENT_TYPE_CHECK", params);
			}
			if (count > 0) {
				rtnMap.put("success", "fail");
				rtnMap.put("errormsg", "已被引用的事件不允许删除!");
			} else {
				imp.deleteData(serviceName, params);
				rtnMap.put("success", "success");
			}

		} catch (Exception e) {
			e.printStackTrace();
			rtnMap.put("success", "fail");
			rtnMap.put("errormsg", "删除失败");
		}

	}

	/**
	 * 获取目录树数据
	 * 
	 * @param request
	 * @param response
	 * @param rtnMap
	 * @author crast
	 * @date 20170720
	 */
	@SuppressWarnings({ "rawtypes", "unchecked" })
	public String getTreeData(HttpServletRequest request,
			HttpServletResponse response, Map<String, Object> rtnMap) {
		CommonDBService imp = new CommonDBService();
		Map params = this.dataToMap_new(request);
		String serviceName = params.get("sqlcode") + "";
		if (null == params.get("rule_tree_name")) {
			System.out.println("要查询的树名称:值为null");
		} else if ("".equals(params.get("rule_tree_name"))) {
			System.out.println("要查询的树名称:值为空");
		} else {
			System.out.println("要查询的树名称:" + params.get("rule_tree_name"));
		}

		List<Map<String, Object>> list = imp.queryData(serviceName, params);

		rtnMap.put("success", "success");
		rtnMap.put("data", list);
		rtnMap.put("list_flag", "list");
		return null;

	}
	
	/**
	 * 获取当前登录人权限码getCurPrivilegeCode
	 * @throws IOException
	 */
	public void getCurPrivilegeCode(HttpServletRequest request, HttpServletResponse response, Map<String, Object> rtnMap) {

		try{

			CommonDBService imp = new CommonDBService();
			Map params = this.dataToMap_new(request);
			// 获取查询参数
			String serviceName = params.get("service_name") + "";
			params.put("EMPEE_ID", getEmpeeId(request));
			// 获取记录
			List<Map<String, Object>> dataList = imp.queryDataToPage(serviceName, params);
 	 	  
			
			String privilegeCode="";
			if(dataList!=null&&dataList.size()>0){
				 for(int i=0;i<dataList.size();i++)
				 {
					 Map<String, Object> data=dataList.get(i);
					 privilegeCode=privilegeCode+data.get("PRIVILEGE_CODE")+",";
				 }
				   privilegeCode=privilegeCode.substring(0,privilegeCode.length()-1);
			 }
	
			  logger.info("当前用户的权限码 为 the privilegeCode="+privilegeCode);
	 		
	 		rtnMap.put("success","true") ;
	 		rtnMap.put("totalRows",1) ;
	 		rtnMap.put("curPage","1") ;
	 		rtnMap.put("data",privilegeCode) ;
		} catch (Exception e) {
			
			e.printStackTrace();
		}
  	}

}
