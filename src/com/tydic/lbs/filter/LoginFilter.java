package com.tydic.lbs.filter;

import java.io.IOException;

import javax.servlet.Filter;
import javax.servlet.FilterChain;
import javax.servlet.FilterConfig;
import javax.servlet.ServletException;
import javax.servlet.ServletRequest;
import javax.servlet.ServletResponse;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import org.jasig.cas.client.util.AuthVo;
import org.jasig.cas.client.util.SessionUtil;

public class LoginFilter implements Filter {
	public LoginFilter() {
		super();
	}

	public void doFilter(ServletRequest request, ServletResponse response,
			FilterChain chain) throws IOException, ServletException {
		// TODO Auto-generated method stub

		HttpServletRequest req = (HttpServletRequest) request;
		HttpServletResponse res = (HttpServletResponse) response;
		res.setHeader("P3P","CP=CAO PSA OUR");
		HttpSession session = req.getSession(true);

		String path = req.getRequestURI();
 		// 登陆页面无需过滤
		if (path.indexOf("/login.html") > -1 ||path.indexOf("ssologin")>-1||path.indexOf("csss")>-1
				|| (req.getQueryString() !=null &&req.getQueryString().indexOf("methodName=login")>-1)) {
//			 System.out.println("release page not need filter....");
			 chain.doFilter(request, response);
		} 

		else {
			// 从session中获取用户名信息
			AuthVo authVo = (AuthVo) SessionUtil.getSessionUserInfo(req);
			if (authVo == null || authVo.getSystemUserCode()==null) {
				res.sendRedirect("http://" + req.getHeader("Host")
						+ "/TPSS_WEB/html/login.html");
			} else {
				chain.doFilter(request, response);
			}
		}

	}

	public void init(FilterConfig conf) throws ServletException {

	}

	public void destroy() {
	}

	
}