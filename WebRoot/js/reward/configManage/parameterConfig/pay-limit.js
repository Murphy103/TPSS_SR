var nowurl  = document.location.href;
nowurl = nowurl.substring(0,nowurl.indexOf("html"));
var JsVar = new Object();
$(function(){
	var screenheight=screen.availHeight;
	var styleElement = document.getElementById('event_grid');
	styleElement.style.height = screenheight*0.65+'px';
	initTableHead("event_grid","PAY_LIMIT",true);
	JsVar["PAY_ACCT_ID"]= mini.get("PAY_ACCT_ID");
	JsVar["eventGrid"] = mini.get("event_grid");//取得事件表格
//	JsVar["eventGrid"].hideColumn("PAY_QUOTA_ID");
//	JsVar["eventGrid"].hideColumn("PAY_ACCT_ID");
	getPayAcctComboxData();
	queryData();
});
/**
 * 获取发放账户下拉选数据
 */
function getPayAcctComboxData(){
	var url=nowurl+'ControlServlet.do?serviceName=commonServlet&methodName=combList';
	var data={sqlcode:"COM_INIT_PAY_ACCT_ALL"};
	var logName="发放账户";
	getJsonDataByPost(url,data,logName,
			function(result){
		var jsonData=result.data;
				if(jsonData.length>0){
					JsVar["PAY_ACCT_ID"].setData(jsonData);
					JsVar["PAY_ACCT_ID"].select(0);
				}
		});
}
function queryData(){
	mini.parse();
	var param = {"pay_acct_id":mini.get("PAY_ACCT_ID").getValue(),
				 "service_name":"PAY_QUOTA"};
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
	var url=bootPATH + "../../html/reward/configManage/parameterConfig/pay-limit-add.html";
	showAddDialog("新增限额配置",690,350,url,
	        function destroy(data){
	            if (data == systemVar.SUCCESS) {
	                JsVar["eventGrid"].reload();
	                showMessageAlter("新增限额配置成功");
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
		 var url=bootPATH + "../../html/reward/configManage/parameterConfig/pay-limit-add.html";
		 showEditDialog("修改限额配置",690,350,url,
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
		 showWarnMessageAlter("请选择需要删除的事件!"); 
		 return;
	 }else{
		 var allId= new Array();
		 for(var i=0;i<rows.length;i++){
			 allId.push(rows[i].PAY_QUOTA_ID);
		 }
//		 alert(JSON.stringify(allId));//[{"EVENT_TYPE_ID":12},{"EVENT_TYPE_ID":999}]
		 var url=nowurl+'ControlServlet.do?serviceName=commonServlet&methodName=deleteData&sqlCode=PAY_QUOTA_D';
		 showConfirmMessageAlter("确定删除记录?",function ok(){
				getJsonDataByPost(url,allId,"删除限额配置",
		                function(result){
							if(result.success != undefined && result.success=='success'){
								JsVar["eventGrid"].reload();
			                    showMessageAlter("删除成功!");
							}else if(result.success != undefined && result.success=='fail'){
								showMessageAlter(result.errormsg);
							}else{
								showMessageAlter("删除失败!");
							}
							
		                },"");
			});
	 }
}