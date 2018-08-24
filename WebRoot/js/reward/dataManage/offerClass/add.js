
var nowurl  = document.location.href;
nowurl = nowurl.substring(0,nowurl.indexOf("html"));
var JsVar = new Object();

//初始化
$(document).ready(function() {
	mini.parse();
		
	JsVar["classForm"] = new mini.Form("#class_form");
});

/**
 * 父窗口调用的初始化方法
 * @param action 操作类型
 * @param data   参数
 */
function onLoadComplete(action,data) {
  
    JsVar["classForm"].setData(data,false);
    //父窗口参数
    JsVar["data"] = data;
}

/**
 * 保存套餐分类
 */
function onSubmit() {
    JsVar["classForm"].validate();
    if (JsVar["classForm"].isValid() == false){
        return;
    }
    
    //获取表单多个控件的数据
    var classInfo = JsVar["classForm"].getData();
    
    //检查套餐分类名称是否重复
    var param = {"latn_id":classInfo["LATN_ID"],
    		 "ref_type":1,
			 "ref_dem_type_name":classInfo["REF_DEM_TYPE_NAME"],
			 "ref_dem_type_id":JsVar["data"]["REF_DEM_TYPE_ID"],
			 "service_name":"REF_DEM_TYPE_SELECT",
			 "pageIndex":0,
			 "pageSize":6};

    getJsonDataByPost(Globals.baseActionUrl.SELECT_OPERATION_URL,param,"销售品分类名称重复校验",
	        function(result){
    			console.log(result);
    			if(result.success == systemVar.SUCCESS && result.total > 0){
    				classInfo["success"] = systemVar.FAIL;
    				classInfo["errormsg"] = "销售品分类名称重复";
    				closeWindow(classInfo);
    			}else if(result.success == systemVar.FAIL){
    				classInfo["success"] = systemVar.FAIL;
    				classInfo["errormsg"] = result.errormsg;
    				closeWindow(classInfo);
    			}else{
    				//分类类型
    			    classInfo["REF_TYPE"] = 1;
    			    classInfo["service_name"] = JsVar["data"]["service_name"];
    			    classInfo["oper_flag"] = JsVar["data"]["oper_flag"];
    			    classInfo["REF_DEM_TYPE_ID"] = JsVar["data"]["REF_DEM_TYPE_ID"];
    			        
    			    getJsonDataByPost(Globals.baseActionUrl.ACTION_OPERATION_URL,classInfo,"销售品分类维护",
    				        function(result){
    			    			classInfo["success"] = result.success;
    			    			classInfo["errormsg"] = result.errormsg;
    					        closeWindow(classInfo);
    				        });
    			}
    			
	        });
   
   
    
    
}