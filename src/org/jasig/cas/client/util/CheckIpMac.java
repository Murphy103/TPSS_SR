package org.jasig.cas.client.util;

import javax.servlet.http.HttpServletRequest;

public class CheckIpMac {

	/**
	 * IP校验（客户端IP与认证IP校对）
	 * 
	 * @param localIP
	 *            客户端IP,如果ip为0.0.0.0就不用校验
	 * @param authIP
	 *            用户认证的IP/IP段
	 * @return 校验是否通过
	 * @author terry.tang
	 */
	public static boolean checkIP(String localIP, String authIP) {
		boolean flag = false;
		if (authIP == null || "".equals(authIP.trim())) {
			return true;
		}
		// 如果获取的IP是0.0.0.0，不用IP认证
		if ("0.0.0.0".equals(localIP)) {
			return true;
		}
		// IP、IP段以','分隔 当有虚拟网卡时，客户端获取的IP有多个值
		String[] localIPArr = localIP.split(",");
		String[] authIPArr = authIP.split(",");
		for (int i = 0, n = authIPArr.length; i < n; i++) {
			if (authIPArr[i].indexOf("-") > -1) {// IP段类型
				// 单个IP地址是IP段;只考虑IP地址前3段相同，最后一段不同的情况
				String[] ipStr = authIPArr[i].split("-");
				String[] strIP1 = null;
				String[] strIP2 = null;
				StringBuffer strIP3 = new StringBuffer("");
				StringBuffer strIP4 = new StringBuffer("");
				StringBuffer nowTemp = new StringBuffer();
				strIP1 = ipStr[0].split("\\.");// 分别获取"-"两边的IP地址,前一部分拆分IP
				for (int j = 0, m = strIP1.length; j < m; j++) {
					strIP3.append(strIP1[j]);
				}
				strIP2 = ipStr[1].split("\\.");// 分别获取"-"两边的IP地址,后一部分拆分IP
				for (int l = 0, m = strIP2.length; l < m; l++) {
					strIP4.append(strIP2[l]);
				}

				long oldlong1 = 0;
				long oldlong2 = 0;
				if (strIP3 != null && !"".equals(strIP3.toString())) {
					oldlong1 = Long.parseLong(strIP3.toString().trim());// 将原有IP前部分连接并转换为long比较
				}
				if (strIP4 != null && !"".equals(strIP4.toString())) {
					oldlong2 = Long.parseLong(strIP4.toString().trim());// 将原有IP后部分连接并转换为long比较
				}

				// 拆分登陆的IP,拼装成数字
				for (int jj = 0, mm = localIPArr.length; jj < mm; jj++) {
					String[] nowip = localIPArr[jj].split("\\.");
					for (int kk = 0, m = nowip.length; kk < m; kk++) {
						nowTemp.append(nowip[kk]);
					}
					long nowlong = 0;
					if (nowTemp != null && !"".equals(nowTemp.toString())) {
						nowlong = Long.parseLong(nowTemp.toString().trim());
					}
					// 比较原有的和登陆的IP
					if (nowlong >= oldlong1 && nowlong <= oldlong2) {
						flag = true;// 表示此时用户登陆IP和原有的IP匹配
					}
				}
			} else {
				// 单个地址是单个IP
				String authSignIP = authIPArr[i];
				String[] authSignIPArr = authSignIP.split("\\.");

				// 1.单个IP地址有段的范围配置的是255
				if (authSignIPArr.length == 4 && authSignIP.indexOf("255") > -1) {
					for (int j = 0, m = localIPArr.length; j < m; j++) {
						boolean bool = checkRangeIPAddr(authSignIP,
								localIPArr[j]);
						if (bool) {
							flag = true;
						}
					}
				}
				// 2.单个地址普通情况，比较IP地址相同即可
				else {
					for (int j = 0, m = localIPArr.length; j < m; j++) {
						if (authSignIP.equals(localIPArr[j])) {
							flag = true;
						}
					}
				}
			}
			// 如果已经通过，则退出
			if (flag) {
				break;
			}
		}
		return flag;
	}

	/**
	 * 验证IP有255的情况
	 * 
	 * @param configIP
	 *            配置的IP
	 * @param locIP
	 *            本机IP
	 * @return
	 */
	public static boolean checkRangeIPAddr(String configIP, String locIP) {
		if (configIP == null || locIP == null) {
			return true;
		}
		String[] ips = configIP.split("\\.");
		String[] authSignIPArr = locIP.split("\\.");
		if (ips.length < 4 || authSignIPArr.length < 4) {
			return true;
		}
		if (!ips[0].equals("255") && !ips[0].equals(authSignIPArr[0])) {
			return false;
		}
		if (!ips[1].equals("255") && !ips[1].equals(authSignIPArr[1])) {
			return false;
		}
		if (!ips[2].equals("255") && !ips[2].equals(authSignIPArr[2])) {
			return false;
		}
		if (!ips[3].equals("255") && !ips[3].equals(authSignIPArr[3])) {
			return false;
		}
		return true;
	}

