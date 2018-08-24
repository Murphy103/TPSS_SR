var nowurl  = document.location.href;
nowurl = nowurl.substring(0,nowurl.indexOf("html"));
var JsVar = new Object();
$(function(){
	var screenheight=screen.availHeight;
	var styleElement = document.getElementById('event_grid');
	styleElement.style.height = screenheight*0.65+'px';
	initTableHead("event_grid","FACTOR_ALLOCATION",true);
	JsVar["value_source"]= mini.get("value_source");
	JsVar["eventGrid"] = mini.get("event_grid");//取得事件表格
//	JsVar["eventGrid"].hideColumn("BUSI_CODE");
//	JsVar["eventGrid"].hideColumn("DATA_GET_TYPE");
//	JsVar["eventGrid"].hideColumn("SQL_DESC");
	getValueSourceComboxData();
	queryData();
});
/**
 * 获取取值来源下拉选数据
 */
function getValueSourceComboxData(){
	var url=nowurl+'ControlServlet.do?serviceName=commonServlet&methodName=combList';
	var data={sqlcode:"COM_INIT_BY_PTYCODE1",sV1:'DATA_GET_TYPE',sV2:'-1'};
	var logName="取值来源";
	getJsonDataByPost(url,data,logName,
			function(result){
		var jsonData=result.data;
				if(jsonData.length>0){
					JsVar["value_source"].setData(jsonData);
					JsVar["value_source"].select(0);
				}
		});
}
function queryData(){
	mini.parse();
	var param = {"obj_name":mini.get("factor_name").getValue(),
				 "ref_obj_code":mini.get("factor_code").getValue(),
				 "source":mini.get("value_source").getValue(),
				 "service_name":"PRICING_REF_OBJECT_MOD"};
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
	var url=bootPATH + "../../html/reward/configManage/ruleManager/factor-add.html";
	showAddDialog("新增因子",690,550,url,
	        function destroy(data){
	            if (data == systemVar.SUCCESS) {
	                JsVar["eventGrid"].reload();
	                showMessageAlter("新增因子成功");
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
//		 {"BUSI_CODE":"1000","BUSI_NAME":"套餐类","OBJ_NAME":"name2","REFERENCE_OBJECT_KEY":"key2",
//			 "REF_OBJ_CODE":"[crast2]","RIGHT_TIP":"取2","RN":1,"SOURCE":"数据库","_uid":0,"_index":0}
		 var url=bootPATH + "../../html/reward/configManage/ruleManager/factor-add.html";
		 showEditDialog("修改因子",690,550,url,
			        function destroy(data){
			            if (data == systemVar.SUCCESS) {
			                JsVar["eventGrid"].reload();
			                showMessageAlter("修改因子成功!");
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
	if(rows.length !=1){
		 showWarnMessageAlter("请选择一条记录!"); 
		 return;
	 }else{
		 var sql_code="";
//		 var allId= new Array();
		 for(var i=0;i<rows.length;i++){
			 sql_code=rows[i].REF_OBJ_CODE.replace("[","").replace("]","");
		 }
		 var params = {"PRICING_REF_OBJECT_MOD1D":{"deal_flag":"D","sql_code":sql_code},
				       "PRICING_REF_OBJECT_MOD2D":{"deal_flag":"D","sql_code":sql_code},
				       "PRICING_REF_OBJECT_MOD3U":{"deal_flag":"D","sql_code":sql_code}};

		 var url=nowurl+'ControlServlet.do?serviceName=commonServlet&methodName=dealData&sqlCode=PRICING_REF_OBJECT_MOD1D,PRICING_REF_OBJECT_MOD2D,PRICING_REF_OBJECT_MOD3U';
		 showConfirmMessageAlter("确定删除记录?",function ok(){
				getJsonDataByPost(url,params,"删除因子",
		                function(result){
							if(result.success != undefined && result.success=='success'){
								JsVar["eventGrid"].reload();
			                    showMessageAlter("删除因子成功!");
							}else if(result.success != undefined && result.success=='fail'){
								showMessageAlter(result.errormsg);
							}else{
								showMessageAlter("删除失败!");
							}
							
		                },"");
			});
	 }
}