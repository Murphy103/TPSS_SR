var nowurl  = document.location.href;
nowurl = nowurl.substring(0,nowurl.indexOf("html"));

//初始化
$(document).ready(function() {
	mini.parse();
	//生成datagrid的field
	initTableHead("data_grid","SALE_REWARD_SEND2TPSS",true);
	mini.get('BILLING_CYCLE_ID').select(0);
});


/**
 * 查询推送批次
 */
function queryData(){
	mini.parse();
	var param = {"BATCH_NO":mini.get("BATCH_NO").getValue(),
			 	 "BILLING_CYCLE_ID":mini.get("BILLING_CYCLE_ID").getValue(),
				 "START_DATE":mini.get("START_DATE").getFormValue(),
				 "END_DATE":mini.get("END_DATE").getFormValue(),
				 "service_name":"SALE_REWARD_SEND2TPSS_Q"};
	
	var url = nowurl+'ControlServlet.do?serviceName=commonServlet&methodName=gridValue_rows';
	var grid = mini.get("data_grid");
	grid.setUrl(url);
	grid.load(param);

}


/**
 * 添加批次
 */
function addBatch() {		
   
	var addObj = new Object();
	addObj['oper_flag'] = 'A';
	addObj['service_name'] = 'SALE_REWARD_SEND2TPSS_A';
	
	showAddDialog("批次新增 ",800,300,Globals.baseHtmlUrl.SEND_TO_TPSS_ADD,
			function callback(data){
	            if (data != undefined && data.success == systemVar.SUCCESS) {
	            	queryData();
	            }else if(data == systemVar.CANCEL || data == systemVar.CLOSE){
	            	
	            }else{
	            	showErrorMessageAlter(data.errormsg);
	                return false;
	            }
	    },addObj);
}


/**
 * 推送佣金
 */
function send2TPSS(){
	var rows = mini.get("data_grid").getSelecteds();
	
	if(rows.length == 0){
		mini.alert("请选中一行进行推送!");
		return;
	}
	
	if(rows[0].STATE =='待推送'){
		var params = new Object();
		params["BATCH_NO"] = rows[0].BATCH_NO;
		params["BILLING_CYCLE_ID"] = rows[0].BILLING_CYCLE_ID;
		params["service_name"] = "SALE_REWARD_SEND2TPSS_BATCH_CALL";
		params["oper_flag"] = 'U';
		showConfirmMessageAlter("确定推送对应报帐批次？",function ok(){
		        getJsonDataByPost(Globals.baseActionUrl.ACTION_OPERATION_URL,params,"推送报帐批次至佣金系统",
		            function(result){
		        		if (result.success == systemVar.SUCCESS) {
		        			showMessageAlter("报帐批次推送成功!");
		        			queryData();
			            }
		        		else{
		        			showErrorMessageAlter(result.errormsg);
		    			}
		            },null);
		    });
	}else{
		showMessageAlter("只有状态为待推送的数据才可推送!");
	}
}

/**
 * 删除发送批次
 */
function delBatch(){
	var rows = mini.get("data_grid").getSelecteds();
	
	if(rows.length == 0){
		mini.alert("请选中一行进行删除!");
		return;
	}
	
	var ids = "";
	
	if(rows[0].STATE =='待推送'){
		var params = new Object();
		params["BATCH_NO"] = rows[0].BATCH_NO;
		params["service_name"] = "SALE_REWARD_SEND2TPSS_D";
		params["oper_flag"] = 'D';
		showConfirmMessageAlter("确定删除对应报帐批次？",function ok(){
		        getJsonDataByPost(Globals.baseActionUrl.ACTION_OPERATION_URL,params,"删除报帐批次",
		            function(result){
		        		if (result.success == systemVar.SUCCESS) {
		        			showMessageAlter("删除报帐批次成功!");
		        			queryData();
			            }
		        		else{
		        			showErrorMessageAlter(result.errormsg);
		    			}
		            },null);
		    });
	}else{
		showMessageAlter("只有状态为待推送的数据才可删除!");
	}
}


/**
 * 导入店员
 */
/*function importSate(){
	var addObj = new Object();
	
	showAddDialog("状态导入 ",600,180,Globals.baseHtmlUrl.SEND_TO_TPSS_CALLBACK,
			function callback(data){
	            if (data != undefined && data.success == systemVar.SUCCESS) {
	            	showMessageAlter("导入状态成功!");
	            	queryData();
	            }else if(data == systemVar.CANCEL || data == systemVar.CLOSE){
	            	
	            }else{
	            	showErrorMessageAlter(data.errormsg);
	                return false;
	            }
	    },addObj);
}*/

/**
 * 同步报账状态
 */
function synState(){
	var rows = mini.get("data_grid").getSelecteds();
	if(rows.length == 0){
		mini.alert("请选中至少一行进行同步报账状态!");
		return;
	}
	var batchArr = new Array();
	for(var i=0; i<rows.length;i++){
		batchArr.push(""+rows[i].BATCH_NO);
	}
	var batchIds = batchArr.join(",");
	var params = new Object();
	params["BATCH_NO"] = batchIds;
	params["service_name"] = "TPSS_REWARD_STATE_SYN";
	params["oper_flag"] = 'U';
	showConfirmMessageAlter("确定同步报账状态？",function ok(){
	        getJsonDataByPost(Globals.baseActionUrl.ACTION_OPERATION_URL,params,"同步报账状态",
	            function(result){
	        		if (result.success == systemVar.SUCCESS) {
	        			showMessageAlter("同步报账状态成功!");
	        			queryData();
		            }
	        		else{
	        			showErrorMessageAlter(result.errormsg);
	    			}
	            },null);
	    });
}
