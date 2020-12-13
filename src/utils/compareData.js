

const compareCI =(ci1,ci2) => {
    var fc1 = fragmentCI((ci1+'').toUpperCase().split('-').join(''));
    var fc2 = fragmentCI((ci2+'').toUpperCase().split('-').join(''));
    if(fc1.ci === fc2.ci)
        if(fc1.complemento && fc2.complemento)
            if(fc1.complemento === fc2.complemento)
                return 1;
            else
                return 0;
        else
            return 1;
    else
        return -1;
};

const fragmentCI = (strCi) => {
    //check codDep ABR
    var abr = null;
    let posAbr = strCi.slice(-2);
    if(extDep.includes(posAbr)){
        abr = posAbr;
        strCi = strCi.slice(0,-2);
    }
    //check COMPLEMENTO
    var com = null;
    if((parseInt(strCi)+'').length !== strCi.length){
        com = strCi.slice(-2);
    }
    //CI
    strCi = parseInt(strCi)+'';
    return {
        ABR: abr,
        complemento: com,
        ci: strCi,
    }
}

const extDep = ['SC','TJ','OR','LP','CB','BE','PD','PT','CH','PO'];

//Compare names
const compareNames=(name1,name2) => {
    var n1formed = name1.map(e => {
        e.toUpperCase();
    }).join('').split('').join();
    var n2formed = name2.map(e => {
        e.toUpperCase();
    }).join('').split('').join();
    return n1formed === n2formed;
}
const compareNumbers = (n1,n2) => {
    return parseFloat(n1) === parseFloat(n2);
}

export default {
  compareCI,
  compareNames,
  compareNumbers
};