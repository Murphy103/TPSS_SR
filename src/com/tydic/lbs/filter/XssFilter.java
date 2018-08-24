/*
 * Copyright 2014 NAVER Corp.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

package com.tydic.lbs.filter;

import java.io.IOException;

import javax.servlet.Filter;
import javax.servlet.FilterChain;
import javax.servlet.FilterConfig;
import javax.servlet.ServletException;
import javax.servlet.ServletRequest;
import javax.servlet.ServletResponse;
import javax.servlet.http.HttpServletRequest;

import com.navercorp.lucy.security.xss.servletfilter.XssEscapeFilter;
import com.navercorp.lucy.security.xss.servletfilter.XssEscapeServletFilterWrapper;

/**
 * @author todtod80
 * @author leeplay
 */
public class XssFilter implements Filter {

	private XssEscapeFilter xssEscapeFilter = XssEscapeFilter.getInstance();
	private String encoding;
	@Override
	public void init(FilterConfig filterConfig) throws ServletException {
		encoding = "utf-8";
	}

	@Override
	public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain) throws IOException, ServletException {
		request.setCharacterEncoding(encoding);
		request.setCharacterEncoding(encoding);
		String path = ((HttpServletRequest) request).getRequestURI();
		if (path.contains("sso") || path.contains("SSO") ) {
			chain.doFilter(request, response);
		}  else {
			chain.doFilter(new XssEscapeServletFilterWrapper(request, xssEscapeFilter), response);
		}
	}

	@Override
	public void destroy() {
	}
}
