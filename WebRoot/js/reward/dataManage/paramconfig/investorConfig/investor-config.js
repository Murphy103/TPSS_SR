var nowurl  = document.location.href;
nowurl = nowurl.substring(0,nowurl.indexOf("html"));
var JsVar = new Object();
$(function(){
	
	var screenheight=screen.availHeight;
	var styleElement = document.getElementById('event_grid');
	styleElement.style.height = screenheight*0.65+'px';
	
	initTableHead("event_grid","CHARGE_PARTY_Q",true);
	JsVar["CHARGE_PARTY_TYPE"]= mini.get("CHARGE_PARTY_TYPE");//出资方属性
	JsVar["eventGrid"] = mini.get("event_grid");//取得事件表格
	getInvestorComboxData();
});
/**
 * 获取出资方属性下拉选数据
 */
function getInvestorComboxData(){
	var data={sqlcode:"COM_INIT_BY_PTYCODE1",sV1:'CHARGE_PARTY_TYPE',sV2:'-1'};
	var logName="出资方属性下拉";
	getJsonDataByPost(Globals.baseActionUrl.COMBOBOX_URL,data,logName,
			function(result){
		var jsonData=result.data;
				if(jsonData.length>0){
					JsVar["CHARGE_PARTY_TYPE"].setData(jsonData);
					JsVar["CHARGE_PARTY_TYPE"].select(0);
				}
		});
}
function queryData(){
	mini.parse();
	var param = {"CHARGE_PARTY_NAME":mini.get("CHARGE_PARTY_NAME").getValue(),
			     "CHARGE_PARTY_TYPE":mini.get("CHARGE_PARTY_TYPE").getValue(),
				 "service_name":"CHARGE_PARTY_Q"};
//	console.log(param);
	var url = nowurl+'ControlServlet.do?serviceName=commonServlet&methodName=gridValue_rows';
	var grid = mini.get("event_grid");
	grid.setUrl(url);
	grid.load(param);

}
/**
 * 新增
 */
function add() {
	showAddDialog("出资方配置",690,350,Globals.baseHtmlUrl.INVESTOR_CONFIG_ADD_URL,
	        function destroy(data){
	            if (data == systemVar.SUCCESS) {
	                JsVar["eventGrid"].reload();
	                showMessageAlter("新增出资方配置成功!");
	            }
	    });
}

/**
 * 修改
 * 只修改一条记录
 */
function modify(){
	 var grid = mini.get("event_grid");
	 var rows = grid.getSelecteds();
	 if(rows.length !=1){
		 showWarnMessageAlter("请选择一条记录"); 
		 return;
	 }else{
		 var row = grid.getSelected();//选中的行数据
//		 alert(JSON.stringify(row));
//		 {"LOWER_LIMIT":666.6,"PAY_ACCT_NAME":"NAME10","PAY_QUOTA_ID":16,"RN":1,"STAFF_DESC":"余辅良",
//			 "UPDATE_DATE":"2017-07-27T09:17:33.000Z","UPPER_LIMIT":8888,"_uid":0,"_index":0}
		 
		 showEditDialog("出资方配置",690,350,Globals.baseHtmlUrl.INVESTOR_CONFIG_ADD_URL,
			        function destroy(data){
			            if (data == systemVar.SUCCESS) {
			                JsVar["eventGrid"].reload();
			                showMessageAlter("修改成功!");
			            }
			    },row);
	 }
}

/**
 * 删除
 * 可以删除多条记录
 */
function del(){
	var grid = mini.get("event_grid");
	var rows = grid.getSelecteds();
	if(rows.length ==0){
		 showWarnMessageAlter("请至少选择一条记录!"); 
		 return;
	 }else{
		 var ids = "";
		 for(var i=0;i<rows.length;i++){
			 ids += rows[i].CHARGE_PARTY_ID + ",";
		 }
		 ids = ids.substring(0,ids.length-1);
		 
		 
		 var info = new Object();
		 info["service_name"]="CHARGE_PARTY_D";
		 info["oper_flag"]="D";
		 info["CHARGE_PARTY_ID"]=ids;
		 
		 showConfirmMessageAlter("确定删除记录?",function ok(){
				getJsonDataByPost(Globals.baseActionUrl.ACTION_OPERATION_URL,info,"删除出资方配置",
		                function(result){
							if(result.success != undefined && result.success=='success'){
								JsVar["eventGrid"].reload();
			                    showMessageAlter("删除成功!");
							}else if(result.success != undefined && result.success=='fail'){
								alert("aaaaa失败");
								showMessageAlter(result.errormsg);
							}else{
								showMessageAlter("删除失败!");
							}
							
		                },"");
			});
	 }
}