var nowurl  = document.location.href;
nowurl = nowurl.substring(0,nowurl.indexOf("html"));

//初始化
$(document).ready(function() {
	mini.parse();
	
	//生成datagrid的field
	initTableHead("dy_grid","REF_DEM_TYPE_SALES",true);
	
	//生成datagrid的field
	initTableHead("reldy_grid","REF_DEM_TYPE_DETAIL_SALES",true);
	
});



/**
 * 查询店员分类
 */
function queryData(){
	mini.parse();
	var param = {"latn_id":mini.get("LATN_ID").getValue(),
			     "ref_type":4,
				 "service_name":"REF_DEM_TYPE_SELECT"};
	
	var url = nowurl+'ControlServlet.do?serviceName=commonServlet&methodName=gridValue_rows';
	var grid = mini.get("dy_grid");
	grid.setUrl(url);
	grid.load(param);

}



/**
 * 选择店员分类关联查询店员
 * @param e
 */
function onSelectionChanged(e) {
	
    var grid = e.sender;
    var record = grid.getSelected();
    if (record) {
    	querySales(record.REF_DEM_TYPE_ID);
    }
}

/**
 * 根据店员分组查询关联店员
 * @param REF_DEM_TYPE_ID
 */
function querySales(REF_DEM_TYPE_ID){
	mini.parse();
	var param = {"ref_dem_type_id":REF_DEM_TYPE_ID ,
			     "ref_type":4,
				 "service_name":"REF_DEM_TYPE_DETAIL_SALES"};
	
	var url = Globals.baseActionUrl.SELECT_OPERATION_URL;
	var grid = mini.get("reldy_grid");
	grid.setUrl(url);
	grid.load(param);
}



/**
 * 添加店员分类
 */
