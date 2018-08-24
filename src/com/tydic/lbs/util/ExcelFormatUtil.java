package com.tydic.lbs.util;

import jxl.format.Alignment;
import jxl.format.Border;
import jxl.format.BorderLineStyle;
import jxl.format.VerticalAlignment;
import jxl.write.Label;
import jxl.write.NumberFormats;
import jxl.write.WritableCellFormat;
import jxl.write.WritableFont;
import jxl.write.WriteException;

public  class  ExcelFormatUtil {
	WritableCellFormat wcf_title;
	WritableCellFormat wcf;
	WritableCellFormat wcf_number;
	
	public void init()throws WriteException{
		wcf_title=titleFormat();
		wcf=commonFormat();
		wcf_number=numberFormat();
	}
	public  WritableCellFormat titleFormat() throws WriteException{
		// 用于标题
		wcf_title = new WritableCellFormat(new WritableFont(WritableFont.createFont("宋体"), WritableFont.DEFAULT_POINT_SIZE,
				WritableFont.BOLD));
		wcf_title.setBorder(Border.ALL, BorderLineStyle.THIN);// 线条
		wcf_title.setVerticalAlignment(VerticalAlignment.CENTRE);// 垂直对齐
		wcf_title.setAlignment(Alignment.CENTRE);// 水平对齐
		wcf_title.setWrap(false);// 是否换行
		wcf_title.setBackground(jxl.format.Colour.LIGHT_TURQUOISE);
		return wcf_title;
		 
	}
	
	public  WritableCellFormat commonFormat() throws WriteException{
		//正文
		wcf = new WritableCellFormat(new WritableFont(WritableFont.createFont("宋体"), WritableFont.DEFAULT_POINT_SIZE,
				WritableFont.NO_BOLD));
		wcf.setBorder(Border.ALL, BorderLineStyle.THIN);// 线条
		wcf.setVerticalAlignment(VerticalAlignment.CENTRE);// 垂直对齐
		wcf.setWrap(false);// 是否换行
		return wcf;
	}
	
	public  WritableCellFormat numberFormat() throws WriteException{
		//数值
	    wcf_number = new WritableCellFormat(NumberFormats.THOUSANDS_INTEGER);
		wcf_number.setBorder(Border.ALL, BorderLineStyle.THIN);// 线条
		wcf_number.setAlignment(Alignment.RIGHT);
	 
		return wcf_number;
	}
	
	//设置单元格值
	public  jxl.write.WritableCell getFormatData(int i,int j,String data,String colType,boolean isTitle) throws WriteException{
		if(data==null){
			 return new Label(i, j,"",wcf);
		}
		if(isTitle){
			return new Label(i, j,data,wcf_title);
		}
		if(StringCommon.isNumber(data)&&"charge".equals(colType)){
			 return new jxl.write.Number(i, j,
					 Double.parseDouble(data),wcf_number);
		 }else if(StringCommon.isPercent(data)&&"percent".equals(colType)){
 			 WritableCellFormat perFormat = new WritableCellFormat(NumberFormats.PERCENT_FLOAT);
 			 perFormat.setBorder(Border.ALL, BorderLineStyle.THIN);// 线条
 			 perFormat.setAlignment(Alignment.RIGHT);
			 return new jxl.write.Number(i, j,
					 Double.parseDouble(data.replace("%", ""))/100,perFormat);
		 } else{
		 
			 return new Label(i, j,data,wcf);
		 }
	}
	
	public WritableCellFormat getWcf_title() {
		return wcf_title;
	}
	public void setWcf_title(WritableCellFormat wcf_title) {
		this.wcf_title = wcf_title;
	}
	public WritableCellFormat getWcf() {
		return wcf;
	}
	public void setWcf(WritableCellFormat wcf) {
		this.wcf = wcf;
	}
	public WritableCellFormat getWcf_number() {
		return wcf_number;
	}
	public void setWcf_number(WritableCellFormat wcf_number) {
		this.wcf_number = wcf_number;
	}
	
}
