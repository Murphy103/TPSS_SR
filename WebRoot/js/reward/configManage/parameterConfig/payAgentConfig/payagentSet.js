var nowurl  = document.location.href;
nowurl = nowurl.substring(0,nowurl.indexOf("html"));
var JsVar = new Object();
//初始化
$(document).ready(function() {
	mini.parse();
	//渠道大小类下拉框
	var url = nowurl+'ControlServlet.do?serviceName=commonServlet&methodName=getTreeSelect&service_name=CHL_TREE';
	var privilege = mini.get("PRIVILEGE");
	privilege.load(url);
});


/**
 * 父窗口调用的初始化方法
 * @param action 操作类型
 * @param data   参数
 */
function onLoadComplete(action,data) {
  
    //父窗口参数
    JsVar["data"] = data;
}



/**
 * 当前支付代理商奖励规则选择
 */
function selectBut(){

	
	var addObj = new Object();
	addObj['oper_flag'] = 'Q';
	addObj['service_name'] = 'PAY_AGENT_INS_RULE_DETAIL_Q';
	
	showAddDialog("规则选择 ",600,350,Globals.baseHtmlUrl.PAYAGENT_SELECT_AGENTREL_URL,
			function callback(data){
	            if (data != undefined && data.success == systemVar.SUCCESS) {
	            	//设置返回值
	            	mini.get("REWARD_RULE_NAME").setValue(data.OFFER_NAME);
	            	mini.get("REWARD_RULE_ID").setValue(data.OFFER_ID);
	            }else if(data == systemVar.CANCEL || data == systemVar.CLOSE){
	            	
	            }else{
	            	showErrorMessageAlter(data.errormsg);
	                return false;
	            }
	    },addObj);
}

function onSubmit(){
	mini.parse();
	var addObj = new Object();
	var sub_chnl_tp=mini.get("PRIVILEGE").getValue();
	var reward_rule=mini.get("REWARD_RULE_ID").getValue();
	var eff_date=mini.formatDate(mini.get("EFF_DATE").getValue(),"yyyy-MM-dd");
	var exp_date=mini.formatDate(mini.get("EXP_DATE").getValue(),"yyyy-MM-dd");
	var sub_chnl_array=sub_chnl_tp.split(',');
	var reward_rule_array=reward_rule.split(',');
	addObj["service_name"] = JsVar["data"]["service_name"];
	addObj["oper_flag"] = 'A';
	addObj["PAY_AGENT_ID"] = JsVar["data"]["PAY_AGENT_ID"];
	addObj["SUB_CHNL_TP"]=sub_chnl_array;
	addObj["PRICING_RULE_ID"]=reward_rule_array;
	addObj["EFF_DATE"]=eff_date;
	addObj["EXP_DATE"]=exp_date
	
	
	getJsonDataByPost(Globals.baseActionUrl.ACTION_OPERATION_URL,addObj,"当前支付代理商设置",
	        function(result){
				addObj["success"] = result.success;
				addObj["errormsg"] = result.errormsg;
		        closeWindow(addObj);
	        });
}
