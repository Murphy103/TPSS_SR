package com.tydic.lbs.entity;

import java.util.Date;
import java.util.List;
import java.util.Map;

import javax.persistence.Id;
import javax.persistence.Transient;

import org.apache.commons.lang.builder.ToStringBuilder;

 
public class Empee {

	private Long empee_id;
	private Long pty_id;
	private String empee_name;
	private String empee_acct;
	private String empee_pwd;
	private String empee_addr_desc;
	private String empee_email_addr;
	private String empee_mob_no;
	private String empee_tel_no;
	private String empee_phs_no;
	private String staff_type;
	private String cert_nbr;
	private Long login_num;
	private String state;
	private Long latn_id;
	private String latn_name ;
	private String user_type;
	private String empee_code;
	private Date crt_date;
	private Date pwd_crt_date;
	private String title;
	private Long site_id;
	private String ip_address;
	private String mac;
	private Long empee_level;
	private Long qq;
	private String msn;
	private String hr_personid;
	private String style;
	private Long pty_latn_id;
	private Long gprovice;
	private String url_mapping;
	
	@Transient
	private Long bill_serial_nbr;
	
	@Transient
	private List empee_privilege;
	
	private String button_privilege;
	
	//----add 2012.07.17 begin
	private String agent_cd;//登陆用户可以检索的代理网点标识
	private String agent_name;//登陆用户可以检索的代理网点名称
	private String agent_id;//登陆用户可以检索的代理网点id
	private String loc_id;//营业区域id
	private String loc_name;//营业区域名称
	private String channel_id;//酬金渠道id
	private String channel_name;//酬金渠道名称
	private String agent_latn_id;//代理网点所在本地网id
	//----add 2012.07.17 end
	private String city_property;//江西版本城市属性
	private String dls_property;//江西版本代理商性质
	private String dls_bigType;//江西版本代理商大类
	private String dls_smalltype;//江西版本代理商小类
	
	
	
	
	public String getCity_property() {
		return city_property;
	}
	public void setCity_property(String city_property) {
		this.city_property = city_property;
	}
	public String getDls_property() {
		return dls_property;
	}
	public void setDls_property(String dls_property) {
		this.dls_property = dls_property;
	}
	public String getDls_bigType() {
		return dls_bigType;
	}
	public void setDls_bigType(String dls_bigType) {
		this.dls_bigType = dls_bigType;
	}
	public String getDls_smalltype() {
		return dls_smalltype;
	}
	public void setDls_smalltype(String dls_smalltype) {
		this.dls_smalltype = dls_smalltype;
	}
	@Id
	public Long getEmpee_id() {
		return empee_id;
	}
	public void setEmpee_id(Long empee_id) {
		this.empee_id = empee_id;
	}
	public Long getPty_id() {
		return pty_id;
	}
	public void setPty_id(Long pty_id) {
		this.pty_id = pty_id;
	}
	public String getEmpee_name() {
		return empee_name;
	}
	public void setEmpee_name(String empee_name) {
		this.empee_name = empee_name;
	}



	public String getEmpee_acct() {
		return empee_acct;
	}



	public void setEmpee_acct(String empee_acct) {
		this.empee_acct = empee_acct;
	}



	public String getEmpee_pwd() {
		return empee_pwd;
	}



	public void setEmpee_pwd(String empee_pwd) {
		this.empee_pwd = empee_pwd;
	}



	public String getEmpee_addr_desc() {
		return empee_addr_desc;
	}



	public void setEmpee_addr_desc(String empee_addr_desc) {
		this.empee_addr_desc = empee_addr_desc;
	}



	public String getEmpee_email_addr() {
		return empee_email_addr;
	}



	public void setEmpee_email_addr(String empee_email_addr) {
		this.empee_email_addr = empee_email_addr;
	}



	public String getEmpee_mob_no() {
		return empee_mob_no;
	}



	public void setEmpee_mob_no(String empee_mob_no) {
		this.empee_mob_no = empee_mob_no;
	}



	public String getEmpee_tel_no() {
		return empee_tel_no;
	}



	public void setEmpee_tel_no(String empee_tel_no) {
		this.empee_tel_no = empee_tel_no;
	}



	public String getEmpee_phs_no() {
		return empee_phs_no;
	}



	public void setEmpee_phs_no(String empee_phs_no) {
		this.empee_phs_no = empee_phs_no;
	}



	public String getStaff_type() {
		return staff_type;
	}



	public void setStaff_type(String staff_type) {
		this.staff_type = staff_type;
	}



	public String getCert_nbr() {
		return cert_nbr;
	}



	public void setCert_nbr(String cert_nbr) {
		this.cert_nbr = cert_nbr;
	}



	public Long getLogin_num() {
		return login_num;
	}



