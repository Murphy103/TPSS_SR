package com.tydic.lbs.util;



import java.io.BufferedReader;
import java.io.BufferedWriter;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.FileReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.OutputStreamWriter;
import java.io.PrintWriter;
import java.sql.ResultSet;
import java.util.ArrayList;
import java.util.List;

import com.jcraft.jsch.Logger;

/**   
 * CSV操作(导出和导入)
 *
 * @author 林计钦
 * @version 1.0 Jan 27, 2014 4:30:58 PM   
 */
public class CSVUtils {
    
    /**
     * 导出
     * 
     * @param file csv文件(路径+文件名)，csv文件不存在会自动创建
     * @param dataList 数据
     * @return
     */
    public static boolean exportCsv1(File file, List<String> dataList){
        boolean isSucess=false;
        
        FileOutputStream out=null;
        OutputStreamWriter osw=null;
        BufferedWriter bw=null;
        try {
            out = new FileOutputStream(file);
            osw = new OutputStreamWriter(out);
            bw =new BufferedWriter(osw);
            if(dataList!=null && !dataList.isEmpty()){
                for(String data : dataList){
                    bw.append(data).append("\r");
                }
            }
            isSucess=true;
        } catch (Exception e) {
            isSucess=false;
        }finally{
            if(bw!=null){
                try {
                    bw.close();
                    bw=null;
                } catch (IOException e) {
                    e.printStackTrace();
                } 
            }
            if(osw!=null){
                try {
                    osw.close();
                    osw=null;
                } catch (IOException e) {
                    e.printStackTrace();
                } 
            }
            if(out!=null){
                try {
                    out.close();
                    out=null;
                } catch (IOException e) {
                    e.printStackTrace();
                } 
            }
        }
        
        return isSucess;
    }
    
    
    /**
     * 分批向csv文件写入数据-游标读取数据
     * @param filepath
     * @param list
     * @return
     * @throws IOException
     */
    public static boolean exportCsvBYcur(File file,List<String[]> titleList, ResultSet rst) throws IOException{
        Boolean bool = false;
        String temp  = "";
        
        FileInputStream fis = null;
        InputStreamReader isr = null;
        BufferedReader br = null;
        FileOutputStream fos  = null;
        PrintWriter pw = null;
        try {
            //File file = new File(filepath);//文件路径(包括文件名称)
            //将文件读入输入流
           // fis = new FileInputStream(file);
           // isr = new InputStreamReader(fis);
           // br = new BufferedReader(isr);
        
            fos = new FileOutputStream(file);
            pw = new PrintWriter(fos);
            
            int titlelen=titleList.size();
            
            titlelen=5;
            
            System.out.println("the titlelen="+titlelen);
            
            if(titleList!=null && !titleList.isEmpty()){
            	String  titlestr="";
                StringBuffer buffer = new StringBuffer();
            	for(String[] data :titleList)
            	{
             	  titlestr=titlestr+data[0]+",";
            	}
            	 titlestr=titlestr.substring(0,titlestr.length()-1);
         	     buffer.append(titlestr).append("\r");
         	     pw.write(buffer.toString().toCharArray());
                 pw.flush();
              };
              
               StringBuffer buffer = new StringBuffer();
               
               int count=1;
               while (rst.next()) {//读取行数据
            	   String str="";
            	   for(int j=1;j<=titlelen;j++)
            	   {
            		   String    dataI=isNull(rst.getString(j)).replaceAll(",", "，");
           		       str=str+dataI+",";
            	   }
            	   buffer.append(str+" \r\n");//写入一行数据并回车换行
           	     if(count%10000==0)
           		 {
           	    	    pw.write(buffer.toString().toCharArray());
                        pw.flush();
                        buffer = new StringBuffer();
           		 }
     			  count++;
     		 }
               
               
            /*  if(dataList!=null && !dataList.isEmpty()){
            	for(int i=0;i<dataList.size();i++)
            	{
            		String[] data=dataList.get(i);
            		String str="";
            	   for(int j=0;j<data.length;j++)
            	   {
            		    String    dataI=isNull(data[j]).replaceAll(",", "，");
               		       str=str+dataI+",";
            	   }
            	      buffer.append(str+" \r\n");
            	    if((i+1)%10000==0)
            		{
            	    	 pw.write(buffer.toString().toCharArray());
                         pw.flush();
                         buffer = new StringBuffer();
            		}
            	}
             }*/
            
            pw.write(buffer.toString().toCharArray());
            pw.flush();
            bool = true;
        } catch (Exception e) {
            e.printStackTrace();
        }finally {
            //不要忘记关闭
            if (pw != null) {
                pw.close();
            }
            if (fos != null) {
                fos.close();
            }
            if (br != null) {
                br.close();
            }
            if (isr != null) {
                isr.close();
            }
            if (fis != null) {
                fis.close();
            }
        }
        return bool;
    }
    
