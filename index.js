const core = require('@actions/core');
const github = require('@actions/github');

const { Octokit } = require("@octokit/action");

main();

async function main() { 
  try {
    const octokit = new Octokit();
    
    // `who-to-greet` input defined in action metadata file    
    const runId = core.getInput('run-id');
    const [owner, repo] = process.env.GITHUB_REPOSITORY.split("/");

    console.log(`get-artifact.js started...`);
    console.log(`run id = ${runId}`);
    const { artifacts } = octokit.request('GET /repos/{owner}/{repo}/actions/runs/{run_id}/artifacts', {
        owner: owner,
        repo: repo,
        run_id: runId
      });
    console.log(`artifacts = ${artifacts}`);
    if (artifacts.total_count != 0) {
      var urls = '';
      for(var i = 0;i < artifacts.total_count;i++) {
        urls += artifacts.artifacts[i].archive_download_url + '\n';        
      }
      core.setOutput("urls", urls);
    } else {
      core.setFailed(`no artifacts where found in /repos/${owner}/${repo}/actions/runs/${runId}/artifacts`);
    }
  } catch (error) {
    core.setFailed(error.message);
  }
}