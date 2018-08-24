package org.jasig.cas.client.util;

import java.util.Scanner;

import org.springframework.context.ApplicationContext;
import org.springframework.context.support.ClassPathXmlApplicationContext;

import com.tydic.lbs.frame.MybatisInitFactory;

public class SpringInitTest {

	public static void main(String[] args) {
		// TODO Auto-generated method stub
		Thread thread1 = new Thread(new Runnable() {
			
			@Override
			public void run() {
				ApplicationContext ctx=new ClassPathXmlApplicationContext("applicationContext.xml");
				while(true){
					
				}
			}
		});
		thread1.start();
		Thread thread2 = new Thread(new Runnable() {
			
			@Override
			public void run() {
				Scanner sc = new Scanner(System.in); 
				System.out.println("请输出：");
				while (true) { 
                    String line = sc.nextLine(); 
                    try {
						new MybatisInitFactory().initMybatis();
					} catch (Exception e) {
						// TODO Auto-generated catch block
						e.printStackTrace();
					}
                    if (line.equals("exit")) break; 
                    System.out.println(">>>" + line); 
            } 
			}
		});
		thread2.start();
	}
	
	
}
