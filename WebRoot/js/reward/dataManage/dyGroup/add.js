var nowurl  = document.location.href;
nowurl = nowurl.substring(0,nowurl.indexOf("html"));
var JsVar = new Object();

//初始化
$(document).ready(function() {
	mini.parse();
		
	JsVar["dyForm"] = new mini.Form("#dy_form");
});

/**
 * 父窗口调用的初始化方法
 * @param action 操作类型
 * @param data   参数
 */
function onLoadComplete(action,data) {
  
    JsVar["dyForm"].setData(data,false);
    //父窗口参数
    JsVar["data"] = data;
}

/**
 * 保存店员分组
 */
function onSubmit() {
    JsVar["dyForm"].validate();
    if (JsVar["dyForm"].isValid() == false){
        return;
    }
    
    //获取表单多个控件的数据
    var dyInfo = JsVar["dyForm"].getData();
    
    //检查店员分组名称是否重复
    var param = {"latn_id":dyInfo["LATN_ID"],
    		 "ref_type":4,
			 "ref_dem_type_name":dyInfo["REF_DEM_TYPE_NAME"],
			 "ref_dem_type_id":JsVar["data"]["REF_DEM_TYPE_ID"],
			 "service_name":"REF_DEM_TYPE",
			 "pageIndex":0,
			 "pageSize":6};

    getJsonDataByPost(Globals.baseActionUrl.SELECT_OPERATION_URL,param,"店员分组名称重复校验",
	        function(result){
    			console.log(result);
    			if(result.success == systemVar.SUCCESS && result.total > 0){
    				dyInfo["success"] = systemVar.FAIL;
    				dyInfo["errormsg"] = "店员分组名称重复";
    				closeWindow(dyInfo);
    			}else if(result.success == systemVar.FAIL){
    				dyInfo["success"] = systemVar.FAIL;
    				dyInfo["errormsg"] = result.errormsg;
    				closeWindow(dyInfo);
    			}else{
    				//分类类型
    			    dyInfo["REF_TYPE"] = 4;
    			    dyInfo["service_name"] = JsVar["data"]["service_name"];
    			    dyInfo["oper_flag"] = JsVar["data"]["oper_flag"];
    			    dyInfo["REF_DEM_TYPE_ID"] = JsVar["data"]["REF_DEM_TYPE_ID"];
    			        
    			    getJsonDataByPost(Globals.baseActionUrl.ACTION_OPERATION_URL,dyInfo,"店员分组维护",
    				        function(result){
    			    			dyInfo["success"] = result.success;
    			    			dyInfo["errormsg"] = result.errormsg;
    					        closeWindow(dyInfo);
    				        });
    			}
    			
	        });
   
   
    
    
}