	public void setLogin_num(Long login_num) {
		this.login_num = login_num;
	}



	public String getState() {
		return state;
	}



	public void setState(String state) {
		this.state = state;
	}



	public Long getLatn_id() {
		return latn_id;
	}



	public void setLatn_id(Long latn_id) {
		this.latn_id = latn_id;
	}



	public String getUser_type() {
		return user_type;
	}



	public void setUser_type(String user_type) {
		this.user_type = user_type;
	}



	public String getEmpee_code() {
		return empee_code;
	}



	public void setEmpee_code(String empee_code) {
		this.empee_code = empee_code;
	}



	public Date getCrt_date() {
		return crt_date;
	}



	public void setCrt_date(Date crt_date) {
		this.crt_date = crt_date;
	}



	public Date getPwd_crt_date() {
		return pwd_crt_date;
	}



	public void setPwd_crt_date(Date pwd_crt_date) {
		this.pwd_crt_date = pwd_crt_date;
	}



	public String getTitle() {
		return title;
	}



	public void setTitle(String title) {
		this.title = title;
	}



	public Long getSite_id() {
		return site_id;
	}



	public void setSite_id(Long site_id) {
		this.site_id = site_id;
	}



	public String getIp_address() {
		return ip_address;
	}



	public void setIp_address(String ip_address) {
		this.ip_address = ip_address;
	}



	public String getMac() {
		return mac;
	}



	public void setMac(String mac) {
		this.mac = mac;
	}



	public Long getEmpee_level() {
		return empee_level;
	}



	public void setEmpee_level(Long empee_level) {
		this.empee_level = empee_level;
	}



	public Long getQq() {
		return qq;
	}



	public void setQq(Long qq) {
		this.qq = qq;
	}



	public String getMsn() {
		return msn;
	}



	public void setMsn(String msn) {
		this.msn = msn;
	}



	public String getHr_personid() {
		return hr_personid;
	}



	public void setHr_personid(String hr_personid) {
		this.hr_personid = hr_personid;
	}



	public String getStyle() {
		return style;
	}



	public void setStyle(String style) {
		this.style = style;
	}



	public Long getPty_latn_id() {
		return pty_latn_id;
	}



	public void setPty_latn_id(Long pty_latn_id) {
		this.pty_latn_id = pty_latn_id;
	}



	public Long getGprovice() {
		return gprovice;
	}



	public void setGprovice(Long gprovice) {
		this.gprovice = gprovice;
	}



	public String getUrl_mapping() {
		return url_mapping;
	}



	public void setUrl_mapping(String url_mapping) {
		this.url_mapping = url_mapping;
	}


	@Transient
	public Long getBill_serial_nbr() {
		return bill_serial_nbr;
	}


	@Transient
	public void setBill_serial_nbr(Long bill_serial_nbr) {
		this.bill_serial_nbr = bill_serial_nbr;
	}

	
	

	@Transient
	public List getEmpee_privilege() {
		return empee_privilege;
	}


	@Transient
	public void setEmpee_privilege(List empee_privilege) {
		this.empee_privilege = empee_privilege;
	} 
 
	 
	public String getButton_privilege() {
		return button_privilege;
	}
	public void setButton_privilege(String button_privilege) {
		this.button_privilege = button_privilege;
	}
	@Override
	public String toString() {
		return ToStringBuilder.reflectionToString(this);
	}
	public String getAgent_cd() {
		return agent_cd;
	}
	public void setAgent_cd(String agent_cd) {
		this.agent_cd = agent_cd;
	}
	public String getAgent_name() {
		return agent_name;
	}
	public void setAgent_name(String agent_name) {
		this.agent_name = agent_name;
	}
	public String getAgent_id() {
		return agent_id;
	}
	public void setAgent_id(String agent_id) {
		this.agent_id = agent_id;
	}
	public String getLoc_id() {
		return loc_id;
	}
	public void setLoc_id(String loc_id) {
		this.loc_id = loc_id;
	}
	public String getLoc_name() {
		return loc_name;
	}
	public void setLoc_name(String loc_name) {
		this.loc_name = loc_name;
	}
	public String getChannel_id() {
		return channel_id;
	}
	public void setChannel_id(String channel_id) {
		this.channel_id = channel_id;
	}
	public String getChannel_name() {
		return channel_name;
	}
	public void setChannel_name(String channel_name) {
		this.channel_name = channel_name;
	}
	public String getAgent_latn_id() {
		return agent_latn_id;
	}
	public void setAgent_latn_id(String agent_latn_id) {
		this.agent_latn_id = agent_latn_id;
	}
	public String getLatn_name() {
		return latn_name;
	}
	public void setLatn_name(String latn_name) {
		this.latn_name = latn_name;
	}
	
}
