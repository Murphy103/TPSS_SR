package com.tydic.lbs.entity;

import org.apache.commons.lang.builder.ToStringBuilder;

 
public class Tree implements Comparable{
	private Long treeid;
	private String treename;
	private String href;
	private boolean leaf;
	private Long preid;
	private String type;
	private String image;
	private boolean checked;
	
	public boolean isChecked() {
		return checked;
	}
	public void setChecked(boolean checked) {
		this.checked = checked;
	}
	
	public String getImage() {
		return image;
	}
	public void setImage(String image) {
		this.image = image;
	}
 
	public Long getTreeid() {
		return treeid;
	}
	public void setTreeid(Long treeid) {
		this.treeid = treeid;
	}
	public String getTreename() {
		return treename;
	}
	public void setTreename(String treename) {
		this.treename = treename;
	}
	public String getHref() {
		return href;
	}
	public void setHref(String href) {
		this.href = href;
	}
	public boolean isLeaf() {
		return leaf;
	}
	public void setLeaf(boolean leaf) {
		this.leaf = leaf;
	}
	
	@Override
	public String toString() {
		return ToStringBuilder.reflectionToString(this);
	}
	public Long getPreid() {
		return preid;
	}
	public void setPreid(Long preid) {
		this.preid = preid;
	}
	public String getType() {
		return type;
	}
	public void setType(String type) {
		this.type = type;
	}
	public int compareTo(Object o) {
		// TODO Auto-generated method stub
		return 0;
	}
}
