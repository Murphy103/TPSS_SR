package com.tydic.lbs.service;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import org.mybatis.spring.SqlSessionTemplate;
import org.springframework.transaction.annotation.Transactional;

import com.tydic.lbs.dao.CommonDBDao;
import com.tydic.lbs.util.SpringBeanUtil;

public class CommonDBService {
	CommonDBDao dao = (CommonDBDao) SpringBeanUtil.getBean("dbdao");
	@SuppressWarnings("unchecked")
	public List<Map<String, Object>> queryDataToPage(String serviceName, Map params) throws Exception {
		int startNum = params.get("pageIndex") == null?-1:
			Integer.parseInt(params.get("pageIndex")+"")*
			(params.get("pageSize") == null?-1:Integer.parseInt(params.get("pageSize")+""))+1;
		int endNum = (startNum-1)+(params.get("pageSize") == null?-1:Integer.parseInt(params.get("pageSize")+""));
		if(startNum > 0){
			params.put("start_num", startNum);
		}
		if(endNum > 0){
			params.put("end_num", endNum);
		}
		return dao.query(serviceName, params);
	}
	/**
	 * 分页获取总记录数
	 * @param string
	 * @param params
	 * @return
	 */
	@SuppressWarnings("unchecked")
	public long getCount(String serviceName, Map params) throws Exception{
		Map<String, Object> countMap = dao.queryForOne(serviceName, params);
		long count = Long.parseLong(countMap.get("COUNT")+"");
		return count;

	}
	
	/**
	 * 新增记录
	 * @param string
	 * @param params
	 * @return
	 */
	@SuppressWarnings("unchecked")
	public void insert(String serviceName, Map params) throws Exception {
		dao.insert(serviceName, params);
	}
	
	/**
	 * 更新记录
	 * @param string
	 * @param params
	 * @return
	 */
	@SuppressWarnings("unchecked")
	public void update(String serviceName, Map params) throws Exception{
		dao.update(serviceName, params);
	}
	
	/**
	 * 删除记录
	 * @param string
	 * @param params
	 * @return
	 */
	@SuppressWarnings("unchecked")
	public void delete(String serviceName, Map params) throws Exception{
		dao.delete(serviceName, params);
	}
	
	/**
	 * 批量插入数据
	 * @param string
	 * @param params
	 * @return
	 */
	@SuppressWarnings("unchecked")
	public void insertBatch(String serviceName, List<Map<String, Object>> params) throws Exception{
		dao.insertBatch(serviceName, params);
	}
	

	
	/**
	 * 查询一条数据
	 * @param string
	 * @param params
	 * @return
	 */
	@SuppressWarnings("unchecked")
	public Map<String, Object> selectOne(String serviceName, Map<String, Object> params) throws Exception{
		return dao.queryForOne(serviceName, params);
	}
	

	public List<Map<String, Object>> getSqlList(String serviceName, Map<String, Object> params) throws Exception {

		//获取待执行的SQL
		 List<Map<String, Object>>sqllist = new ArrayList<Map<String, Object>>();
		 sqllist= dao.queryData(serviceName, params);
		if(sqllist.size()==0){
			return null;
		}else{
			return sqllist;
		}
	}
	
	
	public String insertData(String serviceName, Map<String,Object> params) throws Exception{
		dao.insert(serviceName, params);
		return null;
	}
	
	public String updateData(String serviceName, Map<String,Object> params) throws Exception{
		dao.update(serviceName, params);
		return null;
	}
	
	public String deleteData(String serviceName, Map<String,Object> params) throws Exception{
		dao.delete(serviceName, params);
		return null;
	}
	
	public List<Map<String, Object>> queryData(String serviceName, Map<String,Object> params){
		return dao.query(serviceName, params);
	}
	

	/**
	 * 事务控制批量执行多条SQL
	 * @param serviceName
	 * @param paramList
	 * @param operFlag
	 */
	@Transactional(rollbackFor=Exception.class)
	public void runBatch(List<String> serviceNameList,
			Map<String,List<Map<String, Object>>> paramMap,Map<String,String> operMap) throws Exception {
		
		if(serviceNameList.size() != paramMap.size() || paramMap.size() != operMap.size()){
			throw new Exception("servicename和执行参数不匹配");
		}
		
		String operFlag = "";
		List<Map<String, Object>> paraList = new ArrayList<Map<String, Object>>();
		
		dao.runBatch(serviceNameList, paramMap, operMap);
		
	}

}