    /**
     * 导出csv文件，传入查询结果的 List<String[]>
     * @param file
     * @param dataList-数据列表
     * titleList 标题列表
     * @return
     */
    public static boolean exportCsvArrData(File file,List<String[]> titleList, List<String[]> dataList){
        boolean isSucess=false;
        
        FileOutputStream out=null;
        OutputStreamWriter osw=null;
        BufferedWriter bw=null;
        try {
            out = new FileOutputStream(file);
            osw = new OutputStreamWriter(out,"GBK");
            bw =new BufferedWriter(osw);
            if(titleList!=null && !titleList.isEmpty()){
                /*for(String data : dataList){
                    bw.append(data).append("\r");
                }*/
            	for(String[] data :titleList)
            	{
            		
            		String  titlestr="";
             	   for(String dataI :data)
             	   {
             		  titlestr=titlestr+isNull(dataI)+",";
             	   }
             	    titlestr=titlestr.substring(0,titlestr.length()-1);
             	   System.out.println("the titlestr="+titlestr);//标题行数据
            		 bw.append(titlestr).append("\r");
            	    
            	}
            }
            
             if(dataList!=null && !dataList.isEmpty()){
            	for(String[] data :dataList)
            	{
            		String  str="";
            	   for(String dataI :data)
            	   {
            		   dataI=isNull(dataI).replaceAll(",", "，");
            		   str=str+dataI+",";
            	   }
            	    str=str.substring(0,str.length()-1);
            	   
            		String datastr=String.valueOf(data);
            		 bw.append(str).append("\r");
            	    System.out.println("the datastr="+datastr);//标题行数据
            	}
             }
            
            
            
            isSucess=true;
        } catch (Exception e) {
            isSucess=false;
        }finally{
            if(bw!=null){
                try {
                    bw.close();
                    bw=null;
                } catch (IOException e) {
                    e.printStackTrace();
                } 
            }
            if(osw!=null){
                try {
                    osw.close();
                    osw=null;
                } catch (IOException e) {
                    e.printStackTrace();
                } 
            }
            if(out!=null){
                try {
                    out.close();
                    out=null;
                } catch (IOException e) {
                    e.printStackTrace();
                } 
            }
        }
        
        return isSucess;
    }
    
    
    public static boolean exportCsvArrData(File file,String titleName, List<String[]> dataList){
        boolean isSucess=false;
        
        FileOutputStream out=null;
        OutputStreamWriter osw=null;
        BufferedWriter bw=null;
        try {
            out = new FileOutputStream(file);
            osw = new OutputStreamWriter(out,"GBK");
            bw =new BufferedWriter(osw);
            if(titleName != null && !titleName.equals("")){
            	bw.append(titleName).append("\r");
            	
            }
             if(dataList!=null && !dataList.isEmpty()){
            	for(String[] data :dataList)
            	{
            		String  str="";
            	   for(String dataI :data)
            	   {
            		   dataI=isNull(dataI).replaceAll(",", "，");
            		   str=str+dataI+",";
            	   }
            	    str=str.substring(0,str.length()-1);
            	   
            		String datastr=String.valueOf(data);
            		 bw.append(str).append("\r");
            	    System.out.println("the datastr="+datastr);//标题行数据
            	}
             }
            
            
            
            isSucess=true;
        } catch (Exception e) {
        	e.printStackTrace();
            isSucess=false;
        }finally{
            if(bw!=null){
                try {
                    bw.close();
                    bw=null;
                } catch (IOException e) {
                    e.printStackTrace();
                } 
            }
            if(osw!=null){
                try {
                    osw.close();
                    osw=null;
                } catch (IOException e) {
                    e.printStackTrace();
                } 
            }
            if(out!=null){
                try {
                    out.close();
                    out=null;
                } catch (IOException e) {
                    e.printStackTrace();
                } 
            }
        }
        
        return isSucess;
    }
    
    
    
    /**
     * 导入
     * 
     * @param file csv文件(路径+文件)
     * @return
     */
    public static List<String> importCsv(File file){
        List<String> dataList=new ArrayList<String>();
        
        BufferedReader br=null;
        try { 
            br = new BufferedReader(new FileReader(file));
            String line = ""; 
            while ((line = br.readLine()) != null) { 
                dataList.add(line);
            }
        }catch (Exception e) {
        }finally{
            if(br!=null){
                try {
                    br.close();
                    br=null;
                } catch (IOException e) {
                    e.printStackTrace();
                }
            }
        }
 
        return dataList;
    }
    
    //--新建main函数测试导出
    
    public static void main(String args[]) { 
        System.out.println("Hello World!"); 
        
        
        List<String[]> titleList=new ArrayList<String[]>();
            titleList.add(new String[]{"列1,列2,列3"});
       
        
        
        List<String[]> dataList=new ArrayList<String[]>();
        dataList.add(new String[]{"1","张三,444","男"});
        dataList.add(new String[]{"2","李四","男,测试222"});
        dataList.add(new String[]{"3","小红","女"});
        boolean isSuccess=CSVUtils.exportCsvArrData(new File("E:/ljq.csv"),"列1,列2,列3", dataList);
        System.out.println(isSuccess);
    } 
  
    public static String isNull(String str){
  		if(str==null||str.equals("")||str.equalsIgnoreCase("null")){
  			return "";
  		}else{
  			return str;
  		}
  	}
    
}