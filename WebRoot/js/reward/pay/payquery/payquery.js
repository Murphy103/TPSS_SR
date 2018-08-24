var nowurl  = document.location.href;
nowurl = nowurl.substring(0,nowurl.indexOf("html"));
var data_state = [{"id":1,"text":"未报账"},
                  {"id":2,"text":"已报账"},
                  {"id":3,"text":"已支付"}]
var JsVar = new Object();
$(function(){
	var screenheight=screen.availHeight;
	var styleElement = document.getElementById('payquery_grid');
	styleElement.style.height = screenheight*0.65+'px';
	
	 mini.parse();
	initTableHead("payquery_grid","SALE_REWARD_SNED_Q",true);
	JsVar["queryFrom"] = new mini.Form("queryFrom");
	JsVar["payquery_grid"] = mini.get("payquery_grid");//取得事件表格
	
	
	var date = new Date();
	var nowDay=date.getFullYear()+"-"+(date.getMonth()+1)+"-"+date.getDate();;//今天
	var firstDay=date.getFullYear()+"-"+(date.getMonth()+1)+"-1";//本月第一天
	  
	
	  //mini.get("#EFF_DATE").setValue(firstDay);
	 // mini.get("#EXP_DATE").setValue(nowDay);
	  
	   
	

	
	
	//-加载渠道大小类树
	var url = nowurl+'ControlServlet.do?serviceName=commonServlet&methodName=getTreeSelect&service_name=CHL_TREE';
	var privilege = mini.get("PRIVILEGE");
	 privilege.load(url);
	 
	 //--加载结算账期
	// var url = nowurl+'ControlServlet.do?serviceName=commonServlet&methodName=gridValue&service_name=SETTLECYCLE';
	// var settle_cycle = mini.get("SETTLE_CYCLE");
	  //settle_cycle.load(url);
	  
	  //mini.get("#SETTLE_CYCLE").select(0);//默认选中第一个
	  
	  //mini.get("#PAY_AGENT_ID").select(0);
	  
	  //--加载支付代理商
	  /*var url = nowurl+'ControlServlet.do?serviceName=commonServlet&methodName=gridValue&service_name=SEL_DETAIL_AGENT';
		var pay_agent_name = mini.get("PAY_AGENT_NAME");
		pay_agent_name.load(url);*/
	
	
});



function queryData(){
	JsVar["queryFrom"].validate();
    if (JsVar["queryFrom"].isValid() == false){
        return;
    }
//    if(mini.get("PRIVILEGE").getValue()=='' || mini.get("PRIVILEGE").getValue()==null){
//    	showWarnMessageAlter("渠道大小类为必选项!");
//    	return;
//    }
	mini.parse();
	var param = {"PRIVILEGE":mini.get("PRIVILEGE").getValue(),
			 	"SETTLE_CYCLE":mini.get("SETTLE_CYCLE").getValue(),
			 	"CHANNEL_NAME":mini.get("CHANNEL_NAME").getValue(),
				 "OPERATORS_NAME":mini.get("OPERATORS_NAME").getValue(),
				 "YZF_ACCOUNT":mini.get("YZF_ACCOUNT").getValue(),
				 "EFF_DATE":mini.get("EFF_DATE").getText(),
				 "EXP_DATE":mini.get("EXP_DATE").getText(),
				 "STAFF_ID":mini.get("STAFF_ID").getValue(),
				 "STAFF_NAME":mini.get("STAFF_NAME").getValue(),
				 "STATE":mini.get("STATE").getValue(),
				 "BATCH_NO":mini.get("BATCH_NO").getValue(),
				 "service_name":"SALE_REWARD_SNED_Q"};
	var url = nowurl+'ControlServlet.do?serviceName=commonServlet&methodName=gridValue_rows';
	var grid = mini.get("payquery_grid");
	grid.setUrl(url);
	grid.load(param);

}

function exportData(){
	JsVar["queryFrom"].validate();
    if (JsVar["queryFrom"].isValid() == false){
        return;
    }
	 mini.parse();
	 
	 //--弹出确认提示框--
	 
		var param = {"PRIVILEGE":mini.get("PRIVILEGE").getValue(),
				 "SETTLE_CYCLE":mini.get("SETTLE_CYCLE").getValue(),
				 "CHANNEL_NAME":mini.get("CHANNEL_NAME").getValue(),
				 "OPERATORS_NAME":mini.get("OPERATORS_NAME").getValue(),
				 "YZF_ACCOUNT":mini.get("YZF_ACCOUNT").getValue(),
				 "EFF_DATE":mini.get("EFF_DATE").getText(),
				 "EXP_DATE":mini.get("EXP_DATE").getText(),
				 "STAFF_ID":mini.get("STAFF_ID").getValue(),
				 "STAFF_NAME":mini.get("STAFF_NAME").getValue(),
				 "STATE":mini.get("STATE").getValue(),
				 "BATCH_NO":mini.get("BATCH_NO").getValue(),
				 "service_name":"SALE_REWARD_SEND_EXP",
				 "file_name":"奖励支付导出"
	 	  };
	 
 	mini.confirm("支付清单只会导出状态为报账完成的数据！", "提示信息",
             function (action) {
                 if (action == "ok") {//确定
                	 exportExcel(param);
                 } else {
                     window.close();
                 }
             }
         );
 
}


	/**
	 * 支付状态导入
	 */
	function importData(){
	var addObj = new Object();
	addObj['service_name'] = 'PAY_STATE_CALLBACK';
	
	var serviceArr = new Array();
	var serviceObj = new Object();
	serviceObj["service_name"] = "PAY_STATE_CALLBACK";
	serviceObj["oper_flag"] = "D";
	serviceArr[0] = serviceObj;
	addObj['service_name_pre'] ="";
	
	showAddDialog("文件导入 ",600,180,Globals.baseHtmlUrl.PAY_STATE_CALLBACK,
			function callback(data){
	            if (data != undefined && data.success == systemVar.SUCCESS) {
	            	showMessageAlter("导入成功!");
	            }else if(data == systemVar.CANCEL || data == systemVar.CLOSE){
	            	
	            }else{
	            	showErrorMessageAlter(data.errormsg);
	                return false;
	            }
	    },addObj);
}
	/**
	 * 选择归属代理商
	 */
	function selectagent(){
		var channelCode=mini.get("PRIVILEGE").getValue();
		var url =nowurl+"html/reward/dataManage/shopassistantmanage/assistantinfomanage/select-agent.html?channelCode="+channelCode;
		showAddDialog("归属代理商",890,550,url,
		        function destroy(data){
					if(data !="close" && data !=null){
						mini.get("OPERATORS_NAME").setValue(data.agentName);
						$("#agentCode").val(data.agentCode);
						$("#agentId").val(data.agentId);
					}
					
		    });
	}
	/**
	 * 选择归属门店
	 */
	function selectchannel(){
		var url =nowurl+"html/reward/dataManage/shopassistantmanage/assistantinfomanage/select-channel.html?agentId="+$("#agentId").val();
		showAddDialog("归属门店",890,550,url,
		        function destroy(data){
					if(data !="close" && data !=null){
						mini.get("CHANNEL_NAME").setValue(data.channelName);
						$("#channelCode").val(data.channelCode);
					}
					
		    });
	}
	function clearagent(){
		mini.get("OPERATORS_NAME").setValue('');
		$("#agentCode").val('');
		$("#agentId").val('');
	}

	function clearchannel(){
		mini.get("CHANNEL_NAME").setValue('');
		$("#channelCode").val('');
	}
