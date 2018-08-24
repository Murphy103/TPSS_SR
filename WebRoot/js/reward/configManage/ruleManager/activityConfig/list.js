

//初始化
$(document).ready(function() {
	mini.parse();
	
	//生成datagrid的field
	initTableHead("activity_grid","ACTIVITY_SELECT",true);
	
});

/**
 * 查询活动列表
 */
function queryData(){
	mini.parse();
	var param = {"LATN_ID":mini.get("LATN_ID").getValue(),
				 "ACTIVITY_NAME":mini.get("ACTIVITY_NAME").getValue(),
				 "ACTIVITY_TYPE":mini.get("ACTIVITY_TYPE").getValue(),
				 "STATUS_CD":mini.get("STATUS_CD").getValue(),
				 "service_name":"ACTIVITY_SELECT"};
	
	var url = Globals.baseActionUrl.SELECT_OPERATION_URL;
	var grid = mini.get("activity_grid");
	grid.setUrl(url);
	grid.load(param);

}


/**
 * 添加活动
 */
function addActivity() {		
   
	var addObj = new Object();
	
	showAddDialog("新增活动",1200,600,Globals.baseHtmlUrl.ACTIVITY_RULE_OPERATION_URL,
			function callback(data){
	            if (data != undefined && data.success == systemVar.SUCCESS) {
	            	showMessageAlter("添加活动成功!");
	            	queryData();
	            }else if(data == systemVar.CANCEL || data == systemVar.CLOSE){
	            	
	            }else{
	            	showErrorMessageAlter(data.errormsg);
	                return false;
	            }
	    },addObj);
}

/**
 * 修改活动
 */
function modifyActivity() {
	var rows = mini.get("activity_grid").getSelecteds();
	
	if(rows.length != 1){
		showErrorMessageAlter("请选择一个活动修改!");
		return;
	}
	
	var modifyObj = rows[0];
	
	showEditDialog("修改活动 ",1200,600,Globals.baseHtmlUrl.ACTIVITY_RULE_OPERATION_URL,
			function callback(data){
			
	            if (data != undefined && data.success == systemVar.SUCCESS) {
	            	showMessageAlter("修改活动成功!");
	            	queryData();
	            }else if(data == systemVar.CANCEL || data == systemVar.CLOSE){
	            	
	            }else{
	            	showErrorMessageAlter(data.errormsg);
	                return false;
	            }
	    },modifyObj);
}

/**
 * 删除活动
 */
function delActivity(){
	var rows = mini.get("activity_grid").getSelecteds();
	
	if(rows.length == 0){
		showErrorMessageAlter("请选择一个活动删除!");
		return;
	}
	
	var delObj = rows[0];
	delObj["oper_flag"] = "U";
	delObj["service_name"] = "PRICING_OFFER_DELETE";
	
    showConfirmMessageAlter("确定删除活动？",function ok(){
        getJsonDataByPost(Globals.baseActionUrl.ACTION_OPERATION_URL,delObj,"活动配置-删除活动",
            function(result){
        	
        		if (result.success == systemVar.SUCCESS) {
            		
        			showMessageAlter("删除活动成功!");
        			queryData();
	            }
        		else
    			{
        			showErrorMessageAlter(result.errormsg);
    			}
            },null);
    });
}

/**
 * 提交审批
 */
function applyApproval(){
	
	var rows = mini.get("activity_grid").getSelecteds();
	
	if(rows.length == 0){
		showErrorMessageAlter("请选择一个活动提交审批!");
		return;
	}
	
	var approvalObj = rows[0];
	
	if(approvalObj['STATUS_CD'] != '1000' && approvalObj['STATUS_CD'] != '1003'){
		showErrorMessageAlter("只有暂存、审批不通过状态的活动可以提交审批!");
		return;
	}
	
	approvalObj["oper_flag"] = "U";
	approvalObj["service_name"] = "PRICING_OFFER_APPLY_APPROVAL";
	
    showConfirmMessageAlter("确认提交审批？",function ok(){
        getJsonDataByPost(Globals.baseActionUrl.ACTION_OPERATION_URL,approvalObj,"活动配置-提交审批活动",
            function(result){
        	
        		if (result.success == systemVar.SUCCESS) {
            		
        			showMessageAlter("提交活动审批成功!");
        			queryData();
	            }
        		else
    			{
        			showErrorMessageAlter(result.errormsg);
    			}
            },null);
    });
}

/**
 * 审批活动
 */
function approVal(){
	var rows = mini.get("activity_grid").getSelecteds();
	
	if(rows.length == 0){
		showErrorMessageAlter("请选择一个活动审批!");
		return;
	}
	
	var approvalObj = rows[0];
	
	if(approvalObj['STATUS_CD'] != '1001'){
		showErrorMessageAlter("只有审批状态为待审批的活动!");
		return;
	}
	
	showAddDialog("审批活动 ",600,190,Globals.baseHtmlUrl.ACTIVITY_RULE_APPROVAL_URL,
			function callback(data){
	            if (data != undefined && data.success == systemVar.SUCCESS) {
	            	showMessageAlter("审批成功!");
	            	queryData();
	            }else if(data == systemVar.CANCEL || data == systemVar.CLOSE){
	            	
	            }else{
	            	showErrorMessageAlter(data.errormsg);
	                return false;
	            }
	    },approvalObj);
}

