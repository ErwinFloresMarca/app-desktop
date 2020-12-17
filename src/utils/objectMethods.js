
function changeAndOrderKeys(obj,arrWithNewKey){
    var result={};
    arrWithNewKey.forEach(ok=>{
        result[ok.newKey]=obj[ok.oldKey];
    })
    return result;
}

function extractAtribSubObject(obj,atribs){
    var newObj = {};
    Object.keys(obj).forEach(k=>{
        if(!atribs.includes(k))
            newObj[k]=obj[k];
        else
            newObj={... newObj, ... obj[k]}
    });
    return newObj;
}
export {changeAndOrderKeys as changeAndOrderKeys};
export {extractAtribSubObject as extractAtribSubObject};
