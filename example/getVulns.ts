import BlackDuckAPI from "blackduck-rest-api";

async function getVulns() {
  const bd = new BlackDuckAPI("<BLACKDUCK URL>/api", "<TOKEN>");
  await bd.auth();
  return await bd.getVulnerabilitiesByName("PROJECT NAME", "VERSION");
}

let vulns = getVulns();
console.log(vulns);
