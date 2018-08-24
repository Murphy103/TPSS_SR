/*
 * @author xiangsl   
 * @date 2015年7月9日 下午12:42:14 
 * @Description: 此处添加文件描述……
 */
package com.tydic.lbs.frame;

import java.io.IOException;
import java.io.PrintWriter;
import java.lang.reflect.InvocationTargetException;
import java.lang.reflect.Method;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.servlet.ServletException;
import javax.servlet.annotation.MultipartConfig;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.lang.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.ApplicationContext;
import org.springframework.web.context.support.WebApplicationContextUtils;

import com.alibaba.fastjson.JSONArray;

/**
 * 
 * @Package com.tydic.nodm.frame
 * @ClassName ControlServlet.java
 * @author xiangsl
 * @date 2015年7月9日 下午12:39:38
 * @Description: 所有Servlet类的入口
 * @version V1.0
 */
@WebServlet("/ControlServlet.do")
@MultipartConfig
public class ControlServlet extends HttpServlet {
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
		String serviceName = request.getParameter("serviceName");
		if (StringUtils.isEmpty(serviceName)) {
			logger.error("Parameter[serviceName] is empty, please check it!");
			return;
		}
		String methodName = request.getParameter("methodName");
		if (StringUtils.isEmpty(methodName)) {
			logger.error("Parameter[methodName] is empty, please check it!");
			return;
		}
		ApplicationContext context = WebApplicationContextUtils.getWebApplicationContext(request.getServletContext());
		BaseService serviceInstance = null;
		try {
			serviceInstance = (BaseService) context.getBean(serviceName);
		} catch (Exception e) {
			logger.error("bean " + serviceName + " not exists!!!", e);
			return;
		}
		Class<? extends BaseService> clazz = serviceInstance.getClass();
		Map<String, Object> rtnMap = new HashMap<String, Object>();
		Method method = null;
		try {
			method = clazz.getDeclaredMethod(methodName, HttpServletRequest.class, HttpServletResponse.class, Map.class);
		} catch (NoSuchMethodException e) {
			logger.error("bean=" + serviceName + " not exists method " + methodName, e);
			return;
			
		} catch (SecurityException e) {
			logger.error("bean=" + serviceName + " not exists public method " + methodName, e);
			return;
		}
		try {
			method.invoke(serviceInstance, request, response, rtnMap);
			
		} catch (IllegalAccessException e) {
			logger.error("get error in [bean=" + serviceName + ",method=" + methodName + "]", e);
		}catch (IllegalArgumentException e) {
			logger.error("get error in [bean=" + serviceName + ",method=" + methodName + "]", e);
		}catch (InvocationTargetException e) {
			logger.error("get error in [bean=" + serviceName + ",method=" + methodName + "]", e);
		}
		PrintWriter out = response.getWriter();
		if(rtnMap.get("list_flag") != null && rtnMap.get("list_flag").equals("list")){
			out.println(JSONArray.toJSONString(rtnMap.get("data")));
		}else{
			out.println(JSONArray.toJSONString(rtnMap));
		}
		out.flush();
		out.close();
		if (logger.isDebugEnabled()) {
			logger.debug("leave method:ControlServlet.doPost");
		}
	}
}