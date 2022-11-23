# `blackduck-rest-api` 
## Installation
    npm install blackduck-rest-api
## Usage
- Authentication
    ```
    const bd = new BlackDuckAPI(
        "<BLACKDUCK_URL>/api",
        "<TOKEN>"
    );
    await bd.auth();
    ```
- Get Projects
    > projects = await bd.getProjects()
- Get Projects by name
    > project = await bd.getProjects("PROJECT FULL NAME")
- Get Versions
    > versions = await bd.getVersions("PROJECT URL")
- Get Version by name
    > version = await bd.getVersions("PROJECT URL", "VERSION NAME")
- Get Vulnerabilities by name
    > vulnerabilities = await bd.getVulnerabilitiesByName("PROJECT NAME", "VERSION NAME")
- Get Vulnerabilities by version URL
    > vulnerabilities = await bd.getVulnerabilitiesByUrl("VERSION URL")