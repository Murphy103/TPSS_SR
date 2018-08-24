package com.tydic.lbs.frame;

import java.io.File;
import java.io.FileOutputStream;
import java.io.FileWriter;
import java.io.IOException;
import java.io.OutputStreamWriter;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.sql.DataSource;

import org.mybatis.spring.SqlSessionFactoryBean;
import org.mybatis.spring.SqlSessionTemplate;
import org.springframework.beans.factory.support.DefaultListableBeanFactory;
import org.springframework.context.ApplicationContext;
import org.springframework.core.io.ClassPathResource;
import org.springframework.core.io.Resource;

import com.tydic.lbs.dao.CommonDBDao;
import com.tydic.lbs.service.Test;
import com.tydic.lbs.util.ServerConfig;
import com.tydic.lbs.util.SpringBeanUtil;

public class MybatisInitFactory {

	public void initMybatis() throws Exception {
		String resource = "mybatis-config.xml";
		// InputStream inputStream = Resources.getResourceAsStream(resource);
		SqlSessionFactoryBean factory = new SqlSessionFactoryBean();
		// 第一步，生产xml文件
		createXml();
		// 第二步，设置dataSource,configLocation,自行build,mybtais是否已经初始化
		factory.setDataSource((DataSource) SpringBeanUtil.getBean("dataSource"));
		Resource configLocation = new ClassPathResource(resource);
		factory.setConfigLocation(configLocation);

		// 第三步，初始化SqlSessionTemplate sessionTemplate
		SqlSessionTemplate sessionTemplate = new SqlSessionTemplate(
				factory.getObject());

		ApplicationContext ac=SpringBeanUtil.getApplicationContext();
		DefaultListableBeanFactory acf = (DefaultListableBeanFactory) ac.getAutowireCapableBeanFactory();
		if(acf.containsBean("sqlSessionFactory")){
			acf.destroySingleton("sqlSessionFactory");
		}
		acf.registerSingleton("sqlSessionFactory", factory);
		if(acf.containsBean("sessionTemplate")){
			acf.destroySingleton("sessionTemplate");
		}
		acf.registerSingleton("sessionTemplate", sessionTemplate);

		/**
		 * //Bean的实例工厂 DefaultListableBeanFactory dbf =
		 * (DefaultListableBeanFactory) context.getBeanFactory(); //注入factory
		 * BeanDefinitionBuilder sqlSessionFactoryBuider =
		 * BeanDefinitionBuilder.
		 * genericBeanDefinition(SqlSessionFactoryBean.class); //将实例注册spring容器中
		 * bs 等同于 id配置 dbf.registerBeanDefinition("sqlSessionFactory",
		 * sqlSessionFactoryBuider.getBeanDefinition());
		 * 
		 * //注入sessionTemplate BeanDefinitionBuilder sessionTemplateBuider =
		 * BeanDefinitionBuilder.
		 * genericBeanDefinition(SqlSessionTemplate.class); //将实例注册spring容器中 bs
		 * 等同于 id配置 dbf.registerBeanDefinition("sessionTemplate",
		 * sessionTemplateBuider.getBeanDefinition());
		 ***/
		// 第三步，factory 注入到spring上下文件中 id为sqlSessionFactory
		// SqlSession sqlSession=null;
		// try {
		// sqlSession = factory.getObject().openSession();
		// } catch (Exception e) {
		// e.printStackTrace();
		// }
		// Map paramMap=new HashMap<String,String>();
		// paramMap.put("id", "102");
		// paramMap.put("name", "测试2");
		// sqlSession.insert("commonMapper.TEST_INSERT", paramMap);
		//
		// paramMap.put("id", "102111111111111111111111111");
		// paramMap.put("name", "测试2");
		// sqlSession.insert("commonMapper.TEST_INSERT", paramMap);
//		Test test = (Test) SpringBeanUtil.getBean("test");
//		test.insertData();
//		insertTest();
		// System.out.println(map);

	}

	private void createXml() throws Exception {
		String xmlStr = "";
		xmlStr += "<?xml version=\"1.0\" encoding=\"UTF-8\" ?>\n";
		xmlStr += "<!DOCTYPE mapper \n PUBLIC \"-//mybatis.org//DTD Mapper 3.0//EN\"\n \"http://mybatis.org/dtd/mybatis-3-mapper.dtd\">";
		xmlStr += "<mapper namespace=\"commonMapper\">\n";
		CommonDBDao dao = (CommonDBDao) SpringBeanUtil.getBean("dbdao");
		List<String[]> sqlList = dao.getSqlList();
		if (sqlList != null && sqlList.size() > 0) {
			for (String[] sqlInfo : sqlList) {
				// 获取sql类型
				String flag = sqlInfo[1];
				if (flag == null) {
					throw new Exception("未获取到sql类型");
				}
				if (flag.equals("Q")) {
					xmlStr += "<select id=\""
							+ sqlInfo[0]
							+ "\" parameterType=\"map\" resultType=\"hashMap\">\n";
					xmlStr += sqlInfo[2] + "\n";
					xmlStr += "</select>\n";
				} else if (flag.equals("A")) {
					xmlStr += "<insert id=\"" + sqlInfo[0]
							+ "\" parameterType=\"map\">\n";
					xmlStr += sqlInfo[2] + "\n";
					xmlStr += "</insert>\n";
				} else if (flag.equals("U")) {
					xmlStr += "<update id=\"" + sqlInfo[0]
							+ "\" parameterType=\"map\">\n";
					xmlStr += sqlInfo[2] + "\n";
					xmlStr += "</update>\n";
				} else if (flag.equals("D")) {
					xmlStr += "<delete id=\"" + sqlInfo[0]
							+ "\" parameterType=\"map\">\n";
					xmlStr += sqlInfo[2] + "\n";
					xmlStr += "</delete>\n";
				}
			}
		}
		xmlStr += "</mapper>\n";
		ServerConfig serverConfig=new ServerConfig();
		String filePath = serverConfig.getValue("filePath");
		File file = new File(filePath);
		
		//文件不存在，则新建文件
		if(!file.exists()){
			file.createNewFile();
		}
		OutputStreamWriter fw = new OutputStreamWriter(new FileOutputStream(filePath),"UTF-8");
		//FileWriter fw = new FileWriter(filePath);
		fw.write(xmlStr);
		fw.flush();
		fw.close();
	}
}
