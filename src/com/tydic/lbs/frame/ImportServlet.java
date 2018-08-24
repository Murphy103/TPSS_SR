/*
 * @author xiangsl   
 * @date 2015年7月9日 下午12:42:14 
 * @Description: 此处添加文件描述……
 */
package com.tydic.lbs.frame;

import java.io.File;
import java.io.IOException;
import java.io.PrintWriter;
import java.net.URLDecoder;
import java.util.ArrayList;
import java.util.Enumeration;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.servlet.ServletException;
import javax.servlet.annotation.MultipartConfig;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import com.oreilly.servlet.MultipartRequest;
import com.oreilly.servlet.multipart.FileRenamePolicy;
import com.tydic.lbs.entity.Empee;
import com.tydic.lbs.service.CommonDBService;
import com.tydic.lbs.util.CheckUtil;
import com.tydic.lbs.util.ExcelUtil;


@WebServlet("/ImportServlet.do")
@MultipartConfig
public class ImportServlet extends HttpServlet {
	private static final long serialVersionUID = -4714985293186408724L;
	Logger logger = LoggerFactory.getLogger(this.getClass());
	@Override
	public void doGet(HttpServletRequest request, HttpServletResponse response) throws IOException, ServletException {
		doPost(request,response);
	}

	@Override
	public void doPost(HttpServletRequest request, HttpServletResponse response) throws IOException, ServletException {
		if (logger.isDebugEnabled()) {
			logger.debug("enter method:ControlServlet.doPost");
		}
		response.setContentType("text/html;charset=UTF-8");
		response.setHeader("Cache-Control", "private");
		response.setHeader("Pragma", "no-cache");
		response.setCharacterEncoding("UTF-8");
		request.setCharacterEncoding("UTF-8");
		String fileName="";
		Map<String, Object> rtnMap = new HashMap<String, Object>();
		
		try{
			String uploadPath = "\\upload";
			String saveDirectory = request.getSession().getServletContext().getRealPath("")+uploadPath;
			saveDirectory = saveDirectory.replaceAll("\\\\", "\\/");
			System.out.println(saveDirectory);
			
			MultipartRequest multi = new MultipartRequest(request,saveDirectory,
				100 * 1024 * 1024, "UTF-8",new FileRenamePolicy(){
				  public java.io.File rename(java.io.File fp){
					  String fileName = fp.getName();
					  String prefix=fileName.substring(fileName.lastIndexOf("."));
					  
					  String newFileName = fp.getAbsolutePath().substring(0,fp.getAbsolutePath().indexOf(prefix))+"_"+System.currentTimeMillis()+fp.getAbsolutePath().substring(fp.getAbsolutePath().indexOf(prefix));
					  File fileNew =  new File(newFileName);
					  return fileNew;
				  }
			});
			 
			List<String> fileList = new ArrayList<String>();
			//如果有上传文件, 则保存到数据内
			Enumeration files = multi.getFileNames();
			while (files.hasMoreElements()) {
				String name = (String)files.nextElement();
				File f = multi.getFile(name);
				if(f!=null){
					 //读取上传后的项目文件, 导入保存到数据中
					 fileName = multi.getFilesystemName(name);
					 fileList.add(fileName);
				}else{
					rtnMap.put("success","fail") ;
					rtnMap.put("errormsg","导入的文件为空") ;
					PrintWriter out = response.getWriter();
					out.println(JSONArray.toJSONString(rtnMap));
					out.flush();
					out.close();
				}
			}
			
			CommonDBService imp= new CommonDBService();
			Map params = this.dataToMap_new(multi);
			//获取上传flag LOCAL:上传文件到本地服务器    FTP:上传文件到远程服务器
			String uploadFlag = params.get("upload_flag")+"";
			//获取解析flag true:解析入库   false:不解析
			String parseFlag = params.get("parse_flag")+"";
			
			if(uploadFlag.equals("FTP")){
				//TODO:将文件上传到远程服务器，同时增加任务
			}
			
			//如果需要解析文件，则要解析文件内容入库
			if(parseFlag.equals("true")){
				//获取导入SQL
				String serviceName = params.get("service_name")+"";
				//获取导入SQL执行前执行的SQL
				String serviceName_Pre = params.get("service_name_pre")+"";
				//获取导入文件名  默认只导入一个文件
				String filePath = saveDirectory+"/"+fileList.get(0);
				List<Map<String, Object>> dataList = new ArrayList<Map<String, Object>>();
				//导入文件各列key
				List<Map<String, Object>> columns = LoadParam.importMap.get(serviceName);
				//导入错误原因
				List<String> errorMsgs = new ArrayList<String>();
				
				params.put("CREATE_STAFF", Long.parseLong(this.getEmpeeId(request)));
				params.put("UPDATE_STAFF", Long.parseLong(this.getEmpeeId(request)));
				
				//解析导入文件
				if(!filePath.endsWith("xls")){
					rtnMap.put("success","fail") ;
					rtnMap.put("errormsg","导入的文件不是Excel") ;
					PrintWriter out = response.getWriter();
					out.println(JSONArray.toJSONString(rtnMap));
					out.flush();
					out.close();
				}
				
				ExcelUtil.parseImport(filePath, columns,params, dataList);
				//校验导入数据
				CheckUtil.check(serviceName, "excel", dataList, errorMsgs);
				
				if(errorMsgs.size() > 0){
					String errorTip = "";
					for(String errorMsg:errorMsgs){
						errorTip += errorMsg+"</br>";
					}
					rtnMap.put("success","fail") ;
					rtnMap.put("errormsg",errorTip) ;
				}else{
					if(serviceName_Pre.equals("")){
						//导入数据入库
						imp.insertBatch(serviceName,dataList);
					}else{
						//导入数据之前执行其他SQL
						List<String> serviceNameList = new ArrayList<String>();
						List<Map<String, Object>> paramList = new ArrayList<Map<String, Object>>();
						Map<String,List<Map<String, Object>>> paramMap = new HashMap<String,List<Map<String, Object>>>();
						Map<String,String> operMap = new HashMap<String,String>();
						JSONArray serviceNameArr = JSONArray.parseArray(serviceName_Pre);
						paramList.add(params);
						
						//按照servicename组装SQL参数和操作标识
						for(int i = 0;i < serviceNameArr.size();i++){
							JSONObject serviceNameObj = serviceNameArr.getJSONObject(i);
							serviceNameList.add(serviceNameObj.getString("service_name"));
							paramMap.put(serviceNameObj.getString("service_name"), paramList);
							operMap.put(serviceNameObj.getString("service_name"), serviceNameObj.getString("oper_flag"));
						}
						
						//增加导入SQL
						serviceNameList.add(serviceName);
						paramMap.put(serviceName, dataList);
						operMap.put(serviceName, "A");
						
						//批量执行SQL
						imp.runBatch(serviceNameList, paramMap, operMap);
					}
					
					rtnMap.put("success","success") ;
				}
				
				
			}else{
				//不需要解析入库，则直接将文件列表返回给前台
				rtnMap.put("fileList",fileList) ;
				rtnMap.put("success","success") ;
			}
			
		} catch (Exception e) {
			
			e.printStackTrace();
			rtnMap.put("success","fail") ;
	 		rtnMap.put("errormsg",e.getMessage() == null ? "导入异常" : e.getMessage()) ;
		}
		
		PrintWriter out = response.getWriter();
		out.println(JSONArray.toJSONString(rtnMap));
		out.flush();
		out.close();
		if (logger.isDebugEnabled()) {
			logger.debug("leave method:ImportServlet.doPost");
		}
		
	}
	
	
	/**
	 * 获取用户id
	 * @return
	 */
	@SuppressWarnings("unused")
	private String getEmpeeId(HttpServletRequest request)
	{
		Empee empee = null;
		String empeeId = "";
		if(null !=request.getSession().getAttribute("empee")){
			empee = (Empee) request.getSession().getAttribute("empee");
			empeeId = empee.getEmpee_id().toString();
		}else{
			empeeId = "16715";
		}
		
		logger.info("empeeId----->:"+empeeId);
				
		return empeeId;
	}


	/**
	 * 参数转换String[]
	 * @param request
	 * @return
	 * @throws IOException 
	 */
	public Map dataToMap_new(MultipartRequest request) throws IOException {
		Map params = new HashMap();
		
		Enumeration enu=request.getParameterNames();  
		while(enu.hasMoreElements()){  
			String paraName=(String)enu.nextElement();  
			System.out.println(paraName+": "+request.getParameter(paraName));  
			
			if(paraName.equals("params")){
				Map paramMap=(Map) JSON.parseObject(URLDecoder.decode(request.getParameter(paraName),"UTF-8"), Map.class);
				params.putAll(paramMap);
			}else{
				params.put(paraName, URLDecoder.decode(request.getParameter(paraName),"UTF-8"));
			}
			
		}
		
 		return  params;
	}


	
}