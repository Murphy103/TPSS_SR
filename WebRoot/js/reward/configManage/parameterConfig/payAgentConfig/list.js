var nowurl  = document.location.href;
nowurl = nowurl.substring(0,nowurl.indexOf("html"));

//初始化
$(document).ready(function() {
	mini.parse();
	
	//生成datagrid的field
	initTableHead("agent_grid","PAY_AGENT_Q",true);
	
	//生成datagrid的field
	initTableHead("agent_rel_grid","PAY_AGENT_INST_Q",true);
	
	//渠道大小类下拉框
	var url = nowurl+'ControlServlet.do?serviceName=commonServlet&methodName=getTreeSelect&service_name=CHL_TREE';
	var privilege = mini.get("PRIVILEGE");
	privilege.load(url);
});



/**
 * 查询代理商信息
 */
function queryData(){
	mini.parse();
	var param = {"pay_agent_name":mini.get("PAY_AGENT_NAME").getValue(),
				 "service_name":"PAY_AGENT_Q"};
	
	var url = nowurl+'ControlServlet.do?serviceName=commonServlet&methodName=gridValue_rows';
	var grid = mini.get("agent_grid");
	grid.setUrl(url);
	grid.load(param);

}



/**
 * 选择代理商关联查询当前支付代理商
 * @param e
 */
function onSelectionChanged(e) {
	
    var grid = e.sender;
    var record = grid.getSelected();
    if (record) {
    	queryAgents(record.PAY_AGENT_ID);
    }
}

/**
 * 根据代理商查询当前支付代理商信息
 * @param REF_DEM_TYPE_ID
 */
function queryAgents(PAY_AGENT_ID){
	mini.parse();
	//alert("格式化:"+mini.formatDate(mini.get("EFF_DATE").getValue(),"yyyy-MM-dd"));
	var eff_date=mini.formatDate(mini.get("EFF_DATE").getValue(),"yyyy-MM-dd");
	var exp_date=mini.formatDate(mini.get("EXP_DATE").getValue(),"yyyy-MM-dd");
	var param = {"PAY_AGENT_ID":PAY_AGENT_ID ,
			     "SUB_CHNL_TP":mini.get("PRIVILEGE").getValue(),
			     "EFF_DATE":eff_date,
			     "EXP_DATE":exp_date,
				 "service_name":"PAY_AGENT_INST_Q"};
	
	var url = Globals.baseActionUrl.SELECT_OPERATION_URL;
	var grid = mini.get("agent_rel_grid");
	grid.setUrl(url);
	grid.load(param);
}

function queryRelAgents(){
var rows = mini.get("agent_grid").getSelecteds();
	
	if(rows.length != 1){
		mini.alert("请先选中一行支付代理商查询!");
		return;
	}
var pay_agent_id=rows[0].PAY_AGENT_ID;
queryAgents(pay_agent_id);
}


/**
 * 添加支付代理商
 */
function addPayAgent() {		
   
	var addObj = new Object();
	addObj['oper_flag'] = 'A';
	addObj['service_name'] = 'PAY_AGENT_A';
	
	showAddDialog("支付代理商配置",500,200,Globals.baseHtmlUrl.PAYAGENT_ADD_URL,
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
 * 修改店员分类
 */
function modifyPayAgent() {
	var rows = mini.get("agent_grid").getSelecteds();
	
	if(rows.length != 1){
		mini.alert("请选中一行修改!");
		return;
	}
	
	var modifyObj = rows[0];
	modifyObj['oper_flag'] = 'U';
	modifyObj['service_name'] = 'PAY_AGENT_U';
	
	showAddDialog("支付代理商配置 ",500,200,Globals.baseHtmlUrl.PAYAGENT_ADD_URL,
			function callback(data){
			
	            if (data != undefined && data.success == systemVar.SUCCESS) {
	            	queryData();
	            }else if(data == systemVar.CANCEL || data == systemVar.CLOSE){
	            	
	            }else{
	            	showErrorMessageAlter(data.errormsg);
	                return false;
	            }
	    },modifyObj);
}

/**
 * 删除支付代理商
 */

function delPayAgent(){
	var rows = mini.get("agent_grid").getSelecteds();
	
	if(rows.length == 0){
		mini.alert("请至少选中一行删除!");
		return;
	}
	
	var ids = "";
	for(var i = 0;i < rows.length;i++){
		ids += rows[i].PAY_AGENT_ID + ",";
	}
	ids = ids.substring(0,ids.length-1);
	
	var delObj = new Object();
	delObj["service_name"] = "PAY_AGENT_D";
	delObj["oper_flag"] = 'D';
	delObj["PAY_AGENT_ID"] = ids;
    showConfirmMessageAlter("确定删除支付代理商？",function ok(){
        getJsonDataByPost(Globals.baseActionUrl.ACTION_OPERATION_URL,delObj,"支付代理商管理-删除支付代理商",
            function(result){
        		if (result.success == systemVar.SUCCESS) {
            		
        			showMessageAlter("删除支付代理商成功!");
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
 * 新增当前支付代理商设置
 */
function addRelAgent(){
var rows = mini.get("agent_grid").getSelecteds();
	
	if(rows.length != 1){
		mini.alert("请选中一个支付代理商新增支付代理商设置!");
		return;
	}
	
	var addObj = rows[0];
	addObj['oper_flag'] = 'A';
	addObj['PAY_AGENT_ID']=rows[0].PAY_AGENT_ID;
	addObj['service_name'] = 'PAY_AGENT_INST_A';
	
	showAddDialog("当前支付代理商设置 ",650,250,Globals.baseHtmlUrl.PAYAGENT_ADD_AGENTREL_URL,
			function callback(data){
	            if (data != undefined && data.success == systemVar.SUCCESS) {
	            	mini.alert("设置成功");
	            	queryAgents(addObj["PAY_AGENT_ID"]);
	            }else if(data == systemVar.CANCEL || data == systemVar.CLOSE){
	            	
	            }else{
	            	showErrorMessageAlter(data.errormsg);
	                return false;
	            }
	    },addObj);
}


/**
 * 删除当前支付代理商设置
 */
function delRelAgent(){
var rows = mini.get("agent_rel_grid").getSelecteds();
	
	if(rows.length == 0){
		mini.alert("请至少选择一个当前支付代理商删除!");
		return;
	}
	
	//选中的支付代理商
	var payagent_row = mini.get("agent_grid").getSelected();

	var ids = new Array();
	for(var i = 0;i < rows.length;i++){
		ids[i] = rows[i].PAY_AGENT_INST_ID;
	}
	var delObj = new Object();
	delObj["service_name"] = "PAY_AGENT_INST_D";
	delObj["oper_flag"] = 'D';
	delObj["PAY_AGENT_INST_ID"] = ids;
	delObj["PAY_AGENT_ID"] = payagent_row["PAY_AGENT_ID"];
	
    showConfirmMessageAlter("确定删除当前支付代理商？",function ok(){
        getJsonDataByPost(Globals.baseActionUrl.ACTION_OPERATION_URL,delObj,"当前支付代理商管理-删除当前支付代理商",
            function(result){
        		if (result.success == systemVar.SUCCESS) {
            		
        			showMessageAlter("删除当前支付代理商成功!");
        			queryAgents(payagent_row["PAY_AGENT_ID"]);
	            }
        		else
    			{
        			showErrorMessageAlter(result.errormsg);
    			}
            },null);
    });
}


