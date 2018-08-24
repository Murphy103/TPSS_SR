package org.jasig.cas.client.util;

import java.io.Serializable;
import java.util.List;
import java.util.Map;

/**
 * 保存从SSO获取的信息, 如: SYSTEM_USER_ID、staffCode、SYSTEM_USER_CODE
 */
public class AuthVo implements Serializable {
	
	private static final long serialVersionUID = 5591929624837715583L;
	
	/**
	 * 系统用户标识	SYSTEM_USER_ID	INT	数据自动增长（后台生成）
	 */
	private String systemUserId="" ;
	
	/**
	 * 帐号	SYSTEM_USER_CODE	VARCHAR(100)	必填
	 */
	private String systemUserCode ;
	
	/**
	 * 员工名称	STAFF_NAME	VARCHAR(100)	必填
	 */
	private String staffName ;
	
	/**
	 * 身份证号	CERT_NUBR	VARCHAR(20)	必填
	 */
	private String certNubr ;
	
	/**
	 * 移动电话	MOB_NO	VARCHAR(40)	必填
	 */
	private String mobNo ;
	
	/**
	 * EMAIL	EMAIL_ADDR	VARCHAR(100)	必填
	 */
	private String emailAddr ;
	
	/**
	 * 加密UKEY	UKEY_NUM	VARCHAR(50)	可选
	 */
	private String ukeyNum ;
	
	/**
	 * 当前操作的客户端IP地址
	 */
	private String ipAddress ;
	
	/**
	 * 当前操作的客户端mac地址
	 */
	private String mac ;

	/**
	 * 登陆账号的菜单权限
	 */
	private List<Map<String,Object>> privilegeList = null;
	
	/**
	 * 登陆账号的组织机构
	 */
	private List<Map<String,Object>> orgList = null;
	
	/**
	 * 登陆账号的服务中心
	 */
	private List<Map<String,Object>> serviceList = null;

	public AuthVo() {
		super();
	}

	public String getSystemUserId() {
		return systemUserId;
	}

	public void setSystemUserId(String systemUserId) {
		this.systemUserId = systemUserId;
	}

	public String getSystemUserCode() {
		return systemUserCode;
	}

	public void setSystemUserCode(String systemUserCode) {
		this.systemUserCode = systemUserCode;
	}

	public String getStaffName() {
		return staffName;
	}

	public void setStaffName(String staffName) {
		this.staffName = staffName;
	}

	public String getCertNubr() {
		return certNubr;
	}

	public void setCertNubr(String certNubr) {
		this.certNubr = certNubr;
	}

	public String getMobNo() {
		return mobNo;
	}

	public void setMobNo(String mobNo) {
		this.mobNo = mobNo;
	}

	public String getEmailAddr() {
		return emailAddr;
	}

	public void setEmailAddr(String emailAddr) {
		this.emailAddr = emailAddr;
	}

	public String getUkeyNum() {
		return ukeyNum;
	}

	public void setUkeyNum(String ukeyNum) {
		this.ukeyNum = ukeyNum;
	}

	public List<Map<String, Object>> getPrivilegeList() {
		return privilegeList;
	}

	public String getIpAddress() {
		return ipAddress;
	}

	public void setIpAddress(String ipAddress) {
		this.ipAddress = ipAddress;
	}

	public String getMac() {
		return mac;
	}

	public void setMac(String mac) {
		this.mac = mac;
	}

	public void setPrivilegeList(List<Map<String, Object>> privilegeList) {
		this.privilegeList = privilegeList;
	}

	public List<Map<String, Object>> getOrgList() {
		return orgList;
	}

	public void setOrgList(List<Map<String, Object>> orgList) {
		this.orgList = orgList;
	}

	public List<Map<String, Object>> getServiceList() {
		return serviceList;
	}

	public void setServiceList(List<Map<String, Object>> serviceList) {
		this.serviceList = serviceList;
	}
	
	
	
}
