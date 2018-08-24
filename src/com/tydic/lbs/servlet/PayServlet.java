package com.tydic.lbs.servlet;

import java.io.File;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import com.tydic.lbs.entity.Empee;
import com.tydic.lbs.frame.BaseService;
import com.tydic.lbs.service.CommonDBService;
import com.tydic.lbs.util.DateUtil;

import jxl.Workbook;
import jxl.write.Label;
import jxl.write.WritableSheet;
import jxl.write.WritableWorkbook;

/**
 * Servlet implementation class TaskMonitor
 */
@Service("payServlet")
public class PayServlet extends BaseService {
	private Logger logger = LoggerFactory.getLogger(PayServlet.class);

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
		if (empee != null){
			empeeId = empee.getEmpee_id().toString();
		}else{
			Empee empee1 = new Empee();
			empee1.setEmpee_id(24316l);
			empee1.setEmpee_acct("admin");
			request.getSession().setAttribute("empee", empee1);
		}
		logger.info("empeeId----->:" + empeeId);
		return empeeId;
	}

	/**
	 * 根据选择的订单竣工时间，查询对应的清单信息生成批次、批次清单关系和批次文件
	 * @param request
	 * @param response
	 * @param rtnMap
	 */
	public void addBatch(HttpServletRequest request,
			HttpServletResponse response, Map<String, Object> rtnMap){
		try {
			CommonDBService imp = new CommonDBService();
			Map params = this.dataToMap_new(request);
			params.put("EMPEE_ID", getEmpeeId(request));
			Empee empee =  (Empee) request.getSession().getAttribute("empee");
			//查询对应清单信息
			String serviceName = "SALE_REWARD_SEND2TPSS_DETAIL_Q";
			List<Map<String, Object>> dataList = imp.queryDataToPage(serviceName, params);
			
			if(dataList!=null&&dataList.size()>0){
				//生成批次号
				String batchNo ="BZ-"+DateUtil.getNowTime()+"-"+empee.getEmpee_acct();
				
				//批处理参数
				List<String> serviceNameList = new ArrayList<String>();
				List<Map<String, Object>> paramList = new ArrayList<Map<String, Object>>();
				Map<String,List<Map<String, Object>>> paramMap = new HashMap<String,List<Map<String, Object>>>();
				Map<String,String> operMap = new HashMap<String,String>();
				List<Map<String, Object>> batchDetailParamList = new ArrayList<Map<String, Object>>();
				
				//创建文件
				String fileName = batchNo + ".xls";
				String filePath = request.getSession().getServletContext().getRealPath("");
				if (!filePath.substring(filePath.length() - 1).equals("\\")&& !filePath.substring(filePath.length() - 1).equals("/")){
					filePath = filePath + "/";
				}
				filePath = filePath+"downloadfile/sendtotpss/"+fileName;
				logger.info("filePath----->:" + filePath);
				WritableWorkbook workbook = Workbook.createWorkbook(new File(filePath));
				WritableSheet sheet = workbook.createSheet("支付清单", 0);
				Label label;

				// 获取导出列并写列名
				params.put("service_code", serviceName);
				List<Map<String, Object>> columnList = imp.queryDataToPage("REWARD_QUERY_FIELDS", params);
				for (int i = 0; i < columnList.size(); i++) {
					Map<String, Object> colData = columnList.get(i);
					label = new Label(i, 0, colData.get("COL_NAME") + "");
					sheet.addCell(label);
					sheet.setColumnView(i,Integer.parseInt(colData.get("COL_LEN") + "") / 10); // 设置列的宽度
				}
				
				// 写出数据
				for (int i = 0; i < dataList.size(); i++) {
					HashMap data = (HashMap) dataList.get(i);
					for (int j = 0; j < columnList.size(); j++) {
						Map<String, Object> colData = columnList.get(j);
						String key = colData.get("COL_CODE") + "";
						String value = String.valueOf(data.get(key));
						label = new Label(j, i + 1, value);
						sheet.addCell(label);
					}

					//批次明细参数
					Map<String,Object> batchDetailParamMap = new HashMap();
					batchDetailParamMap.put("BATCH_NO", batchNo);
					batchDetailParamMap.put("SALE_REWARD_DETAIL_ID", data.get("SALE_REWARD_DETAIL_ID"));
					batchDetailParamList.add(batchDetailParamMap);
				}
				
				//写数据
				workbook.write();
				//关闭文件
				workbook.close();
				
				//报帐批次
				Map<String,Object> batchMap = new HashMap();
				batchMap.put("BATCH_NO", batchNo);
				batchMap.put("START_DATE",  params.get("START_DATE"));
				batchMap.put("END_DATE", params.get("END_DATE"));
				batchMap.put("PAY_FILE_NAME", fileName);
				batchMap.put("CREATE_STAFF", empee.getEmpee_id());

				List<Map<String, Object>> batchParamList = new ArrayList<Map<String, Object>>();
				batchParamList.add(batchMap);
				
				serviceNameList.add("SALE_REWARD_SEND2TPSS_BATCH");
				paramMap.put("SALE_REWARD_SEND2TPSS_BATCH", batchParamList);
				operMap.put("SALE_REWARD_SEND2TPSS_BATCH", "AO");
				
				//批次明细
				serviceNameList.add("SALE_REWARD_SEND2TPSS_BATCH_REL");
				paramMap.put("SALE_REWARD_SEND2TPSS_BATCH_REL", batchDetailParamList);
				operMap.put("SALE_REWARD_SEND2TPSS_BATCH_REL", "A");
				
				//批量入库
				imp.runBatch(serviceNameList, paramMap, operMap);

				rtnMap.put("success", "success");
			}else{
				rtnMap.put("success", "fail");
				rtnMap.put("errormsg", "未汇总到数据！");
			}
			
		} catch (Exception e) {
			e.printStackTrace();
			rtnMap.put("success", "fail");
			rtnMap.put("errormsg","保存失败！");
		}
	}
	
	
}
