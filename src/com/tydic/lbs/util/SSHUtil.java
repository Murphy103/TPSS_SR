package com.tydic.lbs.util;

import java.io.BufferedReader;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.OutputStream;

import com.jcraft.jsch.Channel;
import com.jcraft.jsch.ChannelExec;
import com.jcraft.jsch.ChannelSftp;
import com.jcraft.jsch.JSch;
import com.jcraft.jsch.Session;

public class SSHUtil {
	 
	public static Session connect(String host, String user, String pwd) throws Exception{
 
		Session session =null;
		 
		JSch jsch = new JSch();
		session = jsch.getSession(user, host, 22);
		session.setPassword(pwd);
		session.setConfig("StrictHostKeyChecking", "no");
		session.connect(); 
		 
		return session;
	}
	public static String[] sshExecute(Session session,
			String command) {
		Channel channel=null;
		StringBuffer sb = new StringBuffer();
		String ret="1";
		String lastline="";
		try {
			  
			channel = session.openChannel("exec");
		
			((ChannelExec) channel).setCommand(command);
			InputStream in = channel.getInputStream();
			
			channel.connect();
			BufferedReader reader = new BufferedReader(new InputStreamReader(in,"utf-8"));  
	        String buf = null;  
	        while ((buf = reader.readLine()) != null)  
	        {  
	            System.out.println(buf);  
	            sb.append(buf+"\n");
	            lastline=buf;
	        }  
	        reader.close();  
	        ret=String.valueOf(channel.getExitStatus());

			channel.disconnect();
		} catch (Exception e) {
			e.printStackTrace();
			channel.disconnect();
		}
		return new String[]{ret,sb.toString(),lastline};

	}
	
	public static String getTsfShellRet(String msg)
	{
		if("".equals(msg)){
			return "操作失败！";
		}
		String[] ret=msg.split(":");
		if(ret.length==2){
			if("0".equals(ret[0])){
				return ret[0];
			}else{
				return ret[1];
			}
		}
		return msg;
			
	}
	
	/**
	 * 利用JSch包实现远程主机SHELL命令执行
	 * @param ip 主机IP
	 * @param user 主机登陆用户名
	 * @param psw  主机登陆密码
	 * @param port 主机ssh2登陆端口，如果取默认值，传-1
	 * @param privateKey 密钥文件路径
	 * @param passphrase 密钥的密码
	 */
	public static String sshShell(Session session,String shellCommand) throws Exception{
 	    Channel channel = null;
	  
	    try {
	        //创建sftp通信通道
	        channel = (Channel) session.openChannel("shell");
	        channel.connect(1000);
	 
	        //获取输入流和输出流
	        InputStream instream = channel.getInputStream();
	        OutputStream outstream = channel.getOutputStream();
	         
	        //发送需要执行的SHELL命令，需要用\n结尾，表示回车
 	        outstream.write(shellCommand.getBytes());
	        outstream.flush();
	 
	 
	        //获取命令执行的结果
	        if (instream.available() > 0) {
	            byte[] data = new byte[instream.available()];
	            int nLen = instream.read(data);
	             
	            if (nLen < 0) {
	                throw new Exception("network error.");
	            }
	             
	            //转换输出结果并打印出来
	            String temp = new String(data, 0, nLen,"utf-8");
	            return temp;
	        }
	        outstream.close();
	        instream.close();
	    } catch (Exception e) {
	        e.printStackTrace();
	    } finally {
	        session.disconnect();
	        channel.disconnect();
	    }
	    return "";
	}
	
	/**
	 * 利用JSch包实现SFTP下载、上传文件
	 * @param ip 主机IP
	 * @param user 主机登陆用户名
	 * @param psw  主机登陆密码
	 * @param port 主机ssh2登陆端口，如果取默认值，传-1
	 */
	public static int sshSftp(Session session,String uploadPath,String localFilePath,String fileName) throws Exception{
 	    Channel channel = null;
 
	         
	    try {
	        //创建sftp通信通道
	        channel = (Channel) session.openChannel("sftp");
	        channel.connect(1000);
	        ChannelSftp sftp = (ChannelSftp) channel;
	         
	         
	        //进入服务器指定的文件夹
	        sftp.cd(uploadPath);
	        
	        //以下代码实现从本地上传一个文件到服务器，如果要实现下载，对换以下流就可以了
	        
	        OutputStream outstream = sftp.put(fileName);
	        InputStream instream = new FileInputStream(new File(localFilePath));
	         
	        byte b[] = new byte[1024];
	        int n;
	        while ((n = instream.read(b)) != -1) {
	            outstream.write(b, 0, n);
	        }
	         
	        outstream.flush();
	        outstream.close();
	        instream.close();
	        
	    } catch (Exception e) {
	        e.printStackTrace();
	    } finally {
 	        channel.disconnect();
	    }
	    return channel.getExitStatus();
	}
	
	/** 
	* 下载单个文件 
	* 
	* @param directory 
	*            下载目录 
	* @param downloadFile 
	*            下载的文件 
	* @param saveDirectory 
	*            存在本地的路径 
	*            
	* @throws Exception      
	*/ 
	public static void download(Session session,String directory, String downloadFile, String saveDirectory) throws Exception 
	{ 
	String saveFile = saveDirectory + "//" + downloadFile; 
	//创建sftp通信通道
	Channel channel = null;
    channel = (Channel) session.openChannel("sftp");
    channel.connect(1000);
    ChannelSftp sftp = (ChannelSftp) channel; 
	sftp.cd(directory); 
	File file = new File(saveFile); 
	sftp.get(downloadFile, new FileOutputStream(file)); 
	
	} 


	

}
