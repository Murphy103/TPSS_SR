//公共变量
var nowurl_js=document.location.href;
var url = document.location.href;
nowurl_js=nowurl_js.substring(0,nowurl_js.indexOf("html"));
var Globals = {
    ctx: nowurl_js
};

//解析访问url的参数
if(url.indexOf("?")!=-1){ 
	var str = url.substr(url.indexOf("?")+1); 
	var strs= str.split("&"); 
	for(var i=0;i < strs.length;i++){ 
		var val = strs[i].split("=");
		
		if(val.length == 2){
			Globals[val[0]] = val[1];
		}
	} 
}
/**
 * 按钮权限
 * @param btnPrivilige
 * @param key
 * @returns
 */
function hasButtonPrivilige(btnPrivilige,key){
	 
	if(btnPrivilige.indexOf(key)>=0){
		return true;
	} 
		return false; 
}

//用于action url
Globals.baseActionUrl = {
    
	/**********************套餐分类维护  start************************/
    //增删改操作
    ACTION_OPERATION_URL : Globals.ctx +"/ControlServlet.do?serviceName=commonServlet&methodName=operation",
    //分页查询操作
    SELECT_OPERATION_URL : Globals.ctx +"/ControlServlet.do?serviceName=commonServlet&methodName=gridValue_rows",
    //非分页查询操作
    SELECT_GRID_URL : Globals.ctx +"/ControlServlet.do?serviceName=commonServlet&methodName=gridValue",
    //导出操作
    EXPORT_OPERATION_URL : Globals.ctx +"/ControlServlet.do?serviceName=commonServlet&methodName=exportExcel",
    //导入操作
    //IMPORT_OPERATION_URL : Globals.ctx +"/ControlServlet.do?serviceName=commonServlet&methodName=importExcel",
    IMPORT_OPERATION_URL : Globals.ctx +"/ImportServlet.do",
    /**********************套餐分类维护   end************************/

    COMBOBOX_URL:Globals.ctx +"/ControlServlet.do?serviceName=commonServlet&methodName=combList",
    
    /**********************规则维护  start************************/
    //规则新增/编辑/删除操作
    RULE_OPERATION_URL : Globals.ctx +"/ControlServlet.do?serviceName=ruleServlet&methodName=operation",
    //查询规则详细内容
    RULE_DETAIL_URL : Globals.ctx +"/ControlServlet.do?serviceName=ruleServlet&methodName=detail",
    
    /**********************规则维护   end************************/
    

    //规则新增/编辑/删除操作
    SEND_TO_TPSS_ADD : Globals.ctx +"/ControlServlet.do?serviceName=payServlet&methodName=addBatch",
};
//用于html url
Globals.baseHtmlUrl = {
   
    /**********************套餐分类维护  start************************/
    //销售品分类-新增分类页面
    OFFER_CLASS_ADD_URL:Globals.ctx + "html/reward/dataManage/dimensionClass/offerClass/add.html",
    //套餐选择页面
    OFFER_CLASS_ADD_OFFER_URL:Globals.ctx + "html/reward/dataManage/dimensionClass/offerClass/offerSelect.html",
    //套餐导入页面
    OFFER_CLASS_IMPORT_OFFER_URL:Globals.ctx + "html/reward/dataManage/dimensionClass/offerClass/offerImport.html",
    
    /**********************套餐分类维护   end************************/
    
    /**********************终端分类维护  start************************/
    //终端分类-新增分类页面
    TERMINAL_CLASS_ADD_URL:Globals.ctx + "html/reward/dataManage/dimensionClass/terminalClass/add.html",
    //终端选择页面
    TERMINAL_CLASS_ADD_TERMINAL_URL:Globals.ctx + "html/reward/dataManage/dimensionClass/terminalClass/terminalSelect.html",
    //终端导入页面
    TERMINAL_CLASS_IMPORT_TERMINAL_URL:Globals.ctx + "html/reward/dataManage/dimensionClass/terminalClass/terminalImport.html",
    
    /**********************终端分类维护   end************************/
    
    
    /**********************店员分组维护  start************************/
    //店员分组新增
    DYGROUP_ADD_URL:Globals.ctx + "html/reward/dataManage/dimensionClass/dyGroup/add.html",
    //店员选择页面
    DYGROUP_ADD_DYREL_URL:Globals.ctx + "html/reward/dataManage/dimensionClass/dyGroup/dySelect.html",
    //店员导入页面
    DYGROUP_IMPORT_DYREL_URL:Globals.ctx + "html/reward/dataManage/dimensionClass/dyGroup/dyImport.html",
    
    /**********************店员分组维护   end************************/
    
    /**********************补贴分类维护  start************************/
    //补贴分类新增
    SUBSIDY_CLASS_ADD_URL:Globals.ctx + "html/reward/dataManage/dimensionClass/subsidyClass/add.html",
    //补贴选择页面
    SUBSIDY_ADD_SUBSIDYREL_URL:Globals.ctx + "html/reward/dataManage/dimensionClass/subsidyClass/subsidySelect.html",
    //补贴导入页面
    SUBSIDY_IMPORT_SUBSIDYREL_URL:Globals.ctx + "html/reward/dataManage/dimensionClass/subsidyClass/subsidyImport.html",
    
    /**********************店员分组维护   end************************/
    
    /**********************支付代理商配置  start************************/
    //支付代理商新增
    PAYAGENT_ADD_URL:Globals.ctx + "html/reward/configManage/parameterConfig/payAgentConfig/add.html",
    //支付代理商设置
    PAYAGENT_ADD_AGENTREL_URL:Globals.ctx + "html/reward/configManage/parameterConfig/payAgentConfig/payagentSet.html",
    //奖励规则选择页面
    PAYAGENT_SELECT_AGENTREL_URL:Globals.ctx + "html/reward/configManage/parameterConfig/payAgentConfig/rewardruleSelect.html",
    
    /**********************支付代理商配置   end************************/
       
    
    /**********************店员管理信息导入   start************************/
    ASSISTANT_INFO_IMPORT_DYREL_URL:Globals.ctx + "html/reward/dataManage/shopassistantmanage/assistantinfomanage/assistantinfo-import.html",
    /**********************店员管理信息导入   end************************/
    
    /**********************出资方配置   start************************/
    INVESTOR_CONFIG_ADD_URL:Globals.ctx + "html/reward/dataManage/paramconfig/investorConfig/investor-config-add.html",
    /**********************出资方配置   end************************/
    
    /**********************活动维护  start************************/
    //规则配置
    ACTIVITY_RULE_OPERATION_URL:Globals.ctx + "html/reward/configManage/ruleManager/activityConfig/operation.html",
    //规则审批
    ACTIVITY_RULE_APPROVAL_URL:Globals.ctx + "html/reward/configManage/ruleManager/activityConfig/approval.html",
    /**********************活动维护  end************************/
    
    //报帐批次新增
    SEND_TO_TPSS_ADD:Globals.ctx + "html/reward/pay/send2tpss/add.html",

    //报帐批次状态导入
    SEND_TO_TPSS_CALLBACK:Globals.ctx + "html/reward/pay/send2tpss/state-callback.html",
    
    //支付批次状态导入
    PAY_STATE_CALLBACK:Globals.ctx + "html/reward/pay/payquery/state-callback.html",
};