function addDy() {		
   
	var addObj = new Object();
	addObj['oper_flag'] = 'A';
	addObj['service_name'] = 'REF_DEM_TYPE_A';
	
	showAddDialog("分组配置 ",400,180,Globals.baseHtmlUrl.DYGROUP_ADD_URL,
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
function modifyDy() {
	var rows = mini.get("dy_grid").getSelecteds();
	
	if(rows.length != 1){
		mini.alert("请选中一行修改!");
		return;
	}
	
	var modifyObj = rows[0];
	modifyObj['oper_flag'] = 'U';
	modifyObj['service_name'] = 'REF_DEM_TYPE_U';
	
	showAddDialog("分组配置 ",400,180,Globals.baseHtmlUrl.DYGROUP_ADD_URL,
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
 * 删除店员分类
 */

function delDy(){
	var rows = mini.get("dy_grid").getSelecteds();
	
	if(rows.length == 0){
		mini.alert("请至少选中一行删除!");
		return;
	}
	
	var ids = "";
	for(var i = 0;i < rows.length;i++){
		ids += rows[i].REF_DEM_TYPE_ID + ",";
	}
	ids = ids.substring(0,ids.length-1);
	var delObj = new Object();
	delObj["REF_TYPE"] = 4;
	delObj["service_name"] = "REF_DEM_TYPE_D";
	delObj["oper_flag"] = 'D';
	delObj["REF_DEM_TYPE_ID"] = ids;
    showConfirmMessageAlter("确定删除店员分组？",function ok(){
        getJsonDataByPost(Globals.baseActionUrl.ACTION_OPERATION_URL,delObj,"店员分组管理-删除店员分组",
            function(result){
        		if (result.success == systemVar.SUCCESS) {
            		
        			showMessageAlter("删除店员分组成功!");
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
 * 新增店员
 */
function addDyRel(){
var rows = mini.get("dy_grid").getSelecteds();
	
	if(rows.length != 1){
		mini.alert("请选中一个店员分组新增店员!");
		return;
	}
	
	var addObj = rows[0];
	addObj['oper_flag'] = 'A';
	addObj['service_name'] = 'REF_DEM_TYPE_DETAIL_SALES_A';
	
	showAddDialog("店员选择 ",600,350,Globals.baseHtmlUrl.DYGROUP_ADD_DYREL_URL,
			function callback(data){
	            if (data != undefined && data.success == systemVar.SUCCESS) {
	            	querySales(addObj["REF_DEM_TYPE_ID"]);
	            }else if(data == systemVar.CANCEL || data == systemVar.CLOSE){
	            	
	            }else{
	            	showErrorMessageAlter(data.errormsg);
	                return false;
	            }
	    },addObj);
}

/**
 * 导入店员
 */
function importDyRel(){
var rows = mini.get("dy_grid").getSelecteds();
	
	if(rows.length != 1){
		showErrorMessageAlter("请选中一个店员分组导入店员!");
		return;
	}
	
	var addObj = rows[0];
	addObj['service_name'] = 'REF_DEM_TYPE_SALES_IMPORT';
	
	var serviceArr = new Array();
	var serviceObj = new Object();
	serviceObj["service_name"] = "REF_DEM_TYPE_SALES_IMPORT_PRE";
	serviceObj["oper_flag"] = "UO";
	serviceArr[0] = serviceObj;
	addObj['service_name_pre'] = serviceArr;
	
	showAddDialog("店员导入 ",600,180,Globals.baseHtmlUrl.DYGROUP_IMPORT_DYREL_URL,
			function callback(data){
	            if (data != undefined && data.success == systemVar.SUCCESS) {
	            	showMessageAlter("导入店员成功!");
	            	querySales(addObj["REF_DEM_TYPE_ID"]);
	            }else if(data == systemVar.CANCEL || data == systemVar.CLOSE){
	            	
	            }else{
	            	showErrorMessageAlter(data.errormsg);
	                return false;
	            }
	    },addObj);
}

/**
 * 删除店员
 */
function delDyRel(){
var rows = mini.get("reldy_grid").getSelecteds();
	
	if(rows.length == 0){
		mini.alert("请至少选择一个关联店员删除!");
		return;
	}
	
	//选中的套餐分类
	var class_row = mini.get("dy_grid").getSelected();

	var ids = new Array();
	for(var i = 0;i < rows.length;i++){
		ids[i] = rows[i].SALES_ID;
	}
	var delObj = new Object();
	delObj["service_name"] = "REF_DEM_TYPE_DETAIL_SALES_D";
	delObj["oper_flag"] = 'D';
	delObj["SALES_ID"] = ids;
	delObj["REF_DEM_TYPE_ID"] = class_row["REF_DEM_TYPE_ID"];
	
    showConfirmMessageAlter("确定删除关联店员？",function ok(){
        getJsonDataByPost(Globals.baseActionUrl.ACTION_OPERATION_URL,delObj,"店员分组管理-删除关联店员",
            function(result){
        		if (result.success == systemVar.SUCCESS) {
            		
        			showMessageAlter("删除关联店员成功!");
        			querySales(class_row["REF_DEM_TYPE_ID"]);
	            }
        		else
    			{
        			showErrorMessageAlter(result.errormsg);
    			}
            },null);
    });
}


/**
 * 导出店员
 */
function exportDyRel(){
	mini.parse();
	var rows = mini.get("dy_grid").getSelecteds();

	if(rows.length != 1){
		mini.alert("请选中一个店员分组导出关联店员!");
		return;
	}
	
	var grid = mini.get("reldy_grid");
	//var columns = grid.columns;
    //var columns = getColumns(columns);
    
    //DownLoad(Globals.baseActionUrl.EXPORT_OPERATION_URL, { type: "excel", columns: columns,service_name:"REF_DEM_TYPE_DETAIL_SALES_E",file_name:rows[0]["REF_DEM_TYPE_NAME"]+"关联店员",ref_dem_type_id: rows[0]["REF_DEM_TYPE_ID"],ref_type:4});
    var params=new Object();
    params["service_name"] = "REF_DEM_TYPE_DETAIL_SALES_E";
	params["file_name"] = rows[0]["REF_DEM_TYPE_NAME"]+"关联店员";
	params["ref_dem_type_id"] = rows[0]["REF_DEM_TYPE_ID"];
	params["ref_type"]=4;
	
	exportExcel(params);
}


