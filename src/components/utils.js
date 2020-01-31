export default {
  propercase: text => text.split("").map((item,index) => index === 0 ? item.toUpperCase() : item).join(""),
  clone: data => JSON.parse(JSON.stringify(data)),
  numberList: limit => {
    const list = [];
  	for (var i = 0; i < limit; i++) {
      list.push(i);
    }
    return list;
  }
};