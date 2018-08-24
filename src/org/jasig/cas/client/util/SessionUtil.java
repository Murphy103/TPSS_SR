package org.jasig.cas.client.util;

import java.util.Map;

import javax.servlet.http.HttpServletRequest;

import org.jasig.cas.client.authentication.AttributePrincipal;

public class SessionUtil {
	public static Object getSessionUserInfo(HttpServletRequest request) {
		if(request.getSession().getAttribute(BaseConstant.SSO_CLIENT_AUTH_USER) == null){
			setSessionUserInfo(request);
		}
        return request.getSession().getAttribute(BaseConstant.SSO_CLIENT_AUTH_USER);
	}

	public static void setSessionUserInfo(HttpServletRequest request , Object obj) {
		request.getSession().setAttribute(BaseConstant.SSO_CLIENT_AUTH_USER , obj);
        //ServletContext context = request.getSession().getServletContext();
        //context.setAttribute( "portal", request.getSession() );
	}
	/**
	 * 从CAS客户端获取客户相应信息
	 * @param request
	 */
	private static void setSessionUserInfo(HttpServletRequest request){
		AttributePrincipal principal = (AttributePrincipal) request.getUserPrincipal();  
		AuthVo authVo = new AuthVo();
		if(principal != null){
	        Map<String, Object> attributes = principal.getAttributes();  
			authVo.setSystemUserId(attributes.get("SYSTEM_USER_ID").toString());
			authVo.setSystemUserCode(attributes.get("SYSTEM_USER_CODE").toString());
			authVo.setStaffName(attributes.get("STAFF_NAME").toString());
			authVo.setCertNubr(attributes.get("CERT_NUBR").toString());
			authVo.setEmailAddr(UtilTools.getDataToStringByNULL(attributes.get("EMAIL_ADDR")));
			authVo.setMobNo(UtilTools.getDataToStringByNULL(attributes.get("MOB_NO")));
			authVo.setUkeyNum(UtilTools.getDataToStringByNULL(attributes.get("UKEY_NUM")));
			authVo.setIpAddress(UtilTools.getDataToStringByNULL(CheckIpMac.getClientIp(request)));
		}
		request.getSession().setAttribute(BaseConstant.SSO_CLIENT_AUTH_USER , authVo);
	}
}
