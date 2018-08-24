package com.tydic.lbs.util;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.Reader;
import java.util.Properties;
import java.util.Vector;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.jcraft.jsch.Channel;
import com.jcraft.jsch.ChannelSftp;
import com.jcraft.jsch.JSch;
import com.jcraft.jsch.JSchException;
import com.jcraft.jsch.Session;
import com.jcraft.jsch.SftpException;

/**
 * 
 * Title: SFTPUtil
 * Description: SFTP工具类
 * @author huangjg
 * @date 2016年3月31日
 */
public class SFTPUtil {
	private Logger logger = LoggerFactory.getLogger(SFTPUtil.class);

	/**
	 * 获取SFTP连接
	 * @Description: TODO
	 * @param host
	 * @param port
	 * @param username
	 * @param password
	 * @return    
	 * @throws
	 * @date 2016年3月31日
	 */
	public ChannelSftp connect(String host, int port, String username, String password) {
		ChannelSftp sftp = null;
		try {
			JSch jsch = new JSch();
			jsch.getSession(username, host, port);
			Session sshSession = jsch.getSession(username, host, port);
			System.out.println("Session created.");
			sshSession.setPassword(password);
			Properties sshConfig = new Properties();
			sshConfig.put("StrictHostKeyChecking", "no");
			sshSession.setConfig(sshConfig);
			sshSession.connect();
			System.out.println("Session connected.");
			System.out.println("Opening Channel.");
			Channel channel = sshSession.openChannel("sftp");
			channel.connect();
			sftp = (ChannelSftp) channel;
			System.out.println("Connected to " + host + ".");
		} catch (Exception e) {
			logger.error("连接sftp失败",e);
		}
		return sftp;
	}

	/**
	 * 
	 * @Description: 上传文件
	 * @param directory上传目录
	 * @param uploadFile本地文件目录
	 * @param sftp    
	 * @throws
	 * @date 2016年3月31日
	 */
	public void upload(String directory, String uploadFile, ChannelSftp sftp) {
		try {
			sftp.cd(directory);
			File file = new File(uploadFile);
			sftp.put(new FileInputStream(file), file.getName());
		} catch (Exception e) {
			e.printStackTrace();
		}
	}
	
	/**
	 * 
	 * @Description: 上传文件
	 * @param directory上传目录
	 * @param uploadFile本地文件目录
	 * @param sftp    
	 * @throws
	 * @date 2016年3月31日
	 */
	public void upload(String directory, File file, ChannelSftp sftp) {
		try {
			sftp.cd(directory);
			sftp.put(new FileInputStream(file), file.getName());
		} catch (Exception e) {
			e.printStackTrace();
		}
	}
	
	/**
	 * 
	 * @Description: 上传文件并重命名文件
	 * @param directory上传目录
	 * @param uploadFile本地文件目录
	 * @param sftp    
	 * @param 重命名后文件名称    
	 * @throws
	 * @date 2016年3月31日
	 */
	public void upload(String directory, String uploadFile, ChannelSftp sftp,String newFileName) {
		try {
			sftp.cd(directory);
			File file = new File(uploadFile);
			sftp.put(new FileInputStream(file), newFileName);
		} catch (Exception e) {
			e.printStackTrace();
		}
	}
	

	/**
	 * 
	 * @Description: 下载文件
	 * @param directory 下载目录
	 * @param downloadFile 下载的文件
	 * @param saveFile 存在本地的路径
	 * @param sftp    sftp连接
	 * @throws
	 * @date 2016年3月31日
	 */
	public void download(String directory, String downloadFile, String saveFile, ChannelSftp sftp) {
		try {
			sftp.cd(directory);
			File file = new File(saveFile);
			sftp.get(downloadFile, new FileOutputStream(file));
		} catch (Exception e) {
			e.printStackTrace();
		}
	}
	
	
	/**
	 * 
	 * @Description: 下载文件
	 * @param directory
	 * @param downloadFile
	 * @param sftp
	 * @return    
	 * @throws
	 * @date 2016年4月29日
	 */
	public Reader download(String directory, String downloadFile, ChannelSftp sftp) {
		try {
			sftp.cd(directory);
			return new InputStreamReader(sftp.get(downloadFile),"GB2312");
		} catch (Exception e) {
			e.printStackTrace();
		}
		return null;
	}
	
	
	/**
	 * 
	 * @Description: 下载文件
	 * @param directory
	 * @param downloadFile
	 * @param sftp
	 * @return    
	 * @throws
	 * @date 2016年4月29日
	 */
	public InputStream downloadFileToInputStream(String directory, String downloadFile, ChannelSftp sftp) {
		try {
			sftp.cd(directory);
			return sftp.get(downloadFile);
		} catch (Exception e) {
			e.printStackTrace();
		}
		return null;
	}
	
	/**
	 * 
	 * @Description: 删除文件
	 * @param directory  要删除文件所在目录
	 * @param deleteFile 要删除的文件
	 * @param sftp    	 sftp连接
	 * @throws
	 * @date 2016年3月31日
	 */
	public void delete(String directory, String deleteFile, ChannelSftp sftp) {
		try {
			sftp.cd(directory);
			sftp.rm(deleteFile);
		} catch (Exception e) {
			e.printStackTrace();
		}
	}
	
	/**
	 * 
	 * @Description: 列出目录下的文件
	 * @param directory 要列出的目录
	 * @param sftp   sftp连接
	 * @return
	 * @throws SftpException    
	 * @throws
	 * @date 2016年3月31日
	 */
	@SuppressWarnings("rawtypes")
	public Vector listFiles(String directory, ChannelSftp sftp) throws SftpException {
		return sftp.ls(directory);
	}
	
	
	 /**
	  *  
	  * @Description: 关闭连接
	  * @param 	sftp    
	  * @throws
	  * @date 2016年3月31日
	  */
    public void disconnect(ChannelSftp sftp) {  
        if(sftp != null){  
            if(sftp.isConnected()){  
                sftp.disconnect();  
                try {
					sftp.getSession().disconnect();
				} catch (JSchException e) {
					e.printStackTrace();
				}
            }else if(sftp.isClosed()){  
                System.out.println("sftp is closed already");  
            }  
        }  
  
    }  
   
    
	public static void main(String[] args) {
		SFTPUtil sf = new SFTPUtil();
		String host = "192.168.128.42";
		int port = 22;
		String username = "lpht";
		String password = "lpht";
		String directory = "/opt/lpht/";
		String uploadFile = "F:\\lbs_calc.properties";
//		String downloadFile = "lbs_calc.properties";
//		String saveFile = "H:\\lbs_calc.properties";
//		String deleteFile = "lbs_calc.properties";
		ChannelSftp sftp = sf.connect(host, port, username, password);
		sf.upload(directory, uploadFile, sftp);
		//sf.download(directory, downloadFile, saveFile, sftp);
		//sf.delete(directory, deleteFile, sftp);
		try {
			//sftp.cd(directory);
			//sftp.mkdir("ss");
			System.out.println("finished");
			if(sftp.isConnected()){  
                sftp.disconnect();  
            }
			System.exit(0);
		} catch (Exception e) {
			e.printStackTrace();
		}
	}
}