	/**
	 * MAC校验（客户端MAC与认证MAC校对）
	 * 
	 * @param localMAC
	 *            客户端的MAC地址
	 * @param authMAC
	 *            用户认证的MAC地址
	 * @return 校验是否通过
	 * @author terry.tang
	 */
	public static boolean checkMac(final String localMAC, final String authMAC) {
		if (authMAC == null || "".equals(authMAC.trim())) {
			return true;
		} else {
			// authMAC.replace("-", ":")转化MAC地址，格式统一为**:**:**:**:**:**
			// 当配置有虚拟网卡时，会获取到多个MAC地址
			int findIp = localMAC.indexOf(authMAC.replace("-", ":"));
			if (findIp > -1) {
				return true;
			} else {
				return false;
			}
		}
	}

	public static String getRemoteAddr(HttpServletRequest request)
	{
		 return request.getRemoteAddr().toString();
		
	}
	
	public static String getClientIp(HttpServletRequest request)
	{
		if(request.getHeader("x-forwarded-for") == null){
			return request.getRemoteAddr();
		}
		return request.getHeader("x-forwarded-for");
	}
	// 从服务端获取客户端的IP地址
	public static String getClientIpFromServ(HttpServletRequest request) {
		String ip = request.getHeader("x-forwarded-for");
/**		System.out.println("-----------forwarded----------"+request.getHeader("x-forwarded-for"));
		System.out.println("-----------Proxy-Client-IP----------"+request.getHeader("Proxy-Client-IP"));
		System.out.println("-----------WL-Proxy-Client-IP----------"+request.getHeader("WL-Proxy-Client-IP"));
		System.out.println("-----------X-Real-IP----------"+request.getHeader("X-Real-IP"));
		System.out.println("-----------REMOTE-HOST----------"+request.getHeader("REMOTE-HOST"));
		System.out.println("-----------HTTP_X_REAL_IP----------"+request.getHeader("HTTP_X_REAL_IP"));
		System.out.println("-----------ip----------"+request.getHeader("request.getRemoteAddr()"));**/ 
		// 如果通过了多级反向代理的话,X-Forwarded-For的值不止一个,而是一串IP值,取X-Forwarded-For中第一个非unknown的有效IP字符串
		if (ip != null && ip.length() != 0 && !"unknown".equalsIgnoreCase(ip)) {
			ip = ip.split(",")[0];
		}
		if (ip == null || ip.length() == 0 || "unknown".equalsIgnoreCase(ip)) {
			ip = request.getHeader("Proxy-Client-IP");
		}
		if (ip == null || ip.length() == 0 || "unknown".equalsIgnoreCase(ip)) {
			ip = request.getHeader("WL-Proxy-Client-IP");
		}
		if (ip == null || ip.length() == 0 || "unknown".equalsIgnoreCase(ip)) {
			ip = request.getHeader("X-Real-IP");
		}
		if (ip == null || ip.length() == 0 || "unknown".equalsIgnoreCase(ip)) {
			ip = request.getHeader("REMOTE-HOST");
		}
		if (ip == null || ip.length() == 0 || "unknown".equalsIgnoreCase(ip)) {
			ip = request.getHeader("HTTP_X_REAL_IP");
		} 
		if (ip == null || ip.length() == 0 || "unknown".equalsIgnoreCase(ip)) {
			ip = request.getRemoteAddr();
		}

		return ip;
	}

	/** * 判断IP是否在指定范围； */
	public static boolean ipIsValid(String ipSection, String ip) {
		if (ipSection == null)
			throw new NullPointerException("IP段不能为空！");
		if (ip == null)
			throw new NullPointerException("IP不能为空！");
		ipSection = ipSection.trim();
		ip = ip.trim();
		final String REGX_IP = "((25[0-5]|2[0-4]\\d|1\\d{2}|[1-9]\\d|\\d)\\.){3}(25[0-5]|2[0-4]\\d|1\\d{2}|[1-9]\\d|\\d)";
		final String REGX_IPB = REGX_IP + "\\-" + REGX_IP;
		if (!ipSection.matches(REGX_IPB) || !ip.matches(REGX_IP))
			return false;
		int idx = ipSection.indexOf('-');
		String[] sips = ipSection.substring(0, idx).split("\\.");
		String[] sipe = ipSection.substring(idx + 1).split("\\.");
		String[] sipt = ip.split("\\.");
		long ips = 0L, ipe = 0L, ipt = 0L;
		for (int i = 0; i < 4; ++i) {
			ips = ips << 8 | Integer.parseInt(sips[i]);
			ipe = ipe << 8 | Integer.parseInt(sipe[i]);
			ipt = ipt << 8 | Integer.parseInt(sipt[i]);
		}
		if (ips > ipe) {
			long t = ips;
			ips = ipe;
			ipe = t;
		}
		return ips <= ipt && ipt <= ipe;
	}

	public static void main(String[] args) {
		if (ipIsValid("192.168.1.1-192.168.1.10", "192.168.3.54")) {
			System.out.println("ip属于该网段");
		} else
			System.out.println("ip不属于该网段");
	}

}