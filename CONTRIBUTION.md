### Issues

PathforaJS consume GitHub issues, similar to most open source projects. Issues can be divided into categories and are tracked based on their attached labels. The most common ones are `feature requests`, `bugs`, `maintenance`. When you open a new issue, please make sure there is an attached label. This greatly helps contributors prioritize what needs to be worked on.

At minimum, an issue should state the current problem and the expected/desired behavior.

### Branch naming convention
Pathfora encourages the following for branch naming convention:

**For general issues**

```issue/{{issueNumber}}-{{descriptive-name}}```

**For feature related work**

```feature/{{issueNumber}}-{{descriptive-name}}```

**Example**

```issue/255-split-tests```

### Pull Requests
Pull Requests usually track the issues they seek to resolve. PRs should include the issue number, steps to resolution, and, where appropriate, a relevant screenshot. Help a fellow reviewer out and take the little extra time to include the as much info as you can! [See closing git issues](https://help.github.com/articles/closing-issues-using-keywords/)

Below is an example PR written in markdown.

!["Pull Requests"](https://s3-us-west-2.amazonaws.com/pros-lytics/screenshots/issue261_pr_markdown.png)

PathforaJS leverages Travis CI for continuous integration. As a result, existing tests will run against all the PRs and all branches pushed up to the repo. PRs will not get reviewed until CI is green. Still, it is advisable to run `npm test` on your local branch before creating a PR.

Below is an example of a stale PR, with failing Travis CI. Click the `Details` link to see what's going on with Travis CI.

!["Blocked PR"](https://s3-us-west-2.amazonaws.com/pros-lytics/screenshots/issue261_PRs.png)

### Git notes
Please add meaningful commit messages.

For stale PRs, update your branch by merging in develop, or alternatively, you can rebase on top of develop with `git pull origin develop --rebase`.
