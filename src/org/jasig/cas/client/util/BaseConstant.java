package org.jasig.cas.client.util;

public class BaseConstant {

	/**
	 * SSO客户端放在Session中用户对象key标识
	 */
	public static String SSO_CLIENT_AUTH_USER = "SSO_CLIENT_AUTH_USER";
	
	/**
	 * HttpClient 连接时间60000毫秒
	 */
	public static int HTTPCLIENT_CONNECT_TIMEOUT = 60000;
	
	/**
	 * HttpClient 读取时间60000毫秒
	 */
	public static int HTTPCLIENT_READ_TIMEOUT = 60000;

	/**
	 * SSO客户端请求URL参数名
	 */
	public static final String CLIENT_URL_NAME = "clientUrl";

	/**
	 * SSO客户端请求认证key参数名
	 */
	public static final String CLIENT_AUTH_KEY_NAME = "authKey";

	/**
	 * SessionMappingStorage 缓存最大session数量(默认5000)
	 */
	public static final int SESSION_MAPPING_MAX_CONTENT = 5000;

}
