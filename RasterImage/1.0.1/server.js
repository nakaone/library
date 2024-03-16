function doGet() {
  const htmlOutput = HtmlService.createTemplateFromFile("index").evaluate();
  htmlOutput.setTitle('RasterImage');
  return htmlOutput;
}