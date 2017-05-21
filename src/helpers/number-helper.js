export function toFloat(val) {
    if(!val){
        return null;
    } else{
        val = val.replace(/,/g, '.');

        if(isNaN(val)) {
            return null;
        }
        else {
            return parseFloat(val);
        }
    }
}