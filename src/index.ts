import axios, { AxiosResponse, AxiosRequestConfig, AxiosError } from "axios";
import {
  BD_REST_API_RESPONSE,
  BD_PROJECT_DETAIL,
  BD_VERISON_DETAIL,
  BD_VERSIONS_API_RESPONSE,
  BD_PROJECTS_API_RESPONSE
} from "./types";

import { BlackDuckAPIException } from "./exception";

export default class BlackDuckAPI {
  private _api: string;
  private _token: string;
  private _bearer: string;

  constructor(api, token) {
    this._api = api;
    this._token = token;
    this._bearer = "";
  }

  async auth() {
    try {
      const result: AxiosResponse = await axios.post(
        this._api + "/tokens/authenticate",
        {},
        {
          headers: {
            Authorization: "token " + this._token,
            Accept: "application/vnd.blackducksoftware.user-4+json",
            "Content-Type": "application/json",
          },
        }
      );
      this._bearer = result.data.bearerToken;
    } catch (error) {
      if (error instanceof AxiosError) {
        throw new BlackDuckAPIException(
          error.response.status,
          error.response.data.errorMessage
        );
      } else {
        throw error;
      }
    }
  }

  async getProjects(name?: string): Promise<BD_REST_API_RESPONSE> {
    let url: string;
    if (name === undefined) url = this._api + "/proejects?limit=999";
    else url = this._api + "/projects?limit=999&q=name:" + name;
    try {
      const result: AxiosResponse = await axios.get(url, {
        headers: {
          Authorization: "Bearer " + this._bearer,
          Accept: "application/vnd.blackducksoftware.project-detail-4+json",
        },
      });
      let data = result.data;
      if (data === undefined) {
        throw new BlackDuckAPIException(204, "No Projects found!");
      } else {
        return data;
      }
    } catch (error) {
      if (error instanceof AxiosError) {
        throw new BlackDuckAPIException(
          error.response.status,
          error.response.data.errorMessage
        );
      } else {
        throw error;
      }
    }
  }

  async getVersions(
    projectUrl,
    versionName?: string
  ): Promise<BD_REST_API_RESPONSE> {
    let url: string;
    if (versionName === undefined) url = projectUrl + "/versions?limit=999";
    else url = projectUrl + "/versions?limit=999&q=versionName:" + versionName;
    try {
      const projectVersion: AxiosResponse = await axios.get(url, {
        headers: {
          Authorization: "Bearer " + this._bearer,
          Accept: "application/vnd.blackducksoftware.project-detail-5+json",
        },
      });
      let data = projectVersion.data;
      if (data === undefined) {
        throw new BlackDuckAPIException(204, "No Versions found!");
      } else {
        return data;
      }
    } catch (error) {
      if (error instanceof AxiosError) {
        throw new BlackDuckAPIException(
          error.response.status,
          error.response.data.errorMessage
        );
      } else {
        throw error;
      }
    }
  }

  async getVulnerabilitiesByName(
    projectName,
    versionName
  ): Promise<BD_REST_API_RESPONSE> {
    let projects: BD_PROJECTS_API_RESPONSE;
    let versions: BD_VERSIONS_API_RESPONSE;
    let projectDetail: BD_PROJECT_DETAIL;
    let versionDetail: BD_VERISON_DETAIL;
    let vuln_url: string;

    try {
      projects = await this.getProjects(projectName);
      projects.items.forEach((item) => {
        if (item.name === projectName) {
          projectDetail = item;
        }
      });
      if(projectDetail === undefined){
        throw new BlackDuckAPIException(409, "Provide full project name")
      }
      versions = await this.getVersions(
        projectDetail._meta.href,
        versionName
      );
      versions.items.forEach((item) => {
        if (item.versionName === versionName) {
          versionDetail = item;
        }
      });
      if(versionDetail === undefined){
        throw new BlackDuckAPIException(409, "Provide full version name")
      }
      vuln_url = versionDetail._meta.href + "/vulnerable-bom-components";
      const vulns: AxiosResponse = await axios.get(vuln_url, {
        headers: {
          Authorization: "Bearer " + this._bearer,
          Accept: "application/vnd.blackducksoftware.bill-of-materials-6+json",
        },
      });
      return vulns.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        throw new BlackDuckAPIException(
          error.response.status,
          error.response.data.errorMessage
        );
      } else {
        throw error;
      }
    }
  }

  async getVulnerabilitiesByUrl(versionUrl): Promise<BD_REST_API_RESPONSE> {
    try {
      let url = versionUrl + "/vulnerable-bom-components";

      const vulns: AxiosResponse = await axios.get(url, {
        headers: {
          Authorization: "Bearer " + this._bearer,
          Accept: "application/vnd.blackducksoftware.bill-of-materials-6+json",
        },
      });
      let data = vulns.data;
      if (data === undefined) {
        throw new BlackDuckAPIException(204, "No Vulnerabilities found!");
      } else {
        return data;
      }
    } catch (error) {
      if (error instanceof AxiosError) {
        throw new BlackDuckAPIException(
          error.response.status,
          error.response.data.errorMessage
        );
      } else {
        throw error;
      }
    }
  }
}
