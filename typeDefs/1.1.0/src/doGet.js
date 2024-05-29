function doGet(e){
  const v = {};
  v.template = HtmlService.createTemplateFromFile('index');
  v.primitive = new SingleTable('primitive');
  v.relation = new SingleTable('relation');
  v.data = {primitive:v.primitive.data,relation:v.relation.data};
  v.template.data = JSON.stringify(v.data);
  v.htmlOutput = v.template.evaluate();
  v.htmlOutput.setTitle('authMenu');
  return v.htmlOutput;
}
