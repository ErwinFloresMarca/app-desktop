/* eslint-disable */
require('script-loader!file-saver');

const save = (b,o)=>{
    return saveAs(b,o)
}

export { save as saveAs };