var nowurl  = document.location.href;
nowurl = nowurl.substring(0,nowurl.indexOf("html"));
var JsVar = new Object();

//初始化
$(document).ready(function() {
	mini.parse();
	
	JsVar["payagentForm"] = new mini.Form("#payagent_form");
});

/**
 * 父窗口调用的初始化方法
 * @param action 操作类型
 * @param data   参数
 */
function onLoadComplete(action,data) {
  
    JsVar["payagentForm"].setData(data,false);
    //父窗口参数
    JsVar["data"] = data;
}

/**
 * 保存支付代理商配置
 */
function onSubmit() {
    JsVar["payagentForm"].validate();
    if (JsVar["payagentForm"].isValid() == false){
        return;
    }
    
    //获取表单多个控件的数据
    var payagentInfo = JsVar["payagentForm"].getData();
    
    //检查支付代理商名称是否重复
    var param = {
			 "pay_agent_name":payagentInfo["PAY_AGENT_NAME"],
			// "pay_agent_id":JsVar["data"]["PAY_AGENT_ID"],
			 "service_name":"PAY_AGENT_Q",
			 "pageIndex":0,
			 "pageSize":6};

    getJsonDataByPost(Globals.baseActionUrl.SELECT_OPERATION_URL,param,"支付代理商名称重复校验",
	        function(result){
    			console.log(result);
    			if(result.success == systemVar.SUCCESS && result.total > 0){
    				payagentInfo["success"] = systemVar.FAIL;
    				payagentInfo["errormsg"] = "支付代理商名称重复";
    				closeWindow(payagentInfo);
    			}else if(result.success == systemVar.FAIL){
    				payagentInfo["success"] = systemVar.FAIL;
    				payagentInfo["errormsg"] = result.errormsg;
    				closeWindow(payagentInfo);
    			}else{
    				payagentInfo["service_name"] = JsVar["data"]["service_name"];
    				payagentInfo["oper_flag"] = JsVar["data"]["oper_flag"];
    				payagentInfo["PAY_AGENT_ID"] = JsVar["data"]["PAY_AGENT_ID"];
    			        
    			    getJsonDataByPost(Globals.baseActionUrl.ACTION_OPERATION_URL,payagentInfo,"支付代理商配置",
    				        function(result){
    			    	        payagentInfo["success"] = result.success;
    			    	        payagentInfo["errormsg"] = result.errormsg;
    					        closeWindow(payagentInfo);
    				        });
    			}
    			
	        });
   
   
    
    
}
