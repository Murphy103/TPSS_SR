package com.tydic.lbs.service;

import java.util.HashMap;
import java.util.Map;

import org.mybatis.spring.SqlSessionTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.tydic.lbs.util.SpringBeanUtil;

@Service("test")
public class Test {
	@Transactional(rollbackFor=Exception.class)
	public void insertData() throws Exception {
		SqlSessionTemplate sqlSession = (SqlSessionTemplate) SpringBeanUtil
				.getBean("sessionTemplate");

		Map paramMap = new HashMap<String, String>();
		paramMap.put("id", "103");
		paramMap.put("name", "测试3");
		sqlSession.insert("commonMapper.TEST_INSERT", paramMap);
		try {
			paramMap.put("id", "11");
			paramMap.put("name", "测试2");
			sqlSession.insert("commonMapper.TEST_INSERT", paramMap);
			
		} catch (Exception e) {
			throw new Exception("1111");
		}

	}
}
