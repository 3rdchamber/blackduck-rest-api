import BlackDuckAPI from "blackduck-rest-api";

async function getProj() {
  const bd = new BlackDuckAPI("<BLACKDUCK URL>/api", "<TOKEN>");
  await bd.auth();
  return await bd.getProjects("PROJECT NAME");
}

let vulns = getProj();
console.log(vulns);
