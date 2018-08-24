package com.tydic.lbs.dao;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.mybatis.spring.SqlSessionTemplate;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.transaction.annotation.Transactional;

import com.tydic.lbs.util.SpringBeanUtil;
import com.tydic.lbs.util.StringCommon;

 
public class CommonDBDaoImpl implements CommonDBDao {
	private JdbcTemplate jct;
	private static Logger logger = LoggerFactory
			.getLogger(CommonDBDaoImpl.class);
	

	public void setJct(JdbcTemplate jdbcTemplate) {
		this.jct = jdbcTemplate;
	}
	
	@SuppressWarnings("unchecked")
	public List<String[]> getSqlList(){
		List<String[]> temps=null;
		temps=this.jct.query("SELECT service_name,flag,sql_desc,nvl(sql_desc_add,''),nvl(sql_desc_add2,'') from PAR_SERVICE_SQL_DESC_TPSS order by sql_desc_seq ,sql_add_seq",
					 new RowMapper(){
						
						public Object mapRow(ResultSet rs, int arg1)
								throws SQLException {
							String[] strs = new String[3];
							strs[0] = rs.getString(1);
							strs[1] = rs.getString(2);
							strs[2] = StringCommon.trimNull(rs.getString(3))
									+" "+StringCommon.trimNull(rs.getString(4))
									+" "+StringCommon.trimNull(rs.getString(5));
							return strs;
						}
		});
		return temps;
	}

	@Override
	public void insert(String serviceName, Map<String, Object> param) {
		SqlSessionTemplate sqlSession = (SqlSessionTemplate) SpringBeanUtil
				.getBean("sessionTemplate");
		sqlSession.insert(serviceName, param);
		
	}

	@Override
	public void update(String serviceName, Map<String, Object> param) {
		SqlSessionTemplate sqlSession = (SqlSessionTemplate) SpringBeanUtil
				.getBean("sessionTemplate");
		sqlSession.update(serviceName, param);
		
	}

	@Override
	public List<Map<String, Object>> query(String serviceName,
			Map<String, Object> param) {
		SqlSessionTemplate sqlSession = (SqlSessionTemplate) SpringBeanUtil
				.getBean("sessionTemplate");
		return sqlSession.selectList(serviceName, param);
	}
	
	@Override
	public List<Map<String, Object>> queryData(String serviceName,
			Map<String, Object> param) {
		SqlSessionTemplate sqlSession = (SqlSessionTemplate) SpringBeanUtil
				.getBean("sessionTemplate");
		return sqlSession.selectList(serviceName, param);
	}

	@Override
	public void delete(String serviceName, Map<String, Object> param) {
		SqlSessionTemplate sqlSession = (SqlSessionTemplate) SpringBeanUtil
				.getBean("sessionTemplate");
		sqlSession.delete(serviceName, param);
		
	}

	@Override
	public void insertBatch(String serviceName,
			List<Map<String, Object>> paramList) {
		SqlSessionTemplate sqlSession = (SqlSessionTemplate) SpringBeanUtil
				.getBean("sessionTemplate");
		Map paraMap = new HashMap();
		paraMap.put("paramList",paramList);
		sqlSession.insert(serviceName, paraMap);
	}
	
	@Override
	public void updateBatch(String serviceName,
			List<Map<String, Object>> paramList) {
		SqlSessionTemplate sqlSession = (SqlSessionTemplate) SpringBeanUtil
				.getBean("sessionTemplate");
		Map paraMap = new HashMap();
		paraMap.put("paramList",paramList);
		sqlSession.update(serviceName, paraMap);
	}
	
	@Override
	public void deleteBatch(String serviceName,
			List<Map<String, Object>> paramList) {
		SqlSessionTemplate sqlSession = (SqlSessionTemplate) SpringBeanUtil
				.getBean("sessionTemplate");
		Map paraMap = new HashMap();
		paraMap.put("paramList",paramList);
		sqlSession.delete(serviceName, paraMap);
	}

	@Override
	public Map<String, Object> queryForOne(String serviceName,
			Map<String, Object> param) {
		SqlSessionTemplate sqlSession = (SqlSessionTemplate) SpringBeanUtil
				.getBean("sessionTemplate");
		return sqlSession.selectOne(serviceName,param);
	}
	 
	@Override
	@Transactional(rollbackFor=Exception.class)
	public void runBatch(List<String> serviceNameList,
			Map<String,List<Map<String, Object>>> paramMap,Map<String,String> operMap){
		
		SqlSessionTemplate sqlSession = (SqlSessionTemplate) SpringBeanUtil
				.getBean("sessionTemplate");
		
	
		String operFlag = "";
		List<Map<String, Object>> paraList = new ArrayList<Map<String, Object>>();
		
		//循环每个service_name处理
		for(String serviceName : serviceNameList){
			operFlag = operMap.get(serviceName)+"";
			paraList = paramMap.get(serviceName);
			
			if(operFlag.equals("A")){
				this.insertBatch(serviceName, paraList);
			}else if(operFlag.equals("AO")){
				sqlSession.insert(serviceName, paraList.get(0));
			}if(operFlag.equals("U")){
				this.updateBatch(serviceName, paraList);
			}else if(operFlag.equals("UO")){
				sqlSession.update(serviceName, paraList.get(0));
			}else if(operFlag.equals("D")){
				this.deleteBatch(serviceName, paraList);
			}else if(operFlag.equals("DO")){
				sqlSession.delete(serviceName, paraList.get(0));
			}
		}
	}

}