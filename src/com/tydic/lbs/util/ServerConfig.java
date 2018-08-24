package com.tydic.lbs.util;

import java.io.IOException;
import java.io.InputStream;
import java.util.Properties;
import java.util.logging.Logger;



import org.apache.batik.ext.awt.image.codec.PropertyUtil;
import org.apache.commons.beanutils.PropertyUtils;
import org.apache.log4j.PropertyConfigurator;

public class ServerConfig {
	public static Properties properties = null;
	private static String configFile = "application.properties";
	public static Properties kog4jproperties = null;
	private static String LOG_4J_FILE = "LOG_4J_FILE";
	public static Logger logger = Logger.getLogger(ServerConfig.class.getName());
	public ServerConfig() throws IOException {
		try {
			init();
		} catch (Exception e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
	}

	public void init() throws IOException,Exception {
		if (properties == null) {
			properties = new Properties();
			try {
				InputStream in = PropertyUtil.class.getClassLoader().getResourceAsStream(configFile);
				properties.load(in);
				in.close();
//				String log4jconfigFile = getValue(log_file);
//				initLog4j(log4jconfigFile);
				// label = new String
				// (properties.getProperty(statuskey).getBytes("ISO-8859-1"),"GBK");
			} catch (IOException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}

		}
	}

	public void initLog4j(String log4jconfigFile) throws IOException {
		if (kog4jproperties == null) {
			kog4jproperties = new Properties();
			InputStream log4jin = PropertyUtils.class.getClassLoader()
					.getResourceAsStream(log4jconfigFile);
			kog4jproperties.load(log4jin);
			PropertyConfigurator.configure(kog4jproperties);
		}
	}

	public String getValue(String proName)   {
		if (properties.getProperty(proName) == null)
			return proName;
		return properties.getProperty(proName).toString();
	}
}
