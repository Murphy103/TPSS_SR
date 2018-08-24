var nowurl  = document.location.href;
nowurl = nowurl.substring(0,nowurl.indexOf("html"));
var JsVar = new Object();
//初始化
$(document).ready(function() {
	mini.parse();
	
	initTableHead("class_grid","PAY_ACCT",true);
	
	initTableHead("rule_grid","PAY_ACCT_RULE_REL",true);
	
	JsVar["eventGrid"] = mini.get("class_grid");
	queryData();
});

/**
 * 查询账户信息
 */
function queryData(){
	mini.parse();
	var param = {"ACCOUNT_NAME":mini.get("ACCOUNT_NAME").getValue(),
				 "service_name":"PAY_ACCT"};
	
	var url = Globals.baseActionUrl.SELECT_OPERATION_URL;
	var grid = mini.get("class_grid");
	grid.setUrl(url);
	grid.load(param);

}

/**
 * 根据发放账户查询关联规则
 * @param e
 */
function onSelectionChanged(e) {
	
    var grid = e.sender;
    var record = grid.getSelected();
	if (record) {
		queryRule(record.PAY_ACCT_ID);
	}
    
}

/**
 * 根据账户标识查询关联的规则
 * @param REF_DEM_TYPE_ID
 */
function queryRule(PAY_ACCT_ID){
	if(PAY_ACCT_ID==undefined){
		if(mini.get("class_grid").getSelecteds().length !=1){
			showWarnMessageAlter("请选择一个账户!"); 
			return;
		}else{
			PAY_ACCT_ID=mini.get("class_grid").getSelecteds()[0].PAY_ACCT_ID;
		}
		
	}
	mini.parse();
	var param = {"PAY_ACCT_ID":PAY_ACCT_ID ,
				 "OFFER_NAME":mini.get("RULE_NAME").getValue(),
				 "service_name":"PAY_ACCT_RULE"};
	
	var url = Globals.baseActionUrl.SELECT_OPERATION_URL;
	var grid = mini.get("rule_grid");
	grid.setUrl(url);
	grid.load(param);
}

/**
 * 新增发放账户
 */
function addClass() {		
	
	showAddDialog("发放账户配置",690,250,Globals.baseHtmlUrl.GRANT_ACCOUNT_ADD_URL,
	        function destroy(data){
	            if (data == systemVar.SUCCESS) {
	            	JsVar["eventGrid"].reload();
	                showMessageAlter("新增发放账户配置成功");
	            }
	    });
}

/**
 * 修改发放账户
 */
function modifyClass() {
	var rows = mini.get("class_grid").getSelecteds();
	
	if(rows.length != 1){
		showErrorMessageAlter("请选中一行修改!");
		return;
	}
	 var row = rows[0];
//	 alert(JSON.stringify(row));
//	{"IS_TELECOM_ACCT":"否","LATN_NAME":"贵阳分公司","MERCHANT_ACCT":"NAME1717","PAY_ACCT_ID":17,
//	 "PAY_ACCT_NAME":"name17","RN":1,"STAFF_DESC":"管理员","UPDATE_DATE":"2017-07-31T07:50:45.000Z","_uid":0,"_index":0}
	 
	 showEditDialog("修改发放账户配置",690,250,Globals.baseHtmlUrl.GRANT_ACCOUNT_ADD_URL,
		        function destroy(data){
		            if (data == systemVar.SUCCESS) {
		                JsVar["eventGrid"].reload();
		                showMessageAlter("修改成功!");
		            }
		    },row);
}

/**
 * 删除发放账户
 */
function delClass(){
	var rows = mini.get("class_grid").getSelecteds();
	
	if(rows.length == 0){
		showErrorMessageAlter("请至少选择一个发放账户删除!");
		return;
	}
	
	var ids = "";
	for(var i = 0;i < rows.length;i++){
		ids += rows[i].PAY_ACCT_ID + ",";
	}
	ids = ids.substring(0,ids.length-1);
	
	var delObj = new Object();
	delObj["REF_TYPE"] = 1;
	delObj["service_name"] = "PAY_ACCT_D";
	delObj["oper_flag"] = 'D';
	delObj["PAY_ACCT_ID"] = ids;
	
    showConfirmMessageAlter("确定删除发放账户？",function ok(){
        getJsonDataByPost(Globals.baseActionUrl.ACTION_OPERATION_URL,delObj,"删除发放账户",
            function(result){
        	
        		if (result.success == systemVar.SUCCESS) {
            		
        			showMessageAlter("删除发放账户成功!");
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
 * 新增规则
 */
function addRule(){
	
	var rows = mini.get("class_grid").getSelecteds();
	
	if(rows.length != 1){
		showErrorMessageAlter("请选中一个发放账户!");
		return;
	}
	
	var addObj = rows[0];
	addObj['oper_flag'] = 'A';
	addObj['service_name'] = 'PAY_ACCT_RULE_REL_A';
	
	showAddDialog("规则选择 ",600,400,Globals.baseHtmlUrl.RULE_SELECT_URL,
			function callback(data){
	            if (data != undefined && data.success == systemVar.SUCCESS) {
	            	showMessageAlter("新增规则成功!");
	            	queryRule(addObj["PAY_ACCT_ID"]);
	            }else if(data == systemVar.CANCEL || data == systemVar.CLOSE){
	            	
	            }else{
	            	showErrorMessageAlter(data.errormsg);
	                return false;
	            }
	    },addObj);
}

/**
 * 删除规则
 */
function delRule(){
	var rows = mini.get("rule_grid").getSelecteds();
	
	if(rows.length == 0){
		showErrorMessageAlter("请至少选中一个关联规则!");
		return;
	}
	
	//选中的发放账户
	var class_row = mini.get("class_grid").getSelected();

	var ids = "";
	for(var i = 0;i < rows.length;i++){
		ids += rows[i].PAY_ACCT_RULE_REL_ID + ",";
	}
	ids = ids.substring(0,ids.length-1);
	
	var delObj = new Object();
	delObj["service_name"] = "PAY_ACCT_RULE_REL_D";
	delObj["oper_flag"] = 'D';
	delObj["PAY_ACCT_RULE_REL_ID"] = ids;
	
    showConfirmMessageAlter("确定删除关联规则？",function ok(){
        getJsonDataByPost(Globals.baseActionUrl.ACTION_OPERATION_URL,delObj,"删除关联规则",
            function(result){
        		if (result.success == systemVar.SUCCESS) {
            		
        			showMessageAlter("删除成功!");
        			queryRule(class_row["PAY_ACCT_ID"]);
	            }
        		else
    			{
        			showErrorMessageAlter(result.errormsg);
    			}
            },null);
    });
}

