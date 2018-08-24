package com.tydic.lbs.dao;

import java.sql.SQLException;
import java.util.List;
import java.util.Map;

public abstract interface CommonDBDao
{
  public abstract List<String[]> getSqlList();
  
  public abstract void insert(String serviceName,Map<String, Object> param);
  
  public abstract void update(String serviceName,Map<String, Object> param);
  
  public abstract List<Map<String, Object>> query(String serviceName,Map<String, Object> param);
  
  public abstract List<Map<String, Object>> queryData(String serviceName,Map<String, Object> param);
  
  public abstract Map<String, Object> queryForOne(String serviceName,Map<String, Object> param);
  
  public abstract void delete(String serviceName,Map<String, Object> param);
  
  public abstract void insertBatch(String serviceName,List<Map<String, Object>> paramList);
  
  public abstract void updateBatch(String serviceName,List<Map<String, Object>> paramList);
  
  public abstract void deleteBatch(String serviceName,List<Map<String, Object>> paramList);
    
  public abstract void runBatch(List<String> serviceNameList,
			Map<String,List<Map<String, Object>>> paramMap,Map<String,String> operMap);
 }
