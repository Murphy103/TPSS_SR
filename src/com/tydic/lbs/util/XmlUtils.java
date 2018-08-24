package com.tydic.lbs.util;



import java.io.FileInputStream;
import java.io.IOException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;

import org.dom4j.Document;
import org.dom4j.DocumentException;
import org.dom4j.DocumentHelper;
import org.dom4j.Element;

public class XmlUtils {
	
	public static Map<String, Object> Dom2Map(String text) {
		Document doc;
		try {
			doc = DocumentHelper.parseText(text);
		} catch (DocumentException e) {
			return null;
		}
		return Dom2Map(doc);
	}
	
	@SuppressWarnings("unchecked")
	public static Map<String, Object> Dom2Map(Document doc) {
		Map<String, Object> map = new HashMap<String, Object>();
		if (doc == null)
			return map;
		Element root = doc.getRootElement();
		for (Iterator iterator = root.elementIterator(); iterator.hasNext();) {
			Element e = (Element) iterator.next();
			List list = e.elements();
			if (list.size() > 0) {
				map.put(e.getName(), Dom2Map(e));
			} else
				map.put(e.getName(), e.getText());
		}
		return map;
	}

	@SuppressWarnings("unchecked")
	public static Map Dom2Map(Element e) {
		Map map = new HashMap();
		List list = e.elements();
		if (list.size() > 0) {
			for (int i = 0; i < list.size(); i++) {
				Element iter = (Element) list.get(i);
				List mapList = new ArrayList();

				if (iter.elements().size() > 0) {
					Map m = Dom2Map(iter);
					if (map.get(iter.getName()) != null) {
						Object obj = map.get(iter.getName());
						if (!obj.getClass().getName()
								.equals("java.util.ArrayList")) {
							mapList = new ArrayList();
							mapList.add(obj);
							mapList.add(m);
						}
						if (obj.getClass().getName()
								.equals("java.util.ArrayList")) {
							mapList = (List) obj;
							mapList.add(m);
						}
						map.put(iter.getName(), mapList);
					} else
						map.put(iter.getName(), m);
				} else {
					if (map.get(iter.getName()) != null) {
						Object obj = map.get(iter.getName());
						if (!obj.getClass().getName()
								.equals("java.util.ArrayList")) {
							mapList = new ArrayList();
							mapList.add(obj);
							mapList.add(iter.getText());
						}
						if (obj.getClass().getName()
								.equals("java.util.ArrayList")) {
							mapList = (List) obj;
							mapList.add(iter.getText());
						}
						map.put(iter.getName(), mapList);
					} else
						map.put(iter.getName(), iter.getText());
				}
			}
		} else
			map.put(e.getName(), e.getText());
		return map;
	}
	
	public static void main(String[] args) throws IOException,
	   DocumentException {
		
		String classPath = ClassLoader.getSystemResource("").getPath();
		FileInputStream fis = new FileInputStream(classPath+"rowkey");
		byte[] b = new byte[fis.available()];
		
		fis.read(b);
		System.out.println(new String(b));
//		
//		FileInputStream fis = new FileInputStream("/Users/apple/Documents/work/a.xml");
//		  byte[] b = new byte[fis.available()];
//		  fis.read(b);
//		  String str = new String(b);
//		  
//		  Document doc = DocumentHelper.parseText(str);
//		  
//		  System.out.println(doc.asXML());
//
//		  long beginTime = System.currentTimeMillis();
//		  
//		  Map<String, Object> map = XmlUtils.Dom2Map(doc);
//
//		  System.out.println(map.toString());
//		  
//		  System.out.println("Use time:"+(System.currentTimeMillis()-beginTime));

		 }
}
